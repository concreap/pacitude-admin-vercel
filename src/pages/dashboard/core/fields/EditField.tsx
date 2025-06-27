import { useEffect, useRef, useState } from "react"
import Divider from "../../../../components/partials/Divider";
import CardUI from "../../../../components/partials/ui/CardUI";
import useField from "../../../../hooks/app/useField";
import useQuestion from "../../../../hooks/app/useQuestion";
import helper from "../../../../utils/helper.util";
import Filter from "../../../../components/partials/drops/Filter";
import FormField from "../../../../components/partials/inputs/FormField";
import Badge from "../../../../components/partials/badges/Badge";
import TextAreaInput from "../../../../components/partials/inputs/TextAreaInput";
import TextInput from "../../../../components/partials/inputs/TextInput";
import { statusOptions } from "../../../../_data/seed";
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import useGoTo from "../../../../hooks/useGoTo";
import { useParams } from "react-router-dom";
import useGoBack from "../../../../hooks/useGoBack";
import useApp from "../../../../hooks/app/useApp";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import Career from "../../../../models/Career.model";
import Skill from "../../../../models/Skill.model";
import Checkbox from "../../../../components/partials/inputs/Checkbox";
import useToast from "../../../../hooks/useToast";
import useSidebar from "../../../../hooks/useSidebar";

const EditField = () => {

    const skiRef = useRef<any>(null)
    const carRef = useRef<any>(null)

    const { id } = useParams<{ id: string }>()
    const { loading, loader, field, updateField, getField, changeFieldResource } = useField()
    const { core, getCoreResources } = useApp()
    const { toast, setToast } = useToast()
    const { goBack } = useGoBack();

    useSidebar({ type: 'page', init: true });

    const [form, setForm] = useState({
        name: '',
        label: '',
        description: '',
        isEnabled: true,
        careerId: '',
        skills: [] as Array<{ id: string, name: string }>
    })

    useEffect(() => {
        if (id) {
            getField(id)
            getCoreResources({ limit: 9999, page: 1, order: 'desc' })
        }
    }, [])

    useEffect(() => {
        if (!helper.isEmpty(field, 'object')) {
            setForm({
                ...form,
                careerId: field.career ? field.career?._id || '' : '',
                skills: field.skills.map((x: Skill) => ({ id: x._id, name: x.name }))
            })
        }
    }, [field])

    const handleUpdate = async (e: any) => {

        if (e) { e.preventDefault() }

        const response = await updateField({
            id: field._id,
            careerId: form.careerId,
            description: form.description,
            isEnabled: form.isEnabled,
            label: form.label,
            name: form.name,
            skills: form.skills.map((x) => x.id)
        });

        if (!response.error) {
            setToast({
                ...toast,
                show: true,
                type: 'success',
                message: `Changes saved successfully`
            })
            getField(field._id);
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

        const response = await changeFieldResource({
            id: field._id,
            type: 'detach',
            resource: 'skills',
            skills: [id]
        });

        if (!response.error) {
            setToast({
                ...toast,
                show: true,
                type: 'success',
                message: `Changes saved successfully`
            })
            getField(field._id);
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
                        helper.isEmpty(field, 'object') &&
                        <EmptyState className="min-h-[50vh]" noBound={true}>
                            <h3 className="font-mona text-[14px] pas-900">Field not found!</h3>
                        </EmptyState>
                    }

                    {
                        !helper.isEmpty(field, 'object') &&
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
                                                    defaultValue={field.name}
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
                                                    defaultValue={field.label}
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
                                            title: 'Select Skills',
                                            required: true,
                                            fontSize: 13
                                        }}
                                    >
                                        <Filter
                                            ref={skiRef}
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
                                                core.skills.map((x: Skill) => {
                                                    return {
                                                        label: helper.capitalizeWord(x.name),
                                                        value: x._id
                                                    }
                                                })
                                            }
                                            noFilter={false}
                                            onChange={(data) => {

                                                let list = form.skills;
                                                let idList = form.skills.map((x) => x.id);

                                                if (!idList.includes(data.value)) {
                                                    list.push({ id: data.value, name: data.label })
                                                }

                                                setForm({ ...form, skills: list })
                                                skiRef.current.clear()

                                            }}
                                        />

                                        {
                                            form.skills.length > 0 &&
                                            <div className="flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                                {
                                                    form.skills.map((skill) =>
                                                        <Badge
                                                            key={skill.id}
                                                            type={'default'}
                                                            size="xsm"
                                                            close={!loader ? true : false}
                                                            label={skill.name}
                                                            upper={true}
                                                            onClose={(e) => {
                                                                const sk = field.skills.find((x) => x._id === skill.id);
                                                                if (sk) {
                                                                    handleRemove(e, skill.id)
                                                                } else {
                                                                    let list = form.skills;
                                                                    list = list.filter((x) => x.id !== skill.id);
                                                                    setForm({ ...form, skills: list })
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
                                            defaultValue={field.description}
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
                                            checked={field.isEnabled ? true : false}
                                            label={{
                                                title: (form.isEnabled || field.isEnabled) ? 'Field is Enabled' : 'Field is Disabled',
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

export default EditField;
