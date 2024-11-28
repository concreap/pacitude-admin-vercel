import React, { useEffect, useState, useContext } from "react"
import { IDashboardMaster, IUserContext } from "../../utils/interfaces.util";
import useNetwork from "../../hooks/useNetwork";
import useRedirect from "../../hooks/useRedirect";
import Sidebar from "../partials/navs/Sidebar";
import UserContext from "../../context/user/userContext";
import Topbar from "../partials/navs/Topbar";

const DashboardMaster = ({ component, back, sidebar, title }: IDashboardMaster) => {

    const userContext = useContext<IUserContext>(UserContext)

    useEffect(() => {

    }, [])

    useNetwork()
    useRedirect(['admin', 'superadmin'])

    return (
        <>
            {/* sidebar here */}
            <Sidebar pageTitle={title} collapsed={sidebar.collapsed} />

            <main id="ui-dashboard-body" className={`ui-dashboard-body ${ userContext.sidebar.collapsed ? 'collapsed' : 'expand' }`}>

                {/* topbar here */}
                <Topbar showBack={back} pageTitle={title} />

                <div className="ui-body-content">
                    <div className="ui-body-wrapper">
                        { component }
                    </div>
                </div>

            </main>
            
        </>
    )
};

export default DashboardMaster;
