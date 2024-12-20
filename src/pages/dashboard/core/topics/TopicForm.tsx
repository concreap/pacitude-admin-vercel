import React, { useEffect, useState, useContext, useRef } from "react"
import GeniusContext from "../../../../context/genius/geniusContext";
import { IAlert, IGeniusContext, IResourceContext } from "../../../../utils/interfaces.util";
import helper from "../../../../utils/helper.util";
import Topic from "../../../../models/Topic.model";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import Button from "../../../../components/partials/buttons/Button";
import AxiosService from "../../../../services/axios.service";
import { FormActionType, UIDisplayType } from "../../../../utils/types.util";
import ResourceContext from "../../../../context/resource/resourceContext";
import PanelBox from "../../../../components/layouts/PanelBox";
import TextInput from "../../../../components/partials/inputs/TextInput";
import TextAreaInput from "../../../../components/partials/inputs/TextAreaInput";
import Alert from "../../../../components/partials/alerts/Alert";
import { TabList, TabPanel, Tabs, Tab } from 'react-tabs'
import storage from "../../../../utils/storage.util";
import DropDown from "../../../../components/layouts/DropDown";

interface ITopicForm {
    show: boolean,
    topicId?: string,
    title: string,
    type: FormActionType,
    display?: UIDisplayType
    closeForm(e: any): void
}

const TopicForm = ({ show, topicId, title, closeForm, type, display = 'table' }: ITopicForm) => {

    const panelRef = useRef<any>();

    const geniusContext = useContext<IGeniusContext>(GeniusContext)
    const resourceContext = useContext<IResourceContext>(ResourceContext)

    const [topic, setTopic] = useState({ name: '', label: '', description: '', isEnabled: true, fieldId: '' })
    const [updated, setUpdated] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('');
    const [alert, setAlert] = useState<IAlert>({
        type: 'success',
        show: false,
        message: ''
    });

    useEffect(() => {

        if (show) {

            panelRef.current.open(null);

            if (type === 'edit-resource' && display === 'table' || display === 'list') {
                if (topicId) {
                    getTopic(topicId)
                }
            }

            if (type === 'add-resource') {
                geniusContext.getFields({ limit: 9999, page: 1, order: 'desc' })
            }

        }

    }, [show])

    useEffect(() => {
        setTopic(geniusContext.topic)
    }, [geniusContext.topic])

    const getFields = () => {

        let result: Array<any> = [];

        if (geniusContext.fields.data.length > 0) {

            result = geniusContext.fields.data.map((f) => {
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

    const clearTopic = () => {
        setTopic({} as any)
    }

    const configTab = (e: any, val: any) => {
        if (e) { e.preventDefault(); }
        storage.keep('add-topic-tab', val.toString())
    }

    const getTopic = (id: string) => {
        geniusContext.getTopic(id);
    }

    const updateTopic = async (e: any) => {

        if (e) { e.preventDefault(); }

        // close panel
        if (helper.isEmpty(updated, 'object') || helper.isEmpty(geniusContext.topic, 'object')) {
            if (panelRef.current) {
                panelRef.current.close(e)
            }
            return;
        }

        setLoading(true);

        const response = await AxiosService.call({
            type: 'genius',
            method: 'PUT',
            path: `/topics/${geniusContext.topic._id}`,
            isAuth: true,
            payload: updated
        });

        if (response.error === false && response.status === 200) {

            setLoading(false);

            if (panelRef.current) {
                panelRef.current.close(e)
            }

            if (display === 'table' || display === 'list') {
                geniusContext.getTopics({ limit: 35, page: 1, order: 'desc' })
            } else if (display === 'single' || display === 'details') {
                getTopic(geniusContext.topic._id);
            }

            setTimeout(() => {
                resourceContext.setToast({
                    ...resourceContext.toast,
                    show: true,
                    message: `Topic updated successfully`
                })
            }, 50)

            setTimeout(() => {
                resourceContext.setToast({
                    ...resourceContext.toast,
                    show: false,
                })
                setUpdated({})
                clearTopic()
            }, 1000)
        }

        if (response.error === true) {

            setLoading(false)

            if (response.errors.length > 0) {
                setAlert({ ...alert, type: 'error', show: true, message: response.errors.join(',') });
            } else {
                setAlert({ ...alert, type: 'error', show: true, message: response.message });
            }

            setTimeout(() => {
                setAlert({ ...alert, show: false });
                setUpdated({})
            }, 2000)

        }




    }

    const createTopic = async (e: any) => {

        if (e) { e.preventDefault(); }

        setLoading(true);

        const response = await AxiosService.call({
            type: 'genius',
            method: 'POST',
            path: `/topics`,
            isAuth: true,
            payload: topic
        });

        if (response.error === false && response.status === 200) {

            setLoading(false);

            if (panelRef.current) {
                panelRef.current.close(e)
            }

            if (display === 'table' || display === 'list') {
                geniusContext.getTopics({ limit: 35, page: 1, order: 'desc' })
            } else if (display === 'single' || display === 'details') {
                getTopic(geniusContext.topic._id);
            }

            setTimeout(() => {
                resourceContext.setToast({
                    ...resourceContext.toast,
                    show: true,
                    message: `Topic added successfully`
                })
            }, 50)

            setTimeout(() => {
                resourceContext.setToast({
                    ...resourceContext.toast,
                    show: false,
                })
                setUpdated({})
                clearTopic()
            }, 1000)
        }

        if (response.error === true) {

            setLoading(false)

            if (response.errors.length > 0) {
                setAlert({ ...alert, type: 'error', show: true, message: response.errors.join(',') });
            } else {
                setAlert({ ...alert, type: 'error', show: true, message: response.message });
            }

            setTimeout(() => {
                setAlert({ ...alert, show: false });
                setUpdated({})
            }, 2000)

        }




    }

    return (
        <>


            <PanelBox
                ref={panelRef}
                title={title}
                animate={true}
                onClose={closeForm}
            >

                {
                    geniusContext.loading &&
                    <>
                        <EmptyState bgColor='#f7f9ff' size='md' bound={true} >
                            <span className="loader lg primary"></span>
                        </EmptyState>
                    </>
                }

                {
                    !geniusContext.loading &&
                    <>

                        {
                            type === 'edit-resource' &&
                            <>
                                <Alert className="mrgb1" type={alert.type} show={alert.show} message={alert.message} />

                                <form className="form" onSubmit={(e) => e.preventDefault()}>

                                    <div className="form-field mrgb">
                                        <TextInput
                                            type="email"
                                            showFocus={true}
                                            size="sm"
                                            defaultValue={geniusContext.topic.name}
                                            autoComplete={false}
                                            placeholder="Ex. Sample Topic"
                                            isError={error === 'name' ? true : false}
                                            label={{
                                                required: false,
                                                fontSize: 13,
                                                title: "Topic name"
                                            }}
                                            onChange={(e) => { setUpdated({ ...updated, name: e.target.value }) }}
                                        />
                                    </div>

                                    <div className="form-field mrgb">
                                        <TextInput
                                            type="email"
                                            showFocus={true}
                                            size="sm"
                                            defaultValue={geniusContext.topic.label}
                                            autoComplete={false}
                                            placeholder="Ex. Sample Label"
                                            isError={error === 'name' ? true : false}
                                            label={{
                                                required: false,
                                                fontSize: 13,
                                                title: "Topic label"
                                            }}
                                            onChange={(e) => { setUpdated({ ...updated, label: e.target.value }) }}
                                        />
                                    </div>

                                    <div className="form-field mrgb1">
                                        <TextAreaInput
                                            showFocus={true}
                                            autoComplete={false}
                                            defaultValue={geniusContext.topic.description}
                                            placeholder="Type here"
                                            label={{
                                                required: false,
                                                fontSize: 13,
                                                title: "Topic description"
                                            }}
                                            onChange={(e) => { setUpdated({ ...updated, description: e.target.value }) }}
                                        />
                                    </div>

                                    <div className="form-field ui-flexbox align-center mrgt1">

                                        <Button
                                            text={'Save Changes'}
                                            type="primary"
                                            reverse="row"
                                            size="sm"
                                            loading={loading}
                                            disabled={false}
                                            fontSize={13}
                                            lineHeight={16}
                                            className="ui-ml-auto"
                                            icon={{ enable: false }}
                                            style={{ minWidth: '122px' }}
                                            onClick={(e) => updateTopic(e)}

                                        />

                                    </div>

                                </form>
                            </>
                        }

                        {
                            type === 'add-resource' &&
                            <>
                                <Tabs defaultIndex={parseInt(storage.fetch('add-topic-tab'))}>

                                    <TabList>
                                        <Tab onClick={(e: any) => { configTab(e, 0); }}>Enter Details</Tab>
                                        <Tab onClick={(e: any) => { configTab(e, 1); }}>Upload Bulk</Tab>
                                    </TabList>

                                    <TabPanel tabIndex={0}>

                                        <form className="form" onSubmit={(e) => e.preventDefault()}>

                                            <div className="form-field">
                                                <div className="row">

                                                    <div className={`col-6 ${geniusContext.fields.loading ? 'disabled-light' : ''}`}>
                                                        <label className={`mrgb0`}>
                                                            <span className={`fs-13 font-manrope-medium color-black`}>Select Field</span>
                                                            <span className="color-red font-manrope-bold ui-relative fs-16" style={{ top: '4px', left: '1px' }}>*</span>
                                                        </label>
                                                        <DropDown
                                                            options={getFields}
                                                            selected={(data: any) => {
                                                                setTopic({ ...topic, fieldId: data.value })
                                                            }}
                                                            className={`font-manrope dropdown topic-field-dropdown`}
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
                                                                style: { width: '160%' }
                                                            }}
                                                            control={{
                                                                image: false,
                                                                label: true,
                                                                left: false
                                                            }}
                                                            defaultValue={0}
                                                        />
                                                    </div>

                                                    <div className="col-6">
                                                        <TextInput
                                                            type="email"
                                                            showFocus={true}
                                                            size="sm"
                                                            autoComplete={false}
                                                            placeholder="Ex. Sample Topic"
                                                            isError={error === 'name' ? true : false}
                                                            label={{
                                                                required: true,
                                                                fontSize: 13,
                                                                title: "Topic name"
                                                            }}
                                                            onChange={(e) => setTopic({ ...topic, name: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-field mrgb">
                                                <TextInput
                                                    type="email"
                                                    showFocus={true}
                                                    size="sm"
                                                    autoComplete={false}
                                                    placeholder="Ex. Sample Label"
                                                    isError={error === 'name' ? true : false}
                                                    label={{
                                                        required: false,
                                                        fontSize: 13,
                                                        title: "Topic label"
                                                    }}
                                                    onChange={(e) => setTopic({ ...topic, label: e.target.value })}
                                                />
                                            </div>

                                            <div className="form-field mrgb1">
                                                <TextAreaInput
                                                    showFocus={true}
                                                    autoComplete={false}
                                                    placeholder="Type here"
                                                    label={{
                                                        required: false,
                                                        fontSize: 13,
                                                        title: "Topic description"
                                                    }}
                                                    onChange={(e) => setTopic({ ...topic, description: e.target.value })}
                                                />
                                            </div>

                                            <div className="form-field ui-flexbox align-center mrgt1">

                                                <Button
                                                    text={'Create Topic'}
                                                    type="primary"
                                                    reverse="row"
                                                    size="sm"
                                                    loading={loading}
                                                    disabled={false}
                                                    fontSize={13}
                                                    lineHeight={16}
                                                    className="ui-ml-auto"
                                                    icon={{ enable: false }}
                                                    style={{ minWidth: '122px' }}
                                                    onClick={(e) => createTopic(e)}

                                                />

                                            </div>

                                        </form>

                                    </TabPanel>

                                    <TabPanel tabIndex={1}>

                                        <div className="drag-zone">
                                            
                                        </div>

                                    </TabPanel>

                                </Tabs>
                            </>
                        }

                    </>
                }


            </PanelBox>

        </>
    )
};

export default TopicForm;
