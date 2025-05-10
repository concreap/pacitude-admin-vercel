import React, { useEffect, useState, useContext } from "react"
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

const QuestionsPage = ({ }) => {

    useSidebar(true)
    const { toDetailRoute } = useGoTo()
    const { getResourceMetrics, handleSetMetric, metric, metrics, loading } = useMetrics()

    useEffect(() => {
        getResourceMetrics({ metric: 'overview', type: 'question' })
    }, [])

    useEffect(() => {
        handleSetMetric()
    }, [metrics])

    return (
        <>
            <PageHeader
                title="All platform questions"
                description="Manage platform questions"
            >
                <div className="flex items-center">
                    <Button
                        type="primary"
                        size="sm"
                        className="form-button"
                        text={{
                            label: "Create Question",
                            size: 13,
                        }}
                        icon={{
                            enable: true,
                            child: <Icon name="plus" type="feather" size={16} className="color-white" />
                        }}
                        reverse="row"
                        onClick={(e) => toDetailRoute(e, { route: 'core', name: 'create-question', subroute: 'questions' })}
                    />
                </div>

            </PageHeader>

            <Divider show={false} />

            <CardUI flat={true} noBorder={true}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border bdr-pag-100 bg-white rounded-[5px]">

                    <MetricItem
                        metric={{
                            name: 'Total Questions',
                            value: metric.total.toString(),
                            isChange: true,
                            changeType: 'increase',
                            change: '2.5%',
                            description: 'All questions on platform'
                        }}
                        className={` border-r border-gray-200`}
                    />

                    <MetricItem
                        metric={{
                            name: 'Active Questions',
                            value: metric.enabled.toString(),
                            isChange: true,
                            changeType: 'increase',
                            change: '2.5%',
                            description: 'All active questions on platform'
                        }}
                        className={` border-r border-gray-200`}
                    />

                    <MetricItem
                        metric={{
                            name: 'Inactive Questions',
                            value: metric.disabled.toString(),
                            isChange: true,
                            changeType: 'increase',
                            change: '0%',
                            description: 'All inactive questions on platform'
                        }}
                        className={` border-r border-gray-200 `}
                    />

                </div>
            </CardUI>

            <Divider show={false} />

            <QuestionList type="self" />
        </>
    )
};

export default QuestionsPage;
