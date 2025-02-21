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
import IndustryDetails from "./IndustryDetails";
import routil from "../../../../utils/routes.util";
import { useNavigate } from "react-router-dom";
import qHelper from "../../../../utils/question.util";
import IndustryList from "./IndustryList";

const IndustriesPage = ({ }) => {

    const LIMIT = 25;
    const navigate = useNavigate()

    const userContext = useContext<IUserContext>(UserContext)
    const coreContext = useContext<ICoreContext>(CoreContext)

    const [showPanel, setShowPanel] = useState<boolean>(false);
    const [form, setForm] = useState<{ action: FormActionType, questionId: string }>({ action: 'add-resource', questionId: '' })

    useEffect(() => {

        initSidebar()

    }, [])

    const initSidebar = () => {

        const result = userContext.currentSidebar(userContext.sidebar.collapsed);
        if (result) {
            userContext.setSidebar(result)
        }

    }

    return (
        <>
            <IndustryList type="self" />
        </>
    )

};

export default IndustriesPage;
