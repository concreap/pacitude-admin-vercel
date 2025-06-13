import React, { useEffect, useState, useRef, Fragment, useImperativeHandle, forwardRef, ForwardedRef, MouseEvent } from "react"
import PageHeader from "../../../../components/partials/ui/PageHeader";
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import Divider from "../../../../components/partials/Divider";
import CardUI from "../../../../components/partials/ui/CardUI";
import QuestionRubric from "../../../../components/app/question/QuestionRubric";
import QuestionAnswer from "../../../../components/app/question/QuestionAnswer";
import Question, { IQuestionAnswer } from "../../../../models/Question.model";
import useField from "../../../../hooks/app/useField";
import useTopic from "../../../../hooks/app/useTopic";
import useSkill from "../../../../hooks/app/useSkill";
import useQuestion from "../../../../hooks/app/useQuestion";
import helper from "../../../../utils/helper.util";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import Filter from "../../../../components/partials/drops/Filter";
import Field from "../../../../models/Field.model";
import FormField from "../../../../components/partials/inputs/FormField";
import Badge from "../../../../components/partials/badges/Badge";
import useCareer from "../../../../hooks/app/useCareer";
import useApp from "../../../../hooks/app/useApp";
import TextAreaInput from "../../../../components/partials/inputs/TextAreaInput";
import TextInput from "../../../../components/partials/inputs/TextInput";
import { difficulties, levels, questionTypes, statusOptions, timeHandles } from "../../../../_data/seed";
import Career from "../../../../models/Career.model";
import Skill from "../../../../models/Skill.model";
import Topic from "../../../../models/Topic.model";
import useToast from "../../../../hooks/useToast";
import { ResourceType } from "../../../../utils/types.util";
import Industry from "../../../../models/Industry.model";
import useIndustry from "../../../../hooks/app/useIndustry";

const CreateField = forwardRef((props, ref: ForwardedRef<any>) => {

    const leRef = useRef<any>(null)
    const diRef = useRef<any>(null)
    const tyRef = useRef<any>(null)
    const skiRef = useRef<any>(null)
    const toRef = useRef<any>(null)

    const { core } = useApp()
    const { question, updateQuestion, detachResource, updateAnswer, getQuestion } = useQuestion()
    const { careers, getCareers } = useCareer()
    const { fields, getFields } = useField()
    const { skills, getSkills } = useSkill()
    const { toast, setToast, clearToast } = useToast()
    const [fieldData, setFieldData] = useState({
        status: false
    })

    const [status, setStatus] = useState({
        name: 'disable',
        value: false
    })

    const [career, setCareer] = useState({ _id: '', name: '' })
    const [answers, setAnswers] = useState<Array<any>>([])
    const [qData, setQData] = useState({ body: '', duration: 0, handle: '', score: 0 })
    const [fieldList, setFieldList] = useState<Array<{ id: string, name: string, ex: boolean }>>([])

    const [skillList, setSkillList] = useState<Array<{ id: string, name: string, ex: boolean }>>([])
    const [topicList, setTopicList] = useState<Array<{ id: string, name: string, ex: boolean }>>([])
    const [levelList, setLevelList] = useState<Array<{ id: string, name: string, ex: boolean }>>([])
    const [typeList, setTypeList] = useState<Array<{ id: string, name: string, ex: boolean }>>([])
    const [difficultyList, setDifficultyList] = useState<Array<{ id: string, name: string, ex: boolean }>>([])


    useEffect(() => {

        init()

    }, [])


    useEffect(() => {
        initList(25)
    }, [])

    const initList = (limit: number) => {
        getCareers({ limit: limit, page: 1, order: 'desc' })
        getFields({ limit: limit, page: 1, order: 'desc' })
        getSkills({ limit: limit, page: 1, order: 'desc' })
    }

    // expose child component functions to parent component
    useImperativeHandle(ref, () => ({
        save: handleUpdateQuestion,
        saveAnswer: handleUpdateAnswer
    }))



    const init = () => {

        if (question.career) {
            setCareer({ _id: question.career._id, name: question.career.name })
        }

        if (question.fields) {
            const fl = question.fields.map((x) => { return { id: x._id, name: helper.capitalizeWord(x.name), ex: true } })
            setFieldList(fl)
        }

        if (question.skills) {
            const sl = question.skills.map((x) => { return { id: x._id, name: helper.capitalizeWord(x.name), ex: true } })
            setSkillList(sl)
        }

        if (question.topics) {
            const tl = question.topics.map((x) => { return { id: x._id, name: helper.capitalizeWord(x.name), ex: true } })
            setTopicList(tl)
        }

        if (question.levels) {
            const ll = question.levels.map((x) => { return { id: x, name: helper.capitalizeWord(x), ex: true } })
            setLevelList(ll)
        }

        if (question.types) {
            const tl = question.types.map((x) => { return { id: x, name: helper.capitalizeWord(x), ex: true } })
            setTypeList(tl)
        }

        if (question.difficulties) {
            const dl = question.difficulties.map((x) => { return { id: x, name: helper.capitalizeWord(x), ex: true } })
            setDifficultyList(dl)
        }

    }

    const addRubric = (type: string, val: any) => {

        let fieldIds = fieldList.map((x) => x.id);
        let skillIds = skillList.map((x) => x.id);
        let topicIds = topicList.map((x) => x.id);
        let levels = levelList.map((x) => x.id);
        let types = typeList.map((x) => x.id);
        let difficulties = difficultyList.map((x) => x.id);

        if (type === 'field' && !fieldIds.includes(val.id)) {
            setFieldList(prev => [...prev, val])
        }

        if (type === 'skill' && !skillIds.includes(val.id)) {
            setSkillList(prev => [...prev, val])
        }

        if (type === 'topic' && !topicIds.includes(val.id)) {
            setTopicList(prev => [...prev, val])
        }

        if (type === 'level' && !levels.includes(val.id)) {
            setLevelList(prev => [...prev, val])
        }

        if (type === 'type' && !types.includes(val.id)) {
            setTypeList(prev => [...prev, val])
        }

        if (type === 'difficulty' && !difficulties.includes(val.id)) {
            setDifficultyList(prev => [...prev, val])
        }

    }

    const removeRubric = (type: string, id: string) => {

        if (type === 'field') {
            const fi = fieldList.find((x) => x.id === id)
            if (fi && fi.ex) {
                handleDetach(null, { type: 'field', fields: [fi.id] })
            } else {
                setFieldList(prev => prev.filter((x) => x.id !== id))
            }

        }

        if (type === 'skill') {
            const fi = skillList.find((x) => x.id === id)
            if (fi && fi.ex) {
                handleDetach(null, { type: 'skill', skills: [fi.id] })
            } else {
                setSkillList(prev => prev.filter((x) => x.id !== id))
            }

        }

        if (type === 'topic') {
            const fi = topicList.find((x) => x.id === id)
            if (fi && fi.ex) {
                handleDetach(null, { type: 'topic', topics: [fi.id] })
            } else {
                setTopicList(prev => prev.filter((x) => x.id !== id))
            }

        }

        if (type === 'level') {
            const fi = levelList.find((x) => x.id === id)
            if (fi && fi.ex) {
                handleDetach(null, { type: 'level', levels: [fi.id] })
            } else {
                setLevelList(prev => prev.filter((x) => x.id !== id))
            }

        }

        if (type === 'type') {
            const fi = typeList.find((x) => x.id === id)
            if (fi && fi.ex) {
                handleDetach(null, { type: 'type', types: [fi.id] })
            } else {
                setTypeList(prev => prev.filter((x) => x.id !== id))
            }

        }

        if (type === 'difficulty') {
            const fi = difficultyList.find((x) => x.id === id)
            if (fi && fi.ex) {
                handleDetach(null, { type: 'difficulty', difficulties: [fi.id] })
            } else {
                setDifficultyList(prev => prev.filter((x) => x.id !== id))
            }

        }

    }

    const extractRubric = (data: Array<{ id: string, name: string, ex: boolean }>) => {

        let result: Array<string> = []

        for (let i = 0; i < data.length; i++) {
            if (!data[i].ex) {
                result.push(data[i].id)
            }
        }

        return result

    }

    const editOption = (alpha: string, val: string) => {

        let currlist: Array<any> = question.answers;

        let option = currlist.find((x) => x.alphabet === alpha)
        let optionI = currlist.findIndex((x) => x.alphabet === alpha)

        if (option) {
            option.body = val;
            option.action = 'update'
            currlist.splice(optionI, 1, option)
            setAnswers(currlist)
        }

    }

    const editQuestion = (type: string, val: any) => {

        if (type === 'body') {
            setQData({ ...qData, body: val })
        } else if (type === 'time-duration') {
            setQData({ ...qData, duration: val })
        } else if (type === 'time-handle') {
            setQData({ ...qData, handle: val })
        } else if (type === 'score') {
            setQData({ ...qData, score: val })
        }

    }

    const handleUpdateQuestion = async (e: any) => {

        if (e) { e.preventDefault() }

        const payload = {
            careerId: career._id,
            body: qData.body,
            time: {
                duration: qData.duration,
                handle: qData.handle,
            },
            score: qData.score,
            isEnabled: true,
            difficulties: extractRubric(difficultyList),
            levels: extractRubric(levelList),
            types: extractRubric(typeList),
            fields: extractRubric(fieldList),
            skills: extractRubric(skillList),
            topics: extractRubric(topicList)
        }

        const response = await updateQuestion(question._id, payload);

        if (!response.error) {

            setToast({
                ...toast,
                show: true,
                type: 'success',
                message: 'Question saved successfully'
            })

            getQuestion(question._id)
            setQData({ ...qData, body: '', duration: 0, handle: '', score: 0 })
        }

        if (response.error) {

            setToast({
                ...toast,
                show: true,
                type: 'error',
                message: response.errors.join(',')
            })

        }

        setTimeout(() => {
            setToast({
                ...toast,
                show: false,
            })
        }, 1000)

    }

    const handleDetach = async (e: any, data: any) => {

        if (e) { e.preventDefault() }

        const response = await detachResource(question._id, data);

        if (!response.error) {

            setToast({
                ...toast,
                show: true,
                type: 'success',
                message: 'Question saved successfully'
            })

            getQuestion(question._id)
            setQData({ ...qData, body: '', duration: 0, handle: '', score: 0 })
        }

        if (response.error) {

            setToast({
                ...toast,
                show: true,
                type: 'error',
                message: response.errors.join(',')
            })

        }

        setTimeout(() => {
            setToast({
                ...toast,
                show: false,
            })
        }, 1000)

    }

    const handleUpdateAnswer = async (e: any) => {

        if (e) { e.preventDefault() }

        const al = answers.filter((x) => x.action && x.action === 'update');
        const payload = al.map((x) => {
            return {
                code: x.code,
                body: x.body
            }
        })

        const response = await updateAnswer(question._id, { action: 'update', answers: payload });

        if (!response.error) {

            setToast({
                ...toast,
                show: true,
                type: 'success',
                message: 'Question saved successfully'
            })

            getQuestion(question._id)
            setQData({ ...qData, body: '', duration: 0, handle: '', score: 0 })
        }

        if (response.error) {

            setToast({
                ...toast,
                show: true,
                type: 'error',
                message: response.errors.join(',')
            })

        }

        setTimeout(() => {
            clearToast()
        }, 1000)

    }

    const handleStatus = (data: any) => {

        console.log('data', data)

        setStatus({ ...status, name: data.label, value: data.value === 'enable' })

    }

    return (
        <>

            <CardUI>

                <form onSubmit={(e) => { e.preventDefault() }} className="w-[65%] mx-auto my-5">

                    <div className="w-full space-y-[0.55rem]">
                        {/* 
                        <div className="flex items-center">
                            <h3 className="font-mona text-[13px]">Career Name</h3>
                        </div> */}

                        <div className="w-full">

                            <div className="w-[40%] mb-4">
                                <TextInput
                                    type="text"
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Field name"
                                    defaultValue={''}
                                    label={{
                                        title: 'Field Name',
                                        required: true,
                                        className: 'text-[13px]'
                                    }}
                                    onChange={(e) => editQuestion('body', e.target.value)}
                                />
                            </div>

                            <Divider />

                            <div className="w-[40%] mb-4">
                                <TextInput
                                    type="text"
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Display name"
                                    defaultValue={''}
                                    label={{
                                        title: 'Display Name',
                                        required: true,
                                        className: 'text-[13px]'
                                    }}
                                    onChange={(e) => editQuestion('body', e.target.value)}
                                />
                            </div>

                        </div>

                    </div>

                    <Divider />

                    <div className="w-full space-y-[0.55rem] mb-4">

                        <div className="flex items-center">
                            <h3 className="font-mona text-[13px] flex items-center">
                                <span>Career</span>
                                <span className="text-red-600 text-base relative top-1 pl-1">*</span>
                            </h3>
                        </div>

                        <div className="w-full flex items-start gap-x-[1rem]">

                            <div className="min-w-[40%]">
                                <Filter
                                    ref={skiRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder="Select Career"
                                    position="bottom"
                                    menu={{
                                        style: { minWidth: '290px' },
                                        search: true,
                                        fullWidth: false,
                                        limitHeight: 'md'
                                    }}
                                    items={
                                        careers.data.map((x: Career) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        })
                                    }
                                    noFilter={false}
                                    onChange={(data) => {
                                        setCareer({ _id: data.value, name: data.label })
                                    }}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">

                                {
                                    career && career.name !== '' &&
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
                                    ref={skiRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder="Select Career"
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
                                    onChange={(data) => handleStatus(data)}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                
                                    <Badge
                                        type={status.value === true ? 'success' : 'error'}
                                        size="xsm"
                                        close={false}
                                        label={`${helper.capitalize(status.name)}d`}
                                        upper={true}
                                    />
                                

                            </FormField>

                        </div>

                    </div>

                    <Divider />

                    <div className="w-full flex items-start gap-x-[1rem] ">

                        <div className="w-[40%] mb-4">
                            <FormField className="w-full">
                                <TextAreaInput
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Type here"
                                    defaultValue={question.body}
                                    label={{
                                        title: 'Description',
                                        className: 'text-[13px]',
                                        required: true
                                    }}
                                    onChange={(e) => editQuestion('body', e.target.value)}
                                />
                            </FormField>
                        </div>

                    </div>

                </form>

            </CardUI>

        </>
    )
})

export default CreateField;
