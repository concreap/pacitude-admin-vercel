import React, { useEffect, useState, useContext, Fragment } from "react"
import { IQuestionOption } from "../../../utils/interfaces.util";
import EmptyState from "../../partials/dialogs/EmptyState";
import QuestionOption from "./QuestionOption";
import IconButton from "../../partials/buttons/IconButton";

interface IQuestionAnswer {
    options: Array<IQuestionOption>
    onEdit(e: any): void
}

const QuestionAnswer = ({ options, onEdit }: IQuestionAnswer) => {

    useEffect(() => {

    }, [])

    return (
        <>
            <div className="w-full space-y-[1.4rem]">

                {
                    options.length === 0 &&
                    <>
                        <EmptyState className="min-h-[20vh]" noBound={true}>
                            <span className="font-mona pag-600 text-[13px]">Options will appear here</span>
                        </EmptyState>
                    </>
                }

                {
                    options.length > 0 &&
                    <>
                        <div className="w-full flex items-center">
                            <IconButton
                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                className="ml-auto bg-pag-100 bgh-pab-200"
                                icon={{
                                    type: 'polio',
                                    name: 'edit',
                                    size: 16,
                                }}
                                onClick={(e) => onEdit(e)}
                            />
                        </div>

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
