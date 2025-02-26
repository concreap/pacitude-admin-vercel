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
import CareerDetails from "./CareerDetails";
import routil from "../../../../utils/routes.util";
import { useNavigate } from "react-router-dom";
import qHelper from "../../../../utils/question.util";
import CareerList from "./CareerList";

const CareersPage = ({ }) => {

    const userContext = useContext<IUserContext>(UserContext)
    const coreContext = useContext<ICoreContext>(CoreContext)

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
            <CareerList type="self" />
        </>
    )

};

export default CareersPage;
