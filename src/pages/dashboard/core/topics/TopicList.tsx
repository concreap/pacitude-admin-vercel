import React, { useEffect, useState, useContext, useRef, Fragment } from "react"
import { IListUI } from "../../../../utils/interfaces.util";
import useGoTo from "../../../../hooks/useGoTo";
import useIndustry from "../../../../hooks/app/useIndustry";
import useReport from "../../../../hooks/useReport";
import useSearch from "../../../../hooks/app/useSearch";
import ListBox from "../../../../components/partials/ui/ListBox";
import Filter from "../../../../components/partials/drops/Filter";
import helper from "../../../../utils/helper.util";
import SearchInput from "../../../../components/partials/inputs/SearchInput";
import Button from "../../../../components/partials/buttons/Button";
import Table from "../../../../components/partials/table/Table";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import Divider from "../../../../components/partials/Divider";
import TableBox from "../../../../components/partials/table/TableBox";
import TableHeader from "../../../../components/partials/table/Tableheader";
import TableBody from "../../../../components/partials/table/TableBody";
import Industry from "../../../../models/Industry.model";
import TableRow from "../../../../components/partials/table/TableRow";
import CellData from "../../../../components/partials/table/CellData";
import Popout from "../../../../components/partials/drops/Popout";
import TableFooter from "../../../../components/partials/table/TableFooter";
import useCareer from "../../../../hooks/app/useCareer";
import Career from "../../../../models/Career.model";
import useField from "../../../../hooks/app/useField";
import Field from "../../../../models/Field.model";
import useSkill from "../../../../hooks/app/useSkill";
import Skill from "../../../../models/Skill.model";
import useTopic from "../../../../hooks/app/useTopic";
import Topic from "../../../../models/Topic.model";
import Badge from "../../../../components/partials/badges/Badge";
import DeleteModal from "../../../../components/app/DeleteModal";

const TopicList = (props: IListUI) => {

    // props
    const { type, resource, resourceId } = props;

    // refs
    const statRef = useRef<any>(null)
    const fieRef = useRef<any>(null)
    const skiRef = useRef<any>(null)
    const srhRef = useRef<any>(null)

    const { goTo, toDetailRoute } = useGoTo()
    const { fields, getFields } = useField()
    const { skills, getSkills } = useSkill()
    const { topics, getTopics, getResourceTopics } = useTopic()
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

    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [topicId, setTopicId] = useState<string>('');

    useEffect(() => {
        initList(25)
    }, [])

    const initList = (limit: number) => {
        if (type === 'self') {
            getTopics({ limit: limit, page: 1, order: 'desc' })
        }
        if ((type === 'resource' || type === 'details') && resource && resourceId) {
            getResourceTopics({ limit: limit, page: 1, order: 'desc', resource, resourceId })
        }

        if (helper.isEmpty(fields.data, 'array')) {
            getFields({ limit: 9999, page: 1, order: 'desc' })
        }

        if (helper.isEmpty(skills.data, 'array')) {
            getSkills({ limit: 9999, page: 1, order: 'desc' })
        }
    }

    const handleReport = (e: any) => {

        if (e) { e.preventDefault() }

        if (pageSearch.hasResult) {
            exportToCSV({ title: 'rooms', report: search.report })
        } else {
            // open/navigate to form
        }
    }

    const clearFilters = () => {
        clearSearch();
        if (statRef.current) {
            statRef.current.clear()
        }
        if (srhRef.current) {
            srhRef.current.clear()
        }
        if (fieRef.current) {
            fieRef.current.clear()
        }
        if (skiRef.current) {
            skiRef.current.clear()
        }
    }

    const toDetails = (e: any, id: string) => {

        if (e) { e.preventDefault(); }

        toDetailRoute(e, { id: id, route: 'core', name: 'edit-topic' })
        // toDetailRoute(e, { id: id, route: 'core', name: 'topic-details' })

    }

    return (
        <>

            <ListBox>

                <div className="w-full flex items-center">

                    <div className={`grow flex items-center gap-x-[0.5rem] ${search.refineType === 'search' && pageSearch.hasResult ? 'disabled-light' : ''}`}>
                        <div className="min-w-[12%]">
                            <Filter
                                ref={statRef}
                                size='xsm'
                                className='la-filter'
                                placeholder="Status"
                                position="bottom"
                                menu={{
                                    style: {},
                                    search: false,
                                    fullWidth: true,
                                    limitHeight: 'sm'
                                }}
                                items={[
                                    { label: 'Enabled', value: 'enabled' },
                                    { label: 'Disabled', value: 'disabled' }
                                ]}
                                noFilter={false}
                                onChange={async (data) => {
                                    const { isEnabled, ...rest } = filters;
                                    await filterResource({
                                        resource: 'topics',
                                        paginate: 'relative',
                                        payload: {
                                            isEnabled: data.value === 'enabled' ? true : false,
                                            ...rest
                                        }
                                    })

                                    setFilters({ ...filters, isEnabled: data.value === 'enabled' ? true : false })
                                }}
                            />
                        </div>
                        <div className={`min-w-[14%] ${fields.loading ? 'disabled-light' : ''}`}>

                            <Filter
                                ref={fieRef}
                                size='xsm'
                                className='la-filter'
                                placeholder="Field"
                                position="bottom"
                                menu={{
                                    style: {},
                                    search: true,
                                    fullWidth: true,
                                    limitHeight: 'md'
                                }}
                                items={
                                    fields.count > 0 ?
                                        fields.data.map((x: Career) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        }) : []
                                }
                                noFilter={false}
                                onChange={async (data) => {

                                    const { fields, ...rest } = filters;
                                    await filterResource({
                                        resource: 'topics',
                                        paginate: 'relative',
                                        payload: {
                                            fields: [data.value],
                                            ...rest
                                        }
                                    })

                                    setFilters(prev => ({
                                        ...filters,
                                        fields: [data.value]
                                    }))
                                }}
                            />
                        </div>
                        <div className={`min-w-[14%] ${fields.loading ? 'disabled-light' : ''}`}>

                            <Filter
                                ref={skiRef}
                                size='xsm'
                                className='la-filter'
                                placeholder="Skill"
                                position="bottom"
                                menu={{
                                    style: {},
                                    search: true,
                                    fullWidth: true,
                                    limitHeight: 'md'
                                }}
                                items={
                                    skills.count > 0 ?
                                        skills.data.map((x: Career) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        }) : []
                                }
                                noFilter={false}
                                onChange={async (data) => {

                                    const { skills, ...rest } = filters;
                                    await filterResource({
                                        resource: 'topics',
                                        paginate: 'relative',
                                        payload: {
                                            skills: [data.value],
                                            ...rest
                                        }
                                    })

                                    setFilters(prev => ({
                                        ...filters,
                                        skills: [data.value]
                                    }))
                                }}
                            />
                        </div>
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
                                if (pageSearch.hasResult) {
                                    clearFilters()
                                } else {
                                    await searchResource({
                                        resource: 'topics',
                                        key: pageSearch.key,
                                        paginate: 'relative'
                                    });
                                }
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
                        (topics.loading || search.loading) &&
                        <>

                            <EmptyState className="min-h-[50vh]" noBound={true}>
                                <span className="loader lg primary"></span>
                            </EmptyState>
                        </>
                    }

                    {
                        !topics.loading && !search.loading &&
                        <>
                            <TableBox>

                                {
                                    topics.data.length === 0 &&
                                    <EmptyState className="min-h-[50vh]" noBound={true}>
                                        <span className="font-mona pag-600 text-[13px]">Topics will appear here</span>
                                    </EmptyState>
                                }

                                {
                                    topics.data.length > 0 &&
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
                                                    { label: 'Date Created', className: 'w-[18%]' },
                                                    { label: 'Name' },
                                                    { label: 'Code' },
                                                    { label: 'Fields' },
                                                    { label: 'Skills' },
                                                    { label: 'Status', className: 'w-[12%]' },
                                                    { label: 'Action', className: 'text-center w-[8%]' }
                                                ]}
                                            />

                                            <TableBody>

                                                {
                                                    pageSearch.hasResult &&
                                                    search.data.map((topic: Topic, index) =>
                                                        <Fragment key={topic._id}>
                                                            <TableRow>
                                                                <CellData onClick={(e) => toDetails(e, topic._id)}>{index + 1}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, topic._id)}>{helper.formatDate(topic.createdAt, 'basic')}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, topic._id)}>{helper.capitalizeWord(topic.name)}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, topic._id)}>{topic.code}</CellData>
                                                                <CellData className="">{topic.fields.length} Fields</CellData>
                                                                <CellData className="">{topic.skills.length} Skills</CellData>
                                                                <CellData onClick={(e) => toDetails(e, topic._id)}>
                                                                    <Badge
                                                                        type={topic.isEnabled ? 'green' : 'orange'}
                                                                        size="xsm"
                                                                        label={topic.isEnabled ? 'Enabled' : 'Disabled'}
                                                                        upper={true}
                                                                    />
                                                                </CellData>
                                                                <CellData className="text-center">
                                                                    <Popout
                                                                        ref={null}
                                                                        className='la-filter'
                                                                        position={index + 1 === topics.data.length ? "top-right" : "bottom-right"}
                                                                        menu={{
                                                                            style: {},
                                                                            search: false,
                                                                            fullWidth: true,
                                                                            limitHeight: 'sm'
                                                                        }}
                                                                        items={[
                                                                            { label: 'View Details', value: 'details', onClick: () => { } },
                                                                            { label: 'Edit', value: 'details', onClick: (e) => toDetails(e, topic._id) },
                                                                            { label: 'Remove', value: 'remove', onClick: () => {
                                                                                setShowDelete(true);
                                                                                setTopicId(topic._id)
                                                                            } }
                                                                        ]}
                                                                        noFilter={false}
                                                                    />
                                                                </CellData>
                                                            </TableRow>
                                                        </Fragment>
                                                    )
                                                }

                                                {
                                                    !pageSearch.hasResult &&
                                                    topics.data.map((topic: Topic, index) =>
                                                        <Fragment key={topic._id}>
                                                            <TableRow>
                                                                <CellData onClick={(e) => toDetails(e, topic._id)}>{index + 1}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, topic._id)}>{helper.formatDate(topic.createdAt, 'basic')}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, topic._id)}>{helper.capitalizeWord(topic.name)}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, topic._id)}>{topic.code}</CellData>
                                                                <CellData className="">{topic.fields.length} Fields</CellData>
                                                                <CellData className="">{topic.skills.length} Skills</CellData>
                                                                <CellData onClick={(e) => toDetails(e, topic._id)}>
                                                                    <Badge
                                                                        type={topic.isEnabled ? 'green' : 'orange'}
                                                                        size="xsm"
                                                                        label={topic.isEnabled ? 'Enabled' : 'Disabled'}
                                                                        upper={true}
                                                                    />
                                                                </CellData>
                                                                <CellData className="text-center">
                                                                    <Popout
                                                                        ref={null}
                                                                        className='la-filter'
                                                                        position={index + 1 === topics.data.length ? "top-right" : "bottom-right"}
                                                                        menu={{
                                                                            style: {},
                                                                            search: false,
                                                                            fullWidth: true,
                                                                            limitHeight: 'sm'
                                                                        }}
                                                                        items={[
                                                                            { label: 'View Details', value: 'details', onClick: () => { } },
                                                                            { label: 'Edit', value: 'details', onClick: (e) => toDetails(e, topic._id) },
                                                                            { label: 'Remove', value: 'remove', onClick: () => {
                                                                                setShowDelete(true);
                                                                                setTopicId(topic._id)
                                                                            } }
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
                    title="Topics"
                    type={type}
                    resource={resource || 'topics'}
                    resourceId={resourceId}
                    source={topics}
                    limit={25}
                    onChange={
                        type === 'self' ? getTopics : getResourceTopics
                    }
                />


            </ListBox>

            <DeleteModal
                show={showDelete}
                flattened={true}
                title="Delete Topic"
                closeModal={(e) => {
                    setShowDelete(false);
                    initList(25)
                }}
                size="lg"
                resource="topic"
                resourceId={topicId}
            />

        </>
    )
};

export default TopicList;
