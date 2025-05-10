import React, { useEffect, useState, useRef, Fragment, useImperativeHandle, forwardRef, ForwardedRef } from "react"
import PageHeader from "../../partials/ui/PageHeader";
import Button from "../../partials/buttons/Button";
import Icon from "../../partials/icons/Icon";
import Divider from "../../partials/Divider";
import CardUI from "../../partials/ui/CardUI";
import QuestionRubric from "./QuestionRubric";
import QuestionAnswer from "./QuestionAnswer";
import Question, { IQuestionAnswer } from "../../../models/Question.model";
import useField from "../../../hooks/app/useField";
import useTopic from "../../../hooks/app/useTopic";
import useSkill from "../../../hooks/app/useSkill";
import useQuestion from "../../../hooks/app/useQuestion";
import helper from "../../../utils/helper.util";
import EmptyState from "../../partials/dialogs/EmptyState";
import Filter from "../../partials/drops/Filter";
import Field from "../../../models/Field.model";
import FormField from "../../partials/inputs/FormField";
import Badge from "../../partials/badges/Badge";
import useCareer from "../../../hooks/app/useCareer";
import useApp from "../../../hooks/app/useApp";
import TextAreaInput from "../../partials/inputs/TextAreaInput";
import TextInput from "../../partials/inputs/TextInput";
import { difficulties, levels, questionTypes, timeHandles } from "../../../_data/seed";

interface IQuestionEdit {

}

const QuestionEdit = forwardRef((props: IQuestionEdit, ref: ForwardedRef<any>) => {

    const carRef = useRef<any>(null)
    const fiRef = useRef<any>(null)
    const leRef = useRef<any>(null)
    const diRef = useRef<any>(null)
    const tyRef = useRef<any>(null)
    const skiRef = useRef<any>(null)
    const toRef = useRef<any>(null)

    const { careers, fields, skills, topics, clearCoreResources } = useApp()
    const { question } = useQuestion()

    const [career, setCareer] = useState({ _id: '', name: '' })
    const [answers, setAnswers] = useState<Array<IQuestionAnswer>>([])
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

    // expose child component functions to parent component
    useImperativeHandle(ref, () => ({
        save: handleUpdateQuestion
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

            } else {
                setFieldList(prev => prev.filter((x) => x.id !== id))
            }

        }

        if (type === 'skill') {
            const fi = skillList.find((x) => x.id === id)
            if (fi && fi.ex) {

            } else {
                setSkillList(prev => prev.filter((x) => x.id !== id))
            }

        }

        if (type === 'topic') {
            const fi = topicList.find((x) => x.id === id)
            if (fi && fi.ex) {

            } else {
                setTopicList(prev => prev.filter((x) => x.id !== id))
            }

        }

        if (type === 'level') {
            const fi = levelList.find((x) => x.id === id)
            if (fi && fi.ex) {

            } else {
                setLevelList(prev => prev.filter((x) => x.id !== id))
            }

        }

        if (type === 'type') {
            const fi = typeList.find((x) => x.id === id)
            if (fi && fi.ex) {

            } else {
                setTypeList(prev => prev.filter((x) => x.id !== id))
            }

        }

        if (type === 'difficulty') {
            const fi = difficultyList.find((x) => x.id === id)
            if (fi && fi.ex) {

            } else {
                setDifficultyList(prev => prev.filter((x) => x.id !== id))
            }

        }

    }

    const editOption = (alpha: string, val: string) => {

        let currlist = question.answers;
        let option = currlist.find((x) => x.alphabet === alpha)
        let optionI = currlist.findIndex((x) => x.alphabet === alpha)
        if (option) {
            option.body = val;
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

    const handleUpdateQuestion = (e: any) => {

        if (e) { e.preventDefault() }

        

    }

    return (
        <>

            <CardUI>

                <form onSubmit={(e) => { e.preventDefault() }} className="w-[65%] mx-auto my-0">

                    <div className="w-full space-y-[0.55rem]">

                        <div className="flex items-center">
                            <h3 className="font-rethink text-[13px]">Question Career</h3>
                        </div>

                        <div className="w-full flex items-center gap-x-[1rem]">

                            <div className="min-w-[20%]">
                                <Filter
                                    ref={carRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder="Select Career"
                                    position="bottom"
                                    menu={{
                                        style: { minWidth: '250px' },
                                        search: true,
                                        fullWidth: false,
                                        limitHeight: 'md'
                                    }}
                                    items={
                                        careers.data.map((x: Field) => {
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
                                    question.career &&
                                    <Badge
                                        key={career._id}
                                        type={'default'}
                                        size="xsm"
                                        close={false}
                                        label={helper.capitalize(career.name)}
                                        upper={true}
                                    />
                                }
                            </FormField>

                        </div>

                    </div>

                    <Divider />

                    <div className="w-full space-y-[0.55rem]">

                        <div className="flex items-center">
                            <h3 className="font-rethink text-[13px]">Question Fields</h3>
                        </div>

                        <div className="w-full flex items-start gap-x-[1rem]">

                            <div className="min-w-[20%]">
                                <Filter
                                    ref={fiRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder="Select Field"
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
                                                fiRef.current.clear()
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
                            <h3 className="font-rethink text-[13px]">Question Body</h3>
                        </div>

                        <FormField className="">
                            <TextAreaInput
                                showFocus={true}
                                autoComplete={false}
                                placeholder="Question body"
                                defaultValue={question.body}
                                onChange={(e) => editQuestion('body', e.target.value)}
                            />
                        </FormField>

                    </div>

                    <Divider />

                    <div className="w-full space-y-[0.55rem]">

                        <div className="flex items-center">
                            <h3 className="font-rethink text-[13px]">Question Answers</h3>
                        </div>

                        <FormField className="space-y-[0.8rem]">

                            {
                                question.answers.length > 0 &&
                                question.answers.map((answer, index) =>
                                    <Fragment key={answer.alphabet}>

                                        <div className={`form-field ${(index + 1) === question.answers.length ? 'mrgb2' : 'mrgb'}`}>
                                            <TextInput
                                                type="text"
                                                showFocus={true}
                                                size="sm"
                                                defaultValue={answer.body}
                                                autoComplete={false}
                                                placeholder="Type answer here"
                                                isError={false}
                                                label={{
                                                    required: false,
                                                    fontSize: 12,
                                                    title: `Option ${answer.alphabet.toUpperCase()}`
                                                }}
                                                onChange={(e) => { editOption(answer.alphabet, e.target.value) }}
                                            />
                                        </div>

                                    </Fragment>
                                )
                            }

                        </FormField>

                    </div>

                    <Divider />

                    <div className="w-full space-y-[0.55rem]">

                        <div className="flex items-center">
                            <h3 className="font-rethink text-[13px]">Question Skills</h3>
                        </div>

                        <div className="w-full flex items-start gap-x-[1rem]">

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
                                        skills.data.map((x: Field) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
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
                                                skiRef.current.clear()
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
                            <h3 className="font-rethink text-[13px]">Question Topics</h3>
                        </div>

                        <div className="w-full flex items-start gap-x-[1rem]">

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
                                        topics.data.map((x: Field) => {
                                            return {
                                                label: helper.capitalizeWord(x.name),
                                                value: x._id
                                            }
                                        })
                                    }
                                    noFilter={false}
                                    onChange={(data) => {
                                        addRubric('topic', { id: data.value, name: data.label, ex: false })
                                    }}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                {
                                    topicList.map((topic) =>
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

                    </div>

                    <Divider />

                    <div className="w-full space-y-[0.55rem]">

                        <div className="flex items-center">
                            <h3 className="font-rethink text-[13px]">Question Levels</h3>
                        </div>

                        <div className="w-full flex items-start gap-x-[1rem]">

                            <div className="min-w-[20%]">
                                <Filter
                                    ref={leRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder="Select Level"
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
                                        addRubric('level', { id: data.value, name: data.label, ex: false })
                                    }}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                {
                                    levelList.map((level) =>
                                        <Badge
                                            key={level.id}
                                            type={'default'}
                                            size="xsm"
                                            close={true}
                                            label={helper.capitalize(level.name)}
                                            upper={true}
                                            onClose={(e) => {
                                                removeRubric('level', level.id)
                                                leRef.current.clear()
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
                            <h3 className="font-rethink text-[13px]">Question Types</h3>
                        </div>

                        <div className="w-full flex items-start gap-x-[1rem]">

                            <div className="min-w-[20%]">
                                <Filter
                                    ref={tyRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder="Select Type"
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
                                        addRubric('type', { id: data.value, name: data.label, ex: false })
                                    }}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                {
                                    typeList.map((type) =>
                                        <Badge
                                            key={type.id}
                                            type={'default'}
                                            size="xsm"
                                            close={true}
                                            label={helper.capitalize(type.name)}
                                            upper={true}
                                            onClose={(e) => {
                                                removeRubric('type', type.id)
                                                tyRef.current.clear()
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
                            <h3 className="font-rethink text-[13px]">Question Difficulties</h3>
                        </div>

                        <div className="w-full flex items-start gap-x-[1rem]">

                            <div className="min-w-[20%]">
                                <Filter
                                    ref={diRef}
                                    size='xxsm'
                                    className='la-filter'
                                    placeholder="Select Difficulty"
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
                                        addRubric('difficulty', { id: data.value, name: data.label, ex: false })
                                    }}
                                />
                            </div>

                            <FormField className="grow flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.5rem]">
                                {
                                    difficultyList.map((diff) =>
                                        <Badge
                                            key={diff.id}
                                            type={'default'}
                                            size="xsm"
                                            close={true}
                                            label={helper.capitalize(diff.name)}
                                            upper={true}
                                            onClose={(e) => {
                                                removeRubric('difficulty', diff.id)
                                                diRef.current.clear()
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
                            <h3 className="font-rethink text-[13px]">Question Duration and Score</h3>
                        </div>

                        <FormField className="mb-[0.5rem] flex items-center gap-x-[1.5rem]">

                            <div className="flex w-1/2 items-center gap-x-[0.55rem]">

                                <div className="flex-col w-1/2">
                                    <TextInput
                                        type="text"
                                        showFocus={true}
                                        size="xsm"
                                        defaultValue={question.time.duration.toString()}
                                        autoComplete={false}
                                        placeholder="Type time value"
                                        isError={false}
                                        label={{
                                            title: 'Enter Time',
                                            fontSize: 13
                                        }}
                                        onChange={(e) => editQuestion('time-duration', parseInt(e.target.value))}
                                    />
                                </div>

                                <div className="flex-col w-1/2">

                                    <div className="relative top-[2px]">
                                        <h3 className={`text-[13px] font-rethink pag-900`}>Select Handle</h3>
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

                                </div>

                            </div>

                            <div className="flex-col w-1/2">

                                <FormField className="">

                                    <TextInput
                                        type="text"
                                        showFocus={true}
                                        size="xsm"
                                        defaultValue={question.score.default.toString()}
                                        autoComplete={false}
                                        placeholder="Type score value"
                                        label={{
                                            fontSize: 13,
                                            title: 'Enter Question Score'
                                        }}
                                        isError={false}
                                        onChange={(e) => editQuestion('score', parseInt(e.target.value))}
                                    />

                                </FormField>

                            </div>

                        </FormField>

                    </div>

                </form>

            </CardUI>

        </>
    )
})

export default QuestionEdit;
