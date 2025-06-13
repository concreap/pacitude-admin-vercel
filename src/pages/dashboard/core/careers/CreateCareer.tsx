import React, { useEffect, useState, useRef, Fragment, useImperativeHandle, forwardRef, ForwardedRef } from "react"
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
import { difficulties, levels, questionTypes, timeHandles } from "../../../../_data/seed";
import Career from "../../../../models/Career.model";
import Skill from "../../../../models/Skill.model";
import Topic from "../../../../models/Topic.model";
import useToast from "../../../../hooks/useToast";
import { ResourceType } from "../../../../utils/types.util";
import Industry from "../../../../models/Industry.model";
import useIndustry from "../../../../hooks/app/useIndustry";

const CreateCareer = forwardRef((props, ref: ForwardedRef<any>) => {

    const leRef = useRef<any>(null)
    const diRef = useRef<any>(null)
    const tyRef = useRef<any>(null)
    const skiRef = useRef<any>(null)
    const toRef = useRef<any>(null)

    const { core } = useApp()
    const { question, updateQuestion, detachResource, updateAnswer, getQuestion } = useQuestion()
    const { industries, getIndustries } = useIndustry()
    const { fields, getFields } = useField()
    const { skills, getSkills } = useSkill()
    const { toast, setToast, clearToast } = useToast()

    const [career, setCareer] = useState({ _id: '', name: '' })
    const [answers, setAnswers] = useState<Array<any>>([])
    const [qData, setQData] = useState({ body: '', duration: 0, handle: '', score: 0 })
    const [careers, setCareers] = useState<Array<{ id: string, name: string, ex: boolean }>>([])
    const [fieldList, setFieldList] = useState<Array<{ id: string, name: string, ex: boolean }>>([])
    const [industry, setIndustry] = useState({
        id: '', name: '', ex: false
    })
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
        getIndustries({ limit: limit, page: 1, order: 'desc' })
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

                            <div className="w-[30%] mb-4">
                                <TextInput
                                    type="text"
                                    showFocus={true}
                                    autoComplete={false}
                                    placeholder="Career name"
                                    defaultValue={''}
                                    label={{
                                        title: 'Career Name',
                                        required: true,
                                        className: 'text-[13px]'
                                    }}
                                    onChange={(e) => editQuestion('body', e.target.value)}
                                />
                            </div>

                            <Divider />

                            <div className="w-[30%] mb-4">
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

                    <div className="w-full space-y-[0.55rem]">

                        <div className="flex items-center">
                            <h3 className="font-mona text-[13px]">Industry</h3>
                        </div>

                        <div className="w-full flex items-start gap-x-[1rem]">

                            <div className="min-w-[30%]">
                                <Filter
                                    ref={skiRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder="Select Industry"
                                    position="bottom"
                                    menu={{
                                        style: { minWidth: '250px' },
                                        search: true,
                                        fullWidth: false,
                                        limitHeight: 'md'
                                    }}
                                    items={
                                        industries.data.map((x: Industry) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        })
                                    }
                                    noFilter={false}
                                    onChange={(data) => {
                                        setIndustry({ id: data.value, name: data.label, ex: false })
                                    }}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">

                                {
                                    industry && industry.name !== '' &&
                                    <Badge
                                        key={industry.id}
                                        type={'default'}
                                        size="xsm"
                                        close={true}
                                        label={helper.capitalize(industry.name)}
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

                            <div className="min-w-[30%]">
                                <Filter
                                    ref={toRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder={"Select Fields"}
                                    position="bottom"
                                    menu={{
                                        style: { minWidth: '250px' },
                                        search: true,
                                        fullWidth: false,
                                        limitHeight: 'md'
                                    }}
                                    items={
                                        fields.data.map((x: Field) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        })
                                    }
                                    noFilter={false}
                                    onChange={(data) => {
                                        addRubric('field', { id: data.value, name: data.label, ex: false })
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
                                                removeRubric('field', field.id)
                                                toRef.current.clear()
                                            }}
                                        />
                                    )
                                }
                            </FormField>

                        </div>

                    </div>

                    <Divider />

                    <div className="w-full space-y-[0.55rem]">

                        <div className="flex items-center">
                            <h3 className="font-mona text-[13px]">Skills</h3>
                        </div>

                        <div className="w-full flex items-start gap-x-[1rem]">

                            <div className="min-w-[20%]">
                                <Filter
                                    ref={leRef}
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
                                        skills.data.map((x) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x.value
                                            }
                                        })
                                    }
                                    noFilter={false}
                                    onChange={(data) => {
                                        addRubric('skill', { id: data.value, name: data.label, ex: false })
                                    }}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                {
                                    skillList.map((skill) =>
                                        <Badge
                                            key={skill.id}
                                            type={'default'}
                                            size="xsm"
                                            close={true}
                                            label={helper.capitalize(skill.name)}
                                            upper={true}
                                            onClose={(e) => {
                                                removeRubric('skill', skill.id)
                                                leRef.current.clear()
                                            }}
                                        />
                                    )
                                }
                            </FormField>

                        </div>

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
                        label: "Create Career",
                        size: 13,
                    }}
                    onClick={async (e) => { }}
                />

            </div>

        </>
    )
})

export default CreateCareer;
