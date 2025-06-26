import { useEffect, useState, useRef } from "react"
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import Divider from "../../../../components/partials/Divider";
import CardUI from "../../../../components/partials/ui/CardUI";
import useField from "../../../../hooks/app/useField";
import helper from "../../../../utils/helper.util";
import Filter from "../../../../components/partials/drops/Filter";
import Field from "../../../../models/Field.model";
import FormField from "../../../../components/partials/inputs/FormField";
import Badge from "../../../../components/partials/badges/Badge";
import useCareer from "../../../../hooks/app/useCareer";
import TextAreaInput from "../../../../components/partials/inputs/TextAreaInput";
import TextInput from "../../../../components/partials/inputs/TextInput";
import { statusOptions } from "../../../../_data/seed";
import useToast from "../../../../hooks/useToast";
import useIndustry from "../../../../hooks/app/useIndustry";
import useGoTo from "../../../../hooks/useGoTo";
import useGoBack from "../../../../hooks/useGoBack";

const NewCareerPage = () => {

    const statusRef = useRef<any>(null)
    const toRef = useRef<any>(null)

    const { loader: loading, createCareer } = useCareer()
    const { industries, getIndustries } = useIndustry()
    const { toast, setToast } = useToast()
    const { goBack } = useGoBack()

    const [form, setForm] = useState({
        name: '',
        label: '',
        description: '',
        isEnabled: false,
        industryId: '',
        synonyms: [] as Array<string>
    })

    useEffect(() => {
        getIndustries({ limit: 25, page: 1, order: 'desc' })
    }, [])

    const handleClear = () => {
        toRef?.current.clear()
    }

    const handleCreate = async (e: any) => {

        if(e) { e.preventDefault() }

        let isValid: boolean = true;

        if (!form.industryId) {
            setToast({ ...toast, show: true, error: 'career', type: 'error', message: 'Industry is required' })
            isValid = false;
        }
        else if (!form.name) {
            setToast({ ...toast, show: true, error: 'career', type: 'error', message: 'Career name is required' })
            isValid = false;

        } else if (!form.label) {
            setToast({ ...toast, show: true, error: 'career', type: 'error', message: 'Career display name is required' })
            isValid = false;
        } else if (form.synonyms.length === 0) {
            setToast({ ...toast, show: true, error: 'career', type: 'error', message: 'Career synonymns are required' })
            isValid = false;
        }
        else if (form.description && form.description.length < 10) {
            setToast({ ...toast, show: true, error: 'career', type: 'error', message: 'Description must be at least 10 characters long' })
            isValid = false;
        } else {

            const response = await createCareer(form);

            if (!response.error) {
                setToast({
                    ...toast,
                    show: true,
                    type: 'success',
                    message: `Career created successfully`
                })
                handleClear()
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

        return isValid

    }

    return (
        <>

            <CardUI>

                <form onSubmit={(e) => { e.preventDefault() }} className="w-[40%] mx-auto space-y-[1.5rem] py-[1.5rem]">

                    <FormField
                        className={`${industries.loading ? 'disabled-light' : ''}`}
                        label={{
                            title: 'Select Career Industry',
                            required: true,
                            fontSize: 13
                        }}
                    >
                        <Filter
                            ref={toRef}
                            size='sm'
                            className='la-filter'
                            placeholder={"Select Industry"}
                            position="bottom"
                            menu={{
                                search: true,
                                fullWidth: true,
                                limitHeight: 'md'
                            }}
                            items={
                                industries.data.map((x: Field) => {
                                    return {
                                        label: helper.capitalizeWord(x.name),
                                        value: x._id
                                    }
                                })
                            }
                            noFilter={false}
                            onChange={(data) => {
                                setForm({ ...form, industryId: data.value })
                            }}
                        />

                    </FormField>

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
                                    label={{
                                        title: 'Career Name',
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

                        <TextInput
                            type="text"
                            size="sm"
                            showFocus={true}
                            autoComplete={false}
                            placeholder="Synonyms"
                            defaultValue={''}
                            label={{
                                title: 'Synonyms (separate words with comma)',
                                required: true,
                                fontSize: 13
                            }}
                            onChange={(e) => {
                                const split = e.target.value.split(',');
                                setForm({ ...form, synonyms: split.map((x) => x.trim()).filter((m) => m.length >0) })
                            }}
                        />

                    </FormField>

                    <FormField>

                        <TextAreaInput
                            showFocus={true}
                            autoComplete={false}
                            placeholder="Type here"
                            defaultValue={''}
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
                                label: "Create Career",
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

export default NewCareerPage;
