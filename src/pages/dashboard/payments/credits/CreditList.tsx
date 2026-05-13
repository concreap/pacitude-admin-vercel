import { useEffect, useState, useRef, Fragment } from "react"
import { IListUI } from "../../../../utils/interfaces.util";
import useGoTo from "../../../../hooks/useGoTo";
import useReport from "../../../../hooks/useReport";
import useSearch from "../../../../hooks/app/useSearch";
import ListBox from "../../../../components/partials/ui/ListBox";
import Filter from "../../../../components/partials/drops/Filter";
import SearchInput from "../../../../components/partials/inputs/SearchInput";
import Button from "../../../../components/partials/buttons/Button";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import Divider from "../../../../components/partials/Divider";
import TableBox from "../../../../components/partials/table/TableBox";
import TableFooter from "../../../../components/partials/table/TableFooter";
import { CurrencyName, CurrencySymbol, CurrencyType } from "../../../../utils/enums.util";
import helper from "../../../../utils/helper.util";
import useCredit from "../../../../hooks/app/useCredit";
import { Credit } from "../../../../models/Credit.model";
import Table from "../../../../components/partials/table/Table";
import TableHeader from "../../../../components/partials/table/Tableheader";
import TableRow from "../../../../components/partials/table/TableRow";
import CellData from "../../../../components/partials/table/CellData";
import UserAvatar from "../../../../components/partials/ui/UserAvatar";
import Badge from "../../../../components/partials/badges/Badge";
import Popout from "../../../../components/partials/drops/Popout";

const CreditList = (props: IListUI) => {

    // props
    const { type, resource, resourceId } = props;

    // refs
    const staRef = useRef<any>(null)
    const srhRef = useRef<any>(null)
    const cuRef = useRef<any>(null)

    const { toDetailRoute } = useGoTo()
    const { credits, getCredits, getStatusType } = useCredit();
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

            if (credits.data.length === 0) {
                handleGetCredits(limit)
            }

        }
    }

    const handleGetCredits = (limit: number) => {
        getCredits({ limit: limit, page: 1, order: 'desc', type: type })
    }

    const clearFilters = () => {
        clearSearch();
        if (staRef.current) {
            staRef.current.clear()
        }
    }

    const toDetails = (e: any, id: string) => {
        if (e) { e.preventDefault(); }
        toDetailRoute(e, { id: id, route: 'payments', name: 'credit-details' })
    }

    const displayValue = (currency: string, value: number) => {

        let result: string = value.toLocaleString()

        if (currency === CurrencyType.NGN) {
            result = `${CurrencySymbol.NGN}${value.toLocaleString()}`
        } else if (currency === CurrencyType.USD) {
            result = `${CurrencySymbol.USD}${value.toLocaleString()}`
        }

        return result;

    }

    return (
        <>

            <ListBox>

                <div className="w-full flex items-center">

                    <div className={`grow flex items-center gap-x-[0.5rem] ${search.refineType === 'search' && pageSearch.hasResult ? 'disabled-light' : ''}`}>

                        <div className={`min-w-[16%] ${credits.loading ? 'disabled-light' : ''}`}>

                            <Filter
                                ref={staRef}
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
                                items={[
                                    { label: 'Active', value: 'active' },
                                    { label: 'Exhausted', value: 'exhausted' },
                                    { label: 'Revoked', value: 'revoked' }
                                ]}
                                noFilter={false}
                                onChange={async (data) => {

                                }}
                            />
                        </div>

                        <div className={`min-w-[16%] ${credits.loading ? 'disabled-light' : ''}`}>

                            <Filter
                                ref={cuRef}
                                size='xsm'
                                className='la-filter'
                                placeholder="Currency"
                                position="bottom"
                                defaultValue={''}
                                menu={{
                                    style: {},
                                    search: false,
                                    fullWidth: true,
                                    limitHeight: 'md'
                                }}
                                items={[
                                    { label: `${CurrencySymbol.NGN} ${helper.capitalize(CurrencyName.NGN)}`, value: CurrencyType.NGN },
                                    { label: `${CurrencySymbol.USD} ${helper.capitalize(CurrencyName.USD)}`, value: CurrencyType.USD },
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
                        (credits.loading || search.loading) &&
                        <>

                            <EmptyState className="min-h-[50vh]" noBound={true}>
                                <span className="loader lg primary"></span>
                            </EmptyState>
                        </>
                    }

                    {
                        !credits.loading && !search.loading &&
                        <>
                            <TableBox>

                                {
                                    credits.data.length === 0 &&
                                    <EmptyState className="min-h-[50vh]" noBound={true}>
                                        <span className="font-mona pag-600 text-[13px]">Credits will appear here</span>
                                    </EmptyState>
                                }

                                {
                                    credits.data.length > 0 &&
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
                                                    { label: 'Granted At', className: 'w-[15%]' },
                                                    { label: 'Business', className: 'w-[22%]' },
                                                    { label: 'Value' },
                                                    { label: 'Status' },
                                                    { label: 'Starts At' },
                                                    { label: 'Expires At' },
                                                    { label: 'Action', className: 'text-center w-[8%]' }
                                                ]}
                                            />

                                            {
                                                pageSearch.hasResult &&
                                                search.data.map((credit: Credit, index) =>
                                                    <Fragment key={credit._id}>

                                                        <TableRow>

                                                            <CellData large={true} onClick={(e) => toDetails(e, credit._id)}>{index + 1}</CellData>
                                                            <CellData large={true} onClick={(e) => toDetails(e, credit._id)}>{helper.formatDate(credit.createdAt, 'basic')}</CellData>
                                                            <CellData large={true} onClick={(e) => toDetails(e, credit._id)}>
                                                                <div className="flex items-center gap-[1rem]">
                                                                    <UserAvatar
                                                                        size="w-[30px] h-[30px]"
                                                                        className="leader-avatar"
                                                                        avatar={credit?.business?.logo || '../../../images/assets/avatar.png'}
                                                                        name={credit?.business?.name || 'Business'}
                                                                    />
                                                                    <div className="leading-[1rem]">
                                                                        <h3 className="font-mona text-[14px] pag-800">{credit?.business?.name || 'Business'}</h3>
                                                                        {/* <span className="pag-400 text-[13px] font-mona-light">{helper.capitalize(credit?.business?.businessType || 'Biz Type')}</span> */}
                                                                    </div>
                                                                </div>
                                                            </CellData>
                                                            <CellData large={true} onClick={(e) => toDetails(e, credit._id)}>{displayValue(credit.currency, credit.value)}</CellData>
                                                            <CellData large={true} >
                                                                <Badge
                                                                    className="min-w-[70px]"
                                                                    type={getStatusType(credit.status)}
                                                                    size="sm"
                                                                    display="status"
                                                                    label={credit.status}
                                                                    padding={{ y: 2, x: 12 }}
                                                                    font={{
                                                                        weight: 'medium',
                                                                        size: 11
                                                                    }}
                                                                    upper={true}
                                                                    close={false}
                                                                />
                                                            </CellData>
                                                            <CellData large={true} onClick={(e) => toDetails(e, credit._id)}>{helper.formatDate(credit.startAt, 'basic')}</CellData>
                                                            <CellData large={true} onClick={(e) => toDetails(e, credit._id)}>{helper.formatDate(credit.expiresAt, 'basic')}</CellData>

                                                            <CellData className="text-center">
                                                                <Popout
                                                                    ref={null}
                                                                    className='la-filter'
                                                                    position={index + 1 === credits.data.length ? "top-right" : "bottom-right"}
                                                                    menu={{
                                                                        style: {},
                                                                        search: false,
                                                                        fullWidth: true,
                                                                        limitHeight: 'sm'
                                                                    }}
                                                                    items={[
                                                                        { label: 'View Details', value: 'details', onClick: (e) => toDetails(e, credit._id) },
                                                                        { label: 'Revoke', value: 'revoke', onClick: (e) => { } },
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
                                                credits.data.map((credit: Credit, index) =>
                                                    <Fragment key={credit._id}>

                                                        <TableRow>

                                                            <CellData large={true} onClick={(e) => toDetails(e, credit._id)}>{index + 1}</CellData>
                                                            <CellData large={true} onClick={(e) => toDetails(e, credit._id)}>{helper.formatDate(credit.createdAt, 'basic')}</CellData>
                                                            <CellData large={true} onClick={(e) => toDetails(e, credit._id)}>
                                                                <div className="flex items-center gap-[1rem]">
                                                                    <UserAvatar
                                                                        size="w-[30px] h-[30px]"
                                                                        className="leader-avatar"
                                                                        avatar={credit?.business?.logo || '../../../images/assets/avatar.png'}
                                                                        name={credit?.business?.name || 'Business'}
                                                                    />
                                                                    <div className="leading-[1rem]">
                                                                        <h3 className="font-mona text-[14px] pag-800">{credit?.business?.name || 'Business'}</h3>
                                                                        {/* <span className="pag-400 text-[13px] font-mona-light">{helper.capitalize(credit?.business?.businessType || 'Biz Type')}</span> */}
                                                                    </div>
                                                                </div>
                                                            </CellData>
                                                            <CellData large={true} onClick={(e) => toDetails(e, credit._id)}>{displayValue(credit.currency, credit.value)}</CellData>
                                                            <CellData large={true} >
                                                                <Badge
                                                                    className="min-w-[70px]"
                                                                    type={getStatusType(credit.status)}
                                                                    size="sm"
                                                                    display="status"
                                                                    label={credit.status}
                                                                    padding={{ y: 2, x: 12 }}
                                                                    font={{
                                                                        weight: 'medium',
                                                                        size: 11
                                                                    }}
                                                                    upper={true}
                                                                    close={false}
                                                                />
                                                            </CellData>
                                                            <CellData large={true} onClick={(e) => toDetails(e, credit._id)}>{helper.formatDate(credit.startAt, 'basic')}</CellData>
                                                            <CellData large={true} onClick={(e) => toDetails(e, credit._id)}>{helper.formatDate(credit.expiresAt, 'basic')}</CellData>

                                                            <CellData className="text-center">
                                                                <Popout
                                                                    ref={null}
                                                                    className='la-filter'
                                                                    position={index + 1 === credits.data.length ? "top-right" : "bottom-right"}
                                                                    menu={{
                                                                        style: {},
                                                                        search: false,
                                                                        fullWidth: true,
                                                                        limitHeight: 'sm'
                                                                    }}
                                                                    items={[
                                                                        { label: 'View Details', value: 'details', onClick: (e) => toDetails(e, credit._id) },
                                                                        { label: 'Revoke', value: 'revoke', onClick: (e) => { } },
                                                                    ]}
                                                                    noFilter={false}
                                                                />
                                                            </CellData>

                                                        </TableRow>

                                                    </Fragment>
                                                )
                                            }

                                        </Table>

                                    </>
                                }

                            </TableBox>
                        </>
                    }

                </div>

                <Divider show={false} />

                <TableFooter
                    title="Credits"
                    type={type}
                    resource={resource || 'careers'}
                    resourceId={resourceId}
                    source={credits}
                    limit={25}
                    onChange={
                        type === 'self' ? getCredits : async () => { }
                    }
                />


            </ListBox>

        </>
    )
};

export default CreditList;
