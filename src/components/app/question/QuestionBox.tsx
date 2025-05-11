import React, { useEffect, useState, useContext } from "react"
import PageHeader from "../../partials/ui/PageHeader";
import Button from "../../partials/buttons/Button";
import Icon from "../../partials/icons/Icon";
import Divider from "../../partials/Divider";
import CardUI from "../../partials/ui/CardUI";
import QuestionRubric from "./QuestionRubric";
import QuestionAnswer from "./QuestionAnswer";
import Question from "../../../models/Question.model";
import helper from "../../../utils/helper.util";

interface IQuestionBox {
    question: Question,
    onEdit(e: any): void
}

const QuestionBox = ({ question, onEdit }: IQuestionBox) => {

    const [option, setOption] = useState<string>('')

    useEffect(() => {

    }, [])

    return (
        <>

            <CardUI flat={true}>
                <div className="grid grid-cols-[70%_30%]">

                    <div className="min-h-[25vh] rounded-tl-[0.6rem] rounded-bl-[0.6rem] px-[1.3rem] py-[1rem]">

                        <div className="flex items-center">
                            <h3 className="font-rethink text-[16px] pas-900">Question</h3>
                            <div className="flex items-center ml-auto gap-x-[0.3rem]">
                                <QuestionRubric
                                    items={question.types}
                                    limit={2}
                                    type="type"
                                />
                            </div>
                        </div>

                        <Divider show={false} />

                        <div className="w-full leading-[24px]">
                            <p className="mb-0 font-rethink text-[15px] pag-700">{question.body}</p>
                        </div>

                        <Divider padding={{ enable: true, top: 'pt-[1rem]', bottom: 'pb-[1rem]' }} />

                        <QuestionAnswer
                            onEdit={onEdit}
                            options={question.answers.map((answer) => {
                                return {
                                    type: "option",
                                    disabled: true,
                                    isActive: answer.isCorrect,
                                    answer: {
                                        code: answer.code,
                                        alphabet: answer.alphabet,
                                        body: answer.body
                                    },
                                    onClick: (data) => {

                                    }
                                }
                            })}
                        />

                        <Divider show={false} />

                    </div>

                    <div className="min-h-[25vh] bg-pacb-25 rounded-tr-[0.6rem] rounded-br-[0.6rem] p-[1.3rem]">

                        <div className="w-full space-y-[2rem]">

                            <h3 className="font-rethink text-[14px] pacb-700">Quick Overview</h3>

                            <div className="space-y-[1.5rem]">

                                <div className="flex items-center">
                                    <span className="font-rethink text-[13px] pag-500">Career</span>
                                    <span className="font-rethink text-[13px] pag-500 ml-auto">{helper.capitalizeWord(question?.career?.name || '---')}</span>
                                </div>

                                <div className="flex items-center">
                                    <span className="font-rethink text-[13px] pag-500">Fields</span>
                                    {/* <span className="font-rethink text-[13px] pag-500 ml-auto">Product Management</span> */}
                                    <QuestionRubric
                                        items={question.fields.map((x) => helper.capitalizeWord(x.name))}
                                        limit={1}
                                        type="type"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <span className="font-rethink text-[13px] pag-500">Difficulty</span>
                                    <QuestionRubric
                                        className="ml-auto"
                                        items={question.difficulties}
                                        limit={2}
                                        type="difficulty"
                                    />
                                </div>

                            </div>

                            <Divider padding={{ enable: false }} bg="bg-pag-200" />

                            <div className="space-y-[1.5rem]">

                                <div className="flex items-center">
                                    <span className="font-rethink text-[13px] pacb-800">Question Score</span>
                                    <span className="font-rethink text-[13px] pacb-800 ml-auto">{ question.score.default }</span>
                                </div>

                                <div className="flex items-center">
                                    <span className="font-rethink text-[13px] pacb-800">Skill Level</span>
                                    {/* <span className="font-rethink text-[13px] pacb-800 ml-auto">Beginner</span> */}
                                    <QuestionRubric
                                        items={question.levels.map((x) => helper.capitalizeWord(x))}
                                        limit={1}
                                        type="type"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <span className="font-rethink text-[13px] pacb-800">Time</span>
                                    <span className="font-rethink text-[13px] pacb-800 ml-auto">{ question.time.duration } { helper.capitalize(question.time.handle) }</span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </CardUI>

        </>
    )
};

export default QuestionBox;
