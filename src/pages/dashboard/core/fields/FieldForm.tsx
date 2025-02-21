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

interface IFieldForm {
    show: boolean,
    fieldId?: string,
    title: string,
    type: FormActionType,
    display?: UIDisplayType
    closeForm(e: any): void
}

interface IFieldData {
    name: string, label: string, career: string, skills: String[], description: string, error: string

}

const FieldForm = ({ show, fieldId, title, closeForm, type, display = 'table' }: IFieldForm) => {

    const panelRef = useRef<any>();
    const bulkRef = useRef<any>();
    const LIMIT = 25

    const coreContext = useContext<ICoreContext>(CoreContext)
    const resourceContext = useContext<IResourceContext>(ResourceContext)

    const [skills, setSkills] = useState<Array<any>>([])
    const [field, setField] = useState<IFieldData>({ name: '', label: '', career: '', skills: [], description: '', error: '' })
    const [file, setFile] = useState<IFileUpload | null>(null)
    const [step, setStep] = useState<number>(0)
    const [view, setView] = useState<string>(UIView.FORM)
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
                if (fieldId) {
                    getField(fieldId)
                }
            }

            coreContext.getSkills({ limit: LIMIT, page: 1, order: 'desc' })

        }

    }, [show])

    const configTab = (e: any, val: any) => {
        if (e) { e.preventDefault(); }
        storage.keep('field-form-tab', val.toString())
    }

    const getField = (id: string) => {
        coreContext.getField(id);
    }

    const validateForm = (e: any): boolean => {

        if (e) { e.preventDefault() }

        let result: boolean = false;

        if (!field.name) {
            setAlert({ ...alert, show: true, type: 'error', message: 'Field name is required' })
            setError('name')
        }
        else if (!field.label) {
            setAlert({ ...alert, show: true, type: 'error', message: 'Field display name is required' })
            setError('label')
        }
        else if (!field.career) {
            setAlert({ ...alert, show: true, type: 'error', message: 'Field display career is required' })
            setError('label')
        }
        else if (!field.description) {
            setAlert({ ...alert, show: true, type: 'error', message: 'Field description is required' })
            setError('description')
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

    const getSkills = () => {

        let result: Array<any> = [];

        if (coreContext.skills.data.length > 0) {

            result = coreContext.skills.data.map((f) => {
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

    const createField = async (e: any) => {

        if (e) { e.preventDefault(); }

        const validated = validateForm(e);

        if (validated) {

            setLoading(true);

            let payload: any = {};
            Object.assign(payload, field);
            payload.skills = coreContext.items.map((x) => x.id)

            const response = await AxiosService.call({
                type: 'core',
                method: 'POST',
                path: `/fields`,
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
        Object.assign(payload, field);
        payload.skills = coreContext.items.map((x) => x.id)

        if (!helper.isEmpty(payload, 'object')) {

            setLoading(true);

            const response = await AxiosService.call({
                type: 'core',
                method: 'PUT',
                path: `/fields/${coreContext.field._id}`,
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

    const addSkill = (data: any) => {

        let currList = coreContext.items;

        const exist = currList.find((x) => x.id === data.value);

        if (exist) {
            resourceContext.setToast({
                ...resourceContext.toast,
                show: true,
                type: 'error',
                title: 'Skill Exist',
                message: 'Skill already selected!'
            })
            setTimeout(() => {
                resourceContext.setToast({ ...resourceContext.toast, show: false })
            }, 2500)
        }

        if (!exist) {
            currList.push({ name: data.label, id: data.value })
        }

        coreContext.setItems(currList)

    }

    const removeSkill = (id: string) => {

        let currList = coreContext.items;
        currList = currList.filter((x) => x.id !== id)
        console.log(currList)
        coreContext.setItems(currList)

    }

    const closePanel = (e: any) => {

        if (e) { e.preventDefault(); }

        if (panelRef.current) {
            panelRef.current.close(e);
        }

        if (display === 'table' || display === 'list') {
            coreContext.getIndustries({ limit: LIMIT, page: 1, order: 'desc' })
        } else if (display === 'single' || display === 'details') {
            coreContext.getField(coreContext.industry._id);
            // userContext.getPermissions({ limit: 9999, page: 1, order: 'desc' })
        }

        setTimeout(() => {
            setView(UIView.FORM)
            setField({
                ...field,
                name: '',
                label: '',
                career: '',
                skills: [],
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
                                                                placeholder="Ex. Telecommunication"
                                                                isError={error === 'name' ? true : false}
                                                                label={{
                                                                    fontSize: 13,
                                                                    title: "Field Name",
                                                                    required: true
                                                                }}
                                                                onChange={(e) => setField({ ...field, name: e.target.value })}
                                                            />

                                                        </div>

                                                        <div className="form-field mrgt1">

                                                            <div className="row">

                                                                <div className="col-6">

                                                                    <TextInput
                                                                        type="text"
                                                                        showFocus={true}
                                                                        size="sm"
                                                                        autoComplete={false}
                                                                        placeholder="Ex. Telecommunication"
                                                                        isError={error === 'label' ? true : false}
                                                                        label={{
                                                                            fontSize: 13,
                                                                            title: "Display Name",
                                                                            required: true
                                                                        }}
                                                                        onChange={(e) => setField({ ...field, label: e.target.value })}
                                                                    />

                                                                </div>

                                                                <div className="col-6">

                                                                    <div className="form-field">

                                                                        <SelectInput
                                                                            showFocus={true}
                                                                            placeholder={{
                                                                                value: 'Choose',
                                                                                enable: true
                                                                            }}
                                                                            label={{
                                                                                fontSize: 13,
                                                                                title: "career"
                                                                            }}
                                                                            size="sm"
                                                                            isError={error === 'career' ? true : false}
                                                                            options={coreContext.careers.data}
                                                                            onSelect={(e) => { setField({ ...field, career: e.target.value }) }}
                                                                        />

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </div>


                                                        <div className="form-field mrgt1">

                                                            <h4 className="font-golos-medium fs-14 mrgb" onClick={(e) => console.log(field.skills)}>Skills</h4>

                                                            <DropDown
                                                                options={getSkills}
                                                                selected={(data: any) => {
                                                                    addSkill(data)
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

                                                            <div className="mrgt">
                                                                <div className="ui-flexbox wrap">
                                                                    {
                                                                        coreContext.items.map((skill) =>
                                                                            <Fragment key={skill.id}>
                                                                                <Badge
                                                                                    type='info'
                                                                                    size="md"
                                                                                    label={helper.capitalize(skill.name)}
                                                                                    close={true}
                                                                                    style={{ marginBottom: '0.15rem' }}
                                                                                    onClose={(e) => {
                                                                                        removeSkill(skill.id)
                                                                                    }}
                                                                                />
                                                                                <span className="pdr"></span>
                                                                            </Fragment>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className="form-field mrgt1 mrgb1">

                                                            <TextAreaInput
                                                                showFocus={true}
                                                                size="md"
                                                                autoComplete={false}
                                                                placeholder="Type here"
                                                                isError={error === 'description' ? true : false}
                                                                label={{
                                                                    fontSize: 13,
                                                                    title: "Description",
                                                                    required: true
                                                                }}
                                                                rows={2}
                                                                onChange={(e) => setField({ ...field, description: e.target.value })}
                                                            />

                                                        </div>

                                                    </div>

                                                    <div className="form-field d-flex mrgt2">
                                                        <Button
                                                            text="Add New Industry"
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
                                                            onClick={(e) => createField(e)}
                                                        />

                                                    </div>

                                                </form>

                                            </TabPanel>

                                            <TabPanel tabIndex={1}>

                                                <div className="mrgt2">

                                                    <div className="mrgb2">
                                                        <h4 className="font-golos fs-14 mrgb ui-line-height-medium">You can add multiple list of facilities at once. This means adding them in bulk by uploading a CSV file using the instructions below</h4>
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
                                                                                {!file && <h4 className="font-golos-medium fs-13">No file chosen</h4>}
                                                                                {file && <h4 className="font-golos-medium fs-14">{file.name}</h4>}
                                                                                <div className="ui-line-height-small">
                                                                                    <p className="lag-400 fs-13 mrgb">Select a “.csv” file to upload bulk facilities</p>
                                                                                    <a href={'#'} target="_blank" className="font-golos-medium fs-13 mrgb0">Download a sample csv file</a>
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
                                                            <span className="lag-400 fs-12 font-golos-light">File size: </span>
                                                            <span className="lag-400 fs-12 font-golos-light">{file ? file.parsedSize + 'MB' : '0MB'}</span>
                                                        </div>

                                                    </div>

                                                    <div className="mrgt1 ui-flexbox align-center">

                                                        <Button
                                                            text={'Upload Bulk Menu'}
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

                            </>
                        }


                    </>
                }

            </PanelBox>
        </>
    )
};

export default FieldForm;
