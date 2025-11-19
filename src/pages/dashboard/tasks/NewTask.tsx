import { useEffect, useRef, useState } from "react"
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
import { LevelEnum } from "../../../utils/enums.util";
import useTask from "../../../hooks/app/useTask";
import EmptyState from "../../../components/partials/dialogs/EmptyState";
import Badge from "../../../components/partials/badges/Badge";
import useGoTo from "../../../hooks/useGoTo";

const NewTaskPage = () => {

    const fiRef = useRef<any>(null)
    const toRef = useRef<any>(null)
    const carRef = useRef<any>(null)
    const leRef = useRef<any>(null)

    const { toDetailRoute } = useGoTo()
    const { toast, setToast } = useToast()
    const { loading: coreLoading, core, getCoreResources } = useApp()
    const { task, loading, createTask, poller } = useTask()

    const [fields, setFields] = useState<Array<Field>>([])
    const [topics, setTopics] = useState<Array<Topic>>([])
    const [careers, setCareers] = useState<Array<Career>>([])
    const [form, setForm] = useState({
        careerId: '',
        level: '',
        fieldId: '',
        topicId: '',
    })

    const LEVELS: Array<typeof LevelEnum[keyof typeof LevelEnum]> = ['novice', 'beginner', 'intermediate', 'advanced', 'professional']

    useEffect(() => {
        getCoreResources({ limit: 9999, page: 1, order: 'desc' })
    }, [])

    useEffect(() => {
        setCareers(core.careers)
    }, [core])

    const clearOnSelect = (rubric: string) => {

        if (rubric === 'all') {
            leRef?.current?.clear()
            carRef?.current?.clear()
            fiRef?.current?.clear()
            toRef?.current?.clear()
            setForm({
                ...form,
                fieldId: '',
                topicId: '',
                careerId: '',
                level: ''
            })
        }

        if (rubric === 'career') {
            fiRef?.current?.clear()
            toRef?.current?.clear()
            setForm({
                ...form,
                fieldId: '',
                topicId: '',
            })
        }

        if (rubric === 'field') {
            toRef?.current?.clear()
            setForm({
                ...form,
                topicId: '',
            })
        }

    }

    const handleCreateTask = async (e: any) => {

        if (!form.level) {
            setToast({
                ...toast,
                show: true,
                type: 'error', title: 'Error',
                message: 'select a skill level',
                error: 'all', position: 'top-right'
            })
        } else if (!form.careerId) {
            setToast({
                ...toast,
                show: true,
                type: 'error', title: 'Error',
                message: 'select a career',
                error: 'all', position: 'top-right'
            })
        } else if (!form.fieldId) {
            setToast({
                ...toast,
                show: true,
                type: 'error', title: 'Error',
                message: 'select a field',
                error: 'all', position: 'top-right'
            })
        } else if (!form.topicId) {
            setToast({
                ...toast,
                show: true,
                type: 'error', title: 'Error',
                message: 'select a topic',
                error: 'all', position: 'top-right'
            })
        } else {

            const response = await createTask({
                fieldId: form.fieldId,
                level: form.level,
                topicId: form.topicId,
                poll: true
            })

            if (!response.error) {
                setToast({
                    ...toast,
                    show: true,
                    type: 'info',
                    title: 'Ongoing',
                    message: 'Task is currently being created',
                    error: 'all',
                    position: 'top-right'
                })
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

        }

        setTimeout(() => {
            setToast({ ...toast, show: false })
        }, 1800)
    }


    return (
        <>

            <section className="space-y-[2.5rem]">

                <CardUI>

                    <div className="space-y-[1rem]">

                        <h3 className="font-mona-medium text-[14px] pag-800">Select Task Parameters</h3>

                        <div className="w-full flex items-center gap-x-[1.2rem]">

                            {/* LEVEL RUBRIC */}
                            <div className={`w-[14%] ${(coreLoading || poller.loading) ? 'disabled-light' : ''}`}>

                                <Filter
                                    ref={leRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder="Skill Level"
                                    position="bottom"
                                    menu={{
                                        search: false,
                                        fullWidth: true,
                                        limitHeight: 'sm'
                                    }}
                                    items={
                                        LEVELS.map((x) => {
                                            return {
                                                label: helper.capitalizeWord(x),
                                                value: x
                                            }
                                        })
                                    }
                                    noFilter={false}
                                    onChange={(data) => {
                                        setForm({ ...form, level: data.value })
                                    }}
                                />

                            </div>

                            {/* CAREER RUBRIC */}
                            <div className={`w-[18%] ${(coreLoading || poller.loading) ? 'disabled-light' : ''}`}>

                                <Filter
                                    ref={carRef}
                                    size='xxsm'
                                    className='la-filter bg-white'
                                    placeholder="Select Career"
                                    position="bottom"
                                    menu={{
                                        style: { minWidth: '250px' },
                                        search: true,
                                        fullWidth: true,
                                        limitHeight: 'md'
                                    }}
                                    items={
                                        careers.map((x: Career) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        })
                                    }
                                    noFilter={false}
                                    onChange={(data) => {
                                        clearOnSelect('career')
                                        const fd = core.fields.filter((x) => x.career === data.value)
                                        setFields(fd);
                                        setForm({ ...form, careerId: data.value })
                                    }}
                                />

                            </div>

                            {/* FIELD RUBRIC */}
                            <div className={`w-[18%] ${(fields.length === 0 || coreLoading || poller.loading) ? 'disabled-light' : ''}`}>

                                <Filter
                                    ref={fiRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder="Select Field"
                                    position="bottom"
                                    menu={{
                                        style: { minWidth: '250px' },
                                        search: true,
                                        fullWidth: false,
                                        limitHeight: 'md'
                                    }}
                                    items={
                                        fields.map((x: Field) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        })
                                    }
                                    noFilter={false}
                                    onChange={(data) => {
                                        clearOnSelect('field')
                                        const topics = core.topics.filter((x) => x.fields.includes(data.value))
                                        setTopics(topics);
                                        setForm({ ...form, fieldId: data.value })
                                    }}
                                />

                            </div>

                            {/* TOPIC RUBRIC */}
                            <div className={`w-[36%] ${(topics.length === 0 || coreLoading || poller.loading) ? 'disabled-light' : ''}`}>

                                <Filter
                                    ref={toRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder="Select Topic"
                                    position="bottom"
                                    menu={{
                                        style: { minWidth: '250px' },
                                        search: true,
                                        fullWidth: true,
                                        limitHeight: 'md'
                                    }}
                                    items={
                                        topics.map((x: Topic) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        })
                                    }
                                    noFilter={false}
                                    onChange={(data) => {
                                        setForm({ ...form, topicId: data.value })
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                    <Divider />

                    <div className="space-y-[1rem] flex items-center">
                        <Button
                            type={"ghost"}
                            semantic={"info"}
                            size="sm"
                            className="form-button"
                            loading={(coreLoading || loading || poller.loading) ? true : false}
                            text={{
                                label: "Create Task",
                                size: 13,
                            }}
                            onClick={(e) => handleCreateTask(e)}
                        />
                    </div>

                </CardUI>

                <CardUI>
                    {
                        (loading || poller.loading) &&
                        <EmptyState className="min-h-[50vh]" noBound={true}>
                            <span className="loader lg primary"></span>
                            <span className="font-mona text-[16px] pas-950">AI is thinking</span>
                        </EmptyState>
                    }
                    {
                        !loading && !poller.loading &&
                        <>
                            {
                                helper.isEmpty(task, 'object') &&
                                <EmptyState className="min-h-[50vh]" noBound={true} >
                                    <span className="font-mona text-[14px] pas-950">Task created will appear here</span>
                                </EmptyState>
                            }
                            {
                                !helper.isEmpty(task, 'object') &&
                                <>
                                    <div className="grid grid-cols-[35%_60%] gap-x-[5%]">

                                        <div>
                                            <div className="min-h-[250px] rounded-[14px] full-bg" style={{ backgroundImage: `url("${task.image ? task.image : '../../../images/assets/bg@core_03.webp'}")` }}></div>
                                        </div>
                                        <div>

                                            <div className="space-y-[1rem]">

                                                <h3 className="font-mona-medium pas-950 text-[18px]">{task.title}</h3>
                                                <div className="flex items-center gap-x-[1rem]">

                                                    {
                                                        task.field &&
                                                        <Badge
                                                            type={'normal'}
                                                            size="sm"
                                                            display="badge"
                                                            label={task.field.name}
                                                            padding={{ y: 3, x: 12 }}
                                                            font={{
                                                                weight: 'regular',
                                                                size: 12
                                                            }}
                                                            upper={false}
                                                            close={false}
                                                        />
                                                    }

                                                    <h3 className="font-mona-light pag-500 text-[13px]">ID: {task.code}</h3>

                                                </div>

                                            </div>

                                            <Divider />

                                            <div className="font-mona-light text-[14px] pag-700 line-clamp-3">{task.description}</div>

                                            <Divider />

                                            <div className="flex items-center">
                                                <h4 className="font-mona pag-800 text-[15px]">Topic - {task.topic.name}</h4>
                                                <Button
                                                    type={"secondary"}
                                                    semantic={"info"}
                                                    size="xsm"
                                                    className="form-button ml-auto"
                                                    loading={false}
                                                    text={{
                                                        label: "View Task",
                                                        size: 13,
                                                    }}
                                                    onClick={(e) => toDetailRoute(e, { id: task._id, route: 'tasks', name: 'task-details' })}
                                                />
                                            </div>

                                        </div>

                                    </div>
                                </>
                            }
                        </>
                    }
                </CardUI>

            </section>


        </>
    )
}

export default NewTaskPage;
