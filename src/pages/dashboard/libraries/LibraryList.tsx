import { useEffect, useState, useRef, Fragment } from "react"
import { IListUI } from "../../../utils/interfaces.util";
import useGoTo from "../../../hooks/useGoTo";
import useReport from "../../../hooks/useReport";
import useSearch from "../../../hooks/app/useSearch";
import ListBox from "../../../components/partials/ui/ListBox";
import Filter from "../../../components/partials/drops/Filter";
import SearchInput from "../../../components/partials/inputs/SearchInput";
import Button from "../../../components/partials/buttons/Button";
import EmptyState from "../../../components/partials/dialogs/EmptyState";
import Divider from "../../../components/partials/Divider";
import TableBox from "../../../components/partials/table/TableBox";
import TableFooter from "../../../components/partials/table/TableFooter";
import useTask from "../../../hooks/app/useTask";
import useApp from "../../../hooks/app/useApp";
import useLibrary from "../../../hooks/app/useLibrary";
import LibraryCard from "./LibraryCard";
import { Library } from "../../../models/Library.model";

const LibraryList = (props: IListUI) => {

    // props
    const { type, resource, resourceId } = props;

    // refs
    const staRef = useRef<any>(null)
    const srhRef = useRef<any>(null)

    const { toDetailRoute } = useGoTo()
    const { libraries, getLibraries } = useLibrary()
    const { core, loading: coreLoading, getCoreResources } = useApp()
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

            if (libraries.data.length === 0) {
                handleGetLibraries(limit)
            }

        }
    }

    const handleGetLibraries = (limit: number) => {
        getLibraries({ limit: limit, page: 1, order: 'desc', type: type })
    }

    const clearFilters = () => {
        clearSearch();
        if (staRef.current) {
            staRef.current.clear()
        }
    }

    return (
        <>

            <ListBox>

                <div className="w-full flex items-center">

                    <div className={`grow flex items-center gap-x-[0.5rem] ${search.refineType === 'search' && pageSearch.hasResult ? 'disabled-light' : ''}`}>

                        <div className={`min-w-[16%] ${coreLoading ? 'disabled-light' : ''}`}>

                            <Filter
                                ref={staRef}
                                size='xsm'
                                className='la-filter'
                                placeholder="Task Type"
                                position="bottom"
                                defaultValue={'all'}
                                menu={{
                                    style: {},
                                    search: false,
                                    fullWidth: true,
                                    limitHeight: 'md'
                                }}
                                items={[
                                    { label: 'All Libraries', value: 'all' },
                                    { label: 'Draft', value: 'draft' },
                                    { label: 'Published', value: 'published' },
                                    { label: 'Archived', value: 'archived' }
                                ]}
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
                        (libraries.loading || search.loading) &&
                        <>

                            <EmptyState className="min-h-[50vh]" noBound={true}>
                                <span className="loader lg primary"></span>
                            </EmptyState>
                        </>
                    }

                    {
                        !libraries.loading && !search.loading &&
                        <>
                            <TableBox>

                                {
                                    libraries.data.length === 0 &&
                                    <EmptyState className="min-h-[50vh]" noBound={true}>
                                        <span className="font-mona pag-600 text-[13px]">Libraries will appear here</span>
                                    </EmptyState>
                                }

                                {
                                    libraries.data.length > 0 &&
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

                                        <div className="grid grid-cols-[48%_48%] gap-x-[2rem] gap-y-[1rem] items-center justify-between min-h-[70px]">

                                            {
                                                libraries.data.map((library: Library, index: number) => (

                                                    <LibraryCard
                                                        key={library._id}
                                                        library={library}
                                                        toRoute={(e) => {
                                                            toDetailRoute(e, { id: library._id, route: 'libraries', name: 'library-details' })
                                                        }}
                                                    />

                                                ))
                                            }

                                        </div>

                                    </>
                                }

                            </TableBox>
                        </>
                    }

                </div>

                <Divider show={false} />

                <TableFooter
                    title="Libraries"
                    type={type}
                    resource={resource || 'libraries'}
                    resourceId={resourceId}
                    source={libraries}
                    limit={25}
                    onChange={
                        type === 'self' ? getLibraries : async () => { }
                    }
                />


            </ListBox>

        </>
    )
};

export default LibraryList;
