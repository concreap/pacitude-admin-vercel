import { useEffect, useState, useContext, useRef, ChangeEvent, Fragment } from "react"
import PanelBox from "../../../../components/layouts/PanelBox";
import { FormActionType, UIDisplayType } from "../../../../utils/types.util";
import { IAlert, ICoreContext, IFileUpload, IResourceContext, IUserContext } from "../../../../utils/interfaces.util";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import Alert from "../../../../components/partials/alerts/Alert";
import TextInput from "../../../../components/partials/inputs/TextInput";
import helper from "../../../../utils/helper.util";
import Button from "../../../../components/partials/buttons/Button";
import AxiosService from "../../../../services/axios.service";
import { UIView } from "../../../../utils/enums.util";
import MessageComp from "../../../../components/partials/dialogs/Message";
import UserContext from "../../../../context/user/userContext";
import PhoneInput from "../../../../components/partials/inputs/PhoneInput";
import CoreContext from "../../../../context/core/coreContext";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import storage from "../../../../utils/storage.util";
import SelectInput from "../../../../components/partials/inputs/SelectInput";
import TextAreaInput from "../../../../components/partials/inputs/TextAreaInput";
import Fileog from "../../../../components/partials/dialogs/Fileog";
import RoundButton from "../../../../components/partials/buttons/RoundButton";
import Icon from "../../../../components/partials/icons/Icon";
import DropDown from "../../../../components/layouts/DropDown";
import Badge from "../../../../components/partials/badges/Badge";
import ResourceContext from "../../../../context/resource/resourceContext";

interface ICareerForm {
    show: boolean,
    careerId?: string,
    title: string,
    type: FormActionType,
    display?: UIDisplayType
    closeForm(e: any): void
}

interface ICareerData {
    name: string, label: string, description: string, error: string
}

const CareerForm = ({ show, careerId, title, closeForm, type, display = 'table' }: ICareerForm) => {

    const panelRef = useRef<any>();
    const bulkRef = useRef<any>();
    const LIMIT = 25

    const coreContext = useContext<ICoreContext>(CoreContext)
    const resourceContext = useContext<IResourceContext>(ResourceContext)

    const [career, setCareer] = useState<ICareerData>({ name: '', label: '', description: '', error: '' })
    const [file, setFile] = useState<IFileUpload | null>(null)
    const [step, setStep] = useState<number>(0)
    const [view, setView] = useState<string>(UIView.FORM)
    const [loading, setLoading] = useState<boolean>(false)
    const [careerSynonyms, setCareerSynonyms] = useState<string>('');
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
                if (careerId) {
                    getCareer(careerId)
                }
            }

            coreContext.getSkills({ limit: LIMIT, page: 1, order: 'desc' })
            coreContext.getCareers({ limit: LIMIT, page: 1, order: 'desc' })

        }

    }, [show])


    const addSynonyms = (data: any) => {

        let result = []
        const splitText = data.split(',')
        result.push(splitText)
        return result
        // coreContext.setItems(result)

    }

    const configTab = (e: any, val: any) => {
        if (e) { e.preventDefault(); }
        storage.keep('field-form-tab', val.toString())
    }

    const getCareer = (id: string) => {
        coreContext.getCareer(id);
    }

    const validateForm = (e: any): boolean => {

        if (e) { e.preventDefault() }

        let result: boolean = false;

        if (!career.name) {
            setAlert({ ...alert, show: true, type: 'error', message: 'Career name is required' })
            setError('name')
        }
        else if (!career.label) {
            setAlert({ ...alert, show: true, type: 'error', message: 'Career display name is required' })
            setError('label')
        }

        else {
            result = true;
        }

        setTimeout(() => {
            setAlert({ ...alert, show: false })
            setError('')
        }, 2000)

        return result;

    }

    const createCareer = async (e: any) => {

        if (e) { e.preventDefault(); }

        const validated = validateForm(e);

        if (validated) {

            const synonymText = addSynonyms(careerSynonyms)

            let payload: any = {};
            Object.assign(payload, career);
            payload.synonyms = synonymText

            setLoading(true);

            const response = await AxiosService.call({
                type: 'default',
                method: 'POST',
                path: `/careers`,
                isAuth: true,
                payload: payload
            });

            if (response.error === false && response.status === 200) {

                setLoading(false);
                setView(UIView.MESSAGE)
                coreContext.setItems([])

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
                }, 2000)

            }

        }

    }

    const updateField = async (e: any) => {

        if (e) { e.preventDefault(); }

        let payload: any = {};
        Object.assign(payload, career);
        payload.skills = coreContext.items.map((x) => x.id)

        if (!helper.isEmpty(payload, 'object')) {

            setLoading(true);

            const response = await AxiosService.call({
                type: 'default',
                method: 'PUT',
                path: `/careers/${coreContext.career._id}`,
                isAuth: true,
                payload: payload
            });

            if (response.error === false && response.status === 200) {

                setLoading(false);
                setView(UIView.MESSAGE)

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
                }, 2000)

            }

        }


    }

    const closePanel = (e: any) => {

        if (e) { e.preventDefault(); }

        if (panelRef.current) {
            panelRef.current.close(e);
        }

        if (display === 'table' || display === 'list') {
            coreContext.getCareers({ limit: LIMIT, page: 1, order: 'desc' })
        } else if (display === 'single' || display === 'details') {
            coreContext.getCareer(coreContext.career._id);
            // userContext.getPermissions({ limit: 9999, page: 1, order: 'desc' })
        }

        setTimeout(() => {
            setView(UIView.FORM)
            setCareer({
                ...career,
                name: '',
                label: '',
                description: '',
                error: ''
            })
        }, 500)

    }


    return (
        <>
            <PanelBox
                ref={panelRef}
                title={title}
                animate={true}
                onClose={closeForm}
                width={490}
            >

                {
                    coreContext.loading &&
                    <>
                        <EmptyState className='bg-las-50' size='md' bound={true} >
                            <span className="loader lg primary"></span>
                        </EmptyState>
                    </>
                }

                {
                    !coreContext.loading &&
                    <>

                        {
                            type === 'add-resource' &&
                            <>

                                {
                                    view === UIView.FORM &&
                                    <>

                                        <Tabs defaultIndex={parseInt(storage.fetch('industry-form-tab'))}>

                                            <TabList>
                                                <Tab onClick={(e: any) => { configTab(e, 0); }}>Details</Tab>
                                                <Tab onClick={(e: any) => { configTab(e, 1); }}>Bulk upload</Tab>
                                            </TabList>

                                            <TabPanel tabIndex={0}>

                                                <Alert className="mrgb1" type={alert.type} show={alert.show} message={alert.message} />

                                                <form className="form mrgt2" onSubmit={(e) => e.preventDefault()}>

                                                    <div className="industry-details">

                                                        <div className="form-field mrgt1">

                                                            <TextInput
                                                                type="text"
                                                                showFocus={true}
                                                                size="sm"
                                                                autoComplete={false}
                                                                placeholder="Ex. Doctor"
                                                                isError={error === 'name' ? true : false}
                                                                label={{
                                                                    fontSize: 13,
                                                                    title: "Career Name",
                                                                    required: true
                                                                }}
                                                                onChange={(e) => setCareer({ ...career, name: e.target.value })}
                                                            />

                                                        </div>

                                                        <div className="form-field mrgt1">

                                                            <TextInput
                                                                type="text"
                                                                showFocus={true}
                                                                size="sm"
                                                                autoComplete={false}
                                                                placeholder="Ex. Doctor"
                                                                isError={error === 'label' ? true : false}
                                                                label={{
                                                                    fontSize: 13,
                                                                    title: "Display Name",
                                                                    required: true
                                                                }}
                                                                onChange={(e) => setCareer({ ...career, label: e.target.value })}
                                                            />

                                                        </div>

                                                        <div className="form-field mrgt1">

                                                            <TextInput
                                                                type="text"
                                                                showFocus={true}
                                                                size="sm"
                                                                autoComplete={false}
                                                                placeholder="Ex. Product management, Financial analyst"
                                                                isError={error === 'synonyms' ? true : false}
                                                                label={{
                                                                    fontSize: 13,
                                                                    title: "Synonymns",
                                                                    required: true
                                                                }}
                                                                onChange={(e) => setCareerSynonyms(e.target.value)}
                                                            />

                                                        </div>

                                                    </div>

                                                    <div className="form-field d-flex mrgt2">
                                                        <Button
                                                            text="Add New Career"
                                                            type="primary"
                                                            size="rg"
                                                            loading={loading}
                                                            disabled={false}
                                                            block={false}
                                                            fontSize={14}
                                                            fontWeight={'medium'}
                                                            lineHeight={16}
                                                            className="form-button ui-ml-auto"
                                                            icon={{
                                                                enable: false
                                                            }}
                                                            onClick={(e) => createCareer(e)}
                                                        />

                                                    </div>

                                                </form>

                                            </TabPanel>

                                            <TabPanel tabIndex={1}>

                                                <div className="mrgt2">

                                                    <div className="mrgb2">
                                                        <h4 className="font-hostgro fs-14 mrgb ui-line-height-medium">You can add multiple list of facilities at once. This means adding them in bulk by uploading a CSV file using the instructions below</h4>
                                                    </div>

                                                    <Alert className="mrgb1" type={alert.type} show={alert.show} message={alert.message} />

                                                    <div className="drag-zone md">

                                                        <Fileog
                                                            ref={bulkRef}
                                                            type="image"
                                                            accept={['.csv', '.xls']}
                                                            sizeLimit={8}
                                                            onSelect={(file) => {
                                                                setFile(file);
                                                            }}
                                                        />

                                                        <div className={`zone md ${loading || step === 1 ? 'flex-justify-center' : ''}`}>

                                                            {
                                                                loading &&
                                                                <>
                                                                    <span className="loader md primary"></span>
                                                                    <span className="lag-600 pdl1 fs-13">Uploading file...</span>
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
                                                                                icon={<Icon type="polio" name="edit" style={{ color: '#fff' }} clickable={false} size={18} />}
                                                                                className="bg-las-600 ui-absolute"
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
                                                                                    size={22}
                                                                                />
                                                                            </div>

                                                                            <div className="zone-content pdl1 ui-line-height-mini">
                                                                                {!file && <h4 className="font-hostgro-medium fs-13">No file chosen</h4>}
                                                                                {file && <h4 className="font-hostgro-medium fs-14">{file.name}</h4>}
                                                                                <div className="ui-line-height-small">
                                                                                    <p className="lag-400 fs-13 mrgb">Select a “.csv” file to upload bulk facilities</p>
                                                                                    <a href={'#'} target="_blank" className="font-hostgro-medium fs-13 mrgb0">Download a sample csv file</a>
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

                                                        <div className="ui-text-center ui-line-height-small mrgt">
                                                            <span className="lag-400 fs-12 font-hostgro-light">File size: </span>
                                                            <span className="lag-400 fs-12 font-hostgro-light">{file ? file.parsedSize + 'MB' : '0MB'}</span>
                                                        </div>

                                                    </div>

                                                    <div className="mrgt1 ui-flexbox align-center">

                                                        <Button
                                                            text={'Upload Careers'}
                                                            type="primary"
                                                            reverse="row"
                                                            size="rg"
                                                            loading={loading}
                                                            disabled={(loading || !file) ? true : false}
                                                            fontSize={13}
                                                            lineHeight={16}
                                                            className="ui-ml-auto"
                                                            icon={{ enable: false }}
                                                            style={{ minWidth: '189px' }}
                                                            onClick={(e) => { }}
                                                        />

                                                    </div>

                                                </div>

                                            </TabPanel>

                                        </Tabs>

                                    </>
                                }


                                {
                                    view === UIView.MESSAGE &&
                                    <>
                                        <MessageComp
                                            title={'Successful!'}
                                            displayTitle={true}
                                            icon='shield'
                                            message={'You have successfully added a field on Pacitude'}
                                            action={(e: any) => closePanel(e)}
                                            status="success"
                                            actionType={'action'}
                                            buttonText={'Continue'}
                                            setBg={true}
                                            bgColor={'#F6EEEA'}
                                            buttonPosition={'inside'}
                                            slim={false}
                                            messageWidth='10'
                                            className="pdt3 pdb3"
                                        />
                                    </>
                                }

                            </>
                        }



                    </>
                }

            </PanelBox>
        </>
    )
};

export default CareerForm;
