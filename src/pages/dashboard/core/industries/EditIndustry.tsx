import { useEffect, useState } from "react"
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
import useIndustry from "../../../../hooks/app/useIndustry";
import { useParams } from "react-router-dom";
import useGoBack from "../../../../hooks/useGoBack";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import Checkbox from "../../../../components/partials/inputs/Checkbox";

const EditIndustry = () => {

    const { id } = useParams<{ id: string }>()
    const { toast, setToast } = useToast()
    const { loading, loader, industry, getIndustry, updateIndustry } = useIndustry()
    const { goBack } = useGoBack()

    const [form, setForm] = useState({
        name: '',
        label: '',
        description: '',
        isEnabled: false,
    })

    useEffect(() => {
        if(id){
            getIndustry(id)
        }
    }, [id])

    const handleUpdate = async (e: any) => {

        if (e) { e.preventDefault() }

        const response = await updateIndustry({ id: industry._id, ...form });

        if (!response.error) {
            setToast({
                ...toast,
                show: true,
                type: 'success',
                message: `Changes saved successfully`
            })
            getIndustry(industry._id);
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

                    {
                        helper.isEmpty(industry, 'object') &&
                        <EmptyState className="min-h-[50vh]" noBound={true}>
                            <h3 className="font-mona text-[14px] pas-900">Industry not found!</h3>
                        </EmptyState>
                    }

                    {
                        !helper.isEmpty(industry, 'object') &&
                        <>

                            <CardUI>

                                <form onSubmit={(e) => { e.preventDefault() }} className="w-[40%] mx-auto space-y-[1.5rem] py-[1.5rem]">

                                    <FormField>

                                        <div className="grid grid-cols-[48%_48%] gap-x-[4%]">

                                            <div className="">
                                                <TextInput
                                                    type="text"
                                                    size="sm"
                                                    showFocus={true}
                                                    autoComplete={false}
                                                    placeholder="Type here"
                                                    defaultValue={industry.name}
                                                    label={{
                                                        title: 'Industry Name',
                                                        required: true,
                                                        fontSize: 13
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
                                                    placeholder="Type here"
                                                    defaultValue={industry.label}
                                                    label={{
                                                        title: 'Display Name',
                                                        required: true,
                                                        fontSize: 13
                                                    }}
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
                                            defaultValue={industry.description}
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
                                            checked={industry.isEnabled ? true : false}
                                            label={{
                                                title: (form.isEnabled || industry.isEnabled) ? 'Industry is Enabled' : 'Industry is Disabled',
                                                className: '',
                                                fontSize: '[13px]'
                                            }}
                                            onChange={(e) => {
                                                setForm({ ...form, isEnabled: e.target.checked })
                                            }}
                                        />

                                    </FormField>

                                    <div className="flex items-center gap-x-[0.65rem] mt-10">
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
                                            onClick={(e) => { goBack() }}
                                        />

                                        <Button
                                            type="primary"
                                            semantic="normal"
                                            size="sm"
                                            className="form-button ml-auto"
                                            text={{
                                                label: "Save Changes",
                                                size: 13,
                                            }}
                                            loading={loader}
                                            onClick={async (e) => handleUpdate(e)}
                                        />

                                    </div>

                                </form>

                            </CardUI>

                        </>
                    }

                </>
            }



        </>
    )
}

export default EditIndustry;
