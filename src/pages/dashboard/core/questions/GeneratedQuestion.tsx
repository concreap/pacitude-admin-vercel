import React, { useEffect, useState, useContext, Fragment } from "react"
import { IAIQuestion } from "../../../../utils/interfaces.util";
import Divider from "../../../../components/partials/Divider";
import helper from "../../../../utils/helper.util";
import Badge from "../../../../components/partials/badges/Badge";

interface IGeneratedQuestion {
    question: IAIQuestion,
    active: boolean,
    disabled?: boolean
    onClick(code: string): void
}

const GeneratedQuestion = (props: IGeneratedQuestion) => {

    const {
        question,
        active = false,
        disabled = false,
        onClick
    } = props;
    const shadow = 'shadow-[5px_5px_20px_1px_rgba(0,0,0,0.015)]'

    useEffect(() => {

    }, [])

    const cc = () => {

        let result = `w-full min-h-[150px] cursor-pointer ${shadow} rounded-[10px] border bdr-pag-50 bdrh-pab-200 p-[1rem] mb-[1rem]`;

        if (disabled) {
            result = result + ` disabled-light`
        }

        return result;

    }

    const cac = () => {

        let result = `flex items-center justify-center min-w-[25px] min-h-[25px] text-[14px] font-mona-medium rounded-full uppercase`;

        return result;

    }

    const handleSelect = (e: any) => {
        if (e) { e.preventDefault() }
        onClick(question.code);
    }

    return (
        <>
            <div onClick={(e) => handleSelect(e)} className={cc()} style={{ borderColor: active ? '#45c2f0' : '' }}>

                <div className="mrgb font-mona text-[16px] pag-950 leading-[28px]">{question.body}</div>

                <Divider />

                {
                    question.answers.length > 0 &&
                    <>
                        <div className="w-full">
                            {
                                question.answers.map((answer, index) =>
                                    <Fragment key={answer.alphabet + (index + 1)}>

                                        <div className="flex items-center gap-x-[0.8rem] mb-[1rem]">
                                            <span className={`${cac()} ${answer.alphabet === question.correct ? 'bg-pagr-600 color-white font-mona-bold' : 'bg-pab-50 pab-700'}`}>{answer.alphabet}</span>
                                            <div className={`grow text-[14px] font-mona ${answer.alphabet === question.correct ? 'pagr-700' : 'pag-800'}`}>
                                                {answer.answer}
                                            </div>
                                        </div>

                                    </Fragment>
                                )
                            }
                        </div>
                    </>
                }

                <Divider />

                <div className="grid grid-cols-3 gap-x-[1rem]">

                    {
                        question.levels.length > 0 &&
                        <div className="flex items-center gap-x-[0.5rem]">
                            <span className="font-mona text-[14px]">Level:</span>
                            <Badge
                                type={'info'}
                                size="xxsm"
                                label={helper.capitalize(question.levels[0])}
                                upper={true}
                            />
                        </div>
                    }

                    {
                        question.difficulties.length > 0 &&
                        <div className="flex items-center gap-x-[0.5rem]">
                            <span className="font-mona text-[14px]">Difficulty:</span>
                            <Badge
                                type={'ongoing'}
                                size="xxsm"
                                label={helper.capitalize(question.difficulties[0])}
                                upper={true}
                            />
                        </div>
                    }

                </div>

                <div className="py-[0.5rem]"></div>

                <div className="grid grid-cols-3 gap-x-[1rem]">

                    {
                        question.types.length > 0 &&
                        <div className="flex items-center gap-x-[0.5rem]">
                            <span className="font-mona text-[14px]">Types:</span>
                            <Badge
                                type={'warning'}
                                size="xxsm"
                                label={helper.capitalize(question.types[0])}
                                upper={true}
                            />
                        </div>
                    }

                    <div className="flex items-center gap-x-[0.5rem]">
                        <span className="font-mona text-[14px]">Time:</span>
                        <Badge
                            type={'success'}
                            size="xxsm"
                            label={`${question.time.value} ${helper.capitalize(question.time.handle)}`}
                            upper={true}
                        />
                    </div>

                    <div className="flex items-center gap-x-[0.5rem]">
                        <span className="font-mona text-[14px]">Score:</span>
                        <Badge
                            type={'default'}
                            size="xxsm"
                            label={`${question.score} / ${question.score}`}
                            upper={true}
                        />
                    </div>



                </div>

            </div>
        </>
    )
};

export default GeneratedQuestion;
