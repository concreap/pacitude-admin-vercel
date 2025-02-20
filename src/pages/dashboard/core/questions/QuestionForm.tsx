import React, { useEffect, useState, useContext, useRef } from "react"
import GeniusContext from "../../../../context/genius/geniusContext";
import { IAlert, ICoreContext, IFileUpload, IGeniusContext, IResourceContext } from "../../../../utils/interfaces.util";
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
import Icon from "../../../../components/partials/icons/Icon";
import { Link } from "react-router-dom";
import Fileog from "../../../../components/partials/dialogs/Fileog";
import RoundButton from "../../../../components/partials/buttons/RoundButton";
import { FileLinks } from "../../../../utils/enums.util";
import CoreContext from "../../../../context/core/coreContext";

interface IQuestionForm {
    show: boolean,
    questionId?: string,
    title: string,
    type: FormActionType,
    display?: UIDisplayType
    closeForm(e: any): void
}

const QuestionForm = ({ show, questionId, title, closeForm, type, display = 'table' }: IQuestionForm) => {

    const panelRef = useRef<any>();
    const bulkRef = useRef<any>();

    const coreContext = useContext<ICoreContext>(CoreContext)
    const resourceContext = useContext<IResourceContext>(ResourceContext)

    const [topic, setTopic] = useState({ name: '', label: '', description: '', isEnabled: true, fieldId: '' })
    const [step, setStep] = useState<number>(0)
    const [updated, setUpdated] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)
    const [file, setFile] = useState<IFileUpload | null>(null)
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
                // if (topicId) {
                //     getTopic(topicId)
                // }
            }

            if (type === 'add-resource') {
                coreContext.getFields({ limit: 9999, page: 1, order: 'desc' })
            }

        }

    }, [show])

    useEffect(() => {
        setTopic(coreContext.topic)
    }, [coreContext.topic])

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

    const clearTopic = () => {
        setTopic({} as any)
        setFile(null)
    }

    const configTab = (e: any, val: any) => {
        if (e) { e.preventDefault(); }
        storage.keep('add-topic-tab', val.toString())
    }

    const getTopic = (id: string) => {
        coreContext.getTopic(id);
    }

    const updateTopic = async (e: any) => {

        if (e) { e.preventDefault(); }

        // close panel
        if (helper.isEmpty(updated, 'object') || helper.isEmpty(coreContext.topic, 'object')) {
            if (panelRef.current) {
                panelRef.current.close(e)
            }
            return;
        }

        setLoading(true);

        const response = await AxiosService.call({
            type: 'core',
            method: 'PUT',
            path: `/topics/${coreContext.topic._id}`,
            isAuth: true,
            payload: updated
        });

        if (response.error === false && response.status === 200) {

            setLoading(false);

            if (panelRef.current) {
                panelRef.current.close(e)
            }

            if (display === 'table' || display === 'list') {
                coreContext.getTopics({ limit: 35, page: 1, order: 'desc' })
            } else if (display === 'single' || display === 'details') {
                getTopic(coreContext.topic._id);
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
            type: 'core',
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
                coreContext.getTopics({ limit: 35, page: 1, order: 'desc' })
            } else if (display === 'single' || display === 'details') {
                getTopic(coreContext.topic._id);
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

    const uploadTopics = async (e: any) => {

        if (e) { e.preventDefault(); }

        const formData = new FormData();
        formData.append('file', file!.raw);

        setLoading(true);

        const response = await AxiosService.call({
            type: 'core',
            method: 'POST',
            path: `/topics/bulk`,
            isAuth: true,
            payload: formData
        });

        if (response.error === false && response.status === 200) {

            setLoading(false);

            if (display === 'table' || display === 'list') {
                coreContext.getTopics({ limit: 35, page: 1, order: 'desc' })
            } else if (display === 'single' || display === 'details') {
                getTopic(coreContext.topic._id);
            }

            setTimeout(() => {
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
                                            defaultValue={coreContext.topic.name}
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
                                            defaultValue={coreContext.topic.label}
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
                                            defaultValue={coreContext.topic.description}
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
                                        <Tab onClick={(e: any) => { configTab(e, 0); }}>Details</Tab>
                                        <Tab onClick={(e: any) => { configTab(e, 1); }}>Upload Bulk</Tab>
                                    </TabList>

                                    <TabPanel tabIndex={0}>

                                        <Alert className="mrgb1" type={alert.type} show={alert.show} message={alert.message} />

                                        

                                    </TabPanel>

                                    <TabPanel tabIndex={1}>

                                        <div className="mrgb2 mrgt1">
                                            <p className="pag-700 mrgb0 font-hostgro fs-14">You can add multiple Questions at once. This means adding them in bulk by uploading a CSV file using the instructions below</p>
                                        </div>

                                        <Alert className="mrgb1" type={alert.type} show={alert.show} message={alert.message} />

                                        <div className="drag-zone">

                                            <Fileog
                                                ref={bulkRef}
                                                type="csv"
                                                accept={['.csv', '.xls']}
                                                sizeLimit={8}
                                                onSelect={(file) => {
                                                    setFile(file);
                                                }}
                                            />

                                            <div className={`zone ${loading || step === 1 ? 'flex-justify-center' : ''}`}>

                                                {
                                                    loading &&
                                                    <>
                                                        <span className="loader md primary"></span>
                                                        <span className="pag-600 pdl1 fs-13">Uploading file</span>
                                                    </>
                                                }

                                                {
                                                    !loading &&
                                                    <>

                                                        {
                                                            step === 0 &&
                                                            <>

                                                                <RoundButton
                                                                    size="rg"
                                                                    icon={<Icon type="feather" name="edit-2" style={{ color: '#fff' }} clickable={false} size={14} />}
                                                                    className="bg-pab-500 ui-absolute"
                                                                    clickable={true}
                                                                    style={{ top: '1rem', right: '1rem' }}
                                                                    onClick={(e) => { bulkRef.current.open(e) }}
                                                                />

                                                                <div className="zone-file">
                                                                    <Icon
                                                                        type="polio"
                                                                        name="doc-search"
                                                                        clickable={false}
                                                                        position="relative"
                                                                        size={20}
                                                                    />
                                                                </div>

                                                                <div className="zone-content pdl1 ui-line-height-mini">
                                                                    {!file && <h4 className="font-hostgro-medium fs-14">No file chosen</h4>}
                                                                    {file && <h4 className="font-hostgro-medium fs-14">{file.name}</h4>}
                                                                    <div className="ui-line-height-small">
                                                                        <p className="pag-400 fs-13 mrgb0">Select a ".csv" file to upload bulk topics</p>
                                                                        <a href={FileLinks.TOPIC_CSV} target="_blank" className="pab-600 fs-13 mrgb0">Download a sample csv file</a>
                                                                    </div>
                                                                </div>

                                                            </>
                                                        }

                                                        {
                                                            step === 1 &&
                                                            <>
                                                                <RoundButton
                                                                    size="lg"
                                                                    icon={<Icon type="feather" name="check" style={{ color: '#fff' }} clickable={false} size={18} />}
                                                                    className="bg-color-green"
                                                                    clickable={false}
                                                                    onClick={(e) => { }}
                                                                />
                                                            </>
                                                        }
                                                    </>
                                                }

                                            </div>

                                            <div className="ui-text-center ui-line-height-small">
                                                <span className="pag-400 fs-11">File size: </span>
                                                <span className="pag-400 fs-11">{file ? file.parsedSize + 'MB' : '0MB'}</span>
                                            </div>

                                        </div>

                                        <div className="mrgt1 ui-flexbox align-center">

                                            <Button
                                                text={'Upload Questions'}
                                                type="primary"
                                                reverse="row"
                                                size="sm"
                                                loading={false}
                                                disabled={(loading || !file) ? true : false}
                                                fontSize={13}
                                                lineHeight={16}
                                                className="ui-ml-auto"
                                                icon={{ enable: false }}
                                                style={{ minWidth: '122px' }}
                                                onClick={(e) => () => {}}

                                            />

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

export default QuestionForm;
