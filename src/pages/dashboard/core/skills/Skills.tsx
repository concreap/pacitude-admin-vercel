import { useEffect, useContext } from "react"
import { ICoreContext, IUserContext } from "../../../../utils/interfaces.util";
import UserContext from "../../../../context/user/userContext";
import CoreContext from "../../../../context/core/coreContext";
import SkillList from "./SkillList";

const SkillsPage = ({ }) => {

    const userContext = useContext<IUserContext>(UserContext)

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
            <SkillList type="self" />
        </>
    )

};

export default SkillsPage;
