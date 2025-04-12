import React, { useEffect, useState, useContext, Fragment, useRef } from "react"
import Filter from "../../../../components/partials/drops/Filter";
import Button from "../../../../components/partials/buttons/Button";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import helper from "../../../../utils/helper.util";
import { IAddQuestion, IAIQuestion, ICoreContext, IGeneratedQuestion, IGeniusContext, IResourceContext, IUserContext } from "../../../../utils/interfaces.util";
import UserContext from "../../../../context/user/userContext";
import CoreContext from "../../../../context/core/coreContext";
import TextInput from "../../../../components/partials/inputs/TextInput";
import AxiosService from "../../../../services/axios.service";
import ResourceContext from "../../../../context/resource/resourceContext";
import Badge from "../../../../components/partials/badges/Badge";
import GeneratedQuestion from "../../../../components/app/question/GeneratedQuestion";
import TextAreaInput from "../../../../components/partials/inputs/TextAreaInput";
import SelectInput from "../../../../components/partials/inputs/SelectInput";
import { difficulties, questionTypes, skillLevels, timeHandles } from "../../../../_data/seed";
import DropDown from "../../../../components/layouts/DropDown";

const AIQuestionsPage = ({ }) => {

    const promptRef = useRef<any>(null)

    const userContext = useContext<IUserContext>(UserContext)
    const coreContext = useContext<ICoreContext>(CoreContext)
    const resourceContext = useContext<IResourceContext>(ResourceContext)

    const [loading, setLoading] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Array<IAIQuestion>>([])
    const [aiData, setAiData] = useState({
        prompt: '',
        model: 'anthropic',
        total: '3',
        error: ''
    });
    const [code, setCode] = useState<string>('')

    useEffect(() => {

        initSidebar()
        coreContext.getFields({ limit: 9999, page: 1, order: 'desc' })

    }, [])

    useEffect(() => {
        setQuestions(coreContext.aiQuestions)
    }, [code])

    const initSidebar = () => {

        const result = userContext.currentSidebar(userContext.sidebar.collapsed);
        if (result) {
            userContext.setSidebar(result)
        }

    }

    const getFields = () => {

        let result: Array<any> = [];

        if (coreContext.fields.data.length > 0) {

            result = coreContext.fields.data.map((f) => {
                let c = {
                    value: f._id,
                    label: helper.capitalizeWord(f.name),
                    left: '',
                    image: ''
                }
                return c;
            })

        }


        return result;

    }

    const editQuestion = (type: string, val: string) => {

        let currList = coreContext.aiQuestions;

        if (!code) {
            resourceContext.setToast({
                ...resourceContext.toast,
                show: true,
                type: 'error',
                message: 'Select a question!'
            })
            setTimeout(() => {
                resourceContext.setToast({ ...resourceContext.toast, show: false })
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

            coreContext.setAIQuestions(currList)

        }

    }

    const editOption = (alpha: string, val: string) => {

        let currList = coreContext.aiQuestions;

        if (!code) {
            resourceContext.setToast({
                ...resourceContext.toast,
                show: true,
                type: 'error',
                message: 'Select a question!'
            })
            setTimeout(() => {
                resourceContext.setToast({ ...resourceContext.toast, show: false })
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

            coreContext.setAIQuestions(currList)

        }

    }

    const addRubric = (type: string, val: any) => {

        let currList = coreContext.aiQuestions;

        if (!code) {
            resourceContext.setToast({
                ...resourceContext.toast,
                show: true,
                type: 'error',
                message: 'Select a question!'
            })
            setTimeout(() => {
                resourceContext.setToast({ ...resourceContext.toast, show: false })
            }, 2500)
        } else {

            let question = currList.find((x) => x.code === code);
            let questionI = currList.findIndex((x) => x.code === code);

            if (question) {

                let fieldIds = question.fields.map((x) => x.id);

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

                currList.splice(questionI, 1, question);

            }

            coreContext.setAIQuestions(currList)

        }

    }

    const removeRubric = (type: string, val: string) => {

        let currList = coreContext.aiQuestions;

        if (!code) {
            resourceContext.setToast({
                ...resourceContext.toast,
                show: true,
                type: 'error',
                message: 'Select a question!'
            })
        } else {

            let question = currList.find((x) => x.code === code);
            let questionI = currList.findIndex((x) => x.code === code);

            if (question) {

                let fieldIds = question.fields.map((x) => x.id);

                if (type === 'level' && question.levels.includes(val)) {
                    if (question.levels.length === 1) {
                        resourceContext.setToast({
                            ...resourceContext.toast,
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
                        resourceContext.setToast({
                            ...resourceContext.toast,
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
                        resourceContext.setToast({
                            ...resourceContext.toast,
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
                        resourceContext.setToast({
                            ...resourceContext.toast,
                            show: true,
                            type: 'error',
                            message: 'Cannot remove last question field!'
                        })
                    } else {
                        question.fields = question.fields.filter((x) => x.id !== val)
                    }
                }

                currList.splice(questionI, 1, question);

            }

            coreContext.setAIQuestions(currList)

        }

        setTimeout(() => {
            resourceContext.setToast({ ...resourceContext.toast, show: false })
        }, 2500)

    }

    const validateQuestions = async (e: any): Promise<{ error: boolean, message: string }> => {

        if (e) { e.preventDefault(); }
        let result: { error: boolean, message: string } = { error: false, message: '' };

        for (let i = 0; i < coreContext.aiQuestions.length; i++) {

            let question = coreContext.aiQuestions[i]

            if (!question.fields || question.fields.length === 0) {
                result.error = true;
                result.message = `Select at least one field for question ${i + 1}`;
                break;
            } else if (!question.body) {
                result.error = true;
                result.message = `Enter question body for question ${i + 1}`;
                break;
            } else if (!question.score) {
                result.error = true;
                result.message = `Enter score for question ${i + 1}`;
                break;
            } else if (!question.time.value) {
                result.error = true;
                result.message = `Enter time value for question ${i + 1}`;
                break;
            } else if (!question.time.handle) {
                result.error = true;
                result.message = `Select time handle for question ${i + 1}`;
                break;
            } else {
                result.error = false;
                result.message = ``;
                continue;
            }

        }

        return result;

    }

    const mapQuestions = async (): Promise<Array<IAddQuestion>> => {

        let questions: Array<IAddQuestion> = [];

        for (let i = 0; i < coreContext.aiQuestions.length; i++) {

            let fieldIds = coreContext.aiQuestions[i].fields.map((x) => x.id);
            let answers = coreContext.aiQuestions[i].answers.map((x) => { return { alphabet: x.alphabet, body: x.answer } })

            questions.push({
                body: coreContext.aiQuestions[i].body,
                answers: answers,
                levels: coreContext.aiQuestions[i].levels,
                difficulties: coreContext.aiQuestions[i].difficulties,
                types: coreContext.aiQuestions[i].types,
                correct: coreContext.aiQuestions[i].correct,
                score: coreContext.aiQuestions[i].score,
                time: coreContext.aiQuestions[i].time,
                fields: fieldIds,
            })

        }

        return questions;

    }

    const generateQuestions = async (e: any) => {

        if (e) { e.preventDefault(); }

        if (!aiData.prompt) {
            resourceContext.setToast({
                ...resourceContext.toast,
                show: true,
                type: 'error',
                message: 'Enter a prompt or instruction'
            })
        } else if (!aiData.model) {
            resourceContext.setToast({
                ...resourceContext.toast,
                show: true,
                type: 'error',
                message: 'Choose an ai model'
            })
        } else if (!aiData.total) {
            resourceContext.setToast({
                ...resourceContext.toast,
                show: true,
                type: 'error',
                message: 'Choose number of questions'
            })
        } else {

            setLoading(true);

            const response = await AxiosService.call({
                type: 'default',
                method: 'POST',
                path: `/questions/generate`,
                isAuth: true,
                payload: {
                    prompt: aiData.prompt,
                    model: aiData.model,
                    total: parseInt(aiData.total)
                }
            });

            if (response.error === false && response.status === 200) {

                let questionList: Array<IAIQuestion> = [];
                setLoading(false);

                for (let i = 0; i < response.data.length; i++) {
                    let item: IGeneratedQuestion = response.data[i];
                    questionList.push({
                        code: helper.random(6, true).toUpperCase(),
                        body: item.body,
                        answers: item.answers,
                        levels: [item.level],
                        difficulties: [item.difficulty],
                        types: [item.type],
                        correct: item.correct,
                        score: item.score,
                        time: {
                            value: helper.splitGenTime(item.time).value,
                            handle: helper.splitGenTime(item.time).handle
                        },
                        fields: []
                    })
                }

                coreContext.setAIQuestions(questionList)

                resourceContext.setToast({
                    ...resourceContext.toast,
                    show: true,
                    type: 'success',
                    message: 'Questions generated successfully'
                })
            }

            if (response.error === true) {

                setLoading(false)

                resourceContext.setToast({
                    ...resourceContext.toast,
                    show: true,
                    type: 'error',
                    message: response.errors.join(',')
                })

            }

        }

        setTimeout(() => {
            resourceContext.setToast({ ...resourceContext.toast, show: false })
        }, 2500)


    }

    const addQuestions = async (e: any) => {

        if (e) { e.preventDefault(); }

        const validate = await validateQuestions(e)

        if (validate.error) {
            resourceContext.setToast({
                ...resourceContext.toast,
                show: true,
                type: 'error',
                message: validate.message
            })
        } else {

            const questions = await mapQuestions();
            setLoading(true);

            const response = await AxiosService.call({
                type: 'default',
                method: 'POST',
                path: `/questions/add-generated`,
                isAuth: true,
                payload: {
                    generated: questions
                }
            });

            if (response.error === false && response.status === 200) {

                setLoading(false);

                resourceContext.setToast({
                    ...resourceContext.toast,
                    show: true,
                    type: 'success',
                    message: 'Questions saved successfully'
                });

                coreContext.setAIQuestions([]);
                setQuestions([]);
                setAiData({ ...aiData, error: '', model: 'anthropic', prompt: '', total: '3' })
            }

            if (response.error === true) {

                setLoading(false)

                resourceContext.setToast({
                    ...resourceContext.toast,
                    show: true,
                    type: 'error',
                    message: response.errors.join(',')
                })

            }

        }

        setTimeout(() => {
            resourceContext.setToast({ ...resourceContext.toast, show: false })
        }, 2500)

    }

    return (
        <>

            <div className="ui-dashboard-card auto-height">

                <div className="ui-flexbox align-center form">

                    <div className={`ui-flexbox align-center wp-80 ${coreContext.aiQuestions.length > 0 ? 'disabled-light' : ''}`}>
                        <TextInput
                            type="text"
                            showFocus={true}
                            size="rg"
                            defaultValue={''}
                            autoComplete={false}
                            placeholder="Enter instruction for a concept"
                            isError={false}
                            className="wp-60"
                            onChange={(e) => setAiData({ ...aiData, prompt: e.target.value })}
                        />
                        <span className="pdl1"></span>
                        <Filter
                            size="sm"
                            placeholder="Total"
                            position="bottom"
                            icon={{ type: 'polio', name: 'filter-2' }}
                            defaultValue="3"
                            items={[
                                { label: '3 Questions', value: "3" },
                                { label: '5 Questions', value: "5" },
                                { label: '10 Questions', value: "10" }
                            ]}
                            noFilter={false}
                            onChange={(item) => setAiData({ ...aiData, total: item.value })}
                        />
                        <span className="pdl1"></span>
                        <Filter
                            size="sm"
                            placeholder="AI Model"
                            position="bottom"
                            icon={{ type: 'polio', name: 'filter-2' }}
                            defaultValue="anthropic"
                            items={[
                                { label: 'OpenAI', value: 'openai' },
                                { label: 'Anthropic', value: 'anthropic' }
                            ]}
                            noFilter={false}
                            onChange={(item) => setAiData({ ...aiData, model: item.value })}
                        />
                    </div>

                    <div className="ui-ml-auto">
                        {
                            coreContext.aiQuestions.length === 0 &&
                            <Button
                                text="Create Questions"
                                type="ghost"
                                size="sm"
                                semantic="info"
                                loading={loading}
                                disabled={false}
                                fontSize={14}
                                fontWeight={"regular"}
                                lineHeight={16}
                                className="clear-btn"
                                icon={{
                                    enable: false
                                }}
                                onClick={(e) => generateQuestions(e)}
                            />
                        }
                        {
                            coreContext.aiQuestions.length > 0 &&
                            <>
                                <Button
                                    text="Clear"
                                    type="ghost"
                                    size="sm"
                                    semantic="error"
                                    loading={loading}
                                    disabled={false}
                                    fontSize={14}
                                    fontWeight={"regular"}
                                    lineHeight={16}
                                    className="clear-btn"
                                    icon={{
                                        enable: false
                                    }}
                                    onClick={(e) => {
                                        coreContext.setAIQuestions([]);
                                        setQuestions([]);
                                        setAiData({ ...aiData, error: '', model: 'anthropic', prompt: '', total: '3' })
                                        if (promptRef.current) {
                                            promptRef.current.value = ''
                                        }
                                    }}
                                />
                                <span className="pdl1"></span>
                                <Button
                                    text="Save Questions"
                                    type="ghost"
                                    size="sm"
                                    semantic="ongoing"
                                    loading={loading}
                                    disabled={false}
                                    fontSize={14}
                                    fontWeight={"regular"}
                                    lineHeight={16}
                                    className="clear-btn"
                                    icon={{
                                        enable: false
                                    }}
                                    onClick={(e) => addQuestions(e)}
                                />
                            </>
                        }
                    </div>

                </div>

            </div>

            <div className="ui-separate-small"></div>

            <div className="row no-gutters">

                <div className="col-md-6">

                    <div className="ui-dashboard-card flat gen-questions-box">

                        {
                            loading &&
                            <EmptyState bgColor='#f7f9ff' size='md' bound={true} >
                                <div><span className="loader lg primary"></span></div>
                                <span className="font-hostgro-medium fs-14 pas-950">AI is thinking</span>
                            </EmptyState>
                        }

                        {
                            !loading &&
                            <>
                                {
                                    coreContext.aiQuestions.length === 0 &&
                                    <EmptyState bgColor='#f7f9ff' size='md' bound={true} >
                                        <span className="font-hostgro-medium fs-14 pas-950">No questions generated</span>
                                    </EmptyState>
                                }
                                {
                                    coreContext.aiQuestions.length > 0 &&
                                    coreContext.aiQuestions.map((question: IAIQuestion) =>
                                        <Fragment key={question.code}>
                                            <GeneratedQuestion
                                                question={question}
                                                active={code === question.code}
                                                disabled={false}
                                                onClick={(code: string) => {
                                                    setCode(code)
                                                }}
                                            />
                                        </Fragment>
                                    )
                                }
                            </>
                        }

                    </div>

                </div>

                <div className="col-md-6">

                    <div className="ui-dashboard-card form gen-edit-questions">

                        {
                            (!code || questions.length === 0) &&
                            <EmptyState bgColor='#f7f9ff' size='md' bound={true} >
                                <span className="font-hostgro-medium fs-14 pas-950">Select a question</span>
                            </EmptyState>
                        }
                        {
                            code && questions.length > 0 &&
                            questions.map((question) =>
                                <Fragment key={question.code}>

                                    {
                                        question.code === code &&
                                        <>

                                            <div className="mrgb0">
                                                <h3 className="mrgb font-hostgro fs-14">Select Fields</h3>

                                                <div className="row mrgb2">

                                                    <div className="col-4">
                                                        <DropDown
                                                            options={getFields}
                                                            selected={(data: any) => {
                                                                addRubric('field', { name: data.label, id: data.value })
                                                            }}
                                                            className={`font-manrope dropdown topic-field-dropdown`}
                                                            placeholder={'Select'}
                                                            size="sm"
                                                            disabled={false}
                                                            search={{
                                                                enable: true,
                                                                bgColor: '#fff',
                                                                color: '#1E1335'
                                                            }}
                                                            menu={{
                                                                bgColor: '#fff',
                                                                itemColor: '#000',
                                                                itemLabel: true,
                                                                itemLeft: true,
                                                                position: 'bottom',
                                                                style: { width: '160%' }
                                                            }}
                                                            control={{
                                                                image: false,
                                                                label: true,
                                                                left: false
                                                            }}
                                                            defaultValue={0}
                                                        />
                                                    </div>

                                                    <div className="col">
                                                        <div className="ui-flexbox wrap">
                                                            {
                                                                question.fields.map((field) =>
                                                                    <Fragment key={field.id}>
                                                                        <Badge
                                                                            type='info'
                                                                            size="md"
                                                                            label={helper.capitalize(field.name)}
                                                                            close={true}
                                                                            style={{ marginBottom: '0.15rem' }}
                                                                            onClose={(e) => {
                                                                                removeRubric('field', field.id)
                                                                            }}
                                                                        />
                                                                        <span className="pdr"></span>
                                                                    </Fragment>
                                                                )
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="ui-line bg-pag-50"></div>

                                            <div className="form-field mrgb2">
                                                <TextAreaInput
                                                    showFocus={true}
                                                    autoComplete={false}
                                                    placeholder="Edit question or type a new one"
                                                    defaultValue={question.body}
                                                    label={{
                                                        required: false,
                                                        fontSize: 14,
                                                        title: "Edit Question"
                                                    }}
                                                    onChange={(e) => editQuestion('body', e.target.value)}
                                                />
                                            </div>

                                            <div className="ui-line bg-pag-50"></div>

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
                                                                    fontSize: 14,
                                                                    title: `Option ${answer.alphabet.toUpperCase()}`
                                                                }}
                                                                onChange={(e) => editOption(answer.alphabet, e.target.value)}
                                                            />
                                                        </div>

                                                    </Fragment>
                                                )
                                            }

                                            <div className="ui-line bg-pag-50"></div>

                                            <div className="mrgb0">
                                                <h3 className="mrgb font-hostgro fs-14">Skill Level</h3>

                                                <div className="row mrgb2">

                                                    <div className="col-4">
                                                        <SelectInput
                                                            showFocus={true}
                                                            placeholder={{
                                                                value: 'Choose',
                                                                enable: true
                                                            }}
                                                            size="sm"
                                                            options={skillLevels}
                                                            selected={''}
                                                            onSelect={(e) => addRubric('level', e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="col">
                                                        <div className="ui-flexbox wrap">
                                                            {
                                                                question.levels.map((level: string) =>
                                                                    <Fragment key={level + helper.random(2, true)}>
                                                                        <Badge
                                                                            type='info'
                                                                            size="md"
                                                                            label={helper.capitalize(level)}
                                                                            close={true}
                                                                            style={{ marginBottom: '0.15rem' }}
                                                                            onClose={(e) => {
                                                                                removeRubric('level', level)
                                                                            }}
                                                                        />
                                                                        <span className="pdr"></span>
                                                                    </Fragment>
                                                                )
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="ui-line bg-pag-50"></div>

                                            <div className="mrgb0">
                                                <h3 className="mrgb font-hostgro fs-14">Difficulty Level</h3>

                                                <div className="row mrgb2">

                                                    <div className="col-4">
                                                        <SelectInput
                                                            showFocus={true}
                                                            placeholder={{
                                                                value: 'Choose',
                                                                enable: true
                                                            }}
                                                            size="sm"
                                                            options={difficulties}
                                                            selected={''}
                                                            onSelect={(e) => addRubric('difficulty', e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="col">
                                                        <div className="ui-flexbox wrap">
                                                            {
                                                                question.difficulties.map((diff: string) =>
                                                                    <Fragment key={diff + helper.random(2, true)}>
                                                                        <Badge
                                                                            type='info'
                                                                            size="md"
                                                                            label={helper.capitalize(diff)}
                                                                            close={true}
                                                                            style={{ marginBottom: '0.15rem' }}
                                                                            onClose={(e) => {
                                                                                removeRubric('difficulty', diff)
                                                                            }}
                                                                        />
                                                                        <span className="pdr"></span>
                                                                    </Fragment>
                                                                )
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="ui-line bg-pag-50"></div>

                                            <div className="mrgb0">
                                                <h3 className="mrgb font-hostgro fs-14">Question Type</h3>

                                                <div className="row mrgb2">

                                                    <div className="col-4">
                                                        <SelectInput
                                                            showFocus={true}
                                                            placeholder={{
                                                                value: 'Choose',
                                                                enable: true
                                                            }}
                                                            size="sm"
                                                            options={questionTypes}
                                                            selected={''}
                                                            onSelect={(e) => addRubric('type', e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="col">
                                                        <div className="ui-flexbox wrap">
                                                            {
                                                                question.types.map((type: string) =>
                                                                    <Fragment key={type + helper.random(2, true)}>
                                                                        <Badge
                                                                            type='warning'
                                                                            size="md"
                                                                            label={helper.capitalize(type)}
                                                                            close={true}
                                                                            style={{ marginBottom: '0.15rem' }}
                                                                            onClose={(e) => {
                                                                                removeRubric('type', type)
                                                                            }}
                                                                        />
                                                                        <span className="pdr"></span>
                                                                    </Fragment>
                                                                )
                                                            }
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="ui-line bg-pag-50"></div>

                                            <div className="mrgb0">

                                                <div className="row mrgb2">

                                                    <div className="col-7">
                                                        <TextInput
                                                            type="email"
                                                            showFocus={true}
                                                            size="sm"
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

                                                    <div className="col">
                                                        <SelectInput
                                                            showFocus={true}
                                                            placeholder={{
                                                                value: 'Select',
                                                                enable: true
                                                            }}
                                                            size="sm"
                                                            options={timeHandles}
                                                            selected={question.time.handle}
                                                            label={{
                                                                title: 'Select Handle',
                                                                fontSize: 14
                                                            }}
                                                            onSelect={(e) => editQuestion('time-handle', e.target.value)}
                                                        />
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="ui-line bg-pag-50"></div>

                                            <div className="form-field mrgb0">

                                                <div className="row">

                                                    <div className="col">

                                                        <TextInput
                                                            type="email"
                                                            showFocus={true}
                                                            size="sm"
                                                            defaultValue={question.score}
                                                            autoComplete={false}
                                                            placeholder="Type score value"
                                                            label={{
                                                                fontSize: 14,
                                                                title: 'Enter Score'
                                                            }}
                                                            isError={false}
                                                            onChange={(e) => editQuestion('score', e.target.value)}
                                                        />

                                                    </div>

                                                </div>

                                            </div>

                                        </>
                                    }

                                </Fragment>
                            )
                        }

                    </div>

                </div>

            </div>

        </>
    )

};

export default AIQuestionsPage;
