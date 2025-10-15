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
import useApp from "../../../../hooks/app/useApp";
import useUser from "../../../../hooks/app/useUser";
import Talent from "../../../../models/Talent.model";
import UserAvatar from "../../../../components/partials/ui/UserAvatar";

const TalentList = (props: IListUI) => {

    // props
    const { type, resource, resourceId } = props;

    // refs
    const statRef = useRef<any>(null)
    const fieRef = useRef<any>(null)
    const skiRef = useRef<any>(null)
    const srhRef = useRef<any>(null)

    const { goTo, toDetailRoute } = useGoTo()
    const { core, loading, getCoreResources } = useApp()
    const { exportToCSV } = useReport()
    const { talents, getTalents, getFullname } = useUser()
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

            if(talents.data.length === 0){
                getTalents({ limit: limit, page: 1, order: 'desc' })
            }
            
        }
        getCoreResources({ limit: 9999, page: 1, order: 'desc' })
    }

    const handleReport = (e: any) => {

        if (e) { e.preventDefault() }

        if (pageSearch.hasResult) {
            exportToCSV({ title: 'talents', report: search.report })
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

        toDetailRoute(e, { id: id, route: 'users', name: 'talent-details' })

    }

    return (
        <>

            <ListBox>

                <div className="w-full flex items-center">

                    <div className={`grow flex items-center gap-x-[0.5rem] ${search.refineType === 'search' && pageSearch.hasResult ? 'disabled-light' : ''}`}>
                        <div className={`min-w-[20%] ${loading ? 'disabled-light' : ''}`}>

                            <Filter
                                ref={fieRef}
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


                                }}
                            />

                        </div>

                        <div className={`min-w-[18%] ${loading ? 'disabled-light' : ''}`}>

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
                                    core.fields.length > 0 ?
                                        core.fields.map((x: Field) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        }) : []
                                }
                                noFilter={false}
                                onChange={async (data) => {


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
                                        resource: 'talents',
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
                        (talents.loading || search.loading) &&
                        <>

                            <EmptyState className="min-h-[50vh]" noBound={true}>
                                <span className="loader lg primary"></span>
                            </EmptyState>
                        </>
                    }

                    {
                        !talents.loading && !search.loading &&
                        <>
                            <TableBox>

                                {
                                    talents.data.length === 0 &&
                                    <EmptyState className="min-h-[50vh]" noBound={true}>
                                        <span className="font-mona pag-600 text-[13px]">Talents will appear here</span>
                                    </EmptyState>
                                }

                                {
                                    talents.data.length > 0 &&
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
                                                    { label: 'Joined At', className: 'w-[12%]' },
                                                    { label: 'Talent', className: 'w-[28%]' },
                                                    { label: 'Career' },
                                                    { label: 'Field' },
                                                    { label: 'Last Login' },
                                                    { label: 'Action', className: 'text-center w-[8%]' }
                                                ]}
                                            />

                                            <TableBody>

                                                {
                                                    pageSearch.hasResult &&
                                                    search.data.map((talent: Talent, index) =>
                                                        <Fragment key={talent._id}>
                                                            <TableRow>
                                                                <CellData large={true} onClick={(e) => toDetails(e, talent._id)}>{index + 1}</CellData>
                                                                <CellData large={true} onClick={(e) => toDetails(e, talent._id)}>{helper.formatDate(talent.createdAt, 'basic')}</CellData>
                                                                <CellData large={true} onClick={(e) => toDetails(e, talent._id)}>
                                                                    <div className="flex items-center gap-[1rem]">
                                                                        <UserAvatar
                                                                            size="w-[40px] h-[40px]"
                                                                            className="leader-avatar"
                                                                            avatar={talent.avatar ? talent.avatar : '../../../images/assets/avatar.png'}
                                                                            name={getFullname(talent)}
                                                                        />
                                                                        <div className="leading-[1.2rem]">
                                                                            <h3 className="font-mona text-[14px] pag-800">{getFullname(talent)}</h3>
                                                                            <span className="pag-400 text-[13px] font-moal-light">@{talent.username}</span>
                                                                        </div>
                                                                    </div>
                                                                </CellData>
                                                                <CellData large={true} onClick={(e) => toDetails(e, talent._id)}>{talent.careers[0]?.career?.name || '--'}</CellData>
                                                                <CellData large={true} onClick={(e) => toDetails(e, talent._id)}>{talent.careers[0]?.fields[0]?.name || '--'}</CellData>
                                                                <CellData large={true} onClick={(e) => toDetails(e, talent._id)}>{helper.formatDate(talent.user?.login?.last, 'basic')}</CellData>

                                                                <CellData className="text-center">
                                                                    <Popout
                                                                        ref={null}
                                                                        className='la-filter'
                                                                        position={index + 1 === talents.data.length ? "top-right" : "bottom-right"}
                                                                        menu={{
                                                                            style: {},
                                                                            search: false,
                                                                            fullWidth: true,
                                                                            limitHeight: 'sm'
                                                                        }}
                                                                        items={[
                                                                            { label: 'View Details', value: 'details', onClick: () => { } },
                                                                            { label: 'Edit', value: 'details', onClick: (e) => toDetails(e, talent._id) },
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
                                                    talents.data.map((talent: Talent, index) =>
                                                        <Fragment key={talent._id}>
                                                            <TableRow>
                                                                <CellData large={true} onClick={(e) => toDetails(e, talent._id)}>{index + 1}</CellData>
                                                                <CellData large={true} onClick={(e) => toDetails(e, talent._id)}>{helper.formatDate(talent.createdAt, 'basic')}</CellData>
                                                                <CellData large={true} onClick={(e) => toDetails(e, talent._id)}>
                                                                    <div className="flex items-center gap-[1rem]">
                                                                        <UserAvatar
                                                                            size="w-[40px] h-[40px]"
                                                                            className="leader-avatar"
                                                                            avatar={talent.avatar ? talent.avatar : '../../../images/assets/avatar.png'}
                                                                            name={getFullname(talent)}
                                                                        />
                                                                        <div className="leading-[1.2rem]">
                                                                            <h3 className="font-mona text-[14px] pag-800">{getFullname(talent)}</h3>
                                                                            <span className="pag-400 text-[13px] font-moal-light">@{talent.username}</span>
                                                                        </div>
                                                                    </div>
                                                                </CellData>
                                                                <CellData large={true} onClick={(e) => toDetails(e, talent._id)}>{talent.careers[0]?.career?.name || '--'}</CellData>
                                                                <CellData large={true} onClick={(e) => toDetails(e, talent._id)}>{talent.careers[0]?.fields[0]?.name || '--'}</CellData>
                                                                <CellData large={true} onClick={(e) => toDetails(e, talent._id)}>{helper.formatDate(talent.user?.login?.last, 'basic')}</CellData>

                                                                <CellData className="text-center">
                                                                    <Popout
                                                                        ref={null}
                                                                        className='la-filter'
                                                                        position={index + 1 === talents.data.length ? "top-right" : "bottom-right"}
                                                                        menu={{
                                                                            style: {},
                                                                            search: false,
                                                                            fullWidth: true,
                                                                            limitHeight: 'sm'
                                                                        }}
                                                                        items={[
                                                                            { label: 'View Details', value: 'details', onClick: () => { } },
                                                                            { label: 'Edit', value: 'details', onClick: (e) => toDetails(e, talent._id) },
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
                    title="Talents"
                    type={type}
                    resource={resource || 'talents'}
                    resourceId={resourceId}
                    source={talents}
                    limit={25}
                    onChange={
                        type === 'self' ? getTalents : async () => { }
                    }
                />


            </ListBox>

        </>
    )
};

export default TalentList;
