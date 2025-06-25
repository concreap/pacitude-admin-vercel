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

const CreateCareer = () => {

    const statusRef = useRef<any>(null)
    const toRef = useRef<any>(null)

    const { careerData, industry, loading, setIndustry, handleChange, onSynonymsChange, createCareer } = useCareer()
    const { industries, getIndustries } = useIndustry()
    const { toast, setToast, clearToast } = useToast()
    const { goTo } = useGoTo()


    useEffect(() => {
        initList(25)
    }, [])

    const initList = (limit: number) => {
        getIndustries({ limit: limit, page: 1, order: 'desc' })
    }


    const validateCareer = () => {

        let isValid: boolean = true;

        if (!careerData.name) {
            setToast({ ...toast, show: true, error: 'career', type: 'error', message: 'Career name is required' })
            isValid = false;

        } else if (!careerData.label) {
            setToast({ ...toast, show: true, error: 'career', type: 'error', message: 'Career display name is required' })
            isValid = false;
        } else if (careerData.synonyms.length === 0) {
            setToast({ ...toast, show: true, error: 'career', type: 'error', message: 'Career synonymns are required' })
            isValid = false;
        }
        else if (!careerData.industryId) {
            setToast({ ...toast, show: true, error: 'career', type: 'error', message: 'Industry is required' })
            isValid = false;
        }
        else if (careerData.description.length < 10) {
            setToast({ ...toast, show: true, error: 'career', type: 'error', message: 'Description must be at least 10 characters long' })
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

                <form onSubmit={(e) => { e.preventDefault() }} className="w-[40%] mx-auto my-5">

                    <div className="w-full space-y-[0.55rem]" onClick={() => console.log(careerData)}>

                        <div className="grid grid-cols-2 gap-5 w-full">

                            <div className="mb-4">
                                <TextInput
                                    type="text"
                                    size="sm"
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Topic name"
                                    defaultValue={''}
                                    label={{
                                        title: 'Topic Name',
                                        required: true,
                                        className: 'text-[13px]'
                                    }}
                                    onChange={(e) => { handleChange('name', e.target.value) }}
                                />
                            </div>

                            <div className=" mb-4">
                                <TextInput
                                    type="text"
                                    size="sm"
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Display name"
                                    defaultValue={''}
                                    label={{
                                        title: 'Display Name',
                                        required: true,
                                        className: 'text-[13px]'
                                    }}
                                    onChange={(e) => { handleChange('label', e.target.value) }}
                                />
                            </div>

                        </div>

                    </div>

                    <Divider />

                    <div className="w-full space-y-[0.55rem]">

                        <div className=" mb-4">
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
                                    className: 'text-[13px]'
                                }}
                                onChange={(e) => { onSynonymsChange(e) }}
                            />
                        </div>

                    </div>

                    <Divider />

                    <div className="w-full space-y-[0.55rem]">

                        <div className="flex items-center">
                            <h3 className="font-mona text-[13px]">Industry</h3>
                        </div>

                        <div className="w-full flex items-start gap-x-[1rem]">

                            <div className="min-w-[30%]">
                                <Filter
                                    ref={toRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder={"Select Industry"}
                                    position="bottom"
                                    menu={{
                                        style: { minWidth: '250px' },
                                        search: true,
                                        fullWidth: false,
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
                                        handleChange('industryId', data.value)
                                        setIndustry({ _id: data.value, name: data.label })
                                    }}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">

                                {
                                    industry.name !== '' &&
                                    <Badge
                                        key={industry._id}
                                        type={'default'}
                                        size="xsm"
                                        close={false}
                                        label={helper.capitalize(industry.name)}
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
                                    defaultValue={''}
                                    onChange={(data) => {
                                        handleChange('isEnabled', data.value === 'enable')
                                    }}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">

                                <Badge
                                    type={'success'}
                                    size="xsm"
                                    close={false}
                                    label={`${helper.capitalize(careerData.isEnabled ? 'Enabled' : 'Disabled')}`}
                                    upper={true}
                                />


                            </FormField>

                        </div>

                    </div>

                    <Divider />

                    <div className="w-full flex items-start gap-x-[1rem] ">

                        <FormField className="w-full">
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
                                onChange={(e) => { handleChange('description', e.target.value) }}
                            />
                        </FormField>

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
                    onClick={(e) => { goTo('/dashboard/core/careers')}}
                />

                <Button
                    type="primary"
                    semantic="normal"
                    size="sm"
                    className="form-button"
                    text={{
                        label: "Create Career",
                        size: 13,
                    }}
                    loading={loading}
                    onClick={async (e) => { createCareer(validateCareer) }}
                />

            </div>

        </>
    )
}

export default CreateCareer;
