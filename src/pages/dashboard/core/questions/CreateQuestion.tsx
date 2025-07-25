import React, { useEffect, useState, useContext, useRef, Fragment } from "react"
import CardUI from "../../../../components/partials/ui/CardUI";
import { IAIQuestion } from "../../../../utils/interfaces.util";
import useSidebar from "../../../../hooks/useSidebar";
import TextInput from "../../../../components/partials/inputs/TextInput";
import useToast from "../../../../hooks/useToast";
import Filter from "../../../../components/partials/drops/Filter";
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import useQuestion from "../../../../hooks/app/useQuestion";
import useField from "../../../../hooks/app/useField";
import useTopic from "../../../../hooks/app/useTopic";
import useSkill from "../../../../hooks/app/useSkill";
import helper from "../../../../utils/helper.util";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import GeneratedQuestion from "./GeneratedQuestion";
import FormField from "../../../../components/partials/inputs/FormField";
import Field from "../../../../models/Field.model";
import Badge from "../../../../components/partials/badges/Badge";
import Divider from "../../../../components/partials/Divider";
import TextAreaInput from "../../../../components/partials/inputs/TextAreaInput";
import { difficulties, levels, questionTypes, timeHandles } from "../../../../_data/seed";
import Topic from "../../../../models/Topic.model";
import useApp from "../../../../hooks/app/useApp";
import Skill from "../../../../models/Skill.model";
import Career from "../../../../models/Career.model";

const CreateQuestionPage = ({ }) => {

    const qtRef = useRef<any>(null)
    const modelref = useRef<any>(null)
    const pmRef = useRef<any>(null)

    const carRef = useRef<any>(null)
    const fiRef = useRef<any>(null)
    const leRef = useRef<any>(null)
    const diRef = useRef<any>(null)
    const tyRef = useRef<any>(null)
    const skiRef = useRef<any>(null)
    const toRef = useRef<any>(null)

    useSidebar({ type: 'page', init: true })

    const { toast, setToast } = useToast()
    const { core, getCoreResources } = useApp()
    const { aiQuestions, loading, validateAIQuestions, generateQuestions, addGeneratedQuestions, setAIQuestions } = useQuestion()

    const [questions, setQuestions] = useState<Array<IAIQuestion>>([])
    const [fields, setFields] = useState<Array<Field>>([])
    const [skills, setSkills] = useState<Array<Skill>>([])
    const [topics, setTopics] = useState<Array<Topic>>([])
    const [careers, setCareers] = useState<Array<Career>>([])
    const [code, setCode] = useState<string>('')
    const [aiData, setAiData] = useState({
        prompt: '',
        model: 'openai',
        total: 3,
        error: '',
        career: {
            id: '',
            name: ''
        }
    });

    useEffect(() => {
        getCoreResources({ limit: 9999, page: 1, order: 'desc' })
    }, [])

    useEffect(() => {
        setFields(core.fields)
        setSkills(core.skills)
        setTopics(core.topics)
        setCareers(core.careers)
    }, [core])

    useEffect(() => {
        setQuestions(aiQuestions)
    }, [code])

    const editQuestion = (type: string, val: string) => {

        let currList = aiQuestions;

        if (!code) {
            setToast({
                ...toast,
                show: true,
                error: 'question',
                type: 'error',
                message: 'Select a question!'
            })
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 2500)
        } else {

            let question = currList.find((x) => x.code === code);
            let questionI = currList.findIndex((x) => x.code === code);

            if (question) {

                if (type === 'body') {
                    question.body = val;
                } else if (type === 'time-value') {
                    question.time.value = val;
                } else if (type === 'time-handle') {
                    question.time.handle = val;
                } else if (type === 'score') {
                    question.score = val;
                }

                currList.splice(questionI, 1, question);

            }

            setAIQuestions(currList)

        }

    }

    const editOption = (alpha: string, val: string) => {

        let currList = aiQuestions;

        if (!code) {
            setToast({
                ...toast,
                show: true,
                error: 'option',
                type: 'error',
                message: 'Select a question!'
            })
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 2500)
        } else {

            let question = currList.find((x) => x.code === code);
            let questionI = currList.findIndex((x) => x.code === code);

            if (question) {

                let option = question.answers.find((x) => x.alphabet === alpha)
                let optionIndex = question.answers.findIndex((x) => x.alphabet === alpha)

                if (option) {
                    option.answer = val
                    question.answers[optionIndex] = option;
                }

                currList.splice(questionI, 1, question);

            }

            setAIQuestions(currList)

        }

    }

    const addRubric = (type: string, val: any) => {

        let currList = aiQuestions;

        if (!code) {
            setToast({
                ...toast,
                show: true,
                error: 'rubric',
                type: 'error',
                message: 'Select a question!'
            })
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 2500)
        } else {

            let question = currList.find((x) => x.code === code);
            let questionI = currList.findIndex((x) => x.code === code);

            if (question) {

                let fieldIds = question.fields.map((x) => x.id);
                let skillIds = question.skills.map((x) => x.id);
                let topicIds = question.topics.map((x) => x.id);

                if (type === 'level' && !question.levels.includes(val)) {
                    question.levels.push(val)
                }

                if (type === 'difficulty' && !question.difficulties.includes(val)) {
                    question.difficulties.push(val)
                }

                if (type === 'type' && !question.types.includes(val)) {
                    question.types.push(val)
                }

                if (type === 'field' && !fieldIds.includes(val.id)) {
                    question.fields.push({ name: val.name, id: val.id })
                }

                if (type === 'skill' && !skillIds.includes(val.id)) {
                    question.skills.push({ name: val.name, id: val.id })
                }

                if (type === 'topic' && !topicIds.includes(val.id)) {
                    question.topics.push({ name: val.name, id: val.id })
                }

                currList.splice(questionI, 1, question);

            }

            setAIQuestions(currList)

        }

    }

    const removeRubric = (type: string, val: string) => {

        let currList = aiQuestions;

        if (!code) {
            setToast({
                ...toast,
                show: true,
                error: 'rubric',
                type: 'error',
                message: 'Select a question!'
            })
        } else {

            let question = currList.find((x) => x.code === code);
            let questionI = currList.findIndex((x) => x.code === code);

            if (question) {

                let fieldIds = question.fields.map((x) => x.id);
                let skillIds = question.skills.map((x) => x.id);
                let topicIds = question.topics.map((x) => x.id);

                if (type === 'level' && question.levels.includes(val)) {
                    if (question.levels.length === 1) {
                        setToast({
                            ...toast,
                            show: true,
                            type: 'error',
                            message: 'Cannot remove last skill level!'
                        })
                    } else {
                        question.levels = question.levels.filter((x) => x !== val)
                    }
                }

                if (type === 'difficulty' && question.difficulties.includes(val)) {
                    if (question.difficulties.length === 1) {
                        setToast({
                            ...toast,
                            show: true,
                            type: 'error',
                            message: 'Cannot remove last difficulty level!'
                        })
                    } else {
                        question.difficulties = question.difficulties.filter((x) => x !== val)
                    }
                }

                if (type === 'type' && question.types.includes(val)) {
                    if (question.types.length === 1) {
                        setToast({
                            ...toast,
                            show: true,
                            type: 'error',
                            message: 'Cannot remove last question type!'
                        })
                    } else {
                        question.types = question.types.filter((x) => x !== val)
                    }
                }

                if (type === 'field' && fieldIds.includes(val)) {
                    if (question.fields.length === 1) {
                        setToast({
                            ...toast,
                            show: true,
                            type: 'error',
                            message: 'Cannot remove last question field!'
                        })
                    } else {
                        question.fields = question.fields.filter((x) => x.id !== val)
                    }
                }

                if (type === 'skill' && skillIds.includes(val)) {
                    if (question.skills.length === 1) {
                        setToast({
                            ...toast,
                            show: true,
                            type: 'error',
                            message: 'Cannot remove last question skill!'
                        })
                    } else {
                        question.skills = question.skills.filter((x) => x.id !== val)
                    }
                }

                if (type === 'topic' && topicIds.includes(val)) {
                    if (question.topics.length === 1) {
                        setToast({
                            ...toast,
                            show: true,
                            type: 'error',
                            message: 'Cannot remove last question topic!'
                        })
                    } else {
                        question.topics = question.topics.filter((x) => x.id !== val)
                    }
                }

                currList.splice(questionI, 1, question);

            }

            setAIQuestions(currList)

        }

        setTimeout(() => {
            setToast({ ...toast, show: false })
        }, 2500)

    }

    const clearOnSelect = () => {
        setAiData({ ...aiData, career: { id: '', name: '' } })
    }

    const handleGenerate = async (e: any) => {

        if (e) { e.preventDefault() }

        if (!aiData.prompt) {
            setToast({
                ...toast,
                show: true,
                type: 'error',
                message: 'Enter a prompt or instruction'
            })
        } else if (!aiData.model) {
            setToast({
                ...toast,
                show: true,
                type: 'error',
                message: 'Choose an ai model'
            })
        } else if (!aiData.total) {
            setToast({
                ...toast,
                show: true,
                type: 'error',
                message: 'Choose number of questions'
            })
        } else {

            const response = await generateQuestions(aiData);

            if (!response.error) {
                setToast({
                    ...toast,
                    show: true,
                    type: 'success',
                    message: 'Questions generated successfully'
                })
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
            setToast({ ...toast, show: false })
        }, 2500)

    }

    const handleAddQuestions = async (e: any) => {

        if (e) { e.preventDefault() }

        const validate = await validateAIQuestions(e)

        if (!aiData.career.id) {
            setToast({
                ...toast,
                show: true,
                type: 'error',
                title: 'Error',
                message: 'Select a career'
            })
        }
        else if (validate.error) {
            setToast({
                ...toast,
                show: true,
                type: 'error',
                message: validate.message
            })
        } else {

            const response = await addGeneratedQuestions({ careerId: aiData.career.id });

            if (!response.error) {
                setToast({
                    ...toast,
                    show: true,
                    type: 'success',
                    message: 'Questions saved successfully'
                })
                setAIQuestions([])
                setCode('')
                setAiData({ ...aiData, error: '', model: 'openai', prompt: '', total: 3 })
                pmRef.current.clear()
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
            setToast({ ...toast, show: false })
        }, 2500)

    }

    return (
        <>

            <section className="space-y-[2.5rem]">

                <CardUI>

                    <div className="w-full flex items-center">

                        <div className="grow flex items-center gap-x-[1rem]">

                            <TextInput
                                ref={pmRef}
                                type="text"
                                size="sm"
                                showFocus={true}
                                autoComplete={false}
                                placeholder="Enter instruction for a concept"
                                readonly={aiQuestions.length > 0 ? true : false}
                                isError={toast.error === 'prompt' ? true : false}
                                onChange={(e) => setAiData({ ...aiData, prompt: e.target.value })}
                            />

                            <div className="w-[18%]">

                                <Filter
                                    ref={qtRef}
                                    size='xsm'
                                    className='la-filter'
                                    placeholder="Questions"
                                    position="bottom"
                                    defaultValue={'3'}
                                    menu={{
                                        style: {},
                                        search: false,
                                        fullWidth: true,
                                        limitHeight: 'md'
                                    }}
                                    items={[
                                        { label: '3 Questions', value: "3" },
                                        { label: '5 Questions', value: "5" },
                                        { label: '10 Questions', value: "10" }
                                    ]}
                                    noFilter={false}
                                    onChange={(item) => setAiData({ ...aiData, total: parseInt(item.value) })}
                                />

                            </div>

                            <div className="w-[18%]">

                                <Filter
                                    ref={modelref}
                                    size='xsm'
                                    className='la-filter'
                                    placeholder="Questions"
                                    position="bottom"
                                    defaultValue={aiData.model}
                                    menu={{
                                        style: {},
                                        search: false,
                                        fullWidth: true,
                                        limitHeight: 'md'
                                    }}
                                    items={[
                                        { label: 'OpenAI', value: 'openai' },
                                        { label: 'Anthropic', value: 'anthropic' }
                                    ]}
                                    noFilter={false}
                                    onChange={(item) => setAiData({ ...aiData, model: item.value })}
                                />

                            </div>

                        </div>

                        <div className="ml-auto w-[30%] gap-x-[0.65rem] flex items-center justify-end">
                            {
                                aiQuestions.length > 0 &&
                                <Button
                                    type={"ghost"}
                                    size="sm"
                                    semantic="error"
                                    className="form-button"
                                    loading={loading}
                                    text={{
                                        label: "Clear",
                                        size: 13,
                                    }}
                                    onClick={(e) => {
                                        setAIQuestions([])
                                        setCode('')
                                        pmRef.current.clear()
                                        setAiData({ ...aiData, error: '', model: 'openai', prompt: '', total: 3 })
                                    }}
                                />
                            }
                            <Button
                                type={"ghost"}
                                semantic={aiQuestions.length > 0 ? "ongoing" : "info"}
                                size="sm"
                                className="form-button"
                                loading={loading}
                                text={{
                                    label: aiQuestions.length > 0 ? "Save Questions" : "Generate",
                                    size: 13,
                                }}
                                onClick={(e) => {
                                    if (aiQuestions.length > 0) {
                                        handleAddQuestions(e)
                                    } else {
                                        handleGenerate(e)
                                    }
                                }}
                            />
                        </div>

                    </div>

                </CardUI>

                <CardUI>
                    <>
                        {
                            loading &&
                            <EmptyState className="min-h-[50vh]" noBound={true}>
                                <span className="loader lg primary"></span>
                                <span className="font-mona text-[16px] pas-950">AI is thinking</span>
                            </EmptyState>
                        }
                        {
                            !loading &&
                            <>
                                {
                                    aiQuestions.length === 0 &&
                                    <EmptyState bgColor='#f7f9ff' className="min-h-[50vh]" noBound={true} >
                                        <span className="font-mona text-[16px] pas-950">No questions generated</span>
                                    </EmptyState>
                                }
                                {
                                    aiQuestions.length > 0 &&
                                    <>
                                        <div className="grid grid-cols-2 gap-x-[1rem]">

                                            <div>
                                                {
                                                    aiQuestions.length > 0 &&
                                                    aiQuestions.map((question: IAIQuestion) =>
                                                        <Fragment key={question.code}>
                                                            <GeneratedQuestion
                                                                question={question}
                                                                active={code === question.code}
                                                                disabled={false}
                                                                onClick={(code: string) => {
                                                                    setCode(code);
                                                                }}
                                                            />
                                                        </Fragment>
                                                    )
                                                }
                                            </div>

                                            <div className="space-y-[1.5rem]">

                                                <CardUI className="bg-pag-25">
                                                    <div className="w-full flex items-center gap-x-[1.5rem]">

                                                        <div className="min-w-[30%]">
                                                            <Filter
                                                                ref={carRef}
                                                                size='xxsm'
                                                                className='la-filter bg-white'
                                                                placeholder="Select Career"
                                                                position="bottom"
                                                                menu={{
                                                                    style: { minWidth: '250px' },
                                                                    search: true,
                                                                    fullWidth: false,
                                                                    limitHeight: 'md'
                                                                }}
                                                                items={
                                                                    careers.map((x: Career) => {
                                                                        return {
                                                                            label: helper.capitalizeWord(x.name),
                                                                            value: x._id
                                                                        }
                                                                    })
                                                                }
                                                                noFilter={false}
                                                                onChange={(data) => {
                                                                    setAiData({ ...aiData, career: { id: data.value, name: data.label } })
                                                                    const fd = core.fields.filter((x) => x.career === data.value)
                                                                    const sd = core.skills.filter((x) => x.career === data.value)
                                                                    const td = core.topics.filter((x) => x.career === data.value)
                                                                    setFields(fd);
                                                                    // setSkills(sd.length > 0 ? sd : core.skills)
                                                                    // setTopics(td.length > 0 ? td : core.topics)
                                                                    carRef.current.clear()
                                                                }}
                                                            />
                                                        </div>

                                                        {
                                                            aiData.career.id &&
                                                            <FormField className="grow">
                                                                <Badge
                                                                    type={'info'}
                                                                    size="xsm"
                                                                    close={false}
                                                                    label={helper.capitalize(aiData.career.name)}
                                                                    upper={true}
                                                                    onClose={(e) => { }}
                                                                />
                                                            </FormField>
                                                        }

                                                    </div>
                                                </CardUI>

                                                <CardUI>

                                                    <div className="">

                                                        {
                                                            (!code || questions.length === 0) &&
                                                            <EmptyState bgColor='bg-pag-25' className="min-h-[50vh]" noBound={true} >
                                                                <span className="font-mona text-[14px] pas-950">Select a question</span>
                                                            </EmptyState>
                                                        }

                                                        {
                                                            code && questions.length > 0 &&
                                                            <form className="form" onSubmit={(e) => { e.preventDefault() }}>

                                                                {
                                                                    questions.map((question) =>
                                                                        <Fragment key={question.code}>

                                                                            {
                                                                                question.code === code &&
                                                                                <>

                                                                                    <div className={`w-full space-y-[0.75rem] ${!aiData.career.id ? 'disabled-light' : ''}`}>

                                                                                        <div className="flex items-center">
                                                                                            {/* <h3 className="font-mona text-[13px]">Attach qestion to fields</h3> */}
                                                                                            <div className="min-w-[20%]">
                                                                                                <Filter
                                                                                                    ref={fiRef}
                                                                                                    size='xxsm'
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
                                                                                                        fields.map((x: Field) => {
                                                                                                            return {
                                                                                                                label: helper.capitalizeWord(x.name),
                                                                                                                value: x._id
                                                                                                            }
                                                                                                        })
                                                                                                    }
                                                                                                    noFilter={false}
                                                                                                    onChange={(data) => {
                                                                                                        addRubric('field', { name: data.label, id: data.value })
                                                                                                    }}
                                                                                                />
                                                                                            </div>

                                                                                        </div>

                                                                                        <FormField className="mb-[0.5rem] flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                                                                            {
                                                                                                question.fields.map((field) =>
                                                                                                    <Badge
                                                                                                        key={field.id}
                                                                                                        type={'default'}
                                                                                                        size="xsm"
                                                                                                        close={true}
                                                                                                        label={helper.capitalize(field.name)}
                                                                                                        upper={true}
                                                                                                        onClose={(e) => {
                                                                                                            removeRubric('field', field.id)
                                                                                                            fiRef.current.clear()
                                                                                                        }}
                                                                                                    />
                                                                                                )
                                                                                            }
                                                                                        </FormField>

                                                                                    </div>

                                                                                    <Divider />

                                                                                    <div className="w-full space-y-[0.75rem]">

                                                                                        <FormField className="mb-[0.5rem]">
                                                                                            <TextAreaInput
                                                                                                showFocus={true}
                                                                                                autoComplete={false}
                                                                                                placeholder="Edit question or type a new one"
                                                                                                defaultValue={question.body}
                                                                                                label={{
                                                                                                    required: false,
                                                                                                    fontSize: 14,
                                                                                                    title: "Edit question or type a new one"
                                                                                                }}
                                                                                                onChange={(e) => editQuestion('body', e.target.value)}
                                                                                            />
                                                                                        </FormField>

                                                                                    </div>

                                                                                    <Divider />

                                                                                    <div className="w-full space-y-[0.75rem]">

                                                                                        <FormField className="mb-[0.5rem]">

                                                                                            {
                                                                                                question.answers.length > 0 &&
                                                                                                question.answers.map((answer, index) =>
                                                                                                    <Fragment key={answer.alphabet}>

                                                                                                        <div className={`form-field ${(index + 1) === question.answers.length ? 'mrgb2' : 'mrgb'}`}>
                                                                                                            <TextInput
                                                                                                                type="text"
                                                                                                                showFocus={true}
                                                                                                                size="sm"
                                                                                                                defaultValue={answer.answer}
                                                                                                                autoComplete={false}
                                                                                                                placeholder="Type answer here"
                                                                                                                isError={false}
                                                                                                                label={{
                                                                                                                    required: false,
                                                                                                                    fontSize: 13,
                                                                                                                    title: `Option ${answer.alphabet.toUpperCase()}`
                                                                                                                }}
                                                                                                                onChange={(e) => editOption(answer.alphabet, e.target.value)}
                                                                                                            />
                                                                                                        </div>

                                                                                                    </Fragment>
                                                                                                )
                                                                                            }

                                                                                        </FormField>

                                                                                    </div>

                                                                                    <Divider />

                                                                                    <div className="w-full space-y-[0.75rem]">

                                                                                        <div className="flex items-center">
                                                                                            {/* <h3 className="font-mona text-[13px]">Attach qestion to fields</h3> */}
                                                                                            <div className="min-w-[20%]">
                                                                                                <Filter
                                                                                                    ref={leRef}
                                                                                                    size='xxsm'
                                                                                                    className='la-filter'
                                                                                                    placeholder="Skill Levels"
                                                                                                    position="bottom"
                                                                                                    menu={{
                                                                                                        style: { minWidth: '250px' },
                                                                                                        search: true,
                                                                                                        fullWidth: false,
                                                                                                        limitHeight: 'md'
                                                                                                    }}
                                                                                                    items={
                                                                                                        levels.map((x) => {
                                                                                                            return {
                                                                                                                label: helper.capitalizeWord(x.name),
                                                                                                                value: x.value
                                                                                                            }
                                                                                                        })
                                                                                                    }
                                                                                                    noFilter={false}
                                                                                                    onChange={(data) => {
                                                                                                        addRubric('level', data.value)
                                                                                                    }}
                                                                                                />
                                                                                            </div>

                                                                                        </div>

                                                                                        <FormField className="mb-[0.5rem] flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                                                                            {
                                                                                                question.levels.map((level) =>
                                                                                                    <Badge
                                                                                                        key={level}
                                                                                                        type={'default'}
                                                                                                        size="xsm"
                                                                                                        close={true}
                                                                                                        label={helper.capitalize(level)}
                                                                                                        upper={true}
                                                                                                        onClose={(e) => {
                                                                                                            removeRubric('level', level)
                                                                                                            leRef.current.clear()
                                                                                                        }}
                                                                                                    />
                                                                                                )
                                                                                            }
                                                                                        </FormField>

                                                                                    </div>

                                                                                    <Divider />

                                                                                    <div className="w-full space-y-[0.75rem]">

                                                                                        <div className="flex items-center">
                                                                                            {/* <h3 className="font-mona text-[13px]">Attach qestion to fields</h3> */}
                                                                                            <div className="min-w-[20%]">
                                                                                                <Filter
                                                                                                    ref={diRef}
                                                                                                    size='xxsm'
                                                                                                    className='la-filter'
                                                                                                    placeholder="Difficulties"
                                                                                                    position="bottom"
                                                                                                    menu={{
                                                                                                        style: { minWidth: '250px' },
                                                                                                        search: true,
                                                                                                        fullWidth: false,
                                                                                                        limitHeight: 'md'
                                                                                                    }}
                                                                                                    items={
                                                                                                        difficulties.map((x) => {
                                                                                                            return {
                                                                                                                label: helper.capitalizeWord(x.name),
                                                                                                                value: x.value
                                                                                                            }
                                                                                                        })
                                                                                                    }
                                                                                                    noFilter={false}
                                                                                                    onChange={(data) => {
                                                                                                        addRubric('difficulty', data.value)
                                                                                                    }}
                                                                                                />
                                                                                            </div>

                                                                                        </div>

                                                                                        <FormField className="mb-[0.5rem] flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                                                                            {
                                                                                                question.difficulties.map((diff) =>
                                                                                                    <Badge
                                                                                                        key={diff}
                                                                                                        type={'default'}
                                                                                                        size="xsm"
                                                                                                        close={true}
                                                                                                        label={helper.capitalize(diff)}
                                                                                                        upper={true}
                                                                                                        onClose={(e) => {
                                                                                                            removeRubric('difficulty', diff)
                                                                                                            diRef.current.clear()
                                                                                                        }}
                                                                                                    />
                                                                                                )
                                                                                            }
                                                                                        </FormField>

                                                                                    </div>

                                                                                    <Divider />

                                                                                    <div className="w-full space-y-[0.75rem]">

                                                                                        <div className="flex items-center">
                                                                                            {/* <h3 className="font-mona text-[13px]">Attach qestion to fields</h3> */}
                                                                                            <div className="min-w-[20%]">
                                                                                                <Filter
                                                                                                    ref={tyRef}
                                                                                                    size='xxsm'
                                                                                                    className='la-filter'
                                                                                                    placeholder="Question Types"
                                                                                                    position="bottom"
                                                                                                    menu={{
                                                                                                        style: { minWidth: '250px' },
                                                                                                        search: true,
                                                                                                        fullWidth: false,
                                                                                                        limitHeight: 'md'
                                                                                                    }}
                                                                                                    items={
                                                                                                        questionTypes.map((x) => {
                                                                                                            return {
                                                                                                                label: helper.capitalizeWord(x.name),
                                                                                                                value: x.value
                                                                                                            }
                                                                                                        })
                                                                                                    }
                                                                                                    noFilter={false}
                                                                                                    onChange={(data) => {
                                                                                                        addRubric('type', data.value)
                                                                                                    }}
                                                                                                />
                                                                                            </div>

                                                                                        </div>

                                                                                        <FormField className="mb-[0.5rem] flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                                                                            {
                                                                                                question.types.map((type) =>
                                                                                                    <Badge
                                                                                                        key={type}
                                                                                                        type={'default'}
                                                                                                        size="xsm"
                                                                                                        close={true}
                                                                                                        label={helper.capitalize(type)}
                                                                                                        upper={true}
                                                                                                        onClose={(e) => {
                                                                                                            removeRubric('type', type)
                                                                                                            tyRef.current.clear()
                                                                                                        }}
                                                                                                    />
                                                                                                )
                                                                                            }
                                                                                        </FormField>

                                                                                    </div>

                                                                                    <Divider />

                                                                                    <div className="w-full space-y-[0.75rem]">

                                                                                        <div className="flex items-center">
                                                                                            {/* <h3 className="font-mona text-[13px]">Attach qestion to fields</h3> */}
                                                                                            <div className="min-w-[20%]">
                                                                                                <Filter
                                                                                                    ref={toRef}
                                                                                                    size='xxsm'
                                                                                                    className='la-filter'
                                                                                                    placeholder="Select Topic"
                                                                                                    position="bottom"
                                                                                                    menu={{
                                                                                                        style: { minWidth: '250px' },
                                                                                                        search: true,
                                                                                                        fullWidth: false,
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
                                                                                                        addRubric('topic', { name: data.label, id: data.value })
                                                                                                    }}
                                                                                                />
                                                                                            </div>

                                                                                        </div>

                                                                                        <FormField className="mb-[0.5rem] flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                                                                            {
                                                                                                question.topics.map((topic) =>
                                                                                                    <Badge
                                                                                                        key={topic.id}
                                                                                                        type={'default'}
                                                                                                        size="xsm"
                                                                                                        close={true}
                                                                                                        label={helper.capitalize(topic.name)}
                                                                                                        upper={true}
                                                                                                        onClose={(e) => {
                                                                                                            removeRubric('topic', topic.id)
                                                                                                            toRef.current.clear()
                                                                                                        }}
                                                                                                    />
                                                                                                )
                                                                                            }
                                                                                        </FormField>

                                                                                    </div>

                                                                                    <Divider />

                                                                                    <div className="w-full space-y-[0.75rem]">

                                                                                        <div className="flex items-center">
                                                                                            {/* <h3 className="font-mona text-[13px]">Attach qestion to fields</h3> */}
                                                                                            <div className="min-w-[20%]">
                                                                                                <Filter
                                                                                                    ref={skiRef}
                                                                                                    size='xxsm'
                                                                                                    className='la-filter'
                                                                                                    placeholder="Select Skill"
                                                                                                    position="bottom"
                                                                                                    menu={{
                                                                                                        style: { minWidth: '250px' },
                                                                                                        search: true,
                                                                                                        fullWidth: false,
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
                                                                                                        addRubric('skill', { name: data.label, id: data.value })
                                                                                                    }}
                                                                                                />
                                                                                            </div>

                                                                                        </div>

                                                                                        <FormField className="mb-[0.5rem] flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                                                                            {
                                                                                                question.skills.map((skill) =>
                                                                                                    <Badge
                                                                                                        key={skill.id}
                                                                                                        type={'default'}
                                                                                                        size="xsm"
                                                                                                        close={true}
                                                                                                        label={helper.capitalize(skill.name)}
                                                                                                        upper={true}
                                                                                                        onClose={(e) => {
                                                                                                            removeRubric('skill', skill.id)
                                                                                                            skiRef.current.clear()
                                                                                                        }}
                                                                                                    />
                                                                                                )
                                                                                            }
                                                                                        </FormField>

                                                                                    </div>

                                                                                    <Divider />

                                                                                    <div className="w-full space-y-[0.75rem]">

                                                                                        <FormField className="mb-[0.5rem] flex items-center gap-x-[1rem]">

                                                                                            <div className="flex-col w-1/2">
                                                                                                <TextInput
                                                                                                    type="text"
                                                                                                    showFocus={true}
                                                                                                    size="xsm"
                                                                                                    defaultValue={question.time.value}
                                                                                                    autoComplete={false}
                                                                                                    placeholder="Type time value"
                                                                                                    isError={false}
                                                                                                    label={{
                                                                                                        title: 'Enter Time',
                                                                                                        fontSize: 14
                                                                                                    }}
                                                                                                    onChange={(e) => editQuestion('time-value', e.target.value)}
                                                                                                />
                                                                                            </div>

                                                                                            <div className="flex-col w-1/2">
                                                                                                <h3 className={`text-[13px] font-mona pag-900`}>Select Handle</h3>
                                                                                                <Filter
                                                                                                    ref={tyRef}
                                                                                                    size='xsm'
                                                                                                    className='la-filter'
                                                                                                    placeholder="Select Handle"
                                                                                                    position="bottom"
                                                                                                    defaultValue={question.time.handle}
                                                                                                    menu={{
                                                                                                        style: {},
                                                                                                        search: false,
                                                                                                        fullWidth: true,
                                                                                                        limitHeight: 'md'
                                                                                                    }}
                                                                                                    items={
                                                                                                        timeHandles.map((x) => {
                                                                                                            return {
                                                                                                                label: helper.capitalizeWord(x.name),
                                                                                                                value: x.value
                                                                                                            }
                                                                                                        })
                                                                                                    }
                                                                                                    noFilter={false}
                                                                                                    onChange={(data) => {
                                                                                                        editQuestion('time-handle', data.value)
                                                                                                    }}
                                                                                                />
                                                                                            </div>

                                                                                        </FormField>

                                                                                    </div>

                                                                                    <Divider />

                                                                                    <div className="w-full space-y-[0.75rem]">

                                                                                        <FormField className="mb-[0.5rem]">

                                                                                            <TextInput
                                                                                                type="text"
                                                                                                showFocus={true}
                                                                                                size="xsm"
                                                                                                defaultValue={question.score}
                                                                                                autoComplete={false}
                                                                                                placeholder="Type score value"
                                                                                                label={{
                                                                                                    fontSize: 14,
                                                                                                    title: 'Enter Question Score'
                                                                                                }}
                                                                                                isError={false}
                                                                                                onChange={(e) => editQuestion('score', e.target.value)}
                                                                                            />

                                                                                        </FormField>

                                                                                    </div>
                                                                                </>
                                                                            }

                                                                        </Fragment>
                                                                    )
                                                                }
                                                            </form>
                                                        }


                                                    </div>

                                                </CardUI>
                                            </div>

                                        </div>

                                    </>
                                }
                            </>
                        }
                    </>
                </CardUI>

            </section>

        </>
    )
};

export default CreateQuestionPage;
