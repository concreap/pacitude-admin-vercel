import React, { useEffect, useState, useContext, useRef } from "react"
import { useParams } from "react-router-dom";
import GeniusContext from "../../../../context/genius/geniusContext";
import { IAlert, ICoreContext, IGeniusContext, IResourceContext, IToast, IToastState, IUserContext } from "../../../../utils/interfaces.util";
import helper from "../../../../utils/helper.util";
import Topic from "../../../../models/Topic.model";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import Icon from "../../../../components/partials/icons/Icon";
import UserContext from "../../../../context/user/userContext";
import Button from "../../../../components/partials/buttons/Button";
import AxiosService from "../../../../services/axios.service";
import ResourceContext from "../../../../context/resource/resourceContext";
import TopicForm from "./TopicForm";
import DropDown from "../../../../components/layouts/DropDown";
import Badge from "../../../../components/partials/badges/Badge";
import CoreContext from "../../../../context/core/coreContext";

const TopicDetailsPage = ({ }) => {

    const panelRef = useRef<any>();
    const { id } = useParams()

    const userContext = useContext<IUserContext>(UserContext)
    const coreContext = useContext<ICoreContext>(CoreContext)
    const resourceContext = useContext<IResourceContext>(ResourceContext)

    const [topic, setTopic] = useState<Topic>(coreContext.topic)
    const [updated, setUpdated] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)
    const [showPanel, setShowPanel] = useState<boolean>(false)

    useEffect(() => {

        initSidebar()
        getTopic()

        coreContext.getFields({ limit: 9999, page: 1, order: 'desc' })

    }, [])

    useEffect(() => {
        setTopic(coreContext.topic)
    }, [coreContext.topic])

    const initSidebar = () => {

        const result = userContext.currentSidebar(userContext.sidebar.collapsed);
        if (result) {
            userContext.setSidebar(result)
        }

    }

    const togglePanel = (e: any) => {
        if (e) { e.preventDefault() }
        setShowPanel(!showPanel)
    }

    const getTopic = () => {
        if (id) {
            coreContext.getTopic(id);
        }
    }

    const getFields = () => {

        let result: Array<any> = [];

        if (coreContext.fields.data.length > 0) {

            result = coreContext.fields.data.map((f) => {
                let c = {
                    value: f._id,
                    label: helper.capitalizeWord(f.name),
                    left: '',
                    image: ''
                }
                return c;
            })

        }


        return result;

    }

    const toggleTopicState = async (e: any) => {

        if (e) { e.preventDefault(); }

        setLoading(true);

        const response = await AxiosService.call({
            type: 'default',
            method: 'PUT',
            path: `/topics/${topic._id}`,
            isAuth: true,
            payload: { isEnabled: topic.isEnabled ? false : true }
        });

        if (response.error === false && response.status === 200) {
            setLoading(false)
            resourceContext.setToast({
                ...resourceContext.toast,
                show: true,
                message: `Topic ${topic.isEnabled ? 'disabled' : 'enabled'} successfully`
            })
            getTopic();
        }

        if (response.error === true) {

            setLoading(false)

            if (response.errors.length > 0) {
                resourceContext.setToast({
                    ...resourceContext.toast,
                    show: true,
                    type: 'error',
                    message: response.errors.join(',')
                })
            } else {
                resourceContext.setToast({
                    ...resourceContext.toast,
                    show: true,
                    type: 'error',
                    message: response.message
                })
            }
        }

        setTimeout(() => {
            resourceContext.setToast({ ...resourceContext.toast, show: false })
        }, 2500)

    }

    return (
        <>

            {
                coreContext.loading &&
                <>
                    <EmptyState bgColor='#f7f9ff' size='md' bound={true} >
                        <span className="loader lg primary"></span>
                    </EmptyState>
                </>
            }
            {
                !coreContext.loading &&
                <>

                    <div className="details-header">

                        <div className="avatar">
                            <span className="font-hostgro-bold pab-900 fs-18 ui-upcase">{helper.getInitials(topic.name || 'NA')}</span>
                        </div>

                        <div className="pdl mrgl1">
                            <h3 className="font-hostgro-bold fs-20 mrgb0">{topic.name || '--'}</h3>
                            <span className="font-hostgro fs-14 pag-500 ui-upcase pdr">{topic.code || '--'}</span>
                            <Icon
                                type="feather"
                                name={'copy'}
                                size={14}
                                clickable={true}
                                position="relative"
                                className="copy-icon pab-500"
                                style={{ top: '1px' }}
                            />
                        </div>

                        <div className={`actions ${loading ? 'disabled-light' : ''}`}>

                            <Button
                                text="Edit"
                                type="ghost"
                                semantic="ongoing"
                                reverse="row"
                                size="mini"
                                loading={false}
                                disabled={false}
                                fontSize={13}
                                fontWeight={'medium'}
                                lineHeight={16}
                                className="export-btn"
                                icon={{
                                    enable: true,
                                    type: 'polio',
                                    name: 'edit',
                                    size: 13
                                }}
                                onClick={(e) => togglePanel(e)}
                            />
                            <Button
                                text={topic.isEnabled ? 'Disable' : 'Enable'}
                                type="ghost"
                                semantic={topic.isEnabled ? 'info' : 'success'}
                                reverse="row"
                                size="mini"
                                loading={false}
                                disabled={false}
                                fontSize={13}
                                fontWeight={'medium'}
                                lineHeight={16}
                                className="export-btn"
                                icon={{
                                    enable: true,
                                    type: 'feather',
                                    name: topic.isEnabled ? 'x' : 'check',
                                    size: 13
                                }}
                                onClick={(e) => toggleTopicState(e)}
                            />
                            <Button
                                text="Delete"
                                type="ghost"
                                semantic="error"
                                reverse="row"
                                size="mini"
                                loading={false}
                                disabled={false}
                                fontSize={13}
                                fontWeight={'medium'}
                                lineHeight={16}
                                className="export-btn blind"
                                icon={{
                                    enable: true,
                                    type: 'feather',
                                    name: 'trash',
                                    size: 12
                                }}
                                onClick={(e) => { }}
                            />
                        </div>

                    </div>

                    <div className="ui-separate-mini">
                        <div className="ui-line bg-pag-50"></div>
                    </div>

                    {
                        topic.description &&
                        <>
                            <div className="details-block">
                                <span className="font-hostgro fs-14 pag-950">Topic Description:</span>
                                <div className="font-hostgro fs-15 pag-500 mrgt">{topic.description}</div>
                            </div>

                            <div className="ui-separate-mini">
                                <div className="ui-line bg-pag-50"></div>
                            </div>
                        </>
                    }

                    <div className="details-block">
                        <div className="row">
                            <div className="col-md-5">
                                <div className="mrgb1">
                                    <span className="font-hostgro fs-14 pag-950 pdr1">Topic ID:</span>
                                    <span className="font-hostgro fs-14 pag-500 ui-upcase pdr">{topic._id || '---'}</span>
                                    <Icon
                                        type="feather"
                                        name={'copy'}
                                        size={13}
                                        clickable={true}
                                        position="relative"
                                        className="copy-icon pab-500"
                                        style={{ top: '1px' }}
                                    />
                                </div>
                                <div className="mrgb0">
                                    <span className="font-hostgro fs-14 pag-950 pdr1">Topic Label:</span>
                                    <span className="font-hostgro fs-14 pag-500 pdr">{helper.capitalizeWord(topic.label || '---')}</span>
                                    <Icon
                                        type="feather"
                                        name={'copy'}
                                        size={13}
                                        clickable={true}
                                        position="relative"
                                        className="copy-icon pab-500"
                                        style={{ top: '1px' }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="mrgb1">
                                    <span className="font-hostgro fs-14 pag-950 pdr1">Fields:</span>
                                    <span className="font-hostgro fs-14 pag-500 ui-upcase pdr">{topic.fields ? topic.fields.length : 0}</span>
                                </div>
                                <div className="mrgb0">
                                    <span className="font-hostgro fs-14 pag-950 pdr1">Questions:</span>
                                    <span className="font-hostgro fs-14 pag-500 pdr">{topic.questions ? topic.questions.length : 0}</span>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mrgb1">
                                    <span className="font-hostgro fs-14 pag-950 pdr1">Career:</span>
                                    <span className="font-hostgro fs-14 pag-500 ui-upcase pdr">{topic.career ? helper.capitalizeWord(topic.career.name || '-NA-') : '-NA-'}</span>
                                </div>
                                <div className="mrgb0">
                                    <span className="font-hostgro fs-14 pag-950 pdr1">Since:</span>
                                    <span className="font-hostgro fs-14 pag-500 pdr">{helper.formatDate(topic.createdAt || '', 'datetime')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ui-separate-mini">
                        <div className="ui-line bg-pag-50"></div>
                    </div>

                    <div className="details-block">
                        <div className="row">

                            <div className="col-3 pdr1">
                                <span className="font-hostgro fs-14 pag-950">Add/Remove Feilds:</span>
                                <div className="mrgt">
                                    <DropDown
                                        options={getFields}
                                        selected={(data: any) => {
                                            
                                        }}
                                        className={`font-manrope dropdown`}
                                        placeholder={'Select'}
                                        size="sm"
                                        disabled={false}
                                        search={{
                                            enable: true,
                                            bgColor: '#fff',
                                            color: '#1E1335'
                                        }}
                                        menu={{
                                            bgColor: '#fff',
                                            itemColor: '#000',
                                            itemLabel: true,
                                            itemLeft: true,
                                            position: 'bottom',
                                            style: { width: '100%' }
                                        }}
                                        control={{
                                            image: false,
                                            label: true,
                                            left: false
                                        }}
                                        defaultValue={0}
                                    />
                                </div>

                            </div>

                            <div className="col pdl1" style={{ borderLeft: '1px solid #e9ebf0' }}>

                                <Badge 
                                    type="info"
                                    size="md"
                                    label="Dubar"
                                    close={true}
                                />

                            </div>

                        </div>
                    </div>

                </>
            }

            <TopicForm
                show={showPanel}
                closeForm={togglePanel}
                topicId={topic._id}
                display="details"
                type="edit-resource"
                title="Edit Topic"
            />

        </>
    )
};

export default TopicDetailsPage;
