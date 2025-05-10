import React, { Fragment, useEffect, useState } from "react"
import useRandom from "../../../hooks/useRandom";
import helper from "../../../utils/helper.util";
import Badge from "../../partials/badges/Badge";


interface IQuestionRubric {
    type: 'level' | 'difficulty' | 'type' | 'time' | 'score',
    limit?: number,
    className?: string,
    items: Array<string>
}

const QuestionRubric = ({ type, items, limit = 3, className = '' }: IQuestionRubric) => {

    const { semantics, randomizeIndexes } = useRandom()

    const [badges, setBadges] = useState<Array<string>>([])
    const [remBadges, setRemBadges] = useState<Array<string>>([])
    const [indexes, setIndexes] = useState<Array<number>>([])
    

    useEffect(() => {

        sliceItems()
        setIndexes(randomizeIndexes(semantics, limit))

    }, [])

    const sliceItems = () => {

        if (limit > items.length) {
            setBadges([...items])
            setRemBadges([])
        } else {
            setBadges(items.slice(0, limit))
            setRemBadges(items.slice(limit))
        }

    }

    const getType = (index: number) => {
        return semantics[indexes[index]]
    }

    return (
        <>
            <div className={`flex items-center ml-auto gap-x-[0.3rem] ${className}`}>

                {
                    badges.map((bd, index) =>
                        <Fragment key={bd + index}>
                            <Badge
                                type={getType(index)}
                                size="xsm"
                                display="badge"
                                label={helper.capitalize(bd)}
                                padding={{ y: 1, x: 12 }}
                                font={{
                                    weight: 'regular',
                                    size: 12
                                }}
                                upper={false}
                                close={false}
                            />
                        </Fragment>
                    )
                }

                { remBadges.length > 0 && <span className="text-[13px] color-black font-rethink">+{ remBadges.length }</span> }

            </div>
        </>
    )
};

export default QuestionRubric;
