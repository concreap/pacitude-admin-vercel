import React, { useEffect, useState, useContext, Fragment } from "react"
import { IQuestionOption } from "../../../utils/interfaces.util";
import EmptyState from "../../partials/dialogs/EmptyState";
import QuestionOption from "./QuestionOption";

interface IQuestionAnswer {
    options: Array<IQuestionOption>
}

const QuestionAnswer = ({ options }: IQuestionAnswer) => {

    useEffect(() => {

    }, [])

    return (
        <>
            <div className="w-full space-y-[1.4rem]">

                {
                    options.length === 0 &&
                    <>
                        <EmptyState className="min-h-[20vh]" noBound={true}>
                            <span className="font-rethink pag-600 text-[13px]">Options will appear here</span>
                        </EmptyState>
                    </>
                }

                {
                    options.length > 0 &&
                    <>
                        {
                            options.map((option) => 
                                <Fragment key={option.answer.code}>
                                    <QuestionOption {...option} />
                                </Fragment>
                            )
                        }
                    </>
                }

            </div>
        </>
    )
};

export default QuestionAnswer;
