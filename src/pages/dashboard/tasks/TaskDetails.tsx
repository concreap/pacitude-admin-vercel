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
import EmojiPicker from 'emoji-picker-react';
import Icon from "../../../components/partials/icons/Icon";
import { ITaskDeliverable, ITaskInstruction, ITaskObjective } from "../../../models/Task.model";
import Dot from "../../../components/partials/ui/Dot";
import Skill from "../../../models/Skill.model";
import { IGroupedResource } from "../../../utils/interfaces.util";
import UIResource from "../../../components/app/UIResource";
import UITaskRubric from "../../../components/app/task/UITaskRubric";
import useUser from "../../../hooks/app/useUser";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import storage from "../../../utils/storage.util";
import TaskMCE from "../../../components/app/editor/TaskMCE";
import Feedback from "./Feedback";
import useGoTo from "../../../hooks/useGoTo";

const TaskDetailsPage = () => {

    const { id } = useParams<{ id: string }>()

    const fiRef = useRef<any>(null)
    const toRef = useRef<any>(null)
    const carRef = useRef<any>(null)
    const leRef = useRef<any>(null)
    const diRef = useRef<any>(null)
    const editorRef = useRef<any>(null)

    const { toDetailRoute } = useGoTo()
    const { getFullname } = useUser()
    const { loading: coreLoading, core, getCoreResources } = useApp()
    const { task, loading, getTask, countTaskFields, groupTaskResources, formatTaskStatus } = useTask()

    const [taskField, setTaskField] = useState<typeof TaskFieldEnum[keyof typeof TaskFieldEnum]>(TaskFieldEnum.OBJECTIVES)
    const [resources, setResources] = useState<Array<IGroupedResource>>([]);
    const [fields, setFields] = useState<Array<Field>>([])
    const [topics, setTopics] = useState<Array<Topic>>([])
    const [careers, setCareers] = useState<Array<Career>>([])
    const [skills, setSkills] = useState<Array<Skill>>([])
    const [showPicker, setShowPicker] = useState(false);
    const [showReply, setShowReply] = useState(false);
    const [inputText, setInputText] = useState('');

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

    const configTab = (e: any, val: any) => {
        if (e) { e.preventDefault(); }
        storage.keep('task-details-tab', val.toString())
    }

    const onEmojiClick = (emojiData: any) => {
        setInputText(prevInput => prevInput + emojiData.emoji);
        setShowPicker(false);
    };

    const onReplyClick = (e: any) => {
        if (e) e.preventDefault()
        setShowReply(!showReply);
    };

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
                                                    type={"primary"}
                                                    semantic={"info"}
                                                    size="xsm"
                                                    className="form-button ml-auto"
                                                    loading={false}
                                                    text={{
                                                        label: "Edit Task",
                                                        size: 13,
                                                    }}
                                                    onClick={(e) => { toDetailRoute(e, { route: 'tasks', name: 'edit-task', id: id }) }}
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
                                                <p className="font-mona pag-600 text-[13px]">{task.assignedAt ? helper.formatDate(task.assignedAt, 'dt-noyear') : 'Not Set'}</p>
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
                                                <p className="font-mona pag-600 text-[13px]">{task.feedbacks.length}</p>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <h3 className="font-mona pag-800 text-[13px]">Due Date: </h3>
                                                <p className="font-mona pag-600 text-[13px]">{task.dueDate.ISO ? helper.formatDate(task.dueDate.ISO, 'dt-noyear') : 'Not Set'}</p>
                                            </div>

                                        </div>
                                    </div>

                                </CardUI>

                                <CardUI>

                                    <Tabs defaultIndex={parseInt(storage.fetch('task-details-tab'))}>

                                        <TabList>
                                            <Tab onClick={(e: any) => { configTab(e, 0); }}>General</Tab>
                                            <Tab onClick={(e: any) => { configTab(e, 1); }}>Submission</Tab>
                                            <Tab onClick={(e: any) => { configTab(e, 2); }}>Comments</Tab>
                                            <Tab onClick={(e: any) => { configTab(e, 3); }}>Feedback</Tab>
                                            <Tab onClick={(e: any) => { configTab(e, 4); }}>Assignees</Tab>
                                            <Tab onClick={(e: any) => { configTab(e, 5); }}>Reviewer</Tab>
                                        </TabList>

                                        <TabPanel tabIndex={0}>

                                            <div className="space-y-[1rem] py-[1.5rem]">

                                                <div className="flex items-center">
                                                    <h3 className="font-mona-medium text-[14px] pag-800">Task {helper.capitalize(taskField)} Details</h3>

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

                                                                                </div>


                                                                                {(index + 1) < task.deliverables.length && <Divider padding={{ enable: false }} />}
                                                                            </Fragment>
                                                                        )
                                                                    }
                                                                </div>

                                                            </>
                                                        }

                                                        {
                                                            taskField === TaskFieldEnum.GUIDELINES &&
                                                            <>
                                                                <h3 className="font-mona pag-900 text-[15px] mb-[1rem]">Task Submission {helper.capitalize(taskField)} ({task.submission.guidelines.length})</h3>

                                                                <div className="font-mona-light text-[14px] pag-900 mb-[1rem]" dangerouslySetInnerHTML={{ __html: task.submission.notes }} />

                                                                <div className="space-y-[1rem]">
                                                                    {
                                                                        task.submission.guidelines.length > 0 &&
                                                                        task.submission.guidelines.map((ov: string, index) =>
                                                                            <Fragment key={ov}>

                                                                                <div className="flex items-center">

                                                                                    <div className="space-y-[0.65rem]">
                                                                                        <h3 className="font-mona-medium pag-900 text-[15px]">{index + 1}. {ov}</h3>
                                                                                    </div>

                                                                                </div>

                                                                                {(index + 1) < task.submission.guidelines.length && <Divider padding={{ enable: false }} />}
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
                                                                                <UIResource resource={ov} index={index} edit={false} />
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
                                                                <UITaskRubric edit={false} rubrics={task.rubrics} />
                                                            </>
                                                        }


                                                    </CardUI>

                                                </div>

                                            </div>

                                        </TabPanel>

                                        <TabPanel tabIndex={1}>

                                            <div className="py-[1.5rem]">
                                                {
                                                    task.submission.items.length === 0 &&
                                                    <EmptyState className="min-h-[50vh]" noBound={true} >
                                                        <span className="font-mona text-[14px] pas-950">Submission items will appear here</span>
                                                    </EmptyState>
                                                }
                                            </div>

                                        </TabPanel>

                                        <TabPanel tabIndex={2}>

                                            <div className="py-[1.5rem]">
                                                {
                                                    task.comments.length === 0 &&
                                                    <EmptyState className="min-h-[50vh]" noBound={true} >
                                                        <span className="font-mona text-[14px] pas-950">Comments will appear here</span>
                                                    </EmptyState>
                                                }
                                                <div className="pt-[1.5rem] space-y-[0.6rem] pb-16">

                                                    <h3 className="font-mona-semibold pag-800 text-sm mb-1">Task Title: Create a Simple Task-Completion Animation in Figma</h3>

                                                    <Divider show={false} />

                                                    <div className="">

                                                        <div className="flex items-center gap-4">

                                                            <div className={`avatar round sm ui-full-bg bg-center ${loading ? 'disabled-light' : ''}`}
                                                                style={{ backgroundImage: `url("")` }}>
                                                                <span className="font-mona-semibold pab-900 text-sm uppercase">{helper.getInitials(`Oluwatobi Immanuel`)}</span>
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                <h3 className="font-mona-semibold pag-900 text-[13px]">Immanuel Oluwatobi</h3>
                                                                <p className="font-mona text-[#717689] text-[11px]">Yesterday at 9:50 AM</p>
                                                            </div>

                                                        </div>
                                                        <Divider show={false} padding={{ enable: true, top: 'pt-[0.4rem]', bottom: 'pb-[0.4rem]' }} />
                                                        <p className="font-mona-medium text-[#3A3E4F] text-xs leading-loose">Nice work on defining the goal of your animation early. I like that you tied it to positive reinforcement for the user. But you could improve the timing right now it feels a bit fast, which might overwhelm users. Try slowing it down slightly so the feedback feels smoother and more natural.</p>
                                                        <Divider show={false} padding={{ enable: true, top: 'pt-[0.4rem]', bottom: 'pb-[0.4rem]' }} />
                                                        <div className="flex items-center gap-5 mb-5">
                                                            <Link to='' onClick={(e) => onReplyClick(e)} className="flex items-center gap-2">
                                                                <Icon name="message-text" type="polio" size={16} className="color-black" />
                                                                <p className="font-mona-medium text-[#3A3E4F] text-xs">Reply</p>
                                                            </Link>
                                                            <Link to='' onClick={() => setShowPicker(val => !val)} className="flex items-center gap-2">
                                                                {/* <Icon name="smile" type="polio" size={16} className="color-black" /> */}
                                                                😀
                                                                <p className="font-mona-medium text-[#3A3E4F] text-xs">React</p>
                                                            </Link>

                                                        </div>
                                                        {
                                                            inputText &&
                                                            <div className="h-8 w-13 bg-pag-200 flex items-center justify-between rounded-2xl px-2 mb-4">
                                                                <p>{inputText}</p>
                                                                <p className="font-mona-medium text-[#3A3E4F] text-[11px]">+1</p>
                                                            </div>
                                                        }


                                                        {showPicker && (
                                                            <div className='absolute z-50 h-[300px] overflow-y-scroll'>
                                                                <EmojiPicker
                                                                    onEmojiClick={onEmojiClick}
                                                                    // Optional:you can customize the picker here
                                                                    // theme="white"
                                                                    lazyLoadEmojis={true}
                                                                />
                                                            </div>
                                                        )}

                                                        {
                                                            showReply &&
                                                            <div className="task-mce">
                                                                <TaskMCE ref={editorRef} height={200} />
                                                            </div>
                                                        }

                                                    </div>

                                                    <Divider padding={{ top: 'pt-[1.3rem]', bottom: 'pb-[1.3rem]', enable: true, }} />

                                                    <div className="ml-12">

                                                        <div className="flex items-center gap-4">

                                                            <div className={`avatar round sm ui-full-bg bg-center ${loading ? 'disabled-light' : ''}`}
                                                                style={{ backgroundImage: `url("")` }}>
                                                                <span className="font-mona-semibold pab-900 text-sm uppercase">{helper.getInitials(`Oluwatobi Immanuel`)}</span>
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                <h3 className="font-mona-semibold pag-900 text-[13px]">Immanuel Oluwatobi</h3>
                                                                <p className="font-mona text-[#717689] text-[11px]">Yesterday at 9:50 AM</p>
                                                            </div>

                                                        </div>
                                                        <Divider show={false} padding={{ enable: true, top: 'pt-[0.4rem]', bottom: 'pb-[0.4rem]' }} />
                                                        <p className="font-mona-medium text-[#3A3E4F] text-xs leading-loose">Nice work on defining the goal of your animation early. I like that you tied it to positive reinforcement for the user. But you could improve the timing right now it feels a bit fast, which might overwhelm users. Try slowing it down slightly so the feedback feels smoother and more natural.</p>
                                                        <Divider show={false} padding={{ enable: true, top: 'pt-[0.4rem]', bottom: 'pb-[0.4rem]' }} />
                                                        <div className="flex items-center gap-5 mb-5">
                                                            <Link to='' onClick={(e) => onReplyClick(e)} className="flex items-center gap-2">
                                                                <Icon name="message-text" type="polio" size={16} className="color-black" />
                                                                <p className="font-mona-medium text-[#3A3E4F] text-xs">Reply</p>
                                                            </Link>
                                                            <Link to='' onClick={() => setShowPicker(val => !val)} className="flex items-center gap-2">
                                                                {/* <Icon name="smile" type="polio" size={16} className="color-black" /> */}
                                                                😀
                                                                <p className="font-mona-medium text-[#3A3E4F] text-xs">React</p>
                                                            </Link>

                                                        </div>
                                                        {
                                                            inputText &&
                                                            <div className="h-8 w-13 bg-pag-200 flex items-center justify-between rounded-2xl px-2 mb-4">
                                                                <p>{inputText}</p>
                                                                <p className="font-mona-medium text-[#3A3E4F] text-[11px]">+1</p>
                                                            </div>
                                                        }


                                                        {showPicker && (
                                                            <div className='absolute z-50 h-[300px] overflow-y-scroll'>
                                                                <EmojiPicker
                                                                    onEmojiClick={onEmojiClick}
                                                                    // Optional:you can customize the picker here
                                                                    // theme="white"
                                                                    lazyLoadEmojis={true}
                                                                />
                                                            </div>
                                                        )}

                                                        {
                                                            showReply &&
                                                            <div className="task-mce">
                                                                <TaskMCE ref={editorRef} height={200} />
                                                            </div>
                                                        }

                                                    </div>
                                                    <Divider padding={{ top: 'pt-[1.3rem]', bottom: 'pb-[1.3rem]', enable: true, }} />
                                                    <div className="">

                                                        <div className="flex items-center gap-4">

                                                            <div className={`avatar round sm ui-full-bg bg-center ${loading ? 'disabled-light' : ''}`}
                                                                style={{ backgroundImage: `url("")` }}>
                                                                <span className="font-mona-semibold pab-900 text-sm uppercase">{helper.getInitials(`Oluwatobi Immanuel`)}</span>
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                <h3 className="font-mona-semibold pag-900 text-[13px]">Immanuel Oluwatobi</h3>
                                                                <p className="font-mona text-[#717689] text-[11px]">Yesterday at 9:50 AM</p>
                                                            </div>

                                                        </div>
                                                        <Divider show={false} padding={{ enable: true, top: 'pt-[0.4rem]', bottom: 'pb-[0.4rem]' }} />
                                                        <p className="font-mona-medium text-[#3A3E4F] text-xs leading-loose">Nice work on defining the goal of your animation early. I like that you tied it to positive reinforcement for the user. But you could improve the timing right now it feels a bit fast, which might overwhelm users. Try slowing it down slightly so the feedback feels smoother and more natural.</p>
                                                        <Divider show={false} padding={{ enable: true, top: 'pt-[0.4rem]', bottom: 'pb-[0.4rem]' }} />
                                                        <div className="flex items-center gap-5 mb-5">
                                                            <Link to='' onClick={(e) => onReplyClick(e)} className="flex items-center gap-2">
                                                                <Icon name="message-text" type="polio" size={16} className="color-black" />
                                                                <p className="font-mona-medium text-[#3A3E4F] text-xs">Reply</p>
                                                            </Link>
                                                            <Link to='' onClick={() => setShowPicker(val => !val)} className="flex items-center gap-2">
                                                                {/* <Icon name="smile" type="polio" size={16} className="color-black" /> */}
                                                                😀
                                                                <p className="font-mona-medium text-[#3A3E4F] text-xs">React</p>
                                                            </Link>

                                                        </div>
                                                        {
                                                            inputText &&
                                                            <div className="h-8 w-13 bg-pag-200 flex items-center justify-between rounded-2xl px-2 mb-4">
                                                                <p>{inputText}</p>
                                                                <p className="font-mona-medium text-[#3A3E4F] text-[11px]">+1</p>
                                                            </div>
                                                        }

                                                        {showPicker && (
                                                            <div className='absolute z-50 h-[300px] overflow-y-scroll'>
                                                                <EmojiPicker
                                                                    onEmojiClick={onEmojiClick}
                                                                    // Optional:you can customize the picker here
                                                                    // theme="white"
                                                                    lazyLoadEmojis={true}
                                                                />
                                                            </div>
                                                        )}

                                                        {
                                                            showReply &&
                                                            <div className="task-mce">
                                                                <TaskMCE ref={editorRef} height={200} />
                                                            </div>
                                                        }

                                                    </div>

                                                    {

                                                        (showReply || inputText) &&
                                                        <>
                                                            <Divider show={false} padding={{ enable: true, top: 'pt-[1.4rem]', bottom: 'pb-[1.4rem]' }} />
                                                            <div className="flex justify-end">

                                                                <Button
                                                                    type="primary"
                                                                    semantic="normal"
                                                                    size="rg"
                                                                    loading={loading}
                                                                    disabled={false}
                                                                    block={false}
                                                                    className="form-button min-w-[130px] ml-auto"

                                                                    text={{
                                                                        label: "Send",
                                                                        size: 13,
                                                                        weight: 'medium'
                                                                    }}
                                                                    onClick={(e) => { }}
                                                                />

                                                            </div>
                                                        </>
                                                    }

                                                </div>
                                            </div>

                                        </TabPanel>

                                        <TabPanel tabIndex={3}>

                                            <div className="py-[1.5rem]">
                                                {
                                                    task.feedbacks.length === 0 &&
                                                    <EmptyState className="min-h-[50vh]" noBound={true} >
                                                        <span className="font-mona text-[14px] pas-950">Feedback will appear here</span>
                                                    </EmptyState>
                                                }
                                                <div className="space-y-[0.7rem] pb-16">
                                                    <Feedback />
                                                    <Feedback />
                                                    <Feedback />
                                                </div>
                                            </div>

                                        </TabPanel>

                                        <TabPanel tabIndex={4}>

                                            <div className="py-[1.5rem]">

                                                {
                                                    task.talents.length === 0 &&
                                                    <EmptyState className="min-h-[50vh]" noBound={true} >
                                                        <span className="font-mona text-[14px] pas-950">Assignees will appear here</span>
                                                    </EmptyState>
                                                }

                                            </div>

                                        </TabPanel>

                                        <TabPanel tabIndex={5}>

                                            <div className="pt-[1.5rem] space-y-[0.6rem] pb-16">

                                                <div className="ts-mentor-card">

                                                    <div className="flex items-center gap-3">

                                                        <div className={`avatar round rg ui-full-bg bg-center ${loading ? 'disabled-light' : ''}`}
                                                            style={{ backgroundImage: `url("")` }}>
                                                            <span className="font-mona-semibold pab-900 text-lg uppercase">{helper.getInitials(`Oluwatobi Immanuel`)}</span>
                                                        </div>

                                                        <div>
                                                            <h3 className="font-rethink-semibold pag-900 text-base">Immanuel Oluwatobi</h3>
                                                            <p className="font-rethink text-[#717689] text-sm">Product Designer</p>
                                                        </div>

                                                    </div>
                                                    <p className="font-rethink text-[#4D657D] text-sm leading-loose">An experienced professional passionate about guiding and supporting others in their career journey. With 5+ years of experience in product design, I enjoy sharing practical tips, industry insights, and real-life lessons to help you grow faster. As a mentor, I provide personalized advice, share industry insights, and help you build the skills and confidence needed to achieve your goals.</p>
                                                </div>

                                            </div>

                                        </TabPanel>

                                    </Tabs>





                                </CardUI>
                            </>
                        }

                    </>
                }

            </section>

        </>
    )
}

export default TaskDetailsPage;
