import React, { useEffect, useState, useContext, useRef } from "react"
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
import Badge from "../../../../components/partials/badges/Badge";
import QuestionRubric from "../../../../components/app/question/QuestionRubric";
import QuestionOption from "../../../../components/app/question/QuestionOption";
import QuestionAnswer from "../../../../components/app/question/QuestionAnswer";
import useQuestion from "../../../../hooks/app/useQuestion";
import { useParams } from "react-router-dom";
import QuestionBox from "../../../../components/app/question/QuestionBox";
import QuestionEdit from "../../../../components/app/question/QuestionEdit";
import helper from "../../../../utils/helper.util";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import useApp from "../../../../hooks/app/useApp";
import useCareer from "../../../../hooks/app/useCareer";
import useField from "../../../../hooks/app/useField";
import useSkill from "../../../../hooks/app/useSkill";
import useTopic from "../../../../hooks/app/useTopic";

const QuestionDetailsPage = ({ }) => {

    const { id } = useParams()
    const editRef = useRef<any>(null)

    useSidebar({ type: 'page', init: true })
    const { question, getQuestion, loading } = useQuestion();
    const { getCoreResources } = useApp()

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [editType, setEditType] = useState<string>('')

    useEffect(() => {

        if (id) {
            getQuestion(id);
            getCoreResources({ limit: 9999, page: 1, order: 'desc' })
        }

    }, [])

    const toggleEdit = (e: any, type: string) => {

        if (e) { e.preventDefault() }

        setEditType(type)
        setIsEditing(!isEditing)

    }

    return (
        <>
            <PageHeader
                title={`Question ${question && question.code ? '#' + question.code : ''}`}
                description="View and update question details"
            >
                <div className="flex items-center gap-x-[0.65rem]">
                    <Button
                        type="ghost"
                        semantic={isEditing ? 'error' : 'default'}
                        size="sm"
                        className="form-button"
                        text={{
                            label: isEditing ? "Close" : "Edit Question",
                            size: 13,
                        }}
                        icon={{
                            enable: true,
                            child: isEditing ? <Icon name="x" type="feather" size={16} className="par-600" /> : <Icon name="edit" type="polio" size={16} className="pag-900" />
                        }}
                        reverse="row"
                        onClick={(e) => toggleEdit(e, 'question')}
                    />
                    {
                        isEditing &&
                        <Button
                            type="primary"
                            semantic="normal"
                            size="sm"
                            className="form-button"
                            text={{
                                label: "Save Changes",
                                size: 13,
                            }}
                            onClick={async (e) => {

                                setIsEditing(false)
                                setEditType('')

                                if (editType === 'question') {
                                    editRef.current.save(e);
                                } else {
                                    editRef.current.saveAnswer(e);
                                }

                            }}
                        />
                    }
                </div>

            </PageHeader>

            <Divider show={false} />

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
                        helper.isEmpty(question, 'object') &&
                        <EmptyState bgColor='bg-pag-25' className="min-h-[50vh]" noBound={true} >
                            <span className="font-mona text-[14px] pas-950">Question not found!</span>
                        </EmptyState>
                    }

                    {
                        !helper.isEmpty(question, 'object') &&
                        <>
                            {
                                !isEditing &&
                                <QuestionBox question={question} onEdit={(e) => toggleEdit(e, 'answer')} />
                            }

                            {
                                isEditing &&
                                <QuestionEdit ref={editRef} editType={editType as any} />
                            }
                        </>
                    }

                    {
                        isEditing &&
                        <div className="w-[65%] mx-auto my-0">

                            <Divider show={false} />

                            <PageHeader
                                title=""
                                description=""
                            >
                                <div className="flex items-center gap-x-[0.65rem]">
                                    <Button
                                        type="ghost"
                                        semantic={isEditing ? 'error' : 'default'}
                                        size="sm"
                                        className="form-button"
                                        text={{
                                            label: isEditing ? "Close" : "Edit Question",
                                            size: 13,
                                        }}
                                        icon={{
                                            enable: true,
                                            child: isEditing ? <Icon name="x" type="feather" size={16} className="par-600" /> : <Icon name="edit" type="polio" size={16} className="pag-900" />
                                        }}
                                        reverse="row"
                                        onClick={(e) => setIsEditing(!isEditing)}
                                    />
                                    {
                                        isEditing &&
                                        <Button
                                            type="primary"
                                            semantic="normal"
                                            size="sm"
                                            className="form-button"
                                            text={{
                                                label: "Save Changes",
                                                size: 13,
                                            }}
                                            onClick={async (e) => {
                                                setIsEditing(false)
                                                setEditType('')

                                                if (editType === 'question') {
                                                    editRef.current.save(e);
                                                } else {
                                                    editRef.current.saveAnswer(e);
                                                }
                                            }}
                                        />
                                    }
                                </div>

                            </PageHeader>


                        </div>
                    }

                </>
            }



        </>
    )
};

export default QuestionDetailsPage;
