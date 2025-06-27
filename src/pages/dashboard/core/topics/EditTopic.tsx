import { useEffect, useRef, useState } from "react"
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import Divider from "../../../../components/partials/Divider";
import CardUI from "../../../../components/partials/ui/CardUI";
import helper from "../../../../utils/helper.util";
import Filter from "../../../../components/partials/drops/Filter";
import FormField from "../../../../components/partials/inputs/FormField";
import Badge from "../../../../components/partials/badges/Badge";
import useApp from "../../../../hooks/app/useApp";
import TextAreaInput from "../../../../components/partials/inputs/TextAreaInput";
import TextInput from "../../../../components/partials/inputs/TextInput";
import { statusOptions } from "../../../../_data/seed";
import useTopic from "../../../../hooks/app/useTopic";
import useGoTo from "../../../../hooks/useGoTo";
import { useParams } from "react-router-dom";
import useToast from "../../../../hooks/useToast";
import useGoBack from "../../../../hooks/useGoBack";
import useSidebar from "../../../../hooks/useSidebar";
import Skill from "../../../../models/Skill.model";
import Field from "../../../../models/Field.model";
import { ResourceType } from "../../../../utils/types.util";
import Career from "../../../../models/Career.model";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import Checkbox from "../../../../components/partials/inputs/Checkbox";

const EditTopic = () => {

    const skiRef = useRef<any>(null)
    const fiRef = useRef<any>(null)
    const carRef = useRef<any>(null)

    const { id } = useParams<{ id: string }>()
    const { loading, loader, topic, updateTopic, getTopic, changeResource } = useTopic()
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
        skills: [] as Array<{ id: string, name: string }>,
        fields: [] as Array<{ id: string, name: string }>
    })

    useEffect(() => {
        if (id) {
            getTopic(id)
            getCoreResources({ limit: 9999, page: 1, order: 'desc' })
        }
    }, [])

    useEffect(() => {
        if (!helper.isEmpty(topic, 'object')) {
            setForm({
                ...form,
                careerId: topic.career ? topic.career?._id || '' : '',
                fields: topic.fields.map((x: Field) => ({ id: x._id, name: x.name })),
                skills: topic.skills.map((x: Skill) => ({ id: x._id, name: x.name }))
            })
        }
    }, [topic])

    const handleUpdate = async (e: any) => {

        if (e) { e.preventDefault() }

        const response = await updateTopic({
            id: topic._id,
            careerId: form.careerId,
            description: form.description,
            isEnabled: form.isEnabled,
            label: form.label,
            name: form.name,
            skills: form.skills.map((x) => x.id),
            fields: form.fields.map((x) => x.id)
        });

        if (!response.error) {
            setToast({
                ...toast,
                show: true,
                type: 'success',
                message: `Changes saved successfully`
            })
            getTopic(topic._id);
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

    const handleRemove = async (e: any, id: string, resource: ResourceType) => {

        if (e) { e.preventDefault() }

        const response = await changeResource({
            id: topic._id,
            type: 'detach',
            resource: resource,
            skills: [id],
            fields: [id]
        });

        if (!response.error) {
            setToast({
                ...toast,
                show: true,
                type: 'success',
                message: `Changes saved successfully`
            })
            getTopic(topic._id);
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
                        helper.isEmpty(topic, 'object') &&
                        <EmptyState className="min-h-[50vh]" noBound={true}>
                            <h3 className="font-mona text-[14px] pas-900">Field not found!</h3>
                        </EmptyState>
                    }

                    {
                        !helper.isEmpty(topic, 'object') &&
                        <>
                            <CardUI>

                                <form onSubmit={(e) => { e.preventDefault() }} className="w-[40%] mx-auto space-y-[1.5rem] py-[1.5rem]">

                                    <FormField
                                        className={`${loading ? 'disabled-light' : ''}`}
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
                                            defaultValue={topic.career?._id || ''}
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
                                                    defaultValue={topic.name}
                                                    label={{
                                                        title: 'Topic Name',
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
                                                    defaultValue={topic.label}
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
                                                            close={true}
                                                            label={field.name}
                                                            upper={true}
                                                            onClose={(e) => {
                                                                const sk = topic.fields.find((x) => x._id === field.id);
                                                                if (sk) {
                                                                    handleRemove(e, field.id, 'fields')
                                                                } else {
                                                                    let list = form.fields;
                                                                    list = list.filter((x) => x.id !== field.id);
                                                                    setForm({ ...form, fields: list })
                                                                }
                                                            }}
                                                        />
                                                    )
                                                }
                                            </div>
                                        }


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
                                                            close={true}
                                                            label={skill.name}
                                                            upper={true}
                                                            onClose={(e) => {
                                                                const sk = topic.skills.find((x) => x._id === skill.id);
                                                                if (sk) {
                                                                    handleRemove(e, skill.id, 'skills')
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
                                            defaultValue={topic.description}
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
                                            checked={topic.isEnabled ? true : false}
                                            label={{
                                                title: (form.isEnabled || topic.isEnabled) ? 'Topic is Enabled' : 'Topic is Disabled',
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

export default EditTopic;
