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
import useGoBack from "../../../../hooks/useGoBack";
import Field from "../../../../models/Field.model";
import Checkbox from "../../../../components/partials/inputs/Checkbox";
import useSidebar from "../../../../hooks/useSidebar";

const EditSkill = () => {

    const { id } = useParams<{ id: string }>()

    const fiRef = useRef<any>(null)
    const carRef = useRef<any>(null)

    useSidebar({ type: 'page', init: true })

    const { core, getCoreResources } = useApp();
    const { loading, loader, skill, getSkill, updateSkill, changeResource } = useSkill()
    const { goBack } = useGoBack()
    const { toast, setToast } = useToast()

    const [form, setForm] = useState({
        name: '',
        label: '',
        description: '',
        isEnabled: true,
        careerId: '',
        fields: [] as Array<{ id: string, name: string }>
    })

    useEffect(() => {
        if (id) {
            getSkill(id)
            getCoreResources({ limit: 9999, page: 1, order: 'desc' })
        }
    }, [])

    useEffect(() => {
        if (!helper.isEmpty(skill, 'object')) {
            setForm({
                ...form,
                careerId: skill.career ? skill.career?._id || '' : '',
                fields: skill.fields.map((x: Field) => ({ id: x._id, name: x.name }))
            })
        }
    }, [skill])


    const handleUpdate = async (e: any) => {

        if (e) { e.preventDefault() }

        const response = await updateSkill({
            id: skill._id,
            careerId: form.careerId,
            description: form.description,
            isEnabled: form.isEnabled,
            label: form.label,
            name: form.name,
            fields: form.fields.map((x) => x.id)
        });

        if (!response.error) {
            setToast({
                ...toast,
                show: true,
                type: 'success',
                message: `Changes saved successfully`
            })
            getSkill(skill._id);
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

    const handleRemove = async (e: any, id: string) => {

        if (e) { e.preventDefault() }

        const response = await changeResource({
            id: skill._id,
            type: 'detach',
            resource: 'fields',
            fields: [id]
        });

        if (!response.error) {
            setToast({
                ...toast,
                show: true,
                type: 'success',
                message: `Changes saved successfully`
            })
            getSkill(skill._id);
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
                        helper.isEmpty(skill, 'object') &&
                        <EmptyState className="min-h-[50vh]" noBound={true}>
                            <h3 className="font-mona text-[14px] pas-900">SKill not found!</h3>
                        </EmptyState>
                    }

                    {
                        !helper.isEmpty(skill, 'object') &&
                        <>
                            <CardUI>

                                <form onSubmit={(e) => { e.preventDefault() }} className="w-[40%] mx-auto space-y-[1.5rem] py-[1.5rem]">

                                    <FormField
                                        className={`${loading || core.careers.length === 0 ? 'disabled-light' : ''}`}
                                        label={{
                                            title: 'Select Career',
                                            required: true,
                                            fontSize: 13
                                        }}
                                    >
                                        <Filter
                                            ref={carRef}
                                            size='sm'
                                            className='la-filter'
                                            placeholder={"Choose"}
                                            position="bottom"
                                            defaultValue={form.careerId}
                                            menu={{
                                                search: true,
                                                fullWidth: true,
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
                                                setForm({ ...form, careerId: data.value })
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
                                                    defaultValue={skill.name}
                                                    label={{
                                                        title: 'Field Name',
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
                                                    defaultValue={skill.label}
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

                                    <FormField
                                        className={`${loading ? 'disabled-light' : ''} space-y-[0.6rem]`}
                                        label={{
                                            title: 'Select Fields',
                                            required: true,
                                            fontSize: 13
                                        }}
                                    >
                                        <Filter
                                            ref={fiRef}
                                            size='sm'
                                            className='la-filter'
                                            placeholder={"Choose"}
                                            position="bottom"
                                            menu={{
                                                search: true,
                                                fullWidth: true,
                                                limitHeight: 'md'
                                            }}
                                            items={
                                                core.fields.map((x: Field) => {
                                                    return {
                                                        label: helper.capitalizeWord(x.name),
                                                        value: x._id
                                                    }
                                                })
                                            }
                                            noFilter={false}
                                            onChange={(data) => {

                                                let list = form.fields;
                                                let idList = form.fields.map((x) => x.id);

                                                if (!idList.includes(data.value)) {
                                                    list.push({ id: data.value, name: data.label })
                                                }

                                                setForm({ ...form, fields: list })
                                                fiRef.current.clear()

                                            }}
                                        />

                                        {
                                            form.fields.length > 0 &&
                                            <div className="flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                                {
                                                    form.fields.map((field) =>
                                                        <Badge
                                                            key={field.id}
                                                            type={'default'}
                                                            size="xsm"
                                                            close={!loader ? true : false}
                                                            label={field.name}
                                                            upper={true}
                                                            onClose={(e) => {
                                                                const sk = skill.fields.find((x) => x._id === field.id);
                                                                if (sk) {
                                                                    handleRemove(e, field.id)
                                                                } else {
                                                                    let list = form.fields;
                                                                    list = list.filter((x) => x.id !== skill.id);
                                                                    setForm({ ...form, fields: list })
                                                                }
                                                            }}
                                                        />
                                                    )
                                                }
                                            </div>
                                        }

                                    </FormField>

                                    <FormField>

                                        <TextAreaInput
                                            showFocus={true}
                                            autoComplete={false}
                                            placeholder="Type here"
                                            defaultValue={skill.description}
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
                                            checked={skill.isEnabled ? true : false}
                                            label={{
                                                title: (form.isEnabled || skill.isEnabled) ? 'Field is Enabled' : 'Field is Disabled',
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

export default EditSkill;
