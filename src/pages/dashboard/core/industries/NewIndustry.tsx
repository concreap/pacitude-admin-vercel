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
import useGoBack from "../../../../hooks/useGoBack";

const NewIndustryPage = () => {

    const { toast, setToast } = useToast()
    const { loader: loading, createIndustry } = useIndustry()
    const { goBack } = useGoBack()

    const [form, setForm] = useState({
        name: '',
        label: '',
        description: '',
        isEnabled: true,
    })

    useEffect(() => {
    }, [])

    const handleCreate = async (e: any) => {

        if(e) { e.preventDefault() }

        if (!form.name) {
            setToast({ ...toast, show: true, error: 'industry', type: 'error', message: 'Industry name is required' })
        } else if (!form.label) {
            setToast({ ...toast, show: true, error: 'industry', type: 'error', message: 'Industry display name is required' })
        } else if (form.description && form.description.length < 10) {
            setToast({ ...toast, show: true, error: 'industry', type: 'error', message: 'Description must be at least 10 characters long' })
        } else {

            const response = await createIndustry(form);

            if (!response.error) {
                setToast({
                    ...toast,
                    show: true,
                    type: 'success',
                    message: `Industry created successfully`
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

        }

        setTimeout(() => {
            setToast({ ...toast, show: false })
        }, 3000)

    }

    return (
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
                                    defaultValue={''}
                                    clear={loading ? false : true}
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
                                    defaultValue={''}
                                    clear={loading ? false : true}
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
                            defaultValue={''}
                            clear={loading ? false : true}
                            label={{
                                title: 'Description',
                                className: 'text-[13px]',
                                required: true
                            }}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                                label: "Create Industry",
                                size: 13,
                            }}
                            loading={loading}
                            onClick={async (e) => handleCreate(e)}
                        />

                    </div>

                </form>

            </CardUI>

        </>
    )
}

export default NewIndustryPage;
