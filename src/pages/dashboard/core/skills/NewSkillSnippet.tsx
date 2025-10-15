import { useEffect, useState, useRef } from "react"
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import CardUI from "../../../../components/partials/ui/CardUI";
import useSkill from "../../../../hooks/app/useSkill";
import helper from "../../../../utils/helper.util";
import Filter from "../../../../components/partials/drops/Filter";
import FormField from "../../../../components/partials/inputs/FormField";
import Badge from "../../../../components/partials/badges/Badge";
import useApp from "../../../../hooks/app/useApp";
import TextAreaInput from "../../../../components/partials/inputs/TextAreaInput";
import TextInput from "../../../../components/partials/inputs/TextInput";
import Career from "../../../../models/Career.model";
import useToast from "../../../../hooks/useToast";
import useGoBack from "../../../../hooks/useGoBack";
import Field from "../../../../models/Field.model";
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import storage from "../../../../utils/storage.util";
import Skill from "../../../../models/Skill.model";
import Topic from "../../../../models/Topic.model";
import Divider from "../../../../components/partials/Divider";

const NewSkillPage = () => {

    const fiRef = useRef<any>(null)
    const carRef = useRef<any>(null)
    const skiRef = useRef<any>(null)
    const toRef = useRef<any>(null)

    const { core, getCoreResources } = useApp();
    const { loading, loader, createSkill } = useSkill()
    const { goBack } = useGoBack()
    const { toast, setToast } = useToast()

    const [fields, setFields] = useState<Array<Field>>([])
    const [skills, setSkills] = useState<Array<Skill>>([])
    const [topics, setTopics] = useState<Array<Topic>>([])

    const [form, setForm] = useState({
        name: '',
        label: '',
        description: '',
        isEnabled: true,
        careerId: '',
        fields: [] as Array<{ id: string, name: string }>
    })

    const [aiform, setAIForm] = useState({
        career: { id: '', name: '' },
        field: { id: '', name: '' },
        skill: { id: '', name: '' },
        topics: [] as Array<{ id: string, name: string }>
    })

    useEffect(() => {
        getCoreResources({ limit: 9999, page: 1, order: 'desc' })
    }, [])

    const configTab = (e: any, val: any) => {
        if (e) { e.preventDefault(); }
        storage.keep('new-skill-tab', val.toString())
    }

    const handleCreate = async (e: any) => {

        if (e) { e.preventDefault() }

        if (!form.careerId) {
            setToast({ ...toast, show: true, error: 'career', type: 'error', message: 'Select a career' })
        }
        else if (!form.name) {
            setToast({ ...toast, show: true, error: 'name', type: 'error', message: 'Field name is required' })
        } else if (!form.label) {
            setToast({ ...toast, show: true, error: 'label', type: 'error', message: 'Display name is required' })
        } else if (form.fields.length === 0) {
            setToast({ ...toast, show: true, error: 'skill', type: 'error', message: 'Select at least one field' })
        } else if (form.description && form.description.length < 10) {
            setToast({ ...toast, show: true, error: 'description', type: 'error', message: 'Description must be at least 10 characters long' })
        } else {

            const response = await createSkill({
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
                    message: `Skill created successfully`
                })
                fiRef?.current.clear()
                carRef?.current.clear()
                setForm({ ...form, fields: [] })
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

                <form onSubmit={(e) => { e.preventDefault() }} className="w-[100%]">

                    <Tabs defaultIndex={parseInt(storage.fetch('new-skill-tab'))} className={'new-skill-tab'}>
                        <TabList>
                            <Tab onClick={(e: any) => { configTab(e, 0); }}>Enter Skill Details</Tab>
                            <Tab onClick={(e: any) => { configTab(e, 1); }}>Add Skill Using AI</Tab>
                        </TabList>

                        <TabPanel tabIndex={0}>

                            <div className="w-[40%] mx-auto space-y-[1.5rem] py-[1.5rem]">

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
                                                defaultValue={''}
                                                clear={loader ? false : true}
                                                label={{
                                                    title: 'Skill Name',
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
                                                clear={loader ? false : true}
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
                                                            let list = form.fields;
                                                            list = list.filter((x) => x.id !== field.id);
                                                            setForm({ ...form, fields: list })
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
                                        defaultValue={''}
                                        clear={loader ? false : true}
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
                                            label: "Create Skill",
                                            size: 13,
                                        }}
                                        loading={loader}
                                        onClick={async (e) => handleCreate(e)}
                                    />

                                </div>

                            </div>

                        </TabPanel>

                        <TabPanel tabIndex={1}>

                            <div className="grid grid-cols-[38%_58%] gap-x-[4%] py-[2rem]">

                                <CardUI className={""}>

                                    <div className={`space-y-[0.4rem]`}>

                                        <FormField className="space-y-[0.5rem]">

                                            <h3 className="font-mona text-[13px] pag-800">Choose a Career</h3>

                                            <div className="flex items-center gap-x-[1.5rem]">

                                                <div className="w-1/2">
                                                    <Filter
                                                        ref={carRef}
                                                        size='xxsm'
                                                        className='la-filter bg-white'
                                                        placeholder="Select Career"
                                                        position="bottom"
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
                                                            // capture career
                                                            setAIForm({ ...aiform, career: { id: data.value, name: data.label } });

                                                            // extract fields
                                                            const fields = core.fields.filter((x) => x.career === data.value);
                                                            setFields(fields);

                                                            carRef.current.clear()
                                                        }}
                                                    />
                                                </div>

                                                {
                                                    aiform.career.name &&
                                                    <div className="grow">
                                                        <Badge
                                                            type={'default'}
                                                            size="xsm"
                                                            close={false}
                                                            label={helper.capitalize(aiform.career.name)}
                                                            upper={true}
                                                            onClose={(e) => { }}
                                                        />
                                                    </div>
                                                }

                                            </div>


                                        </FormField>

                                        <Divider />

                                        <FormField className={`space-y-[0.5rem] ${fields.length === 0 ? 'disabled-light' : ''}`}>

                                            <h3 className="font-mona text-[13px] pag-800">Choose Field</h3>

                                            <div className="space-y-[0.8rem]">

                                                <div className="max-w-[50%]">
                                                    <Filter
                                                        ref={fiRef}
                                                        size='xxsm'
                                                        className='la-filter bg-white'
                                                        placeholder="Select Field"
                                                        position="bottom"
                                                        menu={{
                                                            search: true,
                                                            fullWidth: true,
                                                            limitHeight: 'md'
                                                        }}
                                                        items={
                                                            fields.map((x: Field) => {
                                                                return {
                                                                    label: helper.capitalizeWord(x.name),
                                                                    value: x._id
                                                                }
                                                            })
                                                        }
                                                        noFilter={false}
                                                        onChange={(data) => {
                                                            // extract skills
                                                            const skills = core.skills.filter((x) => x.fields.includes(data.value));
                                                            setSkills(skills);

                                                            // capture field
                                                            setAIForm({ ...aiform, field: { id: data.value, name: data.label } });
                                                            fiRef.current.clear();
                                                        }}
                                                    />
                                                </div>

                                                {
                                                    aiform.field.name &&
                                                    <div className="w-full flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                                        <Badge
                                                            type={'default'}
                                                            size="xsm"
                                                            close={false}
                                                            label={helper.capitalize(aiform.field.name)}
                                                            upper={true}
                                                            onClose={(e) => { }}
                                                        />
                                                    </div>
                                                }

                                            </div>


                                        </FormField>

                                        <Divider />

                                        <FormField className={`space-y-[0.5rem] ${(skills.length === 0 || fields.length === 0) ? 'disabled-light' : ''}`}>

                                            <h3 className="font-mona text-[13px] pag-800">Choose Skills</h3>

                                            <div className="space-y-[0.8rem]">

                                                <div className="max-w-[50%]">
                                                    <Filter
                                                        ref={skiRef}
                                                        size='xxsm'
                                                        className='la-filter bg-white'
                                                        placeholder="Select Skill"
                                                        position="bottom"
                                                        menu={{
                                                            search: true,
                                                            fullWidth: true,
                                                            limitHeight: 'md'
                                                        }}
                                                        items={
                                                            skills.map((x: Skill) => {
                                                                return {
                                                                    label: helper.capitalizeWord(x.name),
                                                                    value: x._id
                                                                }
                                                            })
                                                        }
                                                        noFilter={false}
                                                        onChange={(data) => {
                                                            // extract skills
                                                            const topics = core.topics.filter((x) => x.skills.includes(data.value));
                                                            setTopics(topics);

                                                            // capture field
                                                            setAIForm({ ...aiform, skill: { id: data.value, name: data.label } });
                                                            fiRef.current.clear();
                                                        }}
                                                    />
                                                </div>

                                                {
                                                    aiform.skill.name &&
                                                    <div className="w-full flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                                        <Badge
                                                            type={'default'}
                                                            size="xsm"
                                                            close={false}
                                                            label={helper.capitalize(aiform.skill.name)}
                                                            upper={true}
                                                            onClose={(e) => { }}
                                                        />
                                                    </div>
                                                }

                                            </div>


                                        </FormField>

                                        <Divider />

                                        <FormField className={`space-y-[0.5rem] ${(skills.length === 0 || fields.length === 0) ? 'disabled-light' : ''}`}>

                                            <h3 className="font-mona text-[13px] pag-800">Choose Topic(s)</h3>

                                            <div className="space-y-[0.8rem]">

                                                <div className="max-w-[50%]">
                                                    <Filter
                                                        ref={skiRef}
                                                        size='xxsm'
                                                        className='la-filter bg-white'
                                                        placeholder="Select Skill"
                                                        position="bottom"
                                                        menu={{
                                                            search: true,
                                                            fullWidth: true,
                                                            limitHeight: 'md'
                                                        }}
                                                        items={
                                                            skills.map((x: Skill) => {
                                                                return {
                                                                    label: helper.capitalizeWord(x.name),
                                                                    value: x._id
                                                                }
                                                            })
                                                        }
                                                        noFilter={false}
                                                        onChange={(data) => {
                                                            // extract skills
                                                            const topics = core.topics.filter((x) => x.skills.includes(data.value));
                                                            setTopics(topics);

                                                            // capture field
                                                            setAIForm({ ...aiform, skill: { id: data.value, name: data.label } });
                                                            fiRef.current.clear();
                                                        }}
                                                    />
                                                </div>

                                                {
                                                    aiform.skill.name &&
                                                    <div className="w-full flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                                        <Badge
                                                            type={'default'}
                                                            size="xsm"
                                                            close={false}
                                                            label={helper.capitalize(aiform.skill.name)}
                                                            upper={true}
                                                            onClose={(e) => { }}
                                                        />
                                                    </div>
                                                }

                                            </div>


                                        </FormField>

                                    </div>

                                </CardUI>

                            </div>

                        </TabPanel>

                    </Tabs>

                </form>


            </CardUI>

        </>
    )
}

export default NewSkillPage;
