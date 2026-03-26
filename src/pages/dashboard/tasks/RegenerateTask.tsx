import { useEffect } from "react"
import Divider from "../../../components/partials/Divider";
import CardUI from "../../../components/partials/ui/CardUI";
import helper from "../../../utils/helper.util";
import Button from "../../../components/partials/buttons/Button";
import useToast from "../../../hooks/useToast";
import useTask from "../../../hooks/app/useTask";
import EmptyState from "../../../components/partials/dialogs/EmptyState";
import Badge from "../../../components/partials/badges/Badge";
import { useParams } from "react-router-dom";
import useGoTo from "../../../hooks/useGoTo";

const RegenerateTaskPage = () => {

    const { id } = useParams<{ id: string }>()

    const { toDetailRoute } = useGoTo()
    const { setToast, toast } = useToast()
    const {
        task, loading, loader, TaskStatus, poller,
        getTask, regenerateTask
    } = useTask()

    useEffect(() => {
        handleGetTask(id)
    }, [])

    const handleGetTask = (id?: string) => {
        getTask(id ? id : '')
    }

    const handleRegenerate = async (e: any) => {

        if (e) {
            e.preventDefault();
        }

        const response = await regenerateTask({
            id: task._id,
            poll: true,
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

        } else {

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

            <section className="space-y-[2.5rem]">

                {
                    loading &&
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

                                    {
                                        poller.loading &&
                                        <EmptyState className="min-h-[50vh]" noBound={true}>
                                            <span className="loader lg primary"></span>
                                            <span className="font-mona text-[16px] pas-950">AI is thinking</span>
                                        </EmptyState>
                                    }

                                    {
                                        !poller.loading && task.status === TaskStatus.DRAFT &&
                                        <>
                                            <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-[1rem]">

                                                <h3 className="font-mona-medium text-[16px] pag-900">View task details</h3>

                                                <Button
                                                    type={"primary"}
                                                    semantic={"normal"}
                                                    size="md"
                                                    className="form-button min-w-[180px]"
                                                    loading={loader}
                                                    text={{
                                                        label: "View Task",
                                                        size: 15,
                                                    }}
                                                    onClick={(e) => {
                                                        toDetailRoute(e, { id: task._id, route: 'tasks', name: 'task-details' })
                                                    }}
                                                />

                                            </div>
                                        </>
                                    }

                                    {
                                        !poller.loading && task.status === TaskStatus.FAILED &&
                                        <>
                                            <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-[1rem]">

                                                <h3 className="font-mona-medium text-[16px] pag-900">Regerate task with AI</h3>

                                                <Button
                                                    type={"primary"}
                                                    semantic={"info"}
                                                    size="md"
                                                    className="form-button min-w-[180px]"
                                                    loading={loader}
                                                    text={{
                                                        label: "Generate Task",
                                                        size: 15,
                                                    }}
                                                    onClick={(e) => handleRegenerate(e)}
                                                />

                                            </div>
                                        </>
                                    }


                                </CardUI>


                            </>
                        }

                    </>
                }

            </section>

        </>
    )
}

export default RegenerateTaskPage;
