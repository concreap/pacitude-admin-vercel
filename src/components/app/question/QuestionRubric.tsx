import React, { useEffect, useState, useContext, Fragment } from "react"
import { IAIQuestion } from "../../../utils/interfaces.util";
import Badge from "../../partials/badges/Badge";
import helper from "../../../utils/helper.util";
import { RubricType, SemanticType } from "../../../utils/types.util";
import Button from "../../partials/buttons/Button";
import Question from "../../../models/Question.model";
import qHelper from "../../../utils/question.util";

interface IProps {
    question: Question,
    type: RubricType,
    flex?: boolean,
    close?: boolean
}

const QuestionRubric = (props: IProps) => {

    const {
        question,
        type,
        flex = false,
        close = false,
    } = props;

    const [resources, setResources] = useState<Array<any>>([])

    useEffect(() => {

        if (type === 'level' && question.levels) {
            setResources(question.levels)
        } else if (type === 'difficulty' && question.difficulties) {
            setResources(question.difficulties)
        } else if (type === 'question-type' && question.types) {
            setResources(question.types)
        } else if (type === 'score') {
            const score = question.score && question.score.default > 0 ? question.score.default : 1;
            setResources([score.toString()])
        } else if (type === 'time') {
            let time = qHelper.formatTime(question.time)
            setResources([time])
        }

    }, [type])

    const handleSelect = (e: any) => {
        if (e) { e.preventDefault() }
    }


    return (
        <>
            <div className={`question-rubric mrgb1 ${flex ? 'ui-flexbox align-center' : ''}`}>

                <h3 className={`font-hostgro fs-14 ${flex ? 'mrgb0' : 'mrgb'}`}>{helper.capitalize(type)}:</h3>

                {
                    flex && <span className="pdr"></span>
                }

                {
                    resources.length > 0 &&
                    <div className="ui-flexbox align-center">
                        {
                            resources.map((rubric: string) =>
                                <Fragment key={rubric + helper.random(2, true)}>
                                    <Badge
                                        type={qHelper.rubricBadge(type)}
                                        size={close ? 'md' : 'mini'}
                                        label={helper.capitalize(rubric)}
                                        close={close}
                                    />
                                    <span className="pdr"></span>
                                </Fragment>
                            )
                        }

                    </div>

                }

            </div>
        </>
    )
};

export default QuestionRubric;
