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
import { DurationEnum, EditTaskEnum, TaskFieldEnum, UIEnum } from "../../../utils/enums.util";
import useTask from "../../../hooks/app/useTask";
import EmptyState from "../../../components/partials/dialogs/EmptyState";
import Badge from "../../../components/partials/badges/Badge";
import { useParams } from "react-router-dom";
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

const EditTaskPage = () => {

    const { id } = useParams<{ id: string }>()

    const fiRef = useRef<any>(null)
    const toRef = useRef<any>(null)
    const carRef = useRef<any>(null)
    const leRef = useRef<any>(null)
    const diRef = useRef<any>(null)
    const skiRef = useRef<any>(null)

    const { toast, setToast } = useToast()
    const { loading: coreLoading, core, getCoreResources } = useApp()
    const {
        task, loading, loader, fieldItem, TaskStatus,
        getTask, updateTaskField, countTaskFields, updateTaskItem, clearTaskItem,
        groupTaskResources, updateTask, appendTaskItem, modifyTaskField
    } = useTask()

    const [taskField, setTaskField] = useState<typeof TaskFieldEnum[keyof typeof TaskFieldEnum]>(TaskFieldEnum.OBJECTIVES)
    const [resources, setResources] = useState<Array<IGroupedResource>>([]);
    const [fields, setFields] = useState<Array<Field>>([])
    const [topics, setTopics] = useState<Array<Topic>>([])
    const [careers, setCareers] = useState<Array<Career>>([])
    const [skills, setSkills] = useState<Array<Skill>>([])
    const [edit, setEdit] = useState({
        enabled: false as boolean,
        type: EditTaskEnum.DETAILS as typeof EditTaskEnum[keyof typeof EditTaskEnum]
    })
    const [file, setFile] = useState({
        id: '',
        name: '',
        url: ''
    })
    const [form, setForm] = useState({
        title: '',
        handle: '',
        value: 0,
        careerId: '',
        level: '',
        difficulty: '',
        fieldId: '',
        topicId: '',
        description: ''
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

            setFile({
                ...file,
                url: task.image,
            })

            setForm({
                ...form,
                handle: task.duration.handle,
                value: task.duration.value
            })
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

    const handleUpdateTask = async (e?: any) => {

        if (e) { e.preventDefault() }
        const response = await updateTask({
            id: task._id,
            title: form.title,
            image: file.name,
            level: form.level,
            difficulty: form.difficulty,
            description: form.description,
            duration: {
                value: form.value,
                handle: form.handle
            }
        })

        if (!response.error) {
            setToast({
                ...toast,
                show: true,
                type: 'success',
                title: 'Successful',
                message: 'Task updated successfully',
                error: 'all',
                position: 'top-right'
            })
            setForm({ ...form, level: '', difficulty: '' })
            setEdit({ enabled: false, type: EditTaskEnum.DETAILS })
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

    const handleModifyTask = async (e?: any) => {

        if (e) { e.preventDefault() }

        let response = apiresponse;

        if (edit.type === EditTaskEnum.OBJECTIVES) {

            response = await modifyTaskField({
                id: task._id,
                action: 'update',
                fieldType: TaskFieldEnum.OBJECTIVES,
                objectives: [{
                    code: fieldItem?.code || '',
                    title: fieldItem?.title || '',
                    steps: fieldItem?.steps || [],
                }],
            })

        }

        if (edit.type === EditTaskEnum.OUTCOMES) {

            let outcome: string = fieldItem?.outcome || '';
            if (outcome.toLowerCase().includes(`new-out${fieldItem?.index + 1}:`)) {
                outcome = outcome.toLowerCase().replace(`new-out${fieldItem?.index + 1 || 0}:`, "")
            }

            response = await modifyTaskField({
                id: task._id,
                action: 'add',
                fieldType: TaskFieldEnum.OUTCOMES,
                outcomes: [helper.capitalize(outcome)],
            })

        }

        if (edit.type === EditTaskEnum.REQUIREMENTS) {

            let requirement: string = fieldItem?.requirement || '';
            if (requirement.toLowerCase().includes(`new-req${fieldItem?.index + 1}:`)) {
                requirement = requirement.toLowerCase().replace(`new-req${fieldItem?.index + 1 || 0}:`, "")
            }

            response = await modifyTaskField({
                id: task._id,
                action: 'add',
                fieldType: TaskFieldEnum.REQUIREMENTS,
                requirements: [helper.capitalize(requirement)],
            })

        }

        if (edit.type === EditTaskEnum.INSTRUCTIONS) {

            response = await modifyTaskField({
                id: task._id,
                action: 'update',
                fieldType: TaskFieldEnum.INSTRUCTIONS,
                instructions: [{
                    code: fieldItem?.code || '',
                    title: fieldItem?.title || '',
                    actions: fieldItem?.actions || [],
                }],
            })

        }

        if (edit.type === EditTaskEnum.DELIVERABLES) {

            response = await modifyTaskField({
                id: task._id,
                action: 'update',
                fieldType: TaskFieldEnum.DELIVERABLES,
                deliverables: [{
                    code: fieldItem?.code || '',
                    title: fieldItem?.title || '',
                    outcomes: fieldItem?.outcomes || [],
                }],
            })

        }

        if (edit.type === EditTaskEnum.GUIDELINES) {

            let guide: string = fieldItem?.guide || '';
            if (guide.toLowerCase().includes(`new-guide${fieldItem?.index + 1}:`)) {
                guide = guide.toLowerCase().replace(`new-guide${fieldItem?.index + 1 || 0}:`, "")
            }

            response = await modifyTaskField({
                id: task._id,
                action: 'add',
                fieldType: TaskFieldEnum.GUIDELINES,
                guidelines: [helper.capitalize(guide)],
            })

        }

        if (!edit.enabled && taskField === TaskFieldEnum.SKILLS) {

            const skillIds = task.skills.map((sk) => sk._id)

            response = await modifyTaskField({
                id: task._id,
                action: 'add',
                fieldType: TaskFieldEnum.SKILLS,
                skills: skillIds,
            })

        }

        if (edit.type === EditTaskEnum.RESOURCES) {

            const resources: Array<ITaskResource> = fieldItem.links.map((lk: IGroupedLink) => ({
                name: fieldItem?.name || '',
                code: lk.code,
                title: lk.title,
                description: lk.snippet,
                url: lk.url,
            }))

            response = await modifyTaskField({
                id: task._id,
                action: 'update',
                fieldType: TaskFieldEnum.RESOURCES,
                resources: resources,
            })

        }

        if (edit.type === EditTaskEnum.RUBRICS) {

            response = await modifyTaskField({
                id: task._id,
                action: 'update',
                fieldType: TaskFieldEnum.RUBRICS,
                rubrics: [{
                    code: fieldItem?.code || '',
                    criteria: fieldItem?.criteria || '',
                    description: fieldItem?.description || '',
                    point: fieldItem?.point || 0
                }],
            })

        }

        if (!response.error) {
            setToast({
                ...toast,
                show: true,
                type: 'success',
                title: 'Successful',
                message: 'Task updated successfully',
                error: 'all',
                position: 'top-right'
            })
            clearTaskItem()
            setForm({ ...form, level: '', difficulty: '' })
            setEdit({ enabled: false, type: EditTaskEnum.DETAILS })
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

    const handleRemoveItem = async (e: any, data: any) => {

        if (e) { e.preventDefault() }

        let response = apiresponse;

        if (taskField === TaskFieldEnum.OUTCOMES) {
            response = await modifyTaskField({
                id: task._id,
                action: 'remove',
                fieldType: taskField,
                outcomes: [data],
            })
        }

        if (taskField === TaskFieldEnum.REQUIREMENTS) {
            response = await modifyTaskField({
                id: task._id,
                action: 'remove',
                fieldType: taskField,
                requirements: [data],
            })
        }

        if (taskField === TaskFieldEnum.GUIDELINES) {
            response = await modifyTaskField({
                id: task._id,
                action: 'remove',
                fieldType: taskField,
                guidelines: [data],
            })
        }

        if (taskField === TaskFieldEnum.SKILLS) {
            response = await modifyTaskField({
                id: task._id,
                action: 'remove',
                fieldType: taskField,
                skills: [data],
            })
        }


        if (!response.error) {
            setToast({
                ...toast,
                show: true,
                type: 'success',
                title: 'Successful',
                message: 'Task updated successfully',
                error: 'all',
                position: 'top-right'
            })
            clearTaskItem()
            setForm({ ...form, level: '', difficulty: '' })
            setEdit({ enabled: false, type: EditTaskEnum.DETAILS })
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
                            !helper.isEmpty(task, 'object') && task.status === TaskStatus.FAILED &&
                            <EmptyState className="min-h-[50vh]" noBound={true} >
                                <span className="font-mona text-[14px] pas-950">Task details not found!</span>
                            </EmptyState>
                        }

                        {
                            !helper.isEmpty(task, 'object') && task.status !== TaskStatus.FAILED &&
                            <>
                                {
                                    !edit.enabled &&
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
                                                            onClick={(e) => setEdit({ ...edit, enabled: true, type: 'details' })}
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

                                            <div className="space-y-[1rem]">

                                                <div className="flex items-center">
                                                    <h3 className="font-mona-medium text-[14px] pag-800">Edit Task Parameters</h3>
                                                    <div className="flex items-center ml-auto gap-x-[1.5rem]">
                                                        {
                                                            (form.level || form.difficulty) &&
                                                            <IconButton
                                                                size="min-w-[1.3rem] min-h-[1.3rem]"
                                                                className="bg-par-100 bgh-par-200 par-700 parh-700"
                                                                label={{
                                                                    text: 'Clear',
                                                                    className: 'par-600'
                                                                }}
                                                                icon={{
                                                                    type: 'polio',
                                                                    name: 'cancel',
                                                                    size: 16,
                                                                }}
                                                                onClick={(e) => clearOnSelect('level-difficulty')}
                                                            />
                                                        }
                                                        <Button
                                                            type={"secondary"}
                                                            semantic={"info"}
                                                            size="xsm"
                                                            className="form-button"
                                                            loading={loader}
                                                            disabled={(form.level || form.difficulty) ? false : true}
                                                            text={{
                                                                label: "Save",
                                                                size: 13,
                                                            }}
                                                            onClick={(e) => handleUpdateTask(e)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="w-full flex items-center gap-x-[1.2rem] mb-[0.6rem]">

                                                    {/* LEVEL RUBRIC */}
                                                    <div className={`w-[14%] ${(coreLoading) ? 'disabled-light' : ''}`}>

                                                        <Filter
                                                            ref={leRef}
                                                            size='xxsm'
                                                            className='la-filter'
                                                            placeholder="Skill Level"
                                                            defaultValue={task.level}
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

                                                    {/* DIFFICULTY RUBRIC */}
                                                    <div className={`w-[14%] ${(coreLoading) ? 'disabled-light' : ''}`}>

                                                        <Filter
                                                            ref={diRef}
                                                            size='xxsm'
                                                            className='la-filter'
                                                            placeholder="Difficulty"
                                                            defaultValue={task.difficulty}
                                                            position="bottom"
                                                            menu={{
                                                                search: false,
                                                                fullWidth: true,
                                                                limitHeight: 'sm'
                                                            }}
                                                            items={
                                                                DIFFICULTIES.map((x) => {
                                                                    return {
                                                                        label: helper.capitalizeWord(x),
                                                                        value: x
                                                                    }
                                                                })
                                                            }
                                                            noFilter={false}
                                                            onChange={(data) => {
                                                                setForm({ ...form, difficulty: data.value })
                                                            }}
                                                        />

                                                    </div>

                                                    {/* CAREER RUBRIC */}
                                                    <div className={`w-[18%] ${(coreLoading) ? 'disabled-light' : 'disabled-light'}`}>

                                                        <Filter
                                                            ref={carRef}
                                                            size='xxsm'
                                                            className='la-filter bg-white'
                                                            placeholder="Select Career"
                                                            defaultValue={task?.career?._id || ''}
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
                                                            }}
                                                        />

                                                    </div>

                                                    {/* FIELD RUBRIC */}
                                                    <div className={`w-[18%] ${(fields.length === 0 || coreLoading) ? 'disabled-light' : 'disabled-light'}`}>

                                                        <Filter
                                                            ref={fiRef}
                                                            size='xxsm'
                                                            className='la-filter'
                                                            placeholder="Select Field"
                                                            defaultValue={task?.field?._id || ''}
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
                                                            }}
                                                        />

                                                    </div>

                                                    {/* TOPIC RUBRIC */}
                                                    <div className={`w-[25%] ${(topics.length === 0 || coreLoading) ? 'disabled-light' : 'disabled-light'}`}>

                                                        <Filter
                                                            ref={toRef}
                                                            size='xxsm'
                                                            className='la-filter'
                                                            placeholder="Select Topic"
                                                            defaultValue={task?.topic?._id || ''}
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
                                                            }}
                                                        />

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
                                                                                        onClick={(e) => {
                                                                                            setEdit({ enabled: true, type: EditTaskEnum.OBJECTIVES })
                                                                                            appendTaskItem({ data: ov, field: TaskFieldEnum.OBJECTIVES })
                                                                                        }}
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
                                                                <div className="flex items-center mb-[2rem]">
                                                                    <h3 className="font-mona pag-900 text-[15px] ">Task Learning {helper.capitalize(taskField)} ({task.outcomes.length})</h3>
                                                                    <IconButton
                                                                        size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                        className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700 ml-auto"
                                                                        icon={{
                                                                            type: 'feather',
                                                                            name: 'plus',
                                                                            size: 14,
                                                                        }}
                                                                        onClick={(e) => {
                                                                            updateTaskField({
                                                                                data: [`New-OUT${task.outcomes.length + 1}:outcome for task - edit to update`],
                                                                                action: 'add',
                                                                                field: TaskFieldEnum.OUTCOMES
                                                                            })
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="space-y-[1rem]">
                                                                    {
                                                                        task.outcomes.length > 0 &&
                                                                        task.outcomes.map((ov: string, index) =>
                                                                            <Fragment key={ov}>

                                                                                <div className="flex items-center">

                                                                                    <div className="space-y-[0.65rem]">
                                                                                        <h3 className="font-mona-medium pag-900 text-[15px]">{index + 1}. {ov}</h3>
                                                                                    </div>

                                                                                    <div className="flex items-center ml-auto gap-x-[1.2rem]">

                                                                                        {
                                                                                            ov.toLowerCase().includes(`new-out${index + 1}:`) &&
                                                                                            <IconButton
                                                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                                                className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700"
                                                                                                icon={{
                                                                                                    type: 'feather',
                                                                                                    name: 'edit-2',
                                                                                                    size: 14,
                                                                                                }}
                                                                                                onClick={(e) => {
                                                                                                    setEdit({ enabled: true, type: EditTaskEnum.OUTCOMES })
                                                                                                    appendTaskItem({ data: { outcome: ov, index }, field: TaskFieldEnum.OUTCOMES })
                                                                                                }}
                                                                                            />
                                                                                        }

                                                                                        <IconButton
                                                                                            size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                                            className="bg-par-50 bgh-par-200 par-700 parh-700"
                                                                                            icon={{
                                                                                                type: 'feather',
                                                                                                name: 'x',
                                                                                                size: 14,
                                                                                            }}
                                                                                            onClick={(e) => {
                                                                                                if (ov.toLowerCase().includes(`new-out${index + 1}:`)) {
                                                                                                    updateTaskField({
                                                                                                        data: [ov],
                                                                                                        action: 'remove',
                                                                                                        field: TaskFieldEnum.OUTCOMES
                                                                                                    })
                                                                                                } else {
                                                                                                    handleRemoveItem(e, ov)
                                                                                                }
                                                                                            }}
                                                                                        />

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
                                                                <div className="flex items-center mb-[2rem]">
                                                                    <h3 className="font-mona pag-900 text-[15px] mb-[1rem]">Task {helper.capitalize(taskField)} ({task.requirements.length})</h3>
                                                                    <IconButton
                                                                        size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                        className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700 ml-auto"
                                                                        icon={{
                                                                            type: 'feather',
                                                                            name: 'plus',
                                                                            size: 14,
                                                                        }}
                                                                        onClick={(e) => {
                                                                            updateTaskField({
                                                                                data: [`New-REQ${task.requirements.length + 1}:requirement for task - edit to update`],
                                                                                action: 'add',
                                                                                field: TaskFieldEnum.REQUIREMENTS
                                                                            })
                                                                        }}
                                                                    />
                                                                </div>


                                                                <div className="space-y-[1rem]">
                                                                    {
                                                                        task.requirements.length > 0 &&
                                                                        task.requirements.map((ov: string, index) =>
                                                                            <Fragment key={ov}>

                                                                                <div className="flex items-center">

                                                                                    <div className="space-y-[0.65rem]">
                                                                                        <h3 className="font-mona-medium pag-900 text-[15px]">{index + 1}. {ov}</h3>
                                                                                    </div>

                                                                                    <div className="flex items-center ml-auto gap-x-[1.2rem]">

                                                                                        {
                                                                                            ov.toLowerCase().includes(`new-req${index + 1}:`) &&
                                                                                            <IconButton
                                                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                                                className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700"
                                                                                                icon={{
                                                                                                    type: 'feather',
                                                                                                    name: 'edit-2',
                                                                                                    size: 14,
                                                                                                }}
                                                                                                onClick={(e) => {
                                                                                                    setEdit({ enabled: true, type: EditTaskEnum.REQUIREMENTS })
                                                                                                    appendTaskItem({ data: { requirement: ov, index }, field: TaskFieldEnum.REQUIREMENTS })
                                                                                                }}
                                                                                            />
                                                                                        }

                                                                                        <IconButton
                                                                                            size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                                            className="bg-par-50 bgh-par-200 par-700 parh-700"
                                                                                            icon={{
                                                                                                type: 'feather',
                                                                                                name: 'x',
                                                                                                size: 14,
                                                                                            }}
                                                                                            onClick={(e) => {
                                                                                                if (ov.toLowerCase().includes(`new-req${index + 1}:`)) {
                                                                                                    updateTaskField({
                                                                                                        data: [ov],
                                                                                                        action: 'remove',
                                                                                                        field: TaskFieldEnum.REQUIREMENTS
                                                                                                    })
                                                                                                } else {
                                                                                                    handleRemoveItem(e, ov)
                                                                                                }
                                                                                            }}
                                                                                        />

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

                                                                                    <IconButton
                                                                                        size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                                        className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700 ml-auto"
                                                                                        icon={{
                                                                                            type: 'feather',
                                                                                            name: 'edit-2',
                                                                                            size: 14,
                                                                                        }}
                                                                                        onClick={(e) => {
                                                                                            setEdit({ enabled: true, type: EditTaskEnum.INSTRUCTIONS })
                                                                                            appendTaskItem({ data: ov, field: TaskFieldEnum.INSTRUCTIONS })
                                                                                        }}
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
                                                                                        onClick={(e) => {
                                                                                            setEdit({ enabled: true, type: EditTaskEnum.DELIVERABLES })
                                                                                            appendTaskItem({ data: ov, field: TaskFieldEnum.DELIVERABLES })
                                                                                        }}
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
                                                            taskField === TaskFieldEnum.GUIDELINES &&
                                                            <>

                                                                <div className="flex items-center mb-[1rem]">
                                                                    <h3 className="font-mona pag-900 text-[15px]">Task Submission {helper.capitalize(taskField)} ({task.submission.guidelines.length})</h3>
                                                                    <IconButton
                                                                        size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                        className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700 ml-auto"
                                                                        icon={{
                                                                            type: 'feather',
                                                                            name: 'plus',
                                                                            size: 14,
                                                                        }}
                                                                        onClick={(e) => {
                                                                            updateTaskField({
                                                                                data: [`New-GUIDE${task.submission.guidelines.length + 1}:guideline for task submission - edit to update`],
                                                                                action: 'add',
                                                                                field: TaskFieldEnum.GUIDELINES
                                                                            })
                                                                        }}
                                                                    />
                                                                </div>

                                                                <div className="font-mona-light text-[14px] pag-900 mb-[2rem]" dangerouslySetInnerHTML={{ __html: task.submission.notes }} />

                                                                <div className="space-y-[1rem]">
                                                                    {
                                                                        task.submission.guidelines.length > 0 &&
                                                                        task.submission.guidelines.map((ov: string, index) =>
                                                                            <Fragment key={ov}>

                                                                                <div className="flex items-center">

                                                                                    <div className="space-y-[0.65rem]">
                                                                                        <h3 className="font-mona-medium pag-900 text-[15px]">{index + 1}. {ov}</h3>
                                                                                    </div>
                                                                                    <div className="flex items-center ml-auto gap-x-[1.2rem]">

                                                                                        {
                                                                                            ov.toLowerCase().includes(`new-guide${index + 1}:`) &&
                                                                                            <IconButton
                                                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                                                className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700"
                                                                                                icon={{
                                                                                                    type: 'feather',
                                                                                                    name: 'edit-2',
                                                                                                    size: 14,
                                                                                                }}
                                                                                                onClick={(e) => {
                                                                                                    setEdit({ enabled: true, type: EditTaskEnum.GUIDELINES })
                                                                                                    appendTaskItem({ data: { guide: ov, index }, field: TaskFieldEnum.GUIDELINES })
                                                                                                }}
                                                                                            />
                                                                                        }

                                                                                        <IconButton
                                                                                            size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                                            className="bg-par-50 bgh-par-200 par-700 parh-700"
                                                                                            icon={{
                                                                                                type: 'feather',
                                                                                                name: 'x',
                                                                                                size: 14,
                                                                                            }}
                                                                                            onClick={(e) => {
                                                                                                if (ov.toLowerCase().includes(`new-guide${index + 1}:`)) {
                                                                                                    updateTaskField({
                                                                                                        data: [ov],
                                                                                                        action: 'remove',
                                                                                                        field: TaskFieldEnum.GUIDELINES
                                                                                                    })
                                                                                                } else {
                                                                                                    handleRemoveItem(e, ov)
                                                                                                }
                                                                                            }}
                                                                                        />

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
                                                                    <Button
                                                                        type={"secondary"}
                                                                        semantic={"info"}
                                                                        size="xsm"
                                                                        className="form-button ml-auto"
                                                                        loading={loader}
                                                                        disabled={countTaskFields(TaskFieldEnum.SKILLS, UIEnum.NEW) > 0 ? false : true}
                                                                        text={{
                                                                            label: "Save",
                                                                            size: 13,
                                                                        }}
                                                                        onClick={(e) => handleModifyTask(e)}
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
                                                                                    updateTaskField({
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
                                                                                                updateTaskField({
                                                                                                    action: 'remove',
                                                                                                    field: TaskFieldEnum.SKILLS,
                                                                                                    data: [ov]
                                                                                                })
                                                                                            } else {
                                                                                                handleRemoveItem(e, ov._id)
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
                                                                                <UIResource
                                                                                    edit={true}
                                                                                    resource={ov}
                                                                                    index={index}
                                                                                    onEdit={(data) => {
                                                                                        setEdit({ enabled: true, type: EditTaskEnum.RESOURCES })
                                                                                        appendTaskItem({ data, field: TaskFieldEnum.RESOURCES })
                                                                                    }}
                                                                                />
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
                                                                <UITaskRubric
                                                                    edit={true}
                                                                    rubrics={task.rubrics}
                                                                    onEdit={(data) => {
                                                                        setEdit({ enabled: true, type: EditTaskEnum.RUBRICS })
                                                                        appendTaskItem({ data, field: TaskFieldEnum.RUBRICS })
                                                                    }}
                                                                />
                                                            </>
                                                        }


                                                    </CardUI>

                                                </div>

                                            </div>

                                        </CardUI>
                                    </>
                                }

                                {/* EDIT TASK DETAILS */}
                                {
                                    edit.enabled &&
                                    <>
                                        <CardUI className="relative">

                                            <form
                                                onSubmit={(e) => { e.preventDefault() }}
                                                className={`${edit.type === EditTaskEnum.RESOURCES ? 'w-[60%]' : 'w-[40%]'} mx-auto space-y-[1.2rem] py-[1.5rem]`}>

                                                <div className="mb-[2rem]">
                                                    <IconButton
                                                        size="min-w-[1.6rem] min-h-[1.6rem]"
                                                        className="bg-par-50 bgh-par-200 par-700 parh-700"
                                                        icon={{
                                                            type: 'feather',
                                                            name: 'x',
                                                            size: 14,
                                                        }}
                                                        label={{
                                                            text: 'Cancel',
                                                            weight: 'medium',
                                                            className: 'par-600'
                                                        }}
                                                        onClick={(e) => {
                                                            clearTaskItem()
                                                            setEdit({ ...edit, enabled: false, type: EditTaskEnum.OBJECTIVES })
                                                        }}
                                                    />
                                                </div>


                                                {
                                                    edit.type === EditTaskEnum.DETAILS &&
                                                    <>

                                                        <FormField
                                                            className=""
                                                        >
                                                            <ImageUI
                                                                title={'Change task image'}
                                                                url={file.url}
                                                                onChange={(upload) => {
                                                                    if (!upload.error) {
                                                                        setFile(upload.data);
                                                                    }
                                                                }}
                                                            />
                                                        </FormField>

                                                        <FormField>
                                                            <TextInput
                                                                type="text"
                                                                size="sm"
                                                                showFocus={true}
                                                                autoComplete={false}
                                                                placeholder="Type here"
                                                                defaultValue={task.title}
                                                                label={{
                                                                    title: 'Change Task Title',
                                                                    required: false,
                                                                    fontSize: 13
                                                                }}
                                                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                            />
                                                        </FormField>

                                                        <FormField
                                                            label={{
                                                                title: 'Change Task Duration',
                                                                required: false,
                                                                fontSize: 13
                                                            }}
                                                        >
                                                            <div className="grid grid-cols-[48%_48%] gap-x-[4%] mt-[0.3rem]">
                                                                <div>
                                                                    <Filter
                                                                        ref={leRef}
                                                                        size='sm'
                                                                        className='la-filter'
                                                                        placeholder="Duration Handle"
                                                                        defaultValue={task.duration.handle}
                                                                        position="bottom"
                                                                        menu={{
                                                                            search: false,
                                                                            fullWidth: true,
                                                                            limitHeight: 'sm'
                                                                        }}
                                                                        items={[
                                                                            { label: 'Days', value: 'days' },
                                                                            { label: 'Weeks', value: 'weeks' }
                                                                        ]}
                                                                        noFilter={false}
                                                                        onChange={(data) => {
                                                                            setForm({ ...form, handle: data.value })
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <Filter
                                                                        ref={leRef}
                                                                        size='sm'
                                                                        className={`la-filter ${!form.handle ? 'disabled-light' : ''}`}
                                                                        placeholder="Duration Value"
                                                                        defaultValue={task.duration.value.toString()}
                                                                        position="bottom"
                                                                        menu={{
                                                                            search: false,
                                                                            fullWidth: true,
                                                                            limitHeight: 'sm'
                                                                        }}
                                                                        items={
                                                                            form.handle === DurationEnum.DAYS ?
                                                                                DURATION_DAYS.map((x) => ({ label: `${x} ${helper.capitalize(form.handle)}`, value: x })) :
                                                                                DURATION_WEEKS.map((x) => ({ label: `${x} ${helper.capitalize(form.handle)}`, value: x }))
                                                                        }
                                                                        noFilter={false}
                                                                        onChange={(data) => {
                                                                            setForm({ ...form, value: parseInt(data.value) })
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </FormField>


                                                        <div className="flex items-center pt-[1rem]">
                                                            <IconButton
                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                className={`bg-pag-100 bgh-pab-200 ${loader ? 'disabled-light' : ''}`}
                                                                label={{
                                                                    text: 'Cancel',
                                                                    weight: 'medium',
                                                                    size: 14
                                                                }}
                                                                icon={{
                                                                    type: 'feather',
                                                                    name: 'arrow-left',
                                                                    size: 16
                                                                }}
                                                                onClick={(e) => setEdit({ ...edit, enabled: false, type: EditTaskEnum.DETAILS })}
                                                            />
                                                            <Button
                                                                type="primary"
                                                                semantic="normal"
                                                                size="sm"
                                                                className="form-button ml-auto"
                                                                text={{
                                                                    label: "Save Changes",
                                                                    size: 13,
                                                                }}
                                                                loading={loader}
                                                                onClick={async (e) => handleUpdateTask(e)}
                                                            />
                                                        </div>

                                                    </>
                                                }

                                                {
                                                    edit.type === EditTaskEnum.OBJECTIVES &&
                                                    <>

                                                        <div className="w-[100%]">
                                                            <h3 className="font-mona-medium text-[15px] pag-950">Edit Task Objective</h3>
                                                        </div>

                                                        <div className="space-y-[1.5rem]">
                                                            <FormField>
                                                                <TextInput
                                                                    type="text"
                                                                    size="sm"
                                                                    showFocus={true}
                                                                    autoComplete={false}
                                                                    placeholder="Type here"
                                                                    defaultValue={fieldItem?.title || ''}
                                                                    label={{
                                                                        title: 'Objective Title',
                                                                        required: false,
                                                                        fontSize: 13
                                                                    }}
                                                                    onChange={(e) => updateTaskItem({
                                                                        action: 'update',
                                                                        data: {
                                                                            code: fieldItem?.code || '',
                                                                            title: e.target.value
                                                                        },
                                                                        field: TaskFieldEnum.OBJECTIVES
                                                                    })}
                                                                />
                                                            </FormField>
                                                            <FormField>
                                                                <h3 className="font-mona-medium text-[14px] pag-950 mb-[0.5rem]">Resource links for {helper.capitalize(fieldItem?.name || '')}</h3>
                                                                <>
                                                                    {
                                                                        fieldItem.steps && fieldItem.steps.length > 0 &&
                                                                        <div className="space-y-[0.35rem]">
                                                                            {
                                                                                fieldItem.steps.map((step: any, index: number) =>
                                                                                    <Fragment key={index + step.substring(0, 8)}>
                                                                                        <TextInput
                                                                                            type="text"
                                                                                            size="sm"
                                                                                            showFocus={true}
                                                                                            autoComplete={false}
                                                                                            placeholder="Type here"
                                                                                            defaultValue={step}
                                                                                            label={{
                                                                                                title: `Step ${index + 1}`,
                                                                                                required: false,
                                                                                                fontSize: 13
                                                                                            }}
                                                                                            onChange={(e) => updateTaskItem({
                                                                                                action: 'update',
                                                                                                data: {
                                                                                                    code: fieldItem?.code || '',
                                                                                                    title: fieldItem?.name || '',
                                                                                                    step: e.target.value,
                                                                                                },
                                                                                                index: index,
                                                                                                field: TaskFieldEnum.OBJECTIVES
                                                                                            })}
                                                                                        />
                                                                                    </Fragment>
                                                                                )
                                                                            }
                                                                        </div>
                                                                    }
                                                                </>
                                                            </FormField>
                                                        </div>

                                                        <div className="flex items-center pt-[1rem]">
                                                            <IconButton
                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                className={`bg-pag-100 bgh-pab-200 ${loader ? 'disabled-light' : ''}`}
                                                                label={{
                                                                    text: 'Cancel',
                                                                    weight: 'medium',
                                                                    size: 14
                                                                }}
                                                                icon={{
                                                                    type: 'feather',
                                                                    name: 'arrow-left',
                                                                    size: 16
                                                                }}
                                                                onClick={(e) => {
                                                                    clearTaskItem()
                                                                    setEdit({ enabled: false, type: EditTaskEnum.DETAILS })
                                                                }}
                                                            />
                                                            <Button
                                                                type="primary"
                                                                semantic="normal"
                                                                size="sm"
                                                                className="form-button ml-auto"
                                                                text={{
                                                                    label: "Save Changes",
                                                                    size: 13,
                                                                }}
                                                                loading={loader}
                                                                onClick={async (e) => handleModifyTask(e)}
                                                            />
                                                        </div>

                                                    </>
                                                }

                                                {
                                                    edit.type === EditTaskEnum.OUTCOMES &&
                                                    <>

                                                        <div className="w-[100%]">
                                                            <h3 className="font-mona-medium text-[15px] pag-950">Edit Task Learning Outcome</h3>
                                                        </div>

                                                        <div className="space-y-[1.5rem]">
                                                            <FormField>
                                                                <TextInput
                                                                    type="text"
                                                                    size="sm"
                                                                    showFocus={true}
                                                                    autoComplete={false}
                                                                    placeholder="Type here"
                                                                    defaultValue={fieldItem?.outcome || ''}
                                                                    label={{
                                                                        title: 'Task Outcome',
                                                                        required: false,
                                                                        fontSize: 13
                                                                    }}
                                                                    onChange={(e) => updateTaskItem({
                                                                        action: 'update',
                                                                        data: {
                                                                            outcome: e.target.value
                                                                        },
                                                                        field: TaskFieldEnum.OUTCOMES,
                                                                        index: fieldItem?.index
                                                                    })}
                                                                />
                                                            </FormField>
                                                        </div>

                                                        <div className="flex items-center pt-[1rem]">
                                                            <IconButton
                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                className={`bg-pag-100 bgh-pab-200 ${loader ? 'disabled-light' : ''}`}
                                                                label={{
                                                                    text: 'Cancel',
                                                                    weight: 'medium',
                                                                    size: 14
                                                                }}
                                                                icon={{
                                                                    type: 'feather',
                                                                    name: 'arrow-left',
                                                                    size: 16
                                                                }}
                                                                onClick={(e) => {
                                                                    clearTaskItem()
                                                                    setEdit({ enabled: false, type: EditTaskEnum.DETAILS })
                                                                }}
                                                            />
                                                            <Button
                                                                type="primary"
                                                                semantic="normal"
                                                                size="sm"
                                                                className="form-button ml-auto"
                                                                text={{
                                                                    label: "Save Changes",
                                                                    size: 13,
                                                                }}
                                                                loading={loader}
                                                                onClick={async (e) => handleModifyTask(e)}
                                                            />
                                                        </div>

                                                    </>
                                                }

                                                {
                                                    edit.type === EditTaskEnum.REQUIREMENTS &&
                                                    <>

                                                        <div className="w-[100%]">
                                                            <h3 className="font-mona-medium text-[15px] pag-950">Edit Task Requirement</h3>
                                                        </div>

                                                        <div className="space-y-[1.5rem]">
                                                            <FormField>
                                                                <TextInput
                                                                    type="text"
                                                                    size="sm"
                                                                    showFocus={true}
                                                                    autoComplete={false}
                                                                    placeholder="Type here"
                                                                    defaultValue={fieldItem?.requirement || ''}
                                                                    label={{
                                                                        title: 'Task Requirement',
                                                                        required: false,
                                                                        fontSize: 13
                                                                    }}
                                                                    onChange={(e) => updateTaskItem({
                                                                        action: 'update',
                                                                        data: {
                                                                            requirement: e.target.value
                                                                        },
                                                                        field: TaskFieldEnum.REQUIREMENTS,
                                                                        index: fieldItem?.index
                                                                    })}
                                                                />
                                                            </FormField>
                                                        </div>

                                                        <div className="flex items-center pt-[1rem]">
                                                            <IconButton
                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                className={`bg-pag-100 bgh-pab-200 ${loader ? 'disabled-light' : ''}`}
                                                                label={{
                                                                    text: 'Cancel',
                                                                    weight: 'medium',
                                                                    size: 14
                                                                }}
                                                                icon={{
                                                                    type: 'feather',
                                                                    name: 'arrow-left',
                                                                    size: 16
                                                                }}
                                                                onClick={(e) => {
                                                                    clearTaskItem()
                                                                    setEdit({ enabled: false, type: EditTaskEnum.DETAILS })
                                                                }}
                                                            />
                                                            <Button
                                                                type="primary"
                                                                semantic="normal"
                                                                size="sm"
                                                                className="form-button ml-auto"
                                                                text={{
                                                                    label: "Save Changes",
                                                                    size: 13,
                                                                }}
                                                                loading={loader}
                                                                onClick={async (e) => handleModifyTask(e)}
                                                            />
                                                        </div>

                                                    </>
                                                }

                                                {
                                                    edit.type === EditTaskEnum.INSTRUCTIONS &&
                                                    <>

                                                        <div className="w-[100%]">
                                                            <h3 className="font-mona-medium text-[15px] pag-950">Edit Task Instruction</h3>
                                                        </div>

                                                        <div className="space-y-[1.5rem]">
                                                            <FormField>
                                                                <TextInput
                                                                    type="text"
                                                                    size="sm"
                                                                    showFocus={true}
                                                                    autoComplete={false}
                                                                    placeholder="Type here"
                                                                    defaultValue={fieldItem?.title || ''}
                                                                    label={{
                                                                        title: 'Title',
                                                                        required: false,
                                                                        fontSize: 13
                                                                    }}
                                                                    onChange={(e) => updateTaskItem({
                                                                        action: 'update',
                                                                        data: {
                                                                            code: fieldItem?.code || '',
                                                                            title: e.target.value
                                                                        },
                                                                        field: TaskFieldEnum.INSTRUCTIONS
                                                                    })}
                                                                />
                                                            </FormField>
                                                            <FormField>
                                                                <h3 className="font-mona-medium text-[14px] pag-950 mb-[0.5rem]">Actions to carry out for instructions</h3>
                                                                <>
                                                                    {
                                                                        fieldItem.actions && fieldItem.actions.length > 0 &&
                                                                        <div className="space-y-[0.35rem]">
                                                                            {
                                                                                fieldItem.actions.map((action: string, index: number) =>
                                                                                    <Fragment key={index + action.substring(0, 8)}>
                                                                                        <TextInput
                                                                                            type="text"
                                                                                            size="sm"
                                                                                            showFocus={true}
                                                                                            autoComplete={false}
                                                                                            placeholder="Type here"
                                                                                            defaultValue={action}
                                                                                            label={{
                                                                                                title: `Step ${index + 1}`,
                                                                                                required: false,
                                                                                                fontSize: 13
                                                                                            }}
                                                                                            onChange={(e) => updateTaskItem({
                                                                                                action: 'update',
                                                                                                data: {
                                                                                                    code: fieldItem?.code || '',
                                                                                                    title: fieldItem?.title || '',
                                                                                                    action: e.target.value,
                                                                                                },
                                                                                                index: index,
                                                                                                field: TaskFieldEnum.INSTRUCTIONS
                                                                                            })}
                                                                                        />
                                                                                    </Fragment>
                                                                                )
                                                                            }
                                                                        </div>
                                                                    }
                                                                </>
                                                            </FormField>
                                                        </div>

                                                        <div className="flex items-center pt-[1rem]">
                                                            <IconButton
                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                className={`bg-pag-100 bgh-pab-200 ${loader ? 'disabled-light' : ''}`}
                                                                label={{
                                                                    text: 'Cancel',
                                                                    weight: 'medium',
                                                                    size: 14
                                                                }}
                                                                icon={{
                                                                    type: 'feather',
                                                                    name: 'arrow-left',
                                                                    size: 16
                                                                }}
                                                                onClick={(e) => {
                                                                    clearTaskItem()
                                                                    setEdit({ enabled: false, type: EditTaskEnum.DETAILS })
                                                                }}
                                                            />
                                                            <Button
                                                                type="primary"
                                                                semantic="normal"
                                                                size="sm"
                                                                className="form-button ml-auto"
                                                                text={{
                                                                    label: "Save Changes",
                                                                    size: 13,
                                                                }}
                                                                loading={loader}
                                                                onClick={async (e) => handleModifyTask(e)}
                                                            />
                                                        </div>

                                                    </>
                                                }

                                                {
                                                    edit.type === EditTaskEnum.DELIVERABLES &&
                                                    <>

                                                        <div className="w-[100%]">
                                                            <h3 className="font-mona-medium text-[15px] pag-950">Edit Task Deliverable</h3>
                                                        </div>

                                                        <div className="space-y-[1.5rem]">
                                                            <FormField>
                                                                <TextInput
                                                                    type="text"
                                                                    size="sm"
                                                                    showFocus={true}
                                                                    autoComplete={false}
                                                                    placeholder="Type here"
                                                                    defaultValue={fieldItem?.title || ''}
                                                                    label={{
                                                                        title: 'Title',
                                                                        required: false,
                                                                        fontSize: 13
                                                                    }}
                                                                    onChange={(e) => updateTaskItem({
                                                                        action: 'update',
                                                                        data: {
                                                                            code: fieldItem?.code || '',
                                                                            title: e.target.value
                                                                        },
                                                                        field: TaskFieldEnum.DELIVERABLES
                                                                    })}
                                                                />
                                                            </FormField>
                                                            <FormField>
                                                                <h3 className="font-mona-medium text-[14px] pag-950 mb-[0.5rem]">Outcomes of task deliverable</h3>
                                                                <>
                                                                    {
                                                                        fieldItem.outcomes && fieldItem.outcomes.length > 0 &&
                                                                        <div className="space-y-[0.35rem]">
                                                                            {
                                                                                fieldItem.outcomes.map((outcome: string, index: number) =>
                                                                                    <Fragment key={index + outcome.substring(0, 8)}>
                                                                                        <TextInput
                                                                                            type="text"
                                                                                            size="sm"
                                                                                            showFocus={true}
                                                                                            autoComplete={false}
                                                                                            placeholder="Type here"
                                                                                            defaultValue={outcome}
                                                                                            label={{
                                                                                                title: `Step ${index + 1}`,
                                                                                                required: false,
                                                                                                fontSize: 13
                                                                                            }}
                                                                                            onChange={(e) => updateTaskItem({
                                                                                                action: 'update',
                                                                                                data: {
                                                                                                    code: fieldItem?.code || '',
                                                                                                    title: fieldItem?.title || '',
                                                                                                    outcome: e.target.value,
                                                                                                },
                                                                                                index: index,
                                                                                                field: TaskFieldEnum.DELIVERABLES
                                                                                            })}
                                                                                        />
                                                                                    </Fragment>
                                                                                )
                                                                            }
                                                                        </div>
                                                                    }
                                                                </>
                                                            </FormField>
                                                        </div>

                                                        <div className="flex items-center pt-[1rem]">
                                                            <IconButton
                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                className={`bg-pag-100 bgh-pab-200 ${loader ? 'disabled-light' : ''}`}
                                                                label={{
                                                                    text: 'Cancel',
                                                                    weight: 'medium',
                                                                    size: 14
                                                                }}
                                                                icon={{
                                                                    type: 'feather',
                                                                    name: 'arrow-left',
                                                                    size: 16
                                                                }}
                                                                onClick={(e) => {
                                                                    clearTaskItem()
                                                                    setEdit({ enabled: false, type: EditTaskEnum.DETAILS })
                                                                }}
                                                            />
                                                            <Button
                                                                type="primary"
                                                                semantic="normal"
                                                                size="sm"
                                                                className="form-button ml-auto"
                                                                text={{
                                                                    label: "Save Changes",
                                                                    size: 13,
                                                                }}
                                                                loading={loader}
                                                                onClick={async (e) => handleModifyTask(e)}
                                                            />
                                                        </div>

                                                    </>
                                                }

                                                {
                                                    edit.type === EditTaskEnum.GUIDELINES &&
                                                    <>

                                                        <div className="w-[100%]">
                                                            <h3 className="font-mona-medium text-[15px] pag-950">Edit Submission Guideline</h3>
                                                        </div>

                                                        <div className="space-y-[1.5rem]">
                                                            <FormField>
                                                                <TextInput
                                                                    type="text"
                                                                    size="sm"
                                                                    showFocus={true}
                                                                    autoComplete={false}
                                                                    placeholder="Type here"
                                                                    defaultValue={fieldItem?.guide || ''}
                                                                    label={{
                                                                        title: 'Task Outcome',
                                                                        required: false,
                                                                        fontSize: 13
                                                                    }}
                                                                    onChange={(e) => updateTaskItem({
                                                                        action: 'update',
                                                                        data: {
                                                                            outcome: e.target.value
                                                                        },
                                                                        field: TaskFieldEnum.GUIDELINES,
                                                                        index: fieldItem?.index
                                                                    })}
                                                                />
                                                            </FormField>
                                                        </div>

                                                        <div className="flex items-center pt-[1rem]">
                                                            <IconButton
                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                className={`bg-pag-100 bgh-pab-200 ${loader ? 'disabled-light' : ''}`}
                                                                label={{
                                                                    text: 'Cancel',
                                                                    weight: 'medium',
                                                                    size: 14
                                                                }}
                                                                icon={{
                                                                    type: 'feather',
                                                                    name: 'arrow-left',
                                                                    size: 16
                                                                }}
                                                                onClick={(e) => {
                                                                    clearTaskItem()
                                                                    setEdit({ enabled: false, type: EditTaskEnum.DETAILS })
                                                                }}
                                                            />
                                                            <Button
                                                                type="primary"
                                                                semantic="normal"
                                                                size="sm"
                                                                className="form-button ml-auto"
                                                                text={{
                                                                    label: "Save Changes",
                                                                    size: 13,
                                                                }}
                                                                loading={loader}
                                                                onClick={async (e) => handleModifyTask(e)}
                                                            />
                                                        </div>

                                                    </>
                                                }

                                                {
                                                    edit.type === EditTaskEnum.RESOURCES &&
                                                    <>

                                                        <div className="w-[100%]">
                                                            <h3 className="font-mona-medium text-[15px] pag-950">Edit Resources for {helper.capitalize(fieldItem?.name || '')}</h3>
                                                        </div>

                                                        <div className="w-full">
                                                            <FormField>
                                                                {
                                                                    fieldItem.links && fieldItem.links.length > 0 &&
                                                                    <div className="space-y-[1.5rem]">
                                                                        {
                                                                            fieldItem.links.map((link: IGroupedLink, index: number) =>
                                                                                <Fragment key={index + link.url}>

                                                                                    <div>
                                                                                        <h3 className="font-mona text-[14px] pag-950">Resource {index + 1}</h3>
                                                                                        <div className="w-full p-[1rem] border bdr-pag-100 rounded-[6px] space-y-[0.5rem]">

                                                                                            <TextInput
                                                                                                type="text"
                                                                                                size="sm"
                                                                                                showFocus={true}
                                                                                                autoComplete={false}
                                                                                                placeholder="Type here"
                                                                                                defaultValue={link.title}
                                                                                                label={{
                                                                                                    title: `Resource Title`,
                                                                                                    required: false,
                                                                                                    fontSize: 13
                                                                                                }}
                                                                                                onChange={(e) => updateTaskItem({
                                                                                                    action: 'update',
                                                                                                    data: {
                                                                                                        name: fieldItem?.name || '',
                                                                                                        title: e.target.value,
                                                                                                        code: link.code
                                                                                                    },
                                                                                                    index: index,
                                                                                                    field: TaskFieldEnum.RESOURCES
                                                                                                })}
                                                                                            />
                                                                                            <TextInput
                                                                                                type="text"
                                                                                                size="sm"
                                                                                                showFocus={true}
                                                                                                autoComplete={false}
                                                                                                placeholder="Type here"
                                                                                                defaultValue={link.url}
                                                                                                label={{
                                                                                                    title: `Resource URL`,
                                                                                                    required: false,
                                                                                                    fontSize: 13,
                                                                                                }}
                                                                                                onChange={(e) => updateTaskItem({
                                                                                                    action: 'update',
                                                                                                    data: {
                                                                                                        name: fieldItem?.name || '',
                                                                                                        url: e.target.value,
                                                                                                        code: link.code
                                                                                                    },
                                                                                                    index: index,
                                                                                                    field: TaskFieldEnum.RESOURCES
                                                                                                })}
                                                                                            />

                                                                                        </div>
                                                                                    </div>


                                                                                </Fragment>
                                                                            )
                                                                        }
                                                                    </div>
                                                                }
                                                            </FormField>
                                                        </div>

                                                        <div className="flex items-center pt-[1rem]">
                                                            <IconButton
                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                className={`bg-pag-100 bgh-pab-200 ${loader ? 'disabled-light' : ''}`}
                                                                label={{
                                                                    text: 'Cancel',
                                                                    weight: 'medium',
                                                                    size: 14
                                                                }}
                                                                icon={{
                                                                    type: 'feather',
                                                                    name: 'arrow-left',
                                                                    size: 16
                                                                }}
                                                                onClick={(e) => {
                                                                    clearTaskItem()
                                                                    setEdit({ enabled: false, type: EditTaskEnum.DETAILS })
                                                                }}
                                                            />
                                                            <Button
                                                                type="primary"
                                                                semantic="normal"
                                                                size="sm"
                                                                className="form-button ml-auto"
                                                                text={{
                                                                    label: "Save Changes",
                                                                    size: 13,
                                                                }}
                                                                loading={loader}
                                                                onClick={async (e) => handleModifyTask(e)}
                                                            />
                                                        </div>

                                                    </>
                                                }

                                                {
                                                    edit.type === EditTaskEnum.RUBRICS &&
                                                    <>

                                                        <div className="w-[100%]">
                                                            <h3 className="font-mona-medium text-[15px] pag-950">Edit Task Rubric</h3>
                                                        </div>

                                                        <FormField className="space-y-[1rem]">
                                                            <TextInput
                                                                type="text"
                                                                size="sm"
                                                                showFocus={true}
                                                                autoComplete={false}
                                                                placeholder="Type here"
                                                                defaultValue={fieldItem?.criteria}
                                                                label={{
                                                                    title: `Rubric Criteria`,
                                                                    required: false,
                                                                    fontSize: 13
                                                                }}
                                                                onChange={(e) => updateTaskItem({
                                                                    action: 'update',
                                                                    data: {
                                                                        criteria: e.target.value,
                                                                        code: fieldItem?.code || ''
                                                                    },
                                                                    field: TaskFieldEnum.RUBRICS
                                                                })}
                                                            />
                                                            <TextAreaInput
                                                                size="sm"
                                                                showFocus={true}
                                                                autoComplete={false}
                                                                placeholder="Type here"
                                                                defaultValue={fieldItem?.description}
                                                                label={{
                                                                    title: `Rubric Description`,
                                                                    required: false,
                                                                    fontSize: 13
                                                                }}
                                                                onChange={(e) => updateTaskItem({
                                                                    action: 'update',
                                                                    data: {
                                                                        description: e.target.value,
                                                                        code: fieldItem?.code || ''
                                                                    },
                                                                    field: TaskFieldEnum.RUBRICS
                                                                })}
                                                            />
                                                            <NumberInput
                                                                size="sm"
                                                                showFocus={true}
                                                                autoComplete={false}
                                                                placeholder="Type here"
                                                                defaultValue={fieldItem?.point}
                                                                step="1"
                                                                label={{
                                                                    title: `Rubric Point`,
                                                                    required: false,
                                                                    fontSize: 13
                                                                }}
                                                                onChange={(e) => updateTaskItem({
                                                                    action: 'update',
                                                                    data: {
                                                                        point: parseInt(e.target.value),
                                                                        code: fieldItem?.code || ''
                                                                    },
                                                                    field: TaskFieldEnum.RUBRICS
                                                                })}
                                                            />
                                                        </FormField>

                                                        <div className="flex items-center pt-[1rem]">
                                                            <IconButton
                                                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                                                className={`bg-pag-100 bgh-pab-200 ${loader ? 'disabled-light' : ''}`}
                                                                label={{
                                                                    text: 'Cancel',
                                                                    weight: 'medium',
                                                                    size: 14
                                                                }}
                                                                icon={{
                                                                    type: 'feather',
                                                                    name: 'arrow-left',
                                                                    size: 16
                                                                }}
                                                                onClick={(e) => {
                                                                    clearTaskItem()
                                                                    setEdit({ enabled: false, type: EditTaskEnum.DETAILS })
                                                                }}
                                                            />
                                                            <Button
                                                                type="primary"
                                                                semantic="normal"
                                                                size="sm"
                                                                className="form-button ml-auto"
                                                                text={{
                                                                    label: "Save Changes",
                                                                    size: 13,
                                                                }}
                                                                loading={loader}
                                                                onClick={async (e) => handleModifyTask(e)}
                                                            />
                                                        </div>

                                                    </>
                                                }


                                            </form>

                                        </CardUI>
                                    </>
                                }

                            </>
                        }

                    </>
                }

            </section>

        </>
    )
}

export default EditTaskPage;
