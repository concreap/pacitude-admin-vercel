import { useEffect, useState, useRef } from "react"
import PageHeader from "../../../../components/partials/ui/PageHeader";
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import Divider from "../../../../components/partials/Divider";
import CardUI from "../../../../components/partials/ui/CardUI";
import useSkill from "../../../../hooks/app/useSkill";
import useQuestion from "../../../../hooks/app/useQuestion";
import helper from "../../../../utils/helper.util";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import Filter from "../../../../components/partials/drops/Filter";
import FormField from "../../../../components/partials/inputs/FormField";
import Badge from "../../../../components/partials/badges/Badge";
import useApp from "../../../../hooks/app/useApp";
import TextAreaInput from "../../../../components/partials/inputs/TextAreaInput";
import TextInput from "../../../../components/partials/inputs/TextInput";
import { statusOptions } from "../../../../_data/seed";
import Career from "../../../../models/Career.model";
import useToast from "../../../../hooks/useToast";

const CreateSkill = () => {

    const { core, getCoreResources } = useApp()

    const {
        loading, fieldRef, careerRef, skillData, fieldList, career,
        setCareer, addField, removeField, handleChange, createSkill
    } = useSkill()


    useEffect(() => {
        initList(25)
    }, [])

    const initList = (limit: number) => {
        getCoreResources({ limit: 9999, page: 1, order: 'desc' })
    }

    return (
        <>

            <CardUI>

                <form onSubmit={(e) => { e.preventDefault() }} className="w-[45%] mx-auto mt-5 mb-10">

                    <div className="w-full space-y-[0.55rem]">

                        <div className="grid grid-cols-2 gap-5 w-full">

                            <div className="mb-4">
                                <TextInput
                                    type="text"
                                    size="sm"
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Topic name"
                                    defaultValue={skillData.name}
                                    label={{
                                        title: 'Topic Name',
                                        required: true,
                                        className: 'text-[13px]'
                                    }}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                />
                            </div>

                            <div className=" mb-4">
                                <TextInput
                                    type="text"
                                    size="sm"
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Display name"
                                    defaultValue={skillData.label}
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

                    <div className="w-full space-y-[0.55rem]">

                        <div className="flex items-center">
                            <h3 className="font-mona text-[13px]">Career</h3>
                        </div>

                        <div className="w-full flex items-start gap-x-[1rem]">

                            <div className="min-w-[48%]">
                                <Filter
                                    ref={careerRef}
                                    size='sm'
                                    className='la-filter'
                                    placeholder="Select Career"
                                    position="bottom"
                                    menu={{
                                        style: { minWidth: '250px' },
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
                                    career.name !== '' &&
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

                    <div className="w-full space-y-[0.55rem]">

                        <div className="flex items-center">
                            <h3 className="font-mona text-[13px]">Fields</h3>
                        </div>

                        <div className="w-full flex items-start gap-x-[1rem]">

                            <div className="min-w-[48%]">
                                <Filter
                                    ref={fieldRef}
                                    size='sm'
                                    className='la-filter'
                                    placeholder="Select Fields"
                                    position="bottom"
                                    menu={{
                                        style: { minWidth: '250px' },
                                        search: true,
                                        fullWidth: false,
                                        limitHeight: 'md'
                                    }}
                                    items={
                                        core.fields.map((x) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        })
                                    }
                                    noFilter={false}
                                    onChange={(data) => {
                                        addField({ id: data.value, name: data.label, ex: false })
                                    }}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                {
                                    fieldList.map((field) =>
                                        <Badge
                                            key={field.id}
                                            type={'default'}
                                            size="xsm"
                                            close={true}
                                            label={helper.capitalize(field.name)}
                                            upper={true}
                                            onClose={(e) => {
                                                removeField(field.id)
                                                fieldRef.current.clear()
                                            }}
                                        />
                                    )
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
                                    ref={careerRef}
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
                                    defaultValue={skillData.isEnabled ? 'enable' : 'disable'}
                                    onChange={(data) => {
                                        handleChange('isEnabled', data.value === 'enable')
                                    }}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">

                                <Badge
                                    type={skillData.isEnabled === true ? 'success' : 'error'}
                                    size="xsm"
                                    close={false}
                                    label={`${helper.capitalize(skillData.isEnabled ? 'Enabled' : 'Disabled')}`}
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
                                defaultValue={skillData.description}
                                label={{
                                    title: 'Description',
                                    className: 'text-[13px]',
                                    required: true
                                }}
                                onChange={(e) => handleChange('description', e.target.value)}
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
                    onClick={(e) => { }}
                />

                <Button
                    type="primary"
                    semantic="normal"
                    size="sm"
                    className="form-button"
                    text={{
                        label: "Create Skill",
                        size: 13,
                    }}
                    loading={loading}
                    onClick={async (e) => { console.log(skillData); createSkill() }}
                />

            </div>

        </>
    )
}

export default CreateSkill;
