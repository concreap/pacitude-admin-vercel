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
import Badge from "../../../../components/partials/badges/Badge";

const IndustryList = (props: IListUI) => {

    // props
    const { type, resource, resourceId } = props;

    // refs
    const statRef = useRef<any>(null)
    const srhRef = useRef<any>(null)

    const { goTo, toDetailRoute } = useGoTo()
    const { industries, getIndustries, getResourceIndustries } = useIndustry()
    const { exportToCSV } = useReport()
    const { search, pageSearch, setPageSearch, clearSearch, searchResource, filterResource } = useSearch({})

    useEffect(() => {
        initList(25)
    }, [])

    const initList = (limit: number) => {
        if (type === 'self') {
            getIndustries({ limit: limit, page: 1, order: 'desc' })
        }
        if ((type === 'resource' || type === 'details') && resource && resourceId) {
            getResourceIndustries({ limit: limit, page: 1, order: 'desc', resource, resourceId })
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

    const toDetails = (e: any, id: string) => {

        if (e) { e.preventDefault(); }

        toDetailRoute(e, { id: id, route: 'core', name: 'industry-details' })

    }

    return (
        <>

            <ListBox>

                <div className="w-full flex items-center">

                    <div className="grow flex items-center gap-x-[0.5rem]">
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
                                    await filterResource({
                                        resource: 'industries',
                                        paginate: 'relative',
                                        payload: {
                                            isEnabled: data.value === 'enabled' ? true : false
                                        }
                                    })
                                    statRef?.current?.clear()
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
                            className=""
                            onChange={(e) => setPageSearch({ ...pageSearch, key: e.target.value.trim() })}
                            onSearch={async (e) => {
                                if (pageSearch.hasResult) {
                                    clearSearch();
                                    statRef?.current?.clear()
                                } else {
                                    await searchResource({
                                        resource: 'industries',
                                        key: pageSearch.key,
                                        paginate: 'relative'
                                    });
                                    statRef?.current?.clear()
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
                                    clearSearch();
                                    statRef?.current?.clear()
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
                        (industries.loading || search.loading) &&
                        <>

                            <EmptyState className="min-h-[50vh]" noBound={true}>
                                <span className="loader lg primary"></span>
                            </EmptyState>
                        </>
                    }

                    {
                        !industries.loading && !search.loading &&
                        <>
                            <TableBox>

                                {
                                    industries.data.length === 0 &&
                                    <EmptyState className="min-h-[50vh]" noBound={true}>
                                        <span className="font-mona pag-600 text-[13px]">Industries will appear here</span>
                                    </EmptyState>
                                }

                                {
                                    industries.data.length > 0 &&
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
                                                            clearSearch();
                                                            statRef?.current?.clear()
                                                            srhRef?.current?.clear()
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
                                                    { label: 'Code', className: 'w-[15%]' },
                                                    { label: 'Careers', className: 'w-[14%]' },
                                                    { label: 'Status', className: 'w-[12%]' },
                                                    { label: 'Action', className: 'text-center w-[8%]' }
                                                ]}
                                            />

                                            <TableBody>

                                                {
                                                    pageSearch.hasResult &&
                                                    search.data.map((industry: Industry, index) =>
                                                        <Fragment key={industry._id}>
                                                            <TableRow>
                                                                <CellData onClick={(e) => toDetails(e, industry._id)}>{index + 1}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, industry._id)}>{helper.formatDate(industry.createdAt, 'basic')}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, industry._id)}>{helper.capitalizeWord(industry.name)}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, industry._id)}>{industry.code}</CellData>
                                                                <CellData className="">{industry.careers.length} Careers</CellData>
                                                                <CellData onClick={(e) => toDetails(e, industry._id)}>
                                                                    <Badge
                                                                        type={industry.isEnabled ? 'green' : 'orange'}
                                                                        size="xsm"
                                                                        label={industry.isEnabled ? 'Enabled' : 'Disabled'}
                                                                        upper={true}
                                                                    />
                                                                </CellData>
                                                                <CellData className="text-center">
                                                                    <Popout
                                                                        ref={null}
                                                                        className='la-filter'
                                                                        position="bottom-right"
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
                                                    industries.data.map((industry: Industry, index) =>
                                                        <Fragment key={industry._id}>
                                                            <TableRow>
                                                                <CellData onClick={(e) => toDetails(e, industry._id)}>{index + 1}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, industry._id)}>{helper.formatDate(industry.createdAt, 'basic')}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, industry._id)}>{helper.capitalizeWord(industry.name)}</CellData>
                                                                <CellData onClick={(e) => toDetails(e, industry._id)}>{industry.code}</CellData>
                                                                <CellData className="">{industry.careers.length} Careers</CellData>
                                                                <CellData onClick={(e) => toDetails(e, industry._id)}>
                                                                    <Badge
                                                                        type={industry.isEnabled ? 'green' : 'orange'}
                                                                        size="xsm"
                                                                        label={industry.isEnabled ? 'Enabled' : 'Disabled'}
                                                                        upper={true}
                                                                    />
                                                                </CellData>
                                                                <CellData className="text-center">
                                                                    <Popout
                                                                        ref={null}
                                                                        className='la-filter'
                                                                        position={index + 1 === industries.data.length ? "top-right" : "bottom-right"}
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
                    title="Industries"
                    type={type}
                    resource={resource || 'industries'}
                    resourceId={resourceId}
                    source={industries}
                    limit={25}
                    onChange={
                        type === 'self' ? getIndustries : getResourceIndustries
                    }
                />


            </ListBox>

        </>
    )
};

export default IndustryList;
