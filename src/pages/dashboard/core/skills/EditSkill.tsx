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
import useGoTo from "../../../../hooks/useGoTo";
import { useParams } from "react-router-dom";

const EditSkill = () => {

    const {id} = useParams<{ id: string }>()

    const {
        loading, careerRef, skillData, skill,
        handleChange, updateSkill, getSkill,
    } = useSkill()
    const { goTo } = useGoTo()

    useEffect(() => {
        initList()
    }, [])

    const initList = () => {
        getSkill(id ? id : '')
    }
    const getDefaultStatus = (status: boolean) => {
        let flag = status === true ? 'enable' : 'disable'
        console.log('flag', flag)
        return flag
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
                                    defaultValue={skill?.name ?? skillData.name}
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
                                    defaultValue={skill?.label ?? skillData.label}
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
                                    onChange={(data) => {
                                        handleChange('isEnabled', data.value === 'enable')
                                    }}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">

                                <Badge
                                    type={(skill.isEnabled || skillData.isEnabled) === true ? 'success' : 'error'}
                                    size="xsm"
                                    close={false}
                                    label={`${helper.capitalize((skill.isEnabled || skillData.isEnabled) ? 'Enabled' : 'Disabled')}`}
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
                                defaultValue={skill?.description ?? skillData.description ?? ''}
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
                    onClick={(e) => goTo('/dashboard/core/skills')}
                />

                <Button
                    type="primary"
                    semantic="normal"
                    size="sm"
                    className="form-button"
                    text={{
                        label: "Update Skill",
                        size: 13,
                    }}
                    loading={loading}
                    onClick={async (e) => { updateSkill(e) }}
                />

            </div>

        </>
    )
}

export default EditSkill;
