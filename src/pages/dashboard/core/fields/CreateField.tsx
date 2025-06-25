import { useEffect } from "react"
import Divider from "../../../../components/partials/Divider";
import CardUI from "../../../../components/partials/ui/CardUI";
import useField from "../../../../hooks/app/useField";
import useQuestion from "../../../../hooks/app/useQuestion";
import helper from "../../../../utils/helper.util";
import Filter from "../../../../components/partials/drops/Filter";
import FormField from "../../../../components/partials/inputs/FormField";
import Badge from "../../../../components/partials/badges/Badge";
import useApp from "../../../../hooks/app/useApp";
import TextAreaInput from "../../../../components/partials/inputs/TextAreaInput";
import TextInput from "../../../../components/partials/inputs/TextInput";
import { statusOptions } from "../../../../_data/seed";
import Career from "../../../../models/Career.model";
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import useToast from "../../../../hooks/useToast";
import useGoTo from "../../../../hooks/useGoTo";

const CreateField = () => {

    const { toast, setToast } = useToast()
    const { core, getCoreResources } = useApp()
    const { question } = useQuestion()
    const { loading, skillRef, statusRef, career, fieldData, handleChange, setCareer, createField } = useField()
    const {goTo} = useGoTo()

    useEffect(() => {
        initList(25)
    }, [])

    const initList = (limit: number) => {
        getCoreResources({ limit: 9999, page: 1, order: 'desc' })
    }

    const validateField = () => {

        let isValid: boolean = true;

        if (!fieldData.name) {
            setToast({ ...toast, show: true, error: 'field', type: 'error', message: 'Field name is required' })
            isValid = false;

        } else if (!fieldData.label) {
            setToast({ ...toast, show: true, error: 'field', type: 'error', message: 'Field display name is required' })
            isValid = false;
        }
        else if (!fieldData.careerId) {
            setToast({ ...toast, show: true, error: 'field', type: 'error', message: 'Career is required' })
            isValid = false;
        }
        else if (fieldData.description.length < 10) {
            setToast({ ...toast, show: true, error: 'field', type: 'error', message: 'Description must be at least 10 characters long' })
            isValid = false;
        }

        setTimeout(() => {
            setToast({ ...toast, show: false })
        }, 3000)

        return isValid

    }

    return (
        <>

            <CardUI>

                <form onSubmit={(e) => { e.preventDefault() }} className="w-[65%] mx-auto my-5">

                    <div className="w-full space-y-[0.55rem]">
                        <div className="w-full">

                            <div className="w-[40%] mb-4">
                                <TextInput
                                    type="text"
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Field name"
                                    defaultValue={''}
                                    label={{
                                        title: 'Field Name',
                                        required: true,
                                        className: 'text-[13px]'
                                    }}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                />
                            </div>

                            <Divider />

                            <div className="w-[40%] mb-4">
                                <TextInput
                                    type="text"
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Display name"
                                    defaultValue={''}
                                    label={{
                                        title: 'Display Name',
                                        required: true,
                                        className: 'text-[13px]'
                                    }}
                                    onChange={(e) => handleChange('label', e.target.value)}
                                />
                            </div>

                        </div>

                    </div>

                    <Divider />

                    <div className="w-full space-y-[0.55rem] mb-4">

                        <div className="flex items-center">
                            <h3 className="font-mona text-[13px] flex items-center">
                                <span>Career</span>
                                <span className="text-red-600 text-base relative top-1 pl-1">*</span>
                            </h3>
                        </div>

                        <div className="w-full flex items-start gap-x-[1rem]">

                            <div className="min-w-[40%]">
                                <Filter
                                    ref={skillRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder="Select Career"
                                    position="bottom"
                                    menu={{
                                        style: { minWidth: '290px' },
                                        search: true,
                                        fullWidth: false,
                                        limitHeight: 'md'
                                    }}
                                    items={
                                        core.careers.map((x: Career) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        })
                                    }
                                    noFilter={false}
                                    onChange={(data) => {
                                        handleChange('careerId', data.value)
                                        setCareer({ _id: data.value, name: data.label })
                                    }}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">

                                {
                                    career && career.name !== '' &&
                                    <Badge
                                        key={career._id}
                                        type={'default'}
                                        size="xsm"
                                        close={true}
                                        label={helper.capitalize(career.name)}
                                        upper={true}

                                    />
                                }

                            </FormField>

                        </div>

                    </div>

                    <Divider />

                    <div className="w-full space-y-[0.55rem] mb-4">

                        <div className="flex items-center">
                            <h3 className="font-mona text-[13px] flex items-center">
                                <span>Status</span>
                                <span className="text-red-600 text-base relative top-1 pl-1">*</span>
                            </h3>
                        </div>

                        <div className="w-full flex items-start gap-x-[1rem]">

                            <div className="min-w-[40%]">
                                <Filter
                                    ref={statusRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder="Select Status"
                                    position="bottom"
                                    menu={{
                                        style: { minWidth: '290px' },
                                        search: true,
                                        fullWidth: false,
                                        limitHeight: 'md'
                                    }}
                                    items={
                                        statusOptions.map((x) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x.value
                                            }
                                        })
                                    }
                                    noFilter={false}
                                    onChange={(data) => handleChange('isEnabled', data.value === 'enable')}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">

                                <Badge
                                    type={fieldData.isEnabled === true ? 'success' : 'error'}
                                    size="xsm"
                                    close={false}
                                    label={`${helper.capitalize(fieldData.isEnabled ? 'Enabled' : 'Disabled')}`}
                                    upper={true}
                                />

                            </FormField>

                        </div>

                    </div>

                    <Divider />

                    <div className="w-full flex items-start gap-x-[1rem] ">

                        <div className="w-[40%] mb-4">
                            <FormField className="w-full">
                                <TextAreaInput
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Type here"
                                    defaultValue={question.body}
                                    label={{
                                        title: 'Description',
                                        className: 'text-[13px]',
                                        required: true
                                    }}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                />
                            </FormField>
                        </div>

                    </div>

                </form>

            </CardUI>

            <div className="flex justify-end items-center gap-x-[0.65rem] mt-10">
                <Button
                    type="ghost"
                    semantic={'default'}
                    size="sm"
                    className="form-button"
                    text={{
                        label: "Cancel",
                        size: 13,
                    }}
                    icon={{
                        enable: true,
                        child: <Icon name="x" type="feather" size={16} className="par-600" />
                    }}
                    reverse="row"
                    onClick={(e) => goTo('/dashboard/core/fields')}
                />

                <Button
                    type="primary"
                    semantic="normal"
                    size="sm"
                    className="form-button"
                    text={{
                        label: "Create Field",
                        size: 13,
                    }}
                    loading={loading}
                    onClick={async (e) => { createField(validateField) }}
                />

            </div>

        </>
    )
}

export default CreateField;
