import React, { useEffect, useState, useContext, Fragment } from "react"
import { IAIQuestion } from "../../../utils/interfaces.util";
import Badge from "../../partials/badges/Badge";
import helper from "../../../utils/helper.util";
import { SemanticType } from "../../../utils/types.util";
import Button from "../../partials/buttons/Button";

interface IProps {
    question: IAIQuestion,
    active: boolean,
    disabled?: boolean
    onClick(code: string): void
}

const GeneratedQuestion = (props: IProps) => {

    const {
        question,
        active = false,
        disabled = false,
        onClick
    } = props;

    useEffect(() => {

    }, [])

    const handleSelect = (e: any) => {
        if (e) { e.preventDefault() }
        onClick(question.code);
    }

    return (
        <>
            <div onClick={(e) => handleSelect(e)}
                className={`question generated ui-cursor-pointer ui-relative ${disabled ? 'disabled-light' : ''}`}
                style={{ borderColor: active ? '#45c2f0' : '' }}>

                <h3 className="mrgb font-hostgro-medium fs-17 pab-900 question-body">{question.body}</h3>
                <div className="ui-line bg-pag-100"></div>
                {
                    question.answers.length > 0 &&
                    <div className="answers">
                        {
                            question.answers.map((answer, index) =>
                                <Fragment key={answer.alphabet + (index + 1)}>

                                    <div className="answer">
                                        <span className={`alphabet ui-upcase ${answer.alphabet === question.correct ? 'bg-color-green color-white font-hostgro-bold' : ''}`}>{answer.alphabet}</span>
                                        <span className="pdr1"></span>
                                        <div className="content">
                                            {answer.answer}
                                        </div>
                                    </div>

                                </Fragment>
                            )
                        }
                    </div>
                }

                <div className="ui-line bg-pag-100"></div>

                <div className="row mrgb1">

                    {
                        question.levels.length > 0 &&
                        <div className="col-3">

                            <div className="ui-flexbox align-center">
                                <span className="font-hostgro fs-14 pdr1">Level:</span>
                                <Badge
                                    type='info'
                                    size="mini"
                                    label={helper.capitalize(question.levels[0])}
                                    close={false}
                                />
                                {/* {
                                    question.levels.map((level: string) =>
                                        <Fragment key={level + helper.random(2, true)}>
                                            <Badge
                                                type='info'
                                                size="mini"
                                                label={helper.capitalize(level)}
                                                close={false}
                                            />
                                            <span className="pdr"></span>
                                        </Fragment>
                                    )
                                } */}
                            </div>

                        </div>

                    }

                    {
                        question.difficulties.length > 0 &&
                        <div className="col-3">

                            <div className="ui-flexbox align-center">
                                <span className="font-hostgro fs-14 pdr1">Difficulty:</span>
                                <Badge
                                    type='info'
                                    size="mini"
                                    label={helper.capitalize(question.difficulties[0])}
                                    close={false}
                                />
                                {/* {
                                    question.difficulties.map((diff: string) =>
                                        <Fragment key={diff + helper.random(2, true)}>
                                            <Badge
                                                type='info'
                                                size="mini"
                                                label={helper.capitalize(diff)}
                                                close={false}
                                            />
                                            <span className="pdr"></span>
                                        </Fragment>
                                    )
                                } */}
                            </div>

                        </div>

                    }



                </div>

                <div className="row">

                    <div className="col-3">

                        <div className="ui-flexbox align-center">
                            <span className="font-hostgro fs-14 pdr1">Time:</span>
                            <Badge
                                type='success'
                                size="mini"
                                label={`${question.time.value} ${helper.capitalize(question.time.handle)}`}
                                close={false}
                            />
                        </div>

                    </div>

                    {
                        question.types.length > 0 &&
                        <div className="col-3">

                            <div className="ui-flexbox align-center">
                                <span className="font-hostgro fs-14 pdr1">Type:</span>
                                <Badge
                                    type='warning'
                                    size="mini"
                                    label={helper.capitalize(question.types[0])}
                                    close={false}
                                />
                                {/* {
                                    question.types.map((type: string) =>
                                        <Fragment key={type + helper.random(2, true)}>
                                            <Badge
                                                type='warning'
                                                size="mini"
                                                label={helper.capitalize(type)}
                                                close={false}
                                            />
                                            <span className="pdr"></span>
                                        </Fragment>
                                    )
                                } */}
                            </div>

                        </div>

                    }

                    <div className="col-3">

                        <div className="ui-flexbox align-center">
                            <span className="font-hostgro fs-14 pdr1">Score:</span>
                            <Badge
                                type='ongoing'
                                size="mini"
                                label={question.score}
                                close={false}
                            />
                        </div>

                    </div>

                </div>

            </div>
        </>
    )
};

export default GeneratedQuestion;
