import { useEffect, useState, useRef, Fragment } from "react"
import { IListUI } from "../../../utils/interfaces.util";
import useGoTo from "../../../hooks/useGoTo";
import useReport from "../../../hooks/useReport";
import useSearch from "../../../hooks/app/useSearch";
import ListBox from "../../../components/partials/ui/ListBox";
import Filter from "../../../components/partials/drops/Filter";
import helper from "../../../utils/helper.util";
import SearchInput from "../../../components/partials/inputs/SearchInput";
import Button from "../../../components/partials/buttons/Button";
import EmptyState from "../../../components/partials/dialogs/EmptyState";
import Divider from "../../../components/partials/Divider";
import TableBox from "../../../components/partials/table/TableBox";
import TableFooter from "../../../components/partials/table/TableFooter";
import Field from "../../../models/Field.model";
import useUser from "../../../hooks/app/useUser";
import Talent, { ITalentCareer } from "../../../models/Talent.model";
import Task from "../../../models/Task.model";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import storage from "../../../utils/storage.util";
import Table from "../../../components/partials/table/Table";
import TableHeader from "../../../components/partials/table/Tableheader";
import TableBody from "../../../components/partials/table/TableBody";
import TableRow from "../../../components/partials/table/TableRow";
import CellData from "../../../components/partials/table/CellData";
import UserAvatar from "../../../components/partials/ui/UserAvatar";
import Popout from "../../../components/partials/drops/Popout";
import AvatarUI from "../../../components/partials/ui/AvatarUI";
import Badge from "../../../components/partials/badges/Badge";
import { StatusEnum, TaskTypeEnum } from "../../../utils/enums.util";
import useTask from "../../../hooks/app/useTask";
import useApp from "../../../hooks/app/useApp";
import Career from "../../../models/Career.model";
import { TaskType } from "../../../utils/types.util";

const TaskList = (props: IListUI) => {

    // props
    const { type, resource, resourceId } = props;

    // refs
    const fieRef = useRef<any>(null)
    const poRef = useRef<any>(null)
    const carRef = useRef<any>(null)
    const srhRef = useRef<any>(null)

    const { toDetailRoute } = useGoTo()
    const { tasks, getTasks, TaskStatus } = useTask()
    const { core, loading: coreLoading, getCoreResources } = useApp()

    const [taskType, setTaskType] = useState<TaskType>(TaskTypeEnum.TEMPLATE)
    const [fields, setFields] = useState<Array<Field>>([])
    const { exportToCSV } = useReport()

    const {
        search,
        pageSearch,
        filters,
        setPageSearch,
        setFilters,
        clearSearch,
        searchResource,
        filterResource
    } = useSearch({})

    useEffect(() => {
        initList(25)
    }, [])


    const initList = (limit: number) => {
        if (type === 'self') {

            if (tasks.data.length === 0) {
                handleGetTasks(limit, TaskTypeEnum.TEMPLATE)
            }

        }

        getCoreResources({ limit: 9999, page: 1, order: 'desc' })
    }

    const handleGetTasks = (limit: number, type: TaskType) => {
        getTasks({ limit: limit, page: 1, order: 'desc', type: type })
    }


    const configTab = (e: any, val: any) => {
        if (e) { e.preventDefault(); }
        storage.keep('task-management-tab', val.toString())
    }

    const clearFilters = () => {
        clearSearch();
        if (srhRef.current) {
            srhRef.current.clear()
        }
        if (fieRef.current) {
            fieRef.current.clear()
        }
        if (poRef.current) {
            poRef.current.clear()
        }
        if (carRef.current) {
            carRef.current.clear()
        }
    }

    const toDetails = (e: any, id: string) => {

        if (e) { e.preventDefault(); }

        toDetailRoute(e, { id: id, route: 'tasks', name: 'task-details' })

    }

    return (
        <>

            <ListBox>

                <div className="w-full flex items-center">

                    <div className={`grow flex items-center gap-x-[0.5rem] ${search.refineType === 'search' && pageSearch.hasResult ? 'disabled-light' : ''}`}>

                        <div className={`min-w-[14%] ${coreLoading ? 'disabled-light' : ''}`}>

                            <Filter
                                ref={poRef}
                                size='xsm'
                                className='la-filter'
                                placeholder="Task Type"
                                position="bottom"
                                defaultValue={TaskTypeEnum.TEMPLATE}
                                menu={{
                                    style: {},
                                    search: false,
                                    fullWidth: true,
                                    limitHeight: 'md'
                                }}
                                items={
                                    helper.enumToArray(TaskTypeEnum, 'values-only').map((t) => ({
                                        label: helper.capitalize(t),
                                        value: t
                                    }))
                                }
                                noFilter={false}
                                onChange={async (data) => {
                                    setTaskType(data.value as TaskType)
                                    handleGetTasks(25, data.value as TaskType)
                                }}
                            />
                        </div>

                        <div className={`min-w-[12%] max-w-[14%] ${coreLoading ? 'disabled-light' : ''}`}>

                            <Filter
                                ref={carRef}
                                size='xsm'
                                className='la-filter'
                                placeholder="Career"
                                position="bottom"
                                defaultValue={''}
                                menu={{
                                    style: {},
                                    search: true,
                                    fullWidth: true,
                                    limitHeight: 'md'
                                }}
                                items={
                                    core.careers.length > 0 ?
                                        core.careers.map((x: Career) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        }) : []
                                }
                                noFilter={false}
                                onChange={async (data) => {

                                    const fields = core.fields.filter((f: Field) => f.career === data.value);
                                    if (fields.length > 0) {
                                        if (fieRef.current) {
                                            fieRef.current.clear()
                                        }
                                        setFields(fields)
                                    }


                                    // const { careerId, ...rest } = filters;
                                    // await filterResource({
                                    //     resource: 'questions',
                                    //     paginate: 'relative',
                                    //     payload: {
                                    //         careerId: data.value,
                                    //         ...rest
                                    //     }
                                    // })

                                    // setFilters({ ...filters, careerId: data.value })
                                }}
                            />

                        </div>

                        <div className={`min-w-[12%] max-w-[14%] ${coreLoading ? 'disabled-light' : ''}`}>

                            <Filter
                                ref={fieRef}
                                size='xsm'
                                className='la-filter'
                                placeholder="Field"
                                position="bottom"
                                defaultValue={''}
                                menu={{
                                    style: {},
                                    search: true,
                                    fullWidth: true,
                                    limitHeight: 'md'
                                }}
                                items={
                                    fields.length > 0 ?
                                        fields.map((x: Field) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        }) : []
                                }
                                noFilter={false}
                                onChange={async (data: any) => {

                                    // const { fields, ...rest } = filters;
                                    // await filterResource({
                                    //     resource: 'questions',
                                    //     paginate: 'relative',
                                    //     payload: {
                                    //         fields: [data.value],
                                    //         ...rest
                                    //     }
                                    // })

                                    // setFilters(prev => ({
                                    //     ...filters,
                                    //     fields: [data.value]
                                    // }))
                                }}
                            />
                        </div>

                        {
                            taskType === TaskTypeEnum.ASSIGNED &&
                            <div className={`min-w-[14%] ${coreLoading ? 'disabled-light' : ''}`}>

                                <Filter
                                    ref={poRef}
                                    size='xsm'
                                    className='la-filter'
                                    placeholder="Status"
                                    position="bottom"
                                    defaultValue={''}
                                    menu={{
                                        style: {},
                                        search: false,
                                        fullWidth: true,
                                        limitHeight: 'md'
                                    }}
                                    items={
                                        helper.enumToArray(TaskStatus, 'values-only').filter((s) => s !== TaskStatus.DRAFT).map((st) => ({
                                            label: helper.capitalizeWord(st),
                                            value: st
                                        }))
                                    }
                                    noFilter={false}
                                    onChange={async (data: any) => {
                                    }}
                                />
                            </div>
                        }


                    </div>

                    <div className="ml-auto min-w-[25%] flex items-center gap-x-[0.6rem]">
                        <SearchInput
                            ref={srhRef}
                            size="xsm"
                            showFocus={true}
                            placeholder="Search"
                            isError={false}
                            hasResult={pageSearch.hasResult}
                            readonly={pageSearch.hasResult}
                            className=""
                            onChange={(e) => setPageSearch({ ...pageSearch, key: e.target.value.trim() })}
                            onSearch={async (e) => {
                                // if (pageSearch.hasResult) {
                                //     clearFilters()
                                // } else {
                                //     await searchResource({
                                //         resource: 'questions',
                                //         key: pageSearch.key,
                                //         paginate: 'relative'
                                //     });
                                // }
                            }}
                        />
                        {
                            pageSearch.hasResult &&
                            <Button
                                type="ghost"
                                semantic="error"
                                size="xsm"
                                className="form-button"
                                text={{
                                    label: "Clear",
                                    size: 13,
                                    weight: 'regular'
                                }}
                                reverse="row"
                                onClick={(e) => {
                                    clearFilters()
                                }}
                            />
                        }
                        <Button
                            type="ghost"
                            semantic="normal"
                            size="xsm"
                            className="form-button"
                            text={{
                                label: "Export",
                                size: 13,
                                weight: 'regular'
                            }}
                            reverse="row"
                            onClick={(e) => { }}
                        />
                    </div>

                </div>

                <Divider show={false} />

                <div className="w-full">

                    {
                        (tasks.loading || search.loading) &&
                        <>

                            <EmptyState className="min-h-[50vh]" noBound={true}>
                                <span className="loader lg primary"></span>
                            </EmptyState>
                        </>
                    }

                    {
                        !tasks.loading && !search.loading &&
                        <>
                            <TableBox>

                                {
                                    tasks.data.length === 0 &&
                                    <EmptyState className="min-h-[50vh]" noBound={true}>
                                        <span className="font-mona pag-600 text-[13px]">Tasks will appear here</span>
                                    </EmptyState>
                                }

                                {
                                    tasks.data.length > 0 &&
                                    <>
                                        {
                                            search.count < 0 &&
                                            <>
                                                <EmptyState className="min-h-[30vh]" noBound={true} style={{ backgroundColor: '#fffafa' }}>
                                                    <div className="font-mona par-700 text-[14px] mb-[0.35rem]">No results found for {pageSearch.key}</div>
                                                    <Button
                                                        type="ghost"
                                                        semantic="error"
                                                        size="xxsm"
                                                        className="form-button"
                                                        text={{
                                                            label: "Clear",
                                                            size: 13,
                                                            weight: 'regular'
                                                        }}
                                                        reverse="row"
                                                        onClick={(e) => {
                                                            clearFilters()
                                                        }}
                                                    />
                                                </EmptyState>
                                            </>
                                        }

                                        <Table className={`${search.count < 0 ? 'disabled' : ''}`}>

                                            <TableHeader
                                                items={[
                                                    { label: '#' },
                                                    { label: 'Created On', className: 'w-[12%]' },
                                                    { label: 'Title' },
                                                    { label: taskType === TaskTypeEnum.TEMPLATE ? 'Level' : 'Assigned To' },
                                                    { label: 'Difficulty' },
                                                    { label: taskType === TaskTypeEnum.TEMPLATE ? 'Duration' : 'Due Date' },
                                                    { label: 'Status' },
                                                    { label: 'Action', className: 'text-center w-[8%]' }
                                                ]}
                                            />

                                            <TableBody>

                                                {

                                                    tasks.data.map((task: Task, index) =>
                                                        <Fragment key={task.id}>
                                                            <TableRow>
                                                                <CellData large={true} onClick={(e) => toDetails(e, task.id)} className="w-[40px]">{index + 1}</CellData>
                                                                <CellData large={true} onClick={(e) => toDetails(e, task.id)} className="min-w-[170px]">{helper.formatDate(task.createdAt, 'basic')}</CellData>
                                                                <CellData large={true} onClick={(e) => toDetails(e, task.id)}>{task.title}</CellData>

                                                                {
                                                                    taskType === TaskTypeEnum.TEMPLATE &&
                                                                    <>
                                                                        {/* <CellData large={true} onClick={(e) => toDetails(e, task.id)}>
                                                                            <div className="flex items-center">
                                                                                {

                                                                                    task.talents.slice(0, 4).map((talent: Talent, index: number) => (
                                                                                        <Fragment key={index}>
                                                                                            <UserAvatar
                                                                                                size="w-[33px] h-[33px]"
                                                                                                className="leader-avatar -mr-[0.8rem] border border-white"
                                                                                                avatar={talent.avatar ? talent.avatar : '../../../images/assets/avatar.png'}
                                                                                                name={'sdvdfdsf'}
                                                                                            />
                                                                                        </Fragment>
                                                                                    ))
                                                                                }
                                                                            </div>
                                                                        </CellData> */}
                                                                        <CellData large={true} onClick={(e) => toDetails(e, task.id)}>{helper.capitalize(task.level)}</CellData>
                                                                        <CellData large={true} onClick={(e) => toDetails(e, task.id)}>{helper.capitalize(task.difficulty)}</CellData>
                                                                        <CellData large={true} onClick={(e) => toDetails(e, task.id)}>{helper.capitalizeWord(task.duration.label)}</CellData>
                                                                        <CellData onClick={(e) => toDetails(e, task.id)}>
                                                                            <Badge
                                                                                type={task.isEnabled ? 'success' : 'error'}
                                                                                display="status"
                                                                                size="xsm"
                                                                                label={task.isEnabled ? 'Enabled' : 'Disabled'}
                                                                                upper={true}
                                                                            />
                                                                        </CellData>
                                                                    </>
                                                                }
                                                                {
                                                                    taskType === TaskTypeEnum.ASSIGNED &&
                                                                    <>
                                                                        <CellData large={true} onClick={(e) => toDetails(e, task.id)}>
                                                                            <UserAvatar
                                                                                size="w-[33px] h-[33px]"
                                                                                className="leader-avatar -mr-[0.8rem] border border-white"
                                                                                avatar={task?.assignedTo?.avatar || '../../../images/assets/avatar.png'}
                                                                                name={''}
                                                                            />
                                                                        </CellData>
                                                                        <CellData large={true} onClick={(e) => toDetails(e, task.id)}>{helper.capitalize(task.difficulty)}</CellData>
                                                                        <CellData large={true} onClick={(e) => toDetails(e, task.id)}>{helper.formatDate(task.dueDate.ISO, 'basic')}</CellData>
                                                                        <CellData onClick={(e) => toDetails(e, task.id)}>
                                                                            <Badge
                                                                                type={task.status === StatusEnum.DRAFT ? 'info' : 'default'}
                                                                                size="xsm"
                                                                                label={task.status}
                                                                                upper={true}
                                                                            />
                                                                        </CellData>
                                                                    </>
                                                                }

                                                                <CellData className="text-center">
                                                                    <Popout
                                                                        ref={null}
                                                                        className='la-filter'
                                                                        position={(index + 1) === tasks.data.length ? "top-right" : "bottom-right"}
                                                                        menu={{
                                                                            style: {},
                                                                            search: false,
                                                                            fullWidth: true,
                                                                            limitHeight: 'sm'
                                                                        }}
                                                                        items={[
                                                                            { label: 'Details', value: 'details', onClick: (e) => toDetails(e, task.id) },
                                                                            { label: 'Disable', value: 'remove', onClick: () => { } }
                                                                        ]}
                                                                        noFilter={false}
                                                                    />
                                                                </CellData>
                                                            </TableRow>
                                                        </Fragment>
                                                    )
                                                }

                                            </TableBody>

                                        </Table>
                                    </>
                                }

                            </TableBox>
                        </>
                    }

                </div>

                <Divider show={false} />

                <TableFooter
                    title="Tasks"
                    type={type}
                    resource={resource || 'tasks'}
                    resourceId={resourceId}
                    source={tasks}
                    limit={25}
                    onChange={
                        type === 'self' ? getTasks : async () => { }
                    }
                />


            </ListBox>

        </>
    )
};

export default TaskList;
