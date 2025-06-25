import { useEffect, useRef } from "react"
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

const EditCareer = () => {

    const { id } = useParams<{ id: string }>()
    const statusRef = useRef<any>(null)

    const { careerData, loading, career, handleChange, updateCareer, getCareer } = useCareer()
    const { goTo } = useGoTo()


    useEffect(() => {
        initList()
    }, [])

    const initList = () => {
        getCareer(id ? id : '')
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
                                    defaultValue={career?.name ?? careerData.name}
                                    label={{
                                        title: 'Career Name',
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
                                    label={{
                                        title: 'Display Name',
                                        required: true,
                                        className: 'text-[13px]'
                                    }}
                                    defaultValue={career?.label ?? careerData.label}
                                    onChange={(e) => { handleChange('label', e.target.value) }}
                                />
                            </div>

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
                                    onChange={(data) => {
                                        handleChange('isEnabled', data.value === 'enable')
                                    }}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">

                                <Badge
                                    type={(career.isEnabled || careerData.isEnabled) === true ? 'success' : 'error'} size="xsm"
                                    close={false}
                                    label={`${helper.capitalize((career?.isEnabled || careerData.isEnabled) ? 'Enabled' : 'Disabled')}`}
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
                                defaultValue={career?.description ?? careerData.description}
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
                    onClick={(e) => { goTo('/dashboard/core/careers') }}
                />

                <Button
                    type="primary"
                    semantic="normal"
                    size="sm"
                    className="form-button"
                    text={{
                        label: "Update Career",
                        size: 13,
                    }}
                    loading={loading}
                    onClick={async (e) => { updateCareer(e) }}
                />

            </div>

        </>
    )
}

export default EditCareer;
