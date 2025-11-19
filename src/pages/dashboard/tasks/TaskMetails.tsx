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
import { StatusEnum, TaskFieldEnum, TaskTypeEnum, UIEnum } from "../../../utils/enums.util";
import useTask from "../../../hooks/app/useTask";
import EmptyState from "../../../components/partials/dialogs/EmptyState";
import Badge from "../../../components/partials/badges/Badge";
import { Link, useParams } from "react-router-dom";
import { TASK_FIELDS } from "../../../utils/constants.util";
import IconButton from "../../../components/partials/buttons/IconButton";
import Icon from "../../../components/partials/icons/Icon";
import { ITaskDeliverable, ITaskInstruction, ITaskObjective } from "../../../models/Task.model";
import Dot from "../../../components/partials/ui/Dot";
import Skill from "../../../models/Skill.model";
import { IGroupedResource } from "../../../utils/interfaces.util";
import UIResource from "../../../components/app/UIResource";
import UITaskRubric from "../../../components/app/task/UITaskRubric";
import useUser from "../../../hooks/app/useUser";

const TaskMetailsPage = () => {

    const { id } = useParams<{ id: string }>()

    const fiRef = useRef<any>(null)
    const toRef = useRef<any>(null)
    const carRef = useRef<any>(null)
    const leRef = useRef<any>(null)
    const diRef = useRef<any>(null)
    const skiRef = useRef<any>(null)

    const { toast, setToast } = useToast()
    const { getFullname } = useUser()
    const { loading: coreLoading, core, getCoreResources } = useApp()
    const { task, loading, getTask, updateUITask, countTaskFields, groupTaskResources, formatTaskStatus } = useTask()

    const [taskField, setTaskField] = useState<typeof TaskFieldEnum[keyof typeof TaskFieldEnum]>(TaskFieldEnum.OBJECTIVES)
    const [resources, setResources] = useState<Array<IGroupedResource>>([]);
    const [fields, setFields] = useState<Array<Field>>([])
    const [topics, setTopics] = useState<Array<Topic>>([])
    const [careers, setCareers] = useState<Array<Career>>([])
    const [skills, setSkills] = useState<Array<Skill>>([])
    const [form, setForm] = useState({
        careerId: '',
        level: '',
        difficulty: '',
        fieldId: '',
        topicId: '',
    })



    useEffect(() => {
        handleGetTask(id)
        getCoreResources({ limit: 9999, page: 1, order: 'desc' })
    }, [])

    useEffect(() => {
        setCareers(core.careers)
    }, [core])

    useEffect(() => {
        if (task && task.career && task.field) {
            const fd = core.fields.filter((x) => x.career === task.career._id)
            const topics = core.topics.filter((x) => x.fields.includes(task.field._id))
            const skills = core.skills.filter((x) => x.fields.includes(task.field._id))
            setFields(fd);
            setTopics(topics);
            setSkills(skills)

            if (task.resources.length > 0) {
                setResources(groupTaskResources(task.resources))
            }
        }
    }, [task])

    const handleGetTask = (id?: string) => {
        getTask(id ? id : '')
    }

    const clearOnSelect = (rubric: string) => {

        if (rubric === 'all') {
            leRef?.current?.clear()
            carRef?.current?.clear()
            fiRef?.current?.clear()
            toRef?.current?.clear()
            diRef?.current?.clear()
            setForm({
                ...form,
                fieldId: '',
                topicId: '',
                careerId: '',
                difficulty: '',
                level: ''
            })
        }

        if (rubric === 'career') {
            fiRef?.current?.clear()
            toRef?.current?.clear()
            setForm({
                ...form,
                fieldId: '',
                topicId: ''
            })
        }

        if (rubric === 'field') {
            toRef?.current?.clear()
            setForm({
                ...form,
                fieldId: '',
            })
        }

        if (rubric === 'level-difficulty') {
            leRef?.current?.clear()
            diRef?.current?.clear()
            setForm({
                ...form,
                level: '',
                difficulty: ''
            })
        }

    }


    return (
        <>

            <section className="space-y-[2.5rem]">

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
                                <CardUI>
                                    <div className="grid grid-cols-[35%_60%] gap-x-[5%]">

                                        <div>
                                            <div className="min-h-[200px] rounded-[14px] full-bg" style={{ backgroundImage: `url("${task.image ? task.image : '../../../images/assets/bg@core_03.webp'}")` }}></div>
                                        </div>
                                        <div>

                                            <div className="flex items-center">

                                                <div className="space-y-[0.5rem]">
                                                    <h3 className="font-mona-medium pas-950 text-[18px]">{task.title}</h3>
                                                    <div className="flex items-center gap-x-[1rem]">
                                                        <h3 className="font-mona-light pag-600 text-[13px]">ID: {task.code}</h3>
                                                        <h3 className="font-mona-light pag-600 text-[13px]">Duration: {task.duration.label}</h3>
                                                    </div>
                                                </div>

                                                <Button
                                                    type={"secondary"}
                                                    semantic={"info"}
                                                    size="xsm"
                                                    className="form-button ml-auto"
                                                    loading={false}
                                                    text={{
                                                        label: "Edit Details",
                                                        size: 13,
                                                    }}
                                                    onClick={(e) => { }}
                                                />

                                            </div>

                                            <Divider />

                                            <div className="flex items-center gap-x-[1rem]">
                                                <h4 className="">
                                                    <span className="font-mona-light pag-500 text-[15px]">Field - </span>
                                                    <span className="font-mona pag-800 text-[15px]">{task?.field?.name || '---'}</span>
                                                </h4>
                                                <span>&nbsp; | &nbsp;</span>
                                                <h4 className="">
                                                    <span className="font-mona-light pag-500 text-[15px]">Topic - </span>
                                                    <span className="font-mona pag-800 text-[15px]">{task?.topic?.name || '---'}</span>
                                                </h4>
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
                                            </div>

                                        </div>

                                    </div>
                                </CardUI>

                                <CardUI>

                                    <div className="grid grid-cols-4 min-h-[70px]">

                                        <div className="grow space-y-[0.9rem]">
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-[13px]">Created On: </h3>
                                                <p className="font-mona pag-600 text-[13px]">{helper.formatDate(task.createdAt, 'dt-noyear')}</p>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-[13px]">Created By: </h3>
                                                <p className="font-mona pag-600 text-[13px]">{getFullname(task.createdBy)}</p>
                                            </div>
                                        </div>

                                        <div className="grow space-y-[0.9rem]">
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-[13px]">Skill Level: </h3>
                                                <p className="font-mona pag-600 text-[13px]">{helper.capitalize(task.level)}</p>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-[13px]">Difficulty: </h3>
                                                <p className="font-mona pag-600 text-[13px]">{helper.capitalize(task.difficulty)}</p>
                                            </div>
                                        </div>

                                        <div className="grow space-y-[0.9rem]">

                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-[13px]">Duration: </h3>
                                                <p className="font-mona pag-600 text-[13px]">{helper.capitalizeWord(task.duration.label)}</p>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-[13px]">Start Date: </h3>
                                                <p className="font-mona pag-600 text-[13px]">{task.startDate.ISO ? helper.formatDate(task.startDate.ISO, 'dt-noyear') : 'Not Set'}</p>
                                            </div>

                                        </div>

                                        <div className="grow space-y-[0.9rem]">
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-[13px]">Status: </h3>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <Badge
                                                    type={formatTaskStatus(task.status).type as any}
                                                    size="sm"
                                                    display="status"
                                                    label={formatTaskStatus(task.status).label}
                                                    padding={{ y: 3, x: 10 }}
                                                    font={{
                                                        weight: 'regular',
                                                        size: 10
                                                    }}
                                                    upper={true}
                                                    close={false}
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    <div className="py-[rem]">
                                        <Divider show={true} padding={{ enable: true, top: 'pt-[1rem]', bottom: 'pb-[1.5rem]' }} />
                                    </div>

                                    <div className="grid grid-cols-4 min-h-[70px]">
                                        <div className="grow space-y-[0.9rem]">
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-[13px]">Assigned On: </h3>
                                                <p className="font-mona pag-600 text-[13px]">{ task.assignedAt ? helper.formatDate(task.assignedAt, 'dt-noyear') : 'Not Set'}</p>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-[13px]">Assigned By: </h3>
                                                <p className="font-mona pag-600 text-[13px]">{getFullname(task.assignedBy)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grow space-y-[0.9rem]">
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-[13px]">Talents:  </h3>
                                                <p className="font-mona pag-600 text-[13px]">{task.talents.length}</p>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-[13px]">Comments:  </h3>
                                                <p className="font-mona pag-600 text-[13px]">{task.comments.length}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grow space-y-[0.9rem]">

                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-[13px]">Feedbacks: </h3>
                                                <p className="font-mona pag-600 text-[13px]">{ task.feedbacks.length }</p>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-[13px]">Due Date: </h3>
                                                <p className="font-mona pag-600 text-[13px]">{task.dueDate.ISO ? helper.formatDate(task.dueDate.ISO, 'dt-noyear') : 'Not Set'}</p>
                                            </div>

                                        </div>
                                    </div>

                                </CardUI>

                                <CardUI>

                                    <div className="space-y-[1rem]">

                                        <div className="flex items-center">
                                            <h3 className="font-mona-medium text-[14px] pag-800">Modify Task {helper.capitalize(taskField)}</h3>

                                        </div>

                                        <div className="w-full grid grid-cols-[30%_68%] gap-x-[2%]">

                                            <div className="space-y-[0.85rem]">
                                                {
                                                    TASK_FIELDS.map((tskf, index) =>
                                                        <Fragment key={tskf + index}>

                                                            <div onClick={(e) => setTaskField(tskf)} className={`cursor-pointer flex items-center px-[1rem] py-[0.6rem] rounded-[5px] border ${tskf === taskField ? 'bg-pagr-25 bdr-pagr-50' : 'bdr-pag-100'}`}>
                                                                <h3 className={`${tskf === taskField ? 'font-mona-medium pagr-800' : 'font-mona pag-800'} text-[14px]`}>{helper.capitalize(tskf)}</h3>
                                                                {
                                                                    tskf === taskField &&
                                                                    <span className="flex items-center ml-auto justify-center w-[25px] h-[25px] bg-pagr-500 rounded-full">
                                                                        <Icon name="check" type="polio" className="color-white" size={15} />
                                                                    </span>
                                                                }
                                                            </div>

                                                        </Fragment>
                                                    )
                                                }
                                            </div>

                                            <CardUI>

                                                {
                                                    taskField === TaskFieldEnum.OBJECTIVES &&
                                                    <>
                                                        <h3 className="font-mona pag-900 text-[15px] mb-[1rem]">Task {helper.capitalize(taskField)} ({task.objectives.length})</h3>

                                                        <div className="space-y-[1rem]">
                                                            {
                                                                task.objectives.length > 0 &&
                                                                task.objectives.map((ov: ITaskObjective, index) =>
                                                                    <Fragment key={ov.code}>

                                                                        <div className="flex items-center">

                                                                            <div className="space-y-[0.65rem]">
                                                                                <h3 className="font-mona-medium pag-900 text-[15px]">{index + 1}. {ov.title}</h3>
                                                                                <ul className="pl-[1rem]">
                                                                                    {
                                                                                        ov.steps.map((step, index) =>
                                                                                            <Fragment key={ov.code + index}>
                                                                                                <li>
                                                                                                    <div className="flex items-center gap-x-[0.5rem]">
                                                                                                        <Dot />
                                                                                                        <p className="font-mona pag-900 text-[14px]">{step}</p>
                                                                                                    </div>
                                                                                                </li>
                                                                                            </Fragment>
                                                                                        )
                                                                                    }
                                                                                </ul>
                                                                            </div>

                                                                            <IconButton
                                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                                className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700 ml-auto"
                                                                                icon={{
                                                                                    type: 'feather',
                                                                                    name: 'edit-2',
                                                                                    size: 14,
                                                                                }}
                                                                                onClick={(e) => { }}
                                                                            />

                                                                        </div>


                                                                        {(index + 1) < task.objectives.length && <Divider padding={{ enable: false }} />}
                                                                    </Fragment>
                                                                )
                                                            }
                                                        </div>

                                                    </>
                                                }

                                                {
                                                    taskField === TaskFieldEnum.OUTCOMES &&
                                                    <>
                                                        <h3 className="font-mona pag-900 text-[15px] mb-[1rem]">Task Learning {helper.capitalize(taskField)} ({task.outcomes.length})</h3>

                                                        <div className="space-y-[1rem]">
                                                            {
                                                                task.outcomes.length > 0 &&
                                                                task.outcomes.map((ov: string, index) =>
                                                                    <Fragment key={ov}>

                                                                        <div className="flex items-center">

                                                                            <div className="space-y-[0.65rem]">
                                                                                <h3 className="font-mona-medium pag-900 text-[15px]">{index + 1}. {ov}</h3>
                                                                            </div>

                                                                            <IconButton
                                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                                className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700 ml-auto"
                                                                                icon={{
                                                                                    type: 'feather',
                                                                                    name: 'edit-2',
                                                                                    size: 14,
                                                                                }}
                                                                                onClick={(e) => { }}
                                                                            />

                                                                        </div>

                                                                        {(index + 1) < task.outcomes.length && <Divider padding={{ enable: false }} />}
                                                                    </Fragment>
                                                                )
                                                            }
                                                        </div>
                                                    </>
                                                }

                                                {
                                                    taskField === TaskFieldEnum.REQUIREMENTS &&
                                                    <>
                                                        <h3 className="font-mona pag-900 text-[15px] mb-[1rem]">Task {helper.capitalize(taskField)} ({task.requirements.length})</h3>

                                                        <div className="space-y-[1rem]">
                                                            {
                                                                task.requirements.length > 0 &&
                                                                task.requirements.map((ov: string, index) =>
                                                                    <Fragment key={ov}>

                                                                        <div className="flex items-center">

                                                                            <div className="space-y-[0.65rem]">
                                                                                <h3 className="font-mona-medium pag-900 text-[15px]">{index + 1}. {ov}</h3>
                                                                            </div>

                                                                            <IconButton
                                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                                className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700 ml-auto"
                                                                                icon={{
                                                                                    type: 'feather',
                                                                                    name: 'edit-2',
                                                                                    size: 14,
                                                                                }}
                                                                                onClick={(e) => { }}
                                                                            />

                                                                        </div>

                                                                        {(index + 1) < task.requirements.length && <Divider padding={{ enable: false }} />}
                                                                    </Fragment>
                                                                )
                                                            }
                                                        </div>
                                                    </>
                                                }

                                                {
                                                    taskField === TaskFieldEnum.INSTRUCTIONS &&
                                                    <>
                                                        <h3 className="font-mona pag-900 text-[15px] mb-[1rem]">Task {helper.capitalize(taskField)} ({task.instructions.length})</h3>

                                                        <div className="space-y-[1rem]">
                                                            {
                                                                task.instructions.length > 0 &&
                                                                task.instructions.map((ov: ITaskInstruction, index) =>
                                                                    <Fragment key={ov.code}>

                                                                        <div className="flex items-center">

                                                                            <div className="space-y-[0.65rem]">
                                                                                <h3 className="font-mona-medium pag-900 text-[15px]">{index + 1}. {ov.title}</h3>
                                                                                <ul className="pl-[1rem]">
                                                                                    {
                                                                                        ov.actions.map((step, index) =>
                                                                                            <Fragment key={ov.code + index}>
                                                                                                <li>
                                                                                                    <div className="flex items-center gap-x-[0.5rem]">
                                                                                                        <Dot />
                                                                                                        <p className="font-mona pag-900 text-[14px]">{step}</p>
                                                                                                    </div>
                                                                                                </li>
                                                                                            </Fragment>
                                                                                        )
                                                                                    }
                                                                                </ul>
                                                                            </div>

                                                                            <IconButton
                                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                                className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700 ml-auto"
                                                                                icon={{
                                                                                    type: 'feather',
                                                                                    name: 'edit-2',
                                                                                    size: 14,
                                                                                }}
                                                                                onClick={(e) => { }}
                                                                            />

                                                                        </div>


                                                                        {(index + 1) < task.instructions.length && <Divider padding={{ enable: false }} />}
                                                                    </Fragment>
                                                                )
                                                            }
                                                        </div>

                                                    </>
                                                }

                                                {
                                                    taskField === TaskFieldEnum.DELIVERABLES &&
                                                    <>
                                                        <h3 className="font-mona pag-900 text-[15px] mb-[1rem]">Task {helper.capitalize(taskField)} ({task.deliverables.length})</h3>

                                                        <div className="space-y-[1rem]">
                                                            {
                                                                task.deliverables.length > 0 &&
                                                                task.deliverables.map((ov: ITaskDeliverable, index) =>
                                                                    <Fragment key={ov.code}>

                                                                        <div className="flex items-center">

                                                                            <div className="space-y-[0.65rem]">
                                                                                <h3 className="font-mona-medium pag-900 text-[15px]">{index + 1}. {ov.title}</h3>
                                                                                <ul className="pl-[1rem]">
                                                                                    {
                                                                                        ov.outcomes.map((step, index) =>
                                                                                            <Fragment key={ov.code + index}>
                                                                                                <li>
                                                                                                    <div className="flex items-center gap-x-[0.5rem]">
                                                                                                        <Dot />
                                                                                                        <p className="font-mona pag-900 text-[14px]">{step}</p>
                                                                                                    </div>
                                                                                                </li>
                                                                                            </Fragment>
                                                                                        )
                                                                                    }
                                                                                </ul>
                                                                            </div>

                                                                            <IconButton
                                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                                className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700 ml-auto"
                                                                                icon={{
                                                                                    type: 'feather',
                                                                                    name: 'edit-2',
                                                                                    size: 14,
                                                                                }}
                                                                                onClick={(e) => { }}
                                                                            />

                                                                        </div>


                                                                        {(index + 1) < task.deliverables.length && <Divider padding={{ enable: false }} />}
                                                                    </Fragment>
                                                                )
                                                            }
                                                        </div>

                                                    </>
                                                }

                                                {
                                                    taskField === TaskFieldEnum.SKILLS &&
                                                    <>
                                                        <div className="flex items-center">
                                                            <h3 className="font-mona pag-900 text-[15px] mb-[1rem]">Task {helper.capitalize(taskField)} ({task.skills.length})</h3>
                                                            <Button
                                                                type={"secondary"}
                                                                semantic={"info"}
                                                                size="xsm"
                                                                className="form-button ml-auto"
                                                                loading={false}
                                                                disabled={countTaskFields(TaskFieldEnum.SKILLS, UIEnum.NEW) > 0 ? false : true}
                                                                text={{
                                                                    label: "Save",
                                                                    size: 13,
                                                                }}
                                                                onClick={(e) => { }}
                                                            />
                                                        </div>


                                                        <div className="mb-[1.5rem]">
                                                            <div className={`w-[30%] ${(coreLoading) ? 'disabled-light' : ''}`}>

                                                                <Filter
                                                                    ref={skiRef}
                                                                    size='xxsm'
                                                                    className='la-filter'
                                                                    placeholder="Skill Level"
                                                                    defaultValue={''}
                                                                    position="bottom"
                                                                    menu={{
                                                                        search: false,
                                                                        fullWidth: true,
                                                                        limitHeight: 'sm'
                                                                    }}
                                                                    items={
                                                                        skills.map((x: Skill) => {
                                                                            return {
                                                                                label: helper.capitalizeWord(x.name),
                                                                                value: x._id
                                                                            }
                                                                        })
                                                                    }
                                                                    noFilter={false}
                                                                    onChange={(data) => {

                                                                        let skill = skills.find((sk) => sk._id === data.value)

                                                                        if (skill) {
                                                                            updateUITask({
                                                                                action: 'add',
                                                                                field: TaskFieldEnum.SKILLS,
                                                                                data: [{ ...skill, ui: UIEnum.NEW }]
                                                                            })
                                                                            skiRef?.current?.clear()
                                                                        }

                                                                    }}
                                                                />

                                                            </div>
                                                        </div>

                                                        <div className="space-y-[1rem]">
                                                            {
                                                                task.skills.length === 0 &&
                                                                <EmptyState className="min-h-[30vh]" noBound={true} >
                                                                    <span className="font-mona text-[14px] pas-950">No task skills yet!</span>
                                                                </EmptyState>
                                                            }

                                                            {
                                                                task.skills.length > 0 &&
                                                                task.skills.map((ov: any, index) =>
                                                                    <Fragment key={ov.code}>

                                                                        <div className="flex items-center">

                                                                            <div className="space-y-[0.65rem]">
                                                                                <h3 className="font-mona-medium pag-900 text-[15px]">{index + 1}. {ov.name}</h3>
                                                                            </div>

                                                                            <IconButton
                                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                                className="bg-par-50 bgh-par-200 par-700 parh-700 ml-auto"
                                                                                icon={{
                                                                                    type: 'feather',
                                                                                    name: 'x',
                                                                                    size: 14,
                                                                                }}
                                                                                onClick={(e) => {
                                                                                    if (ov.ui && ov.ui === UIEnum.NEW) {
                                                                                        updateUITask({
                                                                                            action: 'remove',
                                                                                            field: TaskFieldEnum.SKILLS,
                                                                                            data: [ov]
                                                                                        })
                                                                                    }
                                                                                }}
                                                                            />

                                                                        </div>


                                                                        {(index + 1) < task.skills.length && <Divider padding={{ enable: false }} />}
                                                                    </Fragment>
                                                                )
                                                            }
                                                        </div>

                                                    </>
                                                }

                                                {
                                                    taskField === TaskFieldEnum.RESOURCES &&
                                                    <>
                                                        <h3 className="font-mona pag-900 text-[15px] mb-[1rem]">Task {helper.capitalize(taskField)} ({resources.length})</h3>

                                                        <div className="space-y-[1rem]">
                                                            {
                                                                resources.length > 0 &&
                                                                resources.map((ov: IGroupedResource, index) =>
                                                                    <Fragment key={ov.name}>
                                                                        <UIResource resource={ov} index={index} />
                                                                    </Fragment>
                                                                )
                                                            }
                                                        </div>

                                                    </>
                                                }

                                                {
                                                    taskField === TaskFieldEnum.RUBRICS &&
                                                    <>
                                                        <h3 className="font-mona pag-900 text-[15px] mb-[1rem]">Task {helper.capitalize(taskField)} ({task.rubrics.length})</h3>
                                                        <UITaskRubric rubrics={task.rubrics} />
                                                    </>
                                                }


                                            </CardUI>

                                        </div>

                                    </div>

                                </CardUI>
                            </>
                        }

                    </>
                }

            </section>

        </>
    )
}

export default TaskMetailsPage;
