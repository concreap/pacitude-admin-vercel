import React, { useEffect, useState, useContext, Fragment } from "react"
import SearchInput from "../../../../components/partials/inputs/SearchInput";
import Filter from "../../../../components/partials/drops/Filter";
import Button from "../../../../components/partials/buttons/Button";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import helper from "../../../../utils/helper.util";
import TableHead from "../../../../components/app/table/TableHead";
import CellData from "../../../../components/app/table/CellData";
import Icon from "../../../../components/partials/icons/Icon";
import RoundButton from "../../../../components/partials/buttons/RoundButton";
import { ICollection, ICoreContext, IUserContext } from "../../../../utils/interfaces.util";
import Popout from "../../../../components/partials/drops/Popout";
import Topic from "../../../../models/Topic.model";
import UserContext from "../../../../context/user/userContext";
import routil from "../../../../utils/routes.util";
import { useNavigate } from "react-router-dom";
import TopicForm from "./TopicForm";
import { FormActionType } from "../../../../utils/types.util";
import CoreContext from "../../../../context/core/coreContext";

const TopicsPage = ({ }) => {

    const LIMIT = 25;
    const navigate = useNavigate()

    const userContext = useContext<IUserContext>(UserContext)
    const coreContext = useContext<ICoreContext>(CoreContext)
    const [showPanel, setShowPanel] = useState<boolean>(false);
    const [form, setForm] = useState<{ action: FormActionType, topicId: string }>({ action: 'add-resource', topicId: '' })


    useEffect(() => {

        initSidebar()

        if (helper.isEmpty(coreContext.topics.data, 'array')) {
            coreContext.getTopics({ limit: LIMIT, page: 1, order: 'desc' })
        }

    }, [])

    const initSidebar = () => {

        const result = userContext.currentSidebar(userContext.sidebar.collapsed);
        if (result) {
            userContext.setSidebar(result)
        }

    }


    const pagiNext = async (e: any) => {
        if (e) { e.preventDefault() }
        const { next } = coreContext.topics.pagination;
        await coreContext.getTopics({ limit: next.limit, page: next.page, order: 'desc' })
        helper.scrollToTop()
    }

    const pagiPrev = async (e: any) => {
        if (e) { e.preventDefault() }
        const { prev } = coreContext.topics.pagination;
        await coreContext.getTopics({ limit: prev.limit, page: prev.page, order: 'desc' })
        helper.scrollToTop()
    }

    const toDetails = (e: any, id: string) => {

        e.preventDefault();

        const route = routil.inRoute({
            route: 'core',
            name: 'topic-details',
            params: [{ type: 'url', name: 'details', value: id }]
        });

        navigate(route);

    }

    const togglePanel = (e: any, form?: { action: FormActionType, id?: string } ) => {
        if (e) { e.preventDefault() }
        
        if(!showPanel && form){
            setForm({ action: form.action, topicId: form.id ? form.id : '' })
        }

        setShowPanel(!showPanel)

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
                        coreContext.topics.loading &&
                        <EmptyState bgColor='#f7f9ff' size='md' bound={true} >
                            <span className="loader lg primary"></span>
                        </EmptyState>
                    }

                    {
                        !coreContext.topics.loading &&
                        <div className="tablebox responsive">

                            {
                                coreContext.topics.data.length === 0 &&
                                <EmptyState bgColor='#f7f9ff' size='md' bound={true} >
                                    <span className={`ts-icon terra-link`}>
                                        <i className='path1 fs-28'></i>
                                        <i className='path2 fs-28'></i>
                                    </span>
                                    <div className='font-hostgro mrgb1 fs-14 ui-line-height mx-auto pas-950'>{coreContext.topics.message}</div>
                                </EmptyState>
                            }

                            {
                                coreContext.topics.data.length > 0 &&
                                <table className="table" style={{ borderCollapse: 'collapse' }}>

                                    <TableHead
                                        items={[
                                            { label: 'Date Created' },
                                            { label: 'Name' },
                                            { label: 'Label' },
                                            { label: 'Code' },
                                            { label: 'Questions', className: 'ui-text-center' },
                                            { label: 'Fields', className: 'ui-text-center' },
                                            { label: 'Status' },
                                            { label: 'Action', className: 'ui-text-center' }
                                        ]}
                                    />

                                    <tbody>

                                        {
                                            coreContext.topics.data.map((topic: Topic, index) =>
                                                <Fragment key={topic._id}>
                                                    <tr className="table-row">
                                                        <CellData fontSize={13} className="wp-15" render={helper.formatDate(topic.createdAt, 'basic')} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, topic._id)} render={helper.capitalizeWord(topic.name)} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, topic._id)} render={helper.capitalizeWord(topic.label)} />
                                                        <CellData fontSize={13} onClick={(e) => toDetails(e, topic._id)} className="ui-upcase" render={topic.code} />
                                                        <CellData fontSize={13} className="ui-upcase ui-text-center" render={topic.questions.length} />
                                                        <CellData fontSize={13} className="ui-upcase ui-text-center" render={topic.fields.length} />
                                                        <CellData fontSize={13} className="" status={{ enable: true, type: 'enabled', value: topic.isEnabled }} render={<></>} />
                                                        <CellData fontSize={13} render={
                                                            <div className="popout-wrapper">
                                                                <Popout
                                                                    position="left"
                                                                    items={[
                                                                        { label: 'Details', value: 'details', icon: { name: 'chevron-right', size: 16, type: 'feather' }, onClick: (e) => toDetails(e, topic._id) },
                                                                        { label: 'Edit', value: 'edit', icon: { name: 'edit', size: 16, type: 'polio' }, onClick: (e) => { togglePanel(e, { action: 'edit-resource', id: topic._id }); } },
                                                                        { label: 'Delete', value: 'delete', disabled: true, icon: { name: 'trash', type: 'feather' }, onClick: (e) => { } }
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

                <div className={`footer pdb2 ${coreContext.topics.loading ? 'disabled-light' : ''}`}>

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
                            <span className="fs-13 pas-950">Displaying {coreContext.topics.count} topics on page {helper.getCurrentPage(coreContext.topics.pagination)}</span>
                        </div>
                    </div>

                    <div className="right-halve ui-text-right">
                        <RoundButton
                            size="rg"
                            icon={<Icon type="feather" name="chevron-left" clickable={false} size={16} />}
                            className={`${coreContext.topics.pagination.prev && coreContext.topics.pagination.prev.limit ? '' : 'disabled'}`}
                            clickable={true}
                            onClick={(e) => pagiPrev(e)}
                        />
                        <span className="pdl"></span>
                        <RoundButton
                            size="rg"
                            icon={<Icon type="feather" name="chevron-right" clickable={false} size={16} />}
                            className={`${coreContext.topics.pagination.next && coreContext.topics.pagination.next.limit ? '' : 'disabled'}`}
                            clickable={true}
                            onClick={(e) => pagiNext(e)}
                        />
                    </div>

                </div>

            </div>

            <TopicForm
                show={showPanel}
                closeForm={togglePanel}
                type={form.action}
                topicId={form.topicId}
                display="table"
                title={form.action === 'add-resource' ? 'Add Topic(s)' : 'Edit Topic'}
            />
        </>
    )

};

export default TopicsPage;
