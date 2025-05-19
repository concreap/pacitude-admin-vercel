import React, { useEffect, useState, useContext } from "react"
import { IQuestionOption } from "../../../utils/interfaces.util";

const QuestionOption = (props: IQuestionOption) => {

    const {
        type,
        answer,
        isActive = false,
        disabled = false,
        onClick
    } = props;

    useEffect(() => {

    }, [])

    const cac = () => {

        let result = `inline-flex items-center justify-center min-w-[27px] min-h-[27px] rounded-full`

        if (isActive) {
            result = result + ` ${type === 'option' ? 'bg-pagr-600' : 'bg-pacb-400'}`
        } else {
            result = result + ` bg-white border bdr-pacb-200`
        }

        return result;

    }

    const ctc = () => {

        let result = ''

        if (isActive) {
            result = result + ` font-mona-medium ${type === 'option' ? 'pagr-700' : 'pacb-600'}`
        } else {
            result = result + ` font-mona pag-700`
        }

        return result;

    }

    const handleClick = (e: any) => {

        if(e) { e.preventDefault() }

        if(onClick){
            onClick(answer)
        }

    }

    return (
        <>
            <div onClick={(e) => disabled ? {} : handleClick(e)} className={`w-full flex items-center gap-x-[2.2rem] ${ type === 'option' ? !disabled ? 'cursor-pointer' : '' : '' }`}>

                <div className="flex items-center gap-x-[0.69rem]">
                    <div className={cac()}>
                        {
                            isActive &&
                            <div className="min-w-[13px] min-h-[13px] bg-white rounded-full"></div>
                        }
                    </div>
                    <span className={`text-[15px] uppercase ${ctc()}`}>{answer.alphabet}</span>
                </div>

                <div className="grow">
                    <p className={`text-[14px] ${ctc()}`}>{answer.body}</p>
                </div>

            </div>
        </>
    )
};

export default QuestionOption;
