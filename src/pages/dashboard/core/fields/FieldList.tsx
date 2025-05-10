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
import Badge from "../../../../components/partials/badges/Badge";

const FieldList = (props: IListUI) => {

    // props
    const { type, resource, resourceId } = props;

    // refs
    const statRef = useRef<any>(null)
    const carRef = useRef<any>(null)
    const srhRef = useRef<any>(null)

    const { goTo, toDetailRoute } = useGoTo()
    const { careers, getCareers } = useCareer()
    const { fields, getFields, getResourceFields } = useField()
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
            getFields({ limit: limit, page: 1, order: 'desc' })
        }
        if ((type === 'resource' || type === 'details') && resource && resourceId) {
            getResourceFields({ limit: limit, page: 1, order: 'desc', resource, resourceId })
        }

        if (helper.isEmpty(careers.data, 'array')) {
            getCareers({ limit: 9999, page: 1, order: 'desc' })
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
        if (carRef.current) {
            carRef.current.clear()
        }
    }

    const toDetails = (e: any, id: string) => {

        if (e) { e.preventDefault(); }

        toDetailRoute(e, { id: id, route: 'core', name: 'field-details' })

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
                                        resource: 'fields',
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
                        <div className={`min-w-[14%] ${careers.loading ? 'disabled-light' : ''}`}>

                            <Filter
                                ref={carRef}
                                size='xsm'
                                className='la-filter'
                                placeholder="Career"
                                position="bottom"
                                menu={{
                                    style: {},
                                    search: true,
                                    fullWidth: true,
                                    limitHeight: 'md'
                                }}
                                items={
                                    careers.count > 0 ?
                                        careers.data.map((x: Career) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        }) : []
                                }
                                noFilter={false}
                                onChange={async (data) => {

                                    const { careerId, ...rest } = filters;
                                    await filterResource({
                                        resource: 'fields',
                                        paginate: 'relative',
                                        payload: {
                                            careerId: data.value,
                                            ...rest
                                        }
                                    })

                                    setFilters({ ...filters, careerId: data.value })
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
                                        resource: 'fields',
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
                        (fields.loading || search.loading) &&
                        <>

                            <EmptyState className="min-h-[50vh]" noBound={true}>
                                <span className="loader lg primary"></span>
                            </EmptyState>
                        </>
                    }

                    {
                        !fields.loading && !search.loading &&
                        <>
                            <TableBox>

                                {
                                    fields.data.length === 0 &&
                                    <EmptyState className="min-h-[50vh]" noBound={true}>
                                        <span className="font-rethink pag-600 text-[13px]">Fields will appear here</span>
                                    </EmptyState>
                                }

                                {
                                    fields.data.length > 0 &&
                                    <>
                                        {
                                            search.count < 0 &&
                                            <>
                                                <EmptyState className="min-h-[30vh]" noBound={true} style={{ backgroundColor: '#fffafa' }}>
                                                    <div className="font-rethink par-700 text-[14px] mb-[0.35rem]">No results found for {pageSearch.key}</div>
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
                                                    { label: 'Skills' },
                                                    { label: 'Status', className: 'w-[12%]' },
                                                    { label: 'Action', className: 'text-center w-[8%]' }
                                                ]}
                                            />

                                            <TableBody>

                                                {
                                                    pageSearch.hasResult &&
                                                    search.data.map((field: Field, index) =>
                                                        <Fragment key={field._id}>
                                                            <TableRow>
                                                                <CellData onClick={(e) => toDetails(e, field._id)}>{index + 1}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, field._id)}>{helper.formatDate(field.createdAt, 'basic')}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, field._id)}>{helper.capitalizeWord(field.name)}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, field._id)}>{field.code}</CellData>
                                                                <CellData className="">{field.skills.length} Skills</CellData>
                                                                <CellData onClick={(e) => toDetails(e, field._id)}>
                                                                    <Badge
                                                                        type={field.isEnabled ? 'green' : 'orange'}
                                                                        size="xsm"
                                                                        label={field.isEnabled ? 'Enabled' : 'Disabled'}
                                                                        upper={true}
                                                                    />
                                                                </CellData>
                                                                <CellData className="text-center">
                                                                    <Popout
                                                                        ref={null}
                                                                        className='la-filter'
                                                                        position={index + 1 === fields.data.length ? "top-right" : "bottom-right"}
                                                                        menu={{
                                                                            style: {},
                                                                            search: false,
                                                                            fullWidth: true,
                                                                            limitHeight: 'sm'
                                                                        }}
                                                                        items={[
                                                                            { label: 'View Details', value: 'details', onClick: () => { } },
                                                                            { label: 'Remove', value: 'remove', onClick: () => { } }
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
                                                    fields.data.map((field: Field, index) =>
                                                        <Fragment key={field._id}>
                                                            <TableRow>
                                                                <CellData onClick={(e) => toDetails(e, field._id)}>{index + 1}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, field._id)}>{helper.formatDate(field.createdAt, 'basic')}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, field._id)}>{helper.capitalizeWord(field.name)}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, field._id)}>{field.code}</CellData>
                                                                <CellData className="">{field.skills.length} Skills</CellData>
                                                                <CellData onClick={(e) => toDetails(e, field._id)}>
                                                                    <Badge
                                                                        type={field.isEnabled ? 'green' : 'orange'}
                                                                        size="xsm"
                                                                        label={field.isEnabled ? 'Enabled' : 'Disabled'}
                                                                        upper={true}
                                                                    />
                                                                </CellData>
                                                                <CellData className="text-center">
                                                                    <Popout
                                                                        ref={null}
                                                                        className='la-filter'
                                                                        position={index + 1 === fields.data.length ? "top-right" : "bottom-right"}
                                                                        menu={{
                                                                            style: {},
                                                                            search: false,
                                                                            fullWidth: true,
                                                                            limitHeight: 'sm'
                                                                        }}
                                                                        items={[
                                                                            { label: 'View Details', value: 'details', onClick: () => { } },
                                                                            { label: 'Remove', value: 'remove', onClick: () => { } }
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
                    title="Fields"
                    type={type}
                    resource={resource || 'fields'}
                    resourceId={resourceId}
                    source={fields}
                    limit={25}
                    onChange={
                        type === 'self' ? getFields : getResourceFields
                    }
                />


            </ListBox>

        </>
    )
};

export default FieldList;
