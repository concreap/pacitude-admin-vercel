import React, { useEffect, useState, useContext, Fragment } from "react"
import { IAIQuestion } from "../../../utils/interfaces.util";
import Badge from "../../partials/badges/Badge";
import helper from "../../../utils/helper.util";
import { SemanticType } from "../../../utils/types.util";
import Button from "../../partials/buttons/Button";
import { IQuestionAnswer } from "../../../models/Question.model";

interface IProps {
    answers: Array<IQuestionAnswer>
}

const AnswersList = (props: IProps) => {

    const {
        answers
    } = props;

    useEffect(() => {

    }, [])

    const handleSelect = (e: any) => {
        if (e) { e.preventDefault() }

    }

    return (
        <>
            <div onClick={(e) => handleSelect(e)}
                className={`question answers-list ui-relative`}>

                {
                    answers.length > 0 &&
                    <div className="answers">
                        {
                            answers.map((answer, index) =>
                                <Fragment key={answer.code + (index + 1)}>

                                    <div className="answer">
                                        <span className={`alphabet ui-upcase ${answer.isCorrect ? 'bg-color-green color-white font-hostgro-bold' : ''}`}>{answer.alphabet}</span>
                                        <span className="pdr1"></span>
                                        <div className="content">
                                            {answer.body}
                                        </div>
                                    </div>

                                </Fragment>
                            )
                        }
                    </div>
                }

            </div>
        </>
    )
};

export default AnswersList;
