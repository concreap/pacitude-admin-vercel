import React, { useEffect, useState, useContext, Fragment } from "react"
import GeniusContext from "../../../../context/genius/geniusContext";
import SearchInput from "../../../../components/partials/inputs/SearchInput";
import Filter from "../../../../components/partials/drops/Filter";
import Button from "../../../../components/partials/buttons/Button";
import EmptyState from "../../../../components/partials/dialogs/EmptyState";
import helper from "../../../../utils/helper.util";
import TableHead from "../../../../components/app/table/TableHead";
import CellData from "../../../../components/app/table/CellData";
import Icon from "../../../../components/partials/icons/Icon";
import RoundButton from "../../../../components/partials/buttons/RoundButton";
import { ICollection, ICoreContext, IGeniusContext, IUserContext } from "../../../../utils/interfaces.util";
import Popout from "../../../../components/partials/drops/Popout";
import Question from "../../../../models/Question.model";
import UserContext from "../../../../context/user/userContext";
import CoreContext from "../../../../context/core/coreContext";
import { FormActionType } from "../../../../utils/types.util";
import TopicForm from "../topics/TopicForm";
import QuestionForm from "./QuestionForm";
import routil from "../../../../utils/routes.util";
import { useNavigate } from "react-router-dom";
import qHelper from "../../../../utils/question.util";
import QuestionList from "./QuestionList";
import Overview from "../../../../components/app/metric/Overview";

const QuestionsPage = ({ }) => {

    const userContext = useContext<IUserContext>(UserContext)
    const coreContext = useContext<ICoreContext>(CoreContext)

    const [metric, setMetric] = useState({ total: 0, disabled: 0, enabled: 0 })

    useEffect(() => {

        initSidebar();
        initPage();

    }, [])

    useEffect(() => {

        const mt = coreContext.metrics;
        const qmt = mt.question; 

        if (qmt && mt.type === 'question' && mt.resource) {

            setMetric({
                ...metric,
                total: qmt.resource.total || qmt.total,
                enabled: qmt.resource.enabled || qmt.enabled,
                disabled: qmt.resource.disabled || qmt.disabled
            })

        } else if (qmt && mt.type === 'question') {
            setMetric({
                ...metric,
                total: qmt.total,
                enabled: qmt.enabled,
                disabled: qmt.disabled
            })
        }

    }, [coreContext.metrics])

    const initSidebar = () => {

        const result = userContext.currentSidebar(userContext.sidebar.collapsed);
        if (result) {
            userContext.setSidebar(result)
        }

    }

    const initPage = () => {
        coreContext.getResourceMetrics({ metric: 'overview', type: 'question' })
    }

    return (
        <>
            <Overview
                title="Questions Overview"
                loading={coreContext.metrics.loading}
                metrics={[
                    {
                        data: <h3 className="font-hostgro-bold pab-800 mrgb0">{metric.total.toLocaleString()}</h3>,
                        label: { pos: 'below', text: 'Total Questions' }
                    },
                    {
                        data: <h3 className="font-hostgro-bold pab-800 mrgb0">{metric.enabled.toLocaleString()}</h3>,
                        label: { pos: 'below', text: 'Active Questions' }
                    },
                    {
                        data: <h3 className="font-hostgro-bold pab-800 mrgb0">{metric.disabled.toLocaleString()}</h3>,
                        label: { pos: 'below', text: 'Inactive Questions' }
                    }
                ]}
            />

            <QuestionList type="self" />
        </>
    )

};

export default QuestionsPage;
