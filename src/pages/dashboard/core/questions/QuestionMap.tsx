import React, { useEffect, useState, useContext, useRef, Fragment } from "react"
import PageHeader from "../../../../components/partials/ui/PageHeader";
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import Divider from "../../../../components/partials/Divider";
import useSidebar from "../../../../hooks/useSidebar";
import TopicList from "../topics/TopicList";
import QuestionList from "./QuestionList";
import useGoTo from "../../../../hooks/useGoTo";
import CardUI from "../../../../components/partials/ui/CardUI";
import useMetrics from "../../../../hooks/app/useMetrics";
import MetricItem from "../../../../components/app/MetricItem";
import useApp from "../../../../hooks/app/useApp";
import Filter from "../../../../components/partials/drops/Filter";
import Career from "../../../../models/Career.model";
import helper from "../../../../utils/helper.util";
import FormField from "../../../../components/partials/inputs/FormField";
import Badge from "../../../../components/partials/badges/Badge";
import Field from "../../../../models/Field.model";
import Skill from "../../../../models/Skill.model";
import Topic from "../../../../models/Topic.model";
import { IQuestionCount } from "../../../../models/Question.model";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import useToast from "../../../../hooks/useToast";
import IconButton from "../../../../components/partials/buttons/IconButton";

const QuestionMapPage = ({ }) => {

    const carRef = useRef<any>(null)
    const fiRef = useRef<any>(null)
    const skiRef = useRef<any>(null)
    const toRef = useRef<any>(null)

    useSidebar({ type: 'page', init: true })
    const { toDetailRoute } = useGoTo()
    const { core, getCoreResources } = useApp()
    const { loader: loading, questionCount: counters, getQuestionCount, clearCounters } = useMetrics()
    const { toast, setToast } = useToast()

    const [fields, setFields] = useState<Array<Field>>([])
    const [skills, setSkills] = useState<Array<Skill>>([])
    const [topics, setTopics] = useState<Array<Topic>>([])

    const [form, setForm] = useState({
        career: { id: '', name: '' },
        fields: [] as Array<{ id: string, name: string }>,
        skills: [] as Array<{ id: string, name: string }>,
        topics: [] as Array<{ id: string, name: string }>
    })

    useEffect(() => {
        getCoreResources({ limit: 9999, page: 1, order: 'desc' })
    }, [])

    const handleClear = () => {

        setForm({
            ...form,
            career: { id: '', name: '' },
            fields: [],
            skills: [],
            topics: []
        });
        setFields([])
        setSkills([])
        setTopics([])
        carRef.current.clear();
        fiRef.current.clear();
        skiRef.current.clear();
        toRef.current.clear();

    }

    const handleGetCount = async (e: any) => {

        if (e) { e.preventDefault() }

        if (!form.career.id) {
            setToast({ ...toast, show: true, type: 'error', message: 'Select a career' })
        } else if (form.fields.length === 0) {
            setToast({ ...toast, show: true, type: 'error', message: 'select at least one field' })
        } else {

            const response = await getQuestionCount({
                careerId: form.career.id,
                fields: form.fields.map((x) => x.id),
                skills: form.skills.map((x) => x.id),
                topics: form.topics.map((x) => x.id)
            });

            if (!response.error) {

                setToast({
                    ...toast,
                    show: true,
                    type: 'success',
                    message: 'Request successful'
                })

                handleClear()

            }

            if (response.error) {

                setToast({
                    ...toast,
                    show: true,
                    type: 'error',
                    message: response.errors.join(',')
                })
            }

        }

        setTimeout(() => {
            setToast({
                ...toast,
                show: false,
            })
        }, 1800)

    }

    return (
        <>
            <PageHeader
                title="Question Maps"
                description="Manage platform questions mapping"
            >
                <div className="flex items-center">
                    <Button
                        type="primary"
                        semantic="default"
                        size="sm"
                        className="form-button"
                        text={{
                            label: "Map Questions",
                            size: 13,
                        }}
                        icon={{
                            enable: true,
                            child: <Icon name="plus" type="feather" size={16} className="pag-900" />
                        }}
                        reverse="row"
                        onClick={(e) => {}}
                    />
                </div>

            </PageHeader>

            <Divider show={false} />

            <form onSubmit={(e) => { e.preventDefault() }} className="w-full">

                <div className="grid grid-cols-[38%_58%] gap-x-[4%]">

                    <CardUI className={""}>

                        <div className={`space-y-[0.4rem] ${counters.length > 0 ? 'disabled-light' : ''}`}>

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
                                                setForm({ ...form, career: { id: data.value, name: data.label } });

                                                // extract fields
                                                const fields = core.fields.filter((x) => x.career === data.value);
                                                setFields(fields)

                                                // extract skills
                                                const skills = core.skills.filter((x) => x.career === data.value);
                                                setSkills(skills)

                                                // extract topics
                                                const topics = core.topics.filter((x) => x.career === data.value);
                                                setTopics(topics)

                                                carRef.current.clear()
                                            }}
                                        />
                                    </div>

                                    {
                                        form.career.name &&
                                        <div className="grow">
                                            <Badge
                                                type={'default'}
                                                size="xsm"
                                                close={false}
                                                label={helper.capitalize(form.career.name)}
                                                upper={true}
                                                onClose={(e) => { }}
                                            />
                                        </div>
                                    }

                                </div>


                            </FormField>

                            <Divider />

                            <FormField className={`space-y-[0.5rem] ${fields.length === 0 ? 'disabled-light' : ''}`}>

                                <h3 className="font-mona text-[13px] pag-800">Choose Fields</h3>

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
                                                let list = form.fields;
                                                let fieldIds = list.map((x) => x.id);
                                                if (!fieldIds.includes(data.value)) {
                                                    list.push({ id: data.value, name: data.label })
                                                }
                                                setForm({ ...form, fields: list })
                                                fiRef.current.clear()
                                            }}
                                        />
                                    </div>

                                    {
                                        form.career.name &&
                                        <div className="w-full flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                            {
                                                form.fields.map((field) =>
                                                    <Badge
                                                        key={field.id}
                                                        type={'default'}
                                                        size="xsm"
                                                        close={true}
                                                        label={helper.capitalize(field.name)}
                                                        upper={true}
                                                        onClose={(e) => {
                                                            let list = form.fields;
                                                            list = list.filter((x) => x.id !== field.id);
                                                            setForm({ ...form, fields: list })
                                                            fiRef.current.clear()
                                                        }}
                                                    />
                                                )
                                            }
                                        </div>
                                    }

                                </div>


                            </FormField>

                            <Divider />

                            <FormField className={`space-y-[0.5rem] ${(skills.length === 0 || form.topics.length > 0) ? 'disabled-light' : ''}`}>

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
                                                let list = form.skills;
                                                let skillIds = list.map((x) => x.id);
                                                if (!skillIds.includes(data.value)) {
                                                    list.push({ id: data.value, name: data.label })
                                                }
                                                setForm({ ...form, skills: list })
                                                skiRef.current.clear()
                                            }}
                                        />
                                    </div>

                                    {
                                        form.career.name &&
                                        <div className="w-full flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                            {
                                                form.skills.map((skill) =>
                                                    <Badge
                                                        key={skill.id}
                                                        type={'default'}
                                                        size="xsm"
                                                        close={true}
                                                        label={helper.capitalize(skill.name)}
                                                        upper={true}
                                                        onClose={(e) => {
                                                            let list = form.skills;
                                                            list = list.filter((x) => x.id !== skill.id);
                                                            setForm({ ...form, skills: list })
                                                            skiRef.current.clear()
                                                        }}
                                                    />
                                                )
                                            }
                                        </div>
                                    }

                                </div>


                            </FormField>

                            <Divider />

                            <FormField className={`space-y-[0.5rem] ${(topics.length === 0 || form.skills.length > 0) ? 'disabled-light' : ''}`}>

                                <h3 className="font-mona text-[13px] pag-800">Choose Topics</h3>

                                <div className="space-y-[0.8rem]">

                                    <div className="max-w-[50%]">
                                        <Filter
                                            ref={toRef}
                                            size='xxsm'
                                            className='la-filter bg-white'
                                            placeholder="Select Topic"
                                            position="bottom"
                                            menu={{
                                                search: true,
                                                fullWidth: true,
                                                limitHeight: 'md'
                                            }}
                                            items={
                                                topics.map((x: Topic) => {
                                                    return {
                                                        label: helper.capitalizeWord(x.name),
                                                        value: x._id
                                                    }
                                                })
                                            }
                                            noFilter={false}
                                            onChange={(data) => {
                                                let list = form.topics;
                                                let topicIds = list.map((x) => x.id);
                                                if (!topicIds.includes(data.value)) {
                                                    list.push({ id: data.value, name: data.label })
                                                }
                                                setForm({ ...form, topics: list })
                                                toRef.current.clear()
                                            }}
                                        />
                                    </div>

                                    {
                                        form.career.name &&
                                        <div className="w-full flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                            {
                                                form.topics.map((topic) =>
                                                    <Badge
                                                        key={topic.id}
                                                        type={'default'}
                                                        size="xsm"
                                                        close={true}
                                                        label={helper.capitalize(topic.name)}
                                                        upper={true}
                                                        onClose={(e) => {
                                                            let list = form.topics;
                                                            list = list.filter((x) => x.id !== topic.id);
                                                            setForm({ ...form, topics: list })
                                                            toRef.current.clear()
                                                        }}
                                                    />
                                                )
                                            }
                                        </div>
                                    }

                                </div>


                            </FormField>

                        </div>


                        <div className={`flex items-center mt-[1.8rem]`}>
                            {
                                counters.length > 0 &&
                                <IconButton
                                    size="min-w-[1.8rem] min-h-[1.8rem]"
                                    className="bg-par-50 bgh-par-100"
                                    icon={{
                                        type: 'polio',
                                        name: 'cancel',
                                        size: 16,
                                        className: 'par-600'
                                    }}
                                    label={{
                                        text: 'Clear',
                                        weight: 'medium',
                                        className: 'par-700'
                                    }}
                                    onClick={(e) => {
                                        handleClear()
                                        clearCounters()
                                    }}
                                />
                            }
                            <Button
                                type="primary"
                                size="sm"
                                disabled={form.fields.length === 0}
                                loading={loading}
                                className="form-button ml-auto"
                                text={{
                                    label: "Get Count Map",
                                    size: 13,
                                }}
                                reverse="row"
                                onClick={(e) => handleGetCount(e)}
                            />
                        </div>

                    </CardUI>

                    <CardUI className="space-y-[0.4rem]">
                        {
                            loading &&
                            <EmptyState className="min-h-[50vh]" noBound={true}>
                                <span className="loader lg primary"></span>
                            </EmptyState>
                        }
                        {
                            !loading &&
                            <>
                                {
                                    counters.length === 0 &&
                                    <>
                                        <EmptyState className="min-h-[50vh]" noBound={true}>
                                            <span className="font-mona pag-800 text-[13px]">Question map count will appear here</span>
                                        </EmptyState>
                                    </>
                                }

                                {
                                    counters.length > 0 &&
                                    <>
                                        {
                                            counters[0] &&
                                            counters[0].career &&
                                            <div className="space-x-[0.35rem] flex items-center mb-[1.6rem]">
                                                <h3 className="font-mona text-[13px] pag-800">Career: </h3>
                                                <Badge
                                                    type={'default'}
                                                    size="xsm"
                                                    close={false}
                                                    label={helper.capitalize(counters[0].career.name)}
                                                    upper={true}
                                                    onClose={(e) => { }}
                                                />
                                            </div>
                                        }

                                        {
                                            counters.map((counter, index) =>
                                                <Fragment key={counter.field._id}>

                                                    <div className="w-full space-y-[1rem]">

                                                        <div className="flex items-center gap-x-[1rem]">

                                                            {
                                                                counter.field &&
                                                                <div className="flex items-center gap-x-[1.5rem]">
                                                                    <h3 className="space-x-[0.3rem] flex items-center">
                                                                        <span className="font-mona-medium text-[13px] pag-800">Field:</span>
                                                                        <span className="font-mona text-[13px] pag-600">{counter.field.name}</span>
                                                                    </h3>
                                                                    {
                                                                        counter.skill &&
                                                                        <h3 className="space-x-[0.3rem] flex items-center">
                                                                            <span className="font-mona-medium text-[13px] pag-800">Skill:</span>
                                                                            <span className="font-mona text-[13px] pag-600">{counter.skill.name}</span>
                                                                        </h3>
                                                                    }
                                                                    {
                                                                        counter.topic &&
                                                                        <h3 className="space-x-[0.3rem] flex items-center">
                                                                            <span className="font-mona-medium text-[13px] pag-800">Topic:</span>
                                                                            <span className="font-mona text-[13px] pag-600">{counter.topic.name}</span>
                                                                        </h3>
                                                                    }
                                                                </div>
                                                            }

                                                        </div>

                                                        <div className="grid grid-cols-[30%_30%_30%] gap-x-[3%] gap-y-[0.6rem]">

                                                            {
                                                                counter.levels && counter.levels.length > 0 &&
                                                                counter.levels.map((level: { [key: string]: number; }) => {
                                                                    let [name, value] = Object.entries(level)[0];
                                                                    return <Fragment key={''}>
                                                                        <div className="w-[30%] space-x-[0.5rem] space-y-[0.8rem]">
                                                                            <span className="font-mona-medium text-[13px] pag-900">{helper.capitalize(name)}:</span>
                                                                            <span className="font-mona text-[13px] pag-900">{value.toString()}</span>
                                                                        </div>
                                                                    </Fragment>
                                                                })
                                                            }

                                                        </div>

                                                    </div>

                                                    <Divider />

                                                </Fragment>
                                            )
                                        }
                                    </>
                                }

                            </>
                        }
                    </CardUI>

                </div>

            </form>


        </>
    )
};

export default QuestionMapPage;
