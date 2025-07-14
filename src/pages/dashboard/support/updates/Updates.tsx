import React, { useEffect, useState, useContext, Fragment, useRef } from "react"
import useSidebar from "../../../../hooks/useSidebar";
import CardUI from "../../../../components/partials/ui/CardUI";
import useUser from "../../../../hooks/app/useUser";
import SearchInput from "../../../../components/partials/inputs/SearchInput";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import User from "../../../../models/User.model";
import UserAvatar from "../../../../components/partials/ui/UserAvatar";
import helper from "../../../../utils/helper.util";
import Divider from "../../../../components/partials/Divider";
import { Link } from "react-router-dom";
import IconButton from "../../../../components/partials/buttons/IconButton";
import Icon from "../../../../components/partials/icons/Icon";
import Checkbox from "../../../../components/partials/inputs/Checkbox";
import { UserEnumType } from "../../../../utils/enums.util";
import FormField from "../../../../components/partials/inputs/FormField";
import TextInput from "../../../../components/partials/inputs/TextInput";
import TinyMCE from "../../../../components/app/editor/TinyMCE";
import useGoBack from "../../../../hooks/useGoBack";
import Button from "../../../../components/partials/buttons/Button";
import useToast from "../../../../hooks/useToast";

const UpdatesPage = ({ }) => {

    const editorRef = useRef<any>(null);

    useSidebar({ type: 'page', init: true });
    const { getUsers, users, getFullname, sendUsersUpdate, loader: loading } = useUser()
    const { goBack } = useGoBack()
    const { toast, setToast } = useToast()

    const [search, setSearch] = useState<Array<User>>([])
    const [form, setForm] = useState({
        title: '',
        content: '',
        users: [] as Array<string>
    })

    useEffect(() => {
        getUsers({ limit: 9999, page: 1, order: 'desc' }, true);
    }, [])

    const findUser = (id: string) => {
        const user: User | undefined = users.data.find((x) => x._id === id);
        return user ? user : null;
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

        let allTalents = users.data.filter((x) => x.userType === UserEnumType.TALENT);

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

    const handleSubmit = async (e: any) => {

        if (e) { e.preventDefault() }

        if (!form.title) {
            setToast({ ...toast, show: true, type: 'error', message: 'title is required' })
        } else if (!editorRef.current.content) {
            setToast({ ...toast, show: true, type: 'error', message: 'message content is required' })
        } else if (form.users.length === 0) {
            setToast({ ...toast, show: true, type: 'error', message: 'select at least one user' })
        } else {

            const response = await sendUsersUpdate({
                content: editorRef.current.content,
                title: form.title,
                users: form.users
            });

            if (!response.error) {

                setToast({
                    ...toast,
                    show: true,
                    type: 'success',
                    message: 'Update scheduled to be sent successfully'
                })

                setForm({ title: '', content: '', users: [] })
                editorRef.current.clear();
            }

            if (response.error) {

                setToast({
                    ...toast,
                    show: true,
                    type: 'error',
                    message: response.errors.join(',')
                })
            }

        }

        setTimeout(() => {
            setToast({
                ...toast,
                show: false,
            })
        }, 1800)

    }

    return (
        <>

            <div className="grid grid-cols-[38%_58%] gap-x-[4%]">

                <CardUI className="space-y-[2rem]">
                    <div className="space-y-[0.8rem]">
                        <div className="flex items-center">
                            <h3 className="font-mona text-[13px] pag-800">Users List</h3>
                            <Checkbox
                                id="career-status"
                                size="xsm"
                                checked={false}
                                wraper={{
                                    className: "ml-auto"
                                }}
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
                                                                    <span className="font-mona-light text-[12px] pag-500">{helper.capitalize(user.userType)}</span>
                                                                    <span className="font-mona-light text-[12px] pag-500">|</span>
                                                                    <span className="font-mona-light text-[12px] pag-500">{user.email}</span>
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
                                                                    <span className="font-mona-light text-[12px] pag-500">{helper.capitalize(user.userType)}</span>
                                                                    <span className="font-mona-light text-[12px] pag-500">|</span>
                                                                    <span className="font-mona-light text-[12px] pag-500">{user.email}</span>
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
                    <div className="space-y-[0.6rem]">
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
                                                    className="absolute bg-par-50 par-600 parh-600 bgh-par-100 right-0 bottom-[-0.3rem]"
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
                        <Divider />

                        <form onClick={(e) => { }} className="w-[95%] mx-auto space-y-[2rem]">

                            <FormField className="">
                                <TextInput
                                    type="text"
                                    size="sm"
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Ex. Update On New Feature"
                                    defaultValue={''}
                                    isError={false}
                                    clear={loading ? false : true}
                                    label={{
                                        required: true,
                                        fontSize: 13,
                                        title: "Enter Title"
                                    }}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                />
                            </FormField>

                            <FormField>
                                <TinyMCE ref={editorRef} height={400} />
                            </FormField>

                            <FormField className="flex items-center">
                                <IconButton
                                    size="min-w-[1.8rem] min-h-[1.8rem]"
                                    className="bg-pab-50 bgh-pab-100"
                                    icon={{
                                        type: 'polio',
                                        name: 'arrow-left',
                                        size: 16,
                                        className: 'pab-800'
                                    }}
                                    label={{
                                        text: 'Cancel',
                                        weight: 'medium'
                                    }}
                                    onClick={(e) => {
                                        goBack()
                                    }}
                                />
                                <Button
                                    type="primary"
                                    semantic="normal"
                                    size="rg"
                                    loading={loading}
                                    disabled={form.users.length === 0}
                                    block={false}
                                    className="form-button min-w-[150px] ml-auto"
                                    icon={{
                                        enable: true,
                                        child: <Icon name="arrow-right" type="polio" size={16} />
                                    }}
                                    text={{
                                        label: "Send Update",
                                        size: 13,
                                        weight: 'medium'
                                    }}
                                    onClick={(e) => handleSubmit(e)}
                                />
                            </FormField>

                        </form>

                    </div>
                </CardUI>

            </div>

        </>
    )
};

export default UpdatesPage;
