import { useEffect, useRef, useState } from "react"
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import Divider from "../../../../components/partials/Divider";
import CardUI from "../../../../components/partials/ui/CardUI";
import helper from "../../../../utils/helper.util";
import Filter from "../../../../components/partials/drops/Filter";
import FormField from "../../../../components/partials/inputs/FormField";
import Badge from "../../../../components/partials/badges/Badge";
import useCareer from "../../../../hooks/app/useCareer";
import TextAreaInput from "../../../../components/partials/inputs/TextAreaInput";
import TextInput from "../../../../components/partials/inputs/TextInput";
import { statusOptions } from "../../../../_data/seed";
import useGoTo from "../../../../hooks/useGoTo";
import { useParams } from "react-router-dom";
import Checkbox from "../../../../components/partials/inputs/Checkbox";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import IconButton from "../../../../components/partials/buttons/IconButton";
import useGoBack from "../../../../hooks/useGoBack";
import useToast from "../../../../hooks/useToast";

const EditCareer = () => {

    const { id } = useParams<{ id: string }>()

    const { toast, setToast } = useToast()
    const { loading, career, updateCareer, getCareer } = useCareer()
    const { goBack } = useGoBack();

    const [form, setForm] = useState({
        name: '',
        label: '',
        description: '',
        isEnabled: false,
        industryId: '',
        synonyms: [] as Array<string>
    })

    useEffect(() => {
        if (id) { getCareer(id) }
    }, [])

    useEffect(() => {

        if (!helper.isEmpty(career, 'object')) {
            setForm({
                ...form,
                name: career?.name || '',
                label: career?.label || '',
                description: career?.description || '',
                isEnabled: career.isEnabled ? true : false,
                industryId: career.industry && career.industry._id ? career.industry._id : '',
                synonyms: career?.synonyms || []
            })
        }

    }, [career])

    const handleUpdate = async (e: any) => {

        if (e) { e.preventDefault() }

        const response = await updateCareer(form);

        if (!response.error) {
            setToast({
                ...toast,
                show: true,
                type: 'success',
                message: `Changes saved successfully`
            })
        }

        if (response.error) {
            setToast({
                ...toast,
                show: true,
                type: 'error',
                message: response.errors.length > 0 ? response.errors[0] : response.message
            })
        }

        setTimeout(() => {
            setToast({ ...toast, show: false })
        }, 3000)

    }

    return (
        <>

            {
                loading &&
                <>
                    <EmptyState className="min-h-[50vh]" noBound={true}>
                        <span className="loader lg primary"></span>
                    </EmptyState>
                </>
            }

            {
                !loading &&
                <>

                    <CardUI>

                        <form onSubmit={(e) => { e.preventDefault() }} className="w-[40%] mx-auto my-0 space-y-[1.5rem] py-[1.5rem]">

                            <FormField>

                                <div className="grid grid-cols-[48%_48%] gap-x-[4%]">

                                    <div className="">
                                        <TextInput
                                            type="text"
                                            size="sm"
                                            showFocus={true}
                                            autoComplete={false}
                                            placeholder="Topic name"
                                            defaultValue={form.name}
                                            label={{
                                                title: 'Career Name',
                                                required: true,
                                                className: 'text-[13px]'
                                            }}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="">
                                        <TextInput
                                            type="text"
                                            size="sm"
                                            showFocus={true}
                                            autoComplete={false}
                                            placeholder="Display name"
                                            label={{
                                                title: 'Display Name',
                                                required: true,
                                                className: 'text-[13px]'
                                            }}
                                            defaultValue={form.label}
                                            onChange={(e) => setForm({ ...form, label: e.target.value })}
                                        />
                                    </div>

                                </div>

                            </FormField>

                            <FormField>
                                <TextAreaInput
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Type here"
                                    defaultValue={form.description}
                                    label={{
                                        title: 'Description',
                                        className: 'text-[13px]',
                                        required: true
                                    }}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                />
                            </FormField>

                            <FormField>

                                <Checkbox
                                    id="career-status"
                                    size="sm"
                                    checked={career.isEnabled ? true : false}
                                    label={{
                                        title: form.isEnabled ? 'Career is Enabled' : 'Career is Disabled',
                                        className: '',
                                        fontSize: '[13px]'
                                    }}
                                    onChange={(e) => {
                                        setForm({ ...form, isEnabled: e.target.checked })
                                    }}
                                />

                            </FormField>

                            <div className="flex items-center gap-x-[0.65rem] mt-10">

                                <IconButton
                                    size="min-w-[1.8rem] min-h-[1.8rem]"
                                    className="bg-pab-50 bgh-pab-100"
                                    icon={{
                                        type: 'polio',
                                        name: 'arrow-left',
                                        size: 16,
                                        className: 'pab-800'
                                    }}
                                    label={{
                                        text: 'Back to Careers',
                                        weight: 'medium'
                                    }}
                                    onClick={(e) => {
                                        goBack()
                                    }}
                                />

                                <Button
                                    type="primary"
                                    semantic="normal"
                                    size="rg"
                                    className="form-button ml-auto min-w-[150px]"
                                    text={{
                                        label: "Save Changes",
                                        size: 13,
                                    }}
                                    loading={loading}
                                    onClick={async (e) => { }}
                                />

                            </div>

                        </form>

                    </CardUI>

                </>
            }


        </>
    )
}

export default EditCareer;
