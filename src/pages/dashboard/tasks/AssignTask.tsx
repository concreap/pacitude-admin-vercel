import { Fragment, useEffect, useRef, useState } from "react"
import Divider from "../../../components/partials/Divider";
import CardUI from "../../../components/partials/ui/CardUI";
import helper from "../../../utils/helper.util";
import Filter from "../../../components/partials/drops/Filter";
import useApp from "../../../hooks/app/useApp";
import Career from "../../../models/Career.model";
import Button from "../../../components/partials/buttons/Button";
import useToast from "../../../hooks/useToast";
import Field from "../../../models/Field.model";
import Topic from "../../../models/Topic.model";
import { DurationEnum, EditTaskEnum, TaskFieldEnum, UIEnum, UserEnum } from "../../../utils/enums.util";
import useTask from "../../../hooks/app/useTask";
import EmptyState from "../../../components/partials/dialogs/EmptyState";
import Badge from "../../../components/partials/badges/Badge";
import { Link, useParams } from "react-router-dom";
import { DIFFICULTIES, DURATION_DAYS, DURATION_WEEKS, LEVELS, TASK_FIELDS } from "../../../utils/constants.util";
import IconButton from "../../../components/partials/buttons/IconButton";
import Icon from "../../../components/partials/icons/Icon";
import { ITaskDeliverable, ITaskInstruction, ITaskObjective, ITaskResource } from "../../../models/Task.model";
import Dot from "../../../components/partials/ui/Dot";
import Skill from "../../../models/Skill.model";
import { IGroupedLink, IGroupedResource } from "../../../utils/interfaces.util";
import UIResource from "../../../components/app/UIResource";
import UITaskRubric from "../../../components/app/task/UITaskRubric";
import Uploader from "../../../components/partials/dialogs/Uploader";
import ImageUI from "../../../components/app/ImageUI";
import FormField from "../../../components/partials/inputs/FormField";
import TextInput from "../../../components/partials/inputs/TextInput";
import { apiresponse } from "../../../_data/seed";
import NumberInput from "../../../components/partials/inputs/NumberInput";
import TextAreaInput from "../../../components/partials/inputs/TextAreaInput";
import useUser from "../../../hooks/app/useUser";
import User from "../../../models/User.model";
import UserAvatar from "../../../components/partials/ui/UserAvatar";
import SearchInput from "../../../components/partials/inputs/SearchInput";
import Checkbox from "../../../components/partials/inputs/Checkbox";
import TaskTalents from "../../../components/app/task/TaskTalents";

const AssignTaskPage = () => {

    const { id } = useParams<{ id: string }>()

    const fiRef = useRef<any>(null)
    const toRef = useRef<any>(null)
    const carRef = useRef<any>(null)
    const leRef = useRef<any>(null)
    const diRef = useRef<any>(null)
    const skiRef = useRef<any>(null)

    const { toast, setToast } = useToast()
    const { task, loading, loader, getTask, assignTask } = useTask()
    const { getUsers, users, getFullname, loader: userLoading } = useUser()

    const [search, setSearch] = useState<Array<User>>([])
    const [form, setForm] = useState({
        users: [] as Array<string>
    })


    useEffect(() => {
        initList()
    }, [])

    const handleGetTask = (id?: string) => {
        getTask(id ? id : '')
    }

    const initList = async () => {
        await Promise.all([
            handleGetTask(id),
            getUsers({ limit: 9999, page: 1, order: 'desc', cache: false }, true)
        ])
    }

    const findUser = (id: string) => {
        const user: User | undefined = users.data.find((x) => x._id === id);
        return user ? user : null;
    }

    const getCareer = (user: User) => {

        let result = 'Unknown Career'
        if (user.talent && user.talent.careers && user.talent.careers.length > 0) {
            result = user.talent.careers[0].career.name
        }

        return result;

    }

    const handleSearch = (value: string) => {

        let currentList = users.data;
        let newList: Array<User> = [];

        if (value !== '') {

            newList = currentList.filter((user: User) => {
                const n = getFullname(user).toLowerCase();
                const e = user.email.toLowerCase()
                const v = value.toLowerCase();
                return n.includes(v) || e.includes(v)
            });

        } else {
            newList = [];
        }

        setSearch(newList)

    }

    const selectTalents = () => {

        let allTalents = users.data.filter((x) => x.userType === UserEnum.TALENT);

        if (allTalents.length > 0) {
            const talentIds = allTalents.map((x) => x._id);
            setForm({ ...form, users: talentIds })
        }

    }

    const handleSelect = (id: string) => {

        let currentList = form.users;

        if (currentList.includes(id)) {
            currentList = currentList.filter((x) => x !== id);
        } else {
            currentList.push(id);
        }

        setForm({ ...form, users: currentList })

    }

    const handleRemove = (id: string) => {

        let currentList = form.users;

        if (currentList.includes(id)) {
            currentList = currentList.filter((x) => x !== id);
        }

        setForm({ ...form, users: currentList })

    }

    const handleAssign = async (e: any) => {

        if (e) { e.preventDefault() }

        const response = await assignTask({
            id: task._id,
            talents: form.users
        })


        if (!response.error) {
            setToast({
                ...toast,
                show: true,
                type: 'success',
                title: 'Successful',
                message: 'Task assigned successfully',
                error: 'all',
                position: 'top-right'
            })
            setForm({ ...form, users: [], })
            handleGetTask(task._id)
        }

        else {
            let message = response.message;
            if (response.errors.length > 0) {
                message = response.errors.join(',')
            }

            setToast({
                ...toast,
                show: true,
                type: 'error',
                title: 'Error',
                message: message,
                error: 'all',
                position: 'top-right'
            })
        }

        setTimeout(() => {
            setToast({ ...toast, show: false })
        }, 1800)
    }

    return (
        <>


            <div className="w-full">

                {
                    (loading) &&
                    <EmptyState className="min-h-[50vh]" noBound={true}>
                        <span className="loader lg primary"></span>
                        <span className="font-mona text-[16px] pas-950">Fetching task data</span>
                    </EmptyState>
                }

                {
                    !loading &&
                    <>
                        {
                            helper.isEmpty(task, 'object') &&
                            <EmptyState className="min-h-[50vh]" noBound={true} >
                                <span className="font-mona text-[14px] pas-950">Task details not found!</span>
                            </EmptyState>
                        }

                        {
                            !helper.isEmpty(task, 'object') &&
                            <>

                                <div className="grid grid-cols-[38%_58%] gap-x-[4%]">

                                    <CardUI className="space-y-[2rem]">
                                        <div className="space-y-[0.8rem]">
                                            <div className="flex items-center">
                                                <h3 className="font-mona text-[13px] pag-800">Users List</h3>
                                                <div className="ml-auto flex items-center gap-x-[1rem]">

                                                    <IconButton
                                                        size="min-w-[1rem] min-h-[1rem]"
                                                        className={`bg-pacb-100 pacb-600 pacbh-600 bgh-pcb-100`}
                                                        container={{
                                                            className: form.users.length > 0 ? '' : 'disabled-blind'
                                                        }}
                                                        icon={{
                                                            type: 'polio',
                                                            name: 'cancel',
                                                            size: 13,
                                                        }}
                                                        label={{
                                                            text: 'Deselect All',
                                                            weight: 'regular'
                                                        }}
                                                        onClick={(e) => {
                                                            setForm({ ...form, users: [] })
                                                        }}
                                                    />
                                                    <Checkbox
                                                        id="allselect-check"
                                                        size="xsm"
                                                        checked={false}
                                                        wraper={{ className: form.users.length > 0 ? 'disabled-blind' : '' }}
                                                        label={{
                                                            title: 'All Talents',
                                                            className: 'pag-800',
                                                            fontSize: '[13px]'
                                                        }}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                selectTalents()
                                                            } else {
                                                                setForm({ ...form, users: [] })
                                                            }
                                                        }}
                                                    />
                                                </div>

                                            </div>
                                            <div>
                                                <SearchInput
                                                    ref={null}
                                                    size="xsm"
                                                    showFocus={true}
                                                    placeholder="Search"
                                                    isError={false}
                                                    hasResult={false}
                                                    readonly={false}
                                                    className=""
                                                    onChange={(e) => {
                                                        handleSearch(e.target.value)
                                                    }}
                                                    onSearch={async (e) => { }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            {
                                                users.loading &&
                                                <EmptyState className="min-h-[40vh]" noBound={true}>
                                                    <span className="loader lg primary"></span>
                                                </EmptyState>
                                            }

                                            {
                                                !users.loading &&
                                                <>
                                                    {
                                                        users.data.length === 0 &&
                                                        <EmptyState className="min-h-[50vh]" noBound={true}>
                                                            <span className="font-mona pag-800 text-[13px]">Users will appear here</span>
                                                        </EmptyState>
                                                    }
                                                    {
                                                        users.data.length > 0 &&
                                                        <>
                                                            <div className="space-y-[1rem] max-h-[550px] overflow-y-scroll scrollbar-hide">
                                                                {
                                                                    search.length > 0 &&
                                                                    search.map((user: User, index) =>
                                                                        <Fragment key={user._id}>

                                                                            <Link onClick={(e) => handleSelect(user._id)} to="" className="w-full flex items-center gap-x-[0.85rem]">
                                                                                <UserAvatar
                                                                                    avatar={user.avatar}
                                                                                    name={getFullname(user)}
                                                                                    width='min-w-[35px]'
                                                                                    height='min-h-[35px]'
                                                                                />
                                                                                <div>
                                                                                    <h4 className="font-mona text-[13px] pag-700">{getFullname(user)}</h4>
                                                                                    <div className="flex items-center gap-x-[0.5rem]">
                                                                                        <span className="font-mona-light text-[12px] pag-500">{getCareer(user)}</span>
                                                                                    </div>
                                                                                </div>
                                                                                {
                                                                                    form.users.includes(user._id) &&
                                                                                    <span className="w-[20px] h-[20px] bg-pacb-400 rounded-full flex items-center justify-center ml-auto">
                                                                                        <Icon type="polio" name="check" size={14} className="color-white" />
                                                                                    </span>
                                                                                }
                                                                            </Link>

                                                                            {/* <Divider bg="bg-pag-50" padding={{ enable: false }} /> */}

                                                                        </Fragment>
                                                                    )
                                                                }
                                                                {
                                                                    search.length === 0 &&
                                                                    users.data.map((user: User, index) =>
                                                                        <Fragment key={user._id}>

                                                                            <Link onClick={(e) => handleSelect(user._id)} to="" className="w-full flex items-center gap-x-[0.85rem]">
                                                                                <UserAvatar
                                                                                    avatar={user.avatar}
                                                                                    name={getFullname(user)}
                                                                                    width='min-w-[35px]'
                                                                                    height='min-h-[35px]'
                                                                                />
                                                                                <div>
                                                                                    <h4 className="font-mona text-[13px] pag-700">{getFullname(user)}</h4>
                                                                                    <div className="flex items-center gap-x-[0.5rem]">
                                                                                        <span className="font-mona-light text-[12px] pag-500">{getCareer(user)}</span>
                                                                                    </div>
                                                                                </div>
                                                                                {
                                                                                    form.users.includes(user._id) &&
                                                                                    <span className="w-[20px] h-[20px] bg-pacb-400 rounded-full flex items-center justify-center ml-auto">
                                                                                        <Icon type="polio" name="check" size={14} className="color-white" />
                                                                                    </span>
                                                                                }
                                                                            </Link>

                                                                            {/* <Divider bg="bg-pag-50" padding={{ enable: false }} /> */}

                                                                        </Fragment>
                                                                    )
                                                                }
                                                            </div>
                                                        </>
                                                    }
                                                </>
                                            }

                                        </div>
                                    </CardUI>

                                    <CardUI>

                                        <div className="">

                                            <div className="w-full">

                                                <div className="flex items-center gap-x-[5%]">

                                                    <div className="min-w-[200px] min-h-[100px] rounded-[14px] full-bg" style={{ backgroundImage: `url("${task.image ? task.image : '../../../images/assets/bg@core_03.webp'}")` }}></div>
                                                    <div className="grow">

                                                        <h3 className="font-mona-medium pas-950 text-[17px]">{task.title}</h3>
                                                        <Divider show={false} padding={{ enable: true, top: "pt-[0.3rem]", bottom: "pb-[0.3rem]" }} />
                                                        <h4 className="">
                                                            <span className="font-mona-light pag-500 text-[14px]">Field - </span>
                                                            <span className="font-mona pag-800 text-[14px]">{task?.field?.name || '---'}</span>
                                                        </h4>
                                                        <Divider show={false} padding={{ enable: true, top: "pt-[0.3rem]", bottom: "pb-[0.3rem]" }} />
                                                        <h4 className="">
                                                            <span className="font-mona-light pag-500 text-[14px]">Topic - </span>
                                                            <span className="font-mona pag-800 text-[14px]">{task?.topic?.name || '---'}</span>
                                                        </h4>


                                                    </div>

                                                </div>

                                                <Divider />

                                                <div className="flex items-center gap-x-[0.5rem]">
                                                    <Badge
                                                        type={'purple'}
                                                        size="sm"
                                                        display="badge"
                                                        label={helper.capitalize(task.level)}
                                                        padding={{ y: 2, x: 12 }}
                                                        font={{
                                                            weight: 'regular',
                                                            size: 12
                                                        }}
                                                        upper={false}
                                                        close={false}
                                                    />
                                                    <Badge
                                                        type={'info'}
                                                        size="sm"
                                                        display="badge"
                                                        label={helper.capitalize(task.difficulty)}
                                                        padding={{ y: 2, x: 12 }}
                                                        font={{
                                                            weight: 'regular',
                                                            size: 12
                                                        }}
                                                        upper={false}
                                                        close={false}
                                                    />
                                                    <Badge
                                                        type={'orange'}
                                                        size="sm"
                                                        display="badge"
                                                        label={helper.capitalize(task.type)}
                                                        padding={{ y: 2, x: 12 }}
                                                        font={{
                                                            weight: 'regular',
                                                            size: 12
                                                        }}
                                                        upper={false}
                                                        close={false}
                                                    />

                                                    <div className="flex items-center gap-x-[1rem] ml-auto">
                                                        <h3 className="font-mona-light pag-600 text-[13px]">ID: {task.code}</h3>
                                                        <h3 className="font-mona-light pag-600 text-[13px]">Duration: {task.duration.label}</h3>
                                                    </div>
                                                </div>

                                            </div>

                                            {
                                                task.talents.length > 0 &&
                                                <>
                                                    <Divider />
                                                    <TaskTalents />
                                                </>
                                            }

                                            <Divider />

                                            <div className="space-y-[0rem]">
                                                <h3 className="font-mona text-[13px] pag-800">Selected Users ({form.users.length})</h3>
                                                {
                                                    form.users.length > 0 &&
                                                    <div className="flex items-center gap-x-[0.6rem] max-w-[100%] flex-wrap gap-y-[1rem]">
                                                        {
                                                            form.users.map((id) =>
                                                                <Fragment key={id}>
                                                                    <div className="relative inline-block">
                                                                        <IconButton
                                                                            size="min-w-[1rem] min-h-[1rem]"
                                                                            className="absolute bg-par-50 par-600 parh-600 bgh-par-100 right-0 bottom-[-0.1rem]"
                                                                            icon={{
                                                                                type: 'polio',
                                                                                name: 'cancel',
                                                                                size: 14,
                                                                            }}
                                                                            onClick={(e) => handleRemove(id)}
                                                                        />
                                                                        <UserAvatar
                                                                            avatar={findUser(id)?.avatar || ''}
                                                                            name={getFullname(findUser(id) || '')}
                                                                            width='min-w-[35px]'
                                                                            height='min-h-[35px]'
                                                                        />
                                                                    </div>
                                                                </Fragment>
                                                            )
                                                        }
                                                    </div>
                                                }

                                            </div>

                                            <Divider />

                                            <div className="flex items-center">
                                                <Button
                                                    type={"primary"}
                                                    size="rg"
                                                    className="assign-button min-w-[200px] ml-auto"
                                                    loading={loader}
                                                    disabled={form.users.length === 0}
                                                    text={{
                                                        label: "Assign Task",
                                                        size: 13,
                                                        weight: 'medium'
                                                    }}
                                                    onClick={(e) => handleAssign(e)}
                                                />
                                            </div>

                                        </div>

                                    </CardUI>

                                </div>

                            </>
                        }

                    </>
                }

            </div>

        </>
    )
}

export default AssignTaskPage;
