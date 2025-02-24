import React, { useEffect, useState, useContext, Fragment } from "react"
import { ICollection, ICoreContext, IGeniusContext, IListUI, IUserContext } from "../../../../utils/interfaces.util";
import GeniusContext from "../../../../context/genius/geniusContext";
import SearchInput from "../../../../components/partials/inputs/SearchInput";
import Filter from "../../../../components/partials/drops/Filter";
import Button from "../../../../components/partials/buttons/Button";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import helper from "../../../../utils/helper.util";
import TableHead from "../../../../components/app/table/TableHead";
import Industry from "../../../../models/Industry.model";
import CellData from "../../../../components/app/table/CellData";
import Icon from "../../../../components/partials/icons/Icon";
import RoundButton from "../../../../components/partials/buttons/RoundButton";
import Popout from "../../../../components/partials/drops/Popout";
import UserContext from "../../../../context/user/userContext";
import CoreContext from "../../../../context/core/coreContext";
import IndustryForm from "./IndustryForm";
import { FormActionType } from "../../../../utils/types.util";
import routil from "../../../../utils/routes.util";
import useGoTo from "../../../../hooks/useGoTo";

const IndustryList = (props: IListUI) => {

    const { type, resource, resourceId } = props;

    const { goTo } = useGoTo();

    const LIMIT = 25;

    const userContext = useContext<IUserContext>(UserContext)
    const coreContext = useContext<ICoreContext>(CoreContext)

    const [showPanel, setShowPanel] = useState<boolean>(false);
    const [form, setForm] = useState<{ action: FormActionType, industryId: string }>({ action: 'add-resource', industryId: '' });

    const [industries, setIndustries] = useState<ICollection>(coreContext.industries)

    useEffect(() => {

        initSidebar()

        if (helper.isEmpty(coreContext.industries.data, 'array')) {
            coreContext.getIndustries({ limit: LIMIT, page: 1, order: 'desc' })
        }

    }, [])

    useEffect(() => {

        setIndustries(coreContext.industries)

    }, [coreContext.industries])

    const initSidebar = () => {

        const result = userContext.currentSidebar(userContext.sidebar.collapsed);
        if (result) {
            userContext.setSidebar(result)
        }

    }


    const togglePanel = (e: any, form?: { action: FormActionType, id?: string }) => {
        if (e) { e.preventDefault() }

        if (!showPanel && form) {
            setForm({ action: form.action, industryId: form.id ? form.id : '' })
        }

        setShowPanel(!showPanel)

    }

    const toDetails = (e: any, id: string) => {

        e.preventDefault();

        const route = routil.inRoute({
            route: 'industries',
            name: 'industry-details',
            params: [{ type: 'url', name: 'details', value: id }]
        });

        goTo(route);

    }

    const pagiNext = async (e: any) => {
        if (e) { e.preventDefault() }
        const { next } = industries.pagination;
        await coreContext.getIndustries({ limit: next.limit, page: next.page, order: 'desc' })
        helper.scrollToTop()
    }

    const pagiPrev = async (e: any) => {
        if (e) { e.preventDefault() }
        const { prev } = industries.pagination;
        await coreContext.getIndustries({ limit: prev.limit, page: prev.page, order: 'desc' })
        helper.scrollToTop()
    }

    return (
        <>
            <div id="listbox" className="listbox">

                <div className="header">
                    <div className="left-halve">
                        <SearchInput
                            showFocus={true}
                            autoComplete={false}
                            size="sm"
                            placeholder="Search Here"
                            onChange={(e) => { }}
                            onSearch={(e) => { }}
                        />
                        <span className="pdl1"></span>
                        <Filter
                            size="sm"
                            position="bottom"
                            icon={{ type: 'feather', name: 'calendar' }}
                            items={[{ label: 'Today', value: 'today' }, { label: 'Last 7 days', value: 7 }]}
                            onChange={(item) => { }}
                        />
                    </div>
                    <div className="right-halve">
                        <Button
                            text="Add New"
                            type="primary"
                            size="xsm"
                            loading={false}
                            disabled={false}
                            fontSize={14}
                            lineHeight={16}
                            className="add-new-btn"
                            icon={{
                                enable: true,
                                name: 'plus',
                                size: 20,
                                loaderColor: ''
                            }}
                            onClick={(e) => togglePanel(e, { action: 'add-resource' })}
                        />
                        <span className="pdl"></span>
                        <Button
                            text="Export"
                            type="ghost"
                            size="xsm"
                            loading={false}
                            disabled={false}
                            fontSize={14}
                            lineHeight={16}
                            className="export-btn"
                            icon={{
                                enable: false,
                            }}
                            onClick={(e) => { }}
                        />
                    </div>
                </div>

                <div className="ui-separate-small"></div>

                <div className="body">

                    {
                        industries.loading &&
                        <EmptyState bgColor='#f7f9ff' size='md' bound={true} >
                            <span className="loader lg primary"></span>
                        </EmptyState>
                    }

                    {
                        !industries.loading &&
                        <div className="tablebox responsive">

                            {
                                industries.data.length === 0 &&
                                <EmptyState bgColor='#f7f9ff' size='md' bound={true} >
                                    <span className={`ts-icon terra-link`}>
                                        <i className='path1 fs-28'></i>
                                        <i className='path2 fs-28'></i>
                                    </span>
                                    <div className='font-hostgro mrgb1 fs-14 ui-line-height mx-auto pas-950'>{industries.message}</div>
                                </EmptyState>
                            }

                            {
                                industries.data.length > 0 &&
                                <table className="table" style={{ borderCollapse: 'collapse' }}>

                                    <TableHead
                                        items={[
                                            { label: 'Date Created' },
                                            { label: 'Name' },
                                            { label: 'Label' },
                                            { label: 'Code' },
                                            { label: 'Careers', className: 'ui-text-center' },
                                            { label: 'Status' },
                                            { label: 'Action', className: 'ui-text-center' }
                                        ]}
                                    />

                                    <tbody>

                                        {
                                            industries.data.map((industry: Industry, index) =>
                                                <Fragment key={industry._id}>
                                                    <tr className="table-row">
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, industry._id)} className="wp-15" render={helper.formatDate(industry.createdAt, 'basic')} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, industry._id)} render={helper.capitalizeWord(industry.name)} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, industry._id)} render={helper.capitalize(industry.label)} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, industry._id)} className="ui-upcase wp-10" render={industry.code} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, industry._id)} className="ui-upcase wp-10 ui-text-center" render={industry.careers.length} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, industry._id)} className="wp-10" status={{ enable: true, type: 'enabled', value: industry.isEnabled }} render={<></>} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, industry._id)} render={
                                                            <div className="popout-wrapper">
                                                                <Popout
                                                                    position="left"
                                                                    items={[
                                                                        { label: 'Edit', value: 'edit', icon: { name: 'edit', size: 16, type: 'polio' }, onClick: (e) => { } },
                                                                        { label: 'Delete', value: 'delete', icon: { name: 'trash', type: 'feather' }, onClick: (e) => { } }
                                                                    ]}
                                                                />
                                                            </div>
                                                        } />
                                                    </tr>
                                                </Fragment>
                                            )
                                        }

                                    </tbody>

                                </table>
                            }

                        </div>
                    }


                </div>

                <div className="ui-separate-small"></div>

                <div className={`footer pdb2 ${industries.loading ? 'disabled-light' : ''}`}>

                    <div className="left-halve">
                        <Filter
                            size="xsm"
                            position="top"
                            noFilter={false}
                            placeholder={LIMIT.toString()}
                            icon={{ type: 'feather', name: 'chevron-down' }}
                            items={[{ label: '10', value: 10 }, { label: '15', value: 15 }, { label: '25', value: 25 }, { label: '45', value: 45 }, { label: '50', value: 50 }]}
                            onChange={(item) => { }}
                        />
                        <div className="pdl1">
                            <span className="fs-13 pas-950">Displaying {industries.count} industries on page {helper.getCurrentPage(industries.pagination)}</span>
                        </div>
                    </div>

                    <div className="right-halve ui-text-right">
                        <RoundButton
                            size="rg"
                            icon={<Icon type="feather" name="chevron-left" clickable={false} size={16} />}
                            className={`${industries.pagination.prev && industries.pagination.prev.limit ? '' : 'disabled'}`}
                            clickable={true}
                            onClick={(e) => pagiPrev(e)}
                        />
                        <span className="pdl"></span>
                        <RoundButton
                            size="rg"
                            icon={<Icon type="feather" name="chevron-right" clickable={false} size={16} />}
                            className={`${industries.pagination.next && industries.pagination.next.limit ? '' : 'disabled'}`}
                            clickable={true}
                            onClick={(e) => pagiNext(e)}
                        />
                    </div>

                </div>

            </div>

            <IndustryForm
                show={showPanel}
                closeForm={togglePanel}
                type={form.action}
                industryId={form.industryId}
                display="table"
                title={form.action === 'add-resource' ? 'Create Industry' : 'Edit Industry'}
            />
        </>
    )
};

export default IndustryList;
