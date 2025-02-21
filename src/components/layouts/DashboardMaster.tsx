import React, { useEffect, useState, useContext } from "react"
import { IDashboardMaster, IResourceContext, IUserContext } from "../../utils/interfaces.util";
import useNetwork from "../../hooks/useNetwork";
import useRedirect from "../../hooks/useRedirect";
import Sidebar from "../partials/navs/Sidebar";
import UserContext from "../../context/user/userContext";
import Topbar from "../partials/navs/Topbar";
import routes from "../../routes/sidebar.route";
import storage from "../../utils/storage.util";
import ResourceContext from "../../context/resource/resourceContext";
import Toast from "../partials/alerts/Toast";

const DashboardMaster = ({ component, back, sidebar, title }: IDashboardMaster) => {

    const userContext = useContext<IUserContext>(UserContext)
    const resourceContext = useContext<IResourceContext>(ResourceContext)

    useEffect(() => {

    }, [])

    useNetwork()
    useRedirect(['admin', 'superadmin'])

    return (
        <>
            {/* sidebar here */}
            <Sidebar pageTitle={title} collapsed={sidebar.collapsed} />

            <main id="ui-dashboard-body" className={`ui-dashboard-body ${userContext.sidebar.collapsed ? 'collapsed' : 'expand'}`}>

                {/* topbar here */}
                <Topbar showBack={back} pageTitle={title} />

                <div className="ui-body-content">
                    <div className="ui-body-wrapper">

                        <Toast
                            show={resourceContext.toast.show}
                            message={resourceContext.toast.message}
                            type={resourceContext.toast.type}
                            title={resourceContext.toast.title}
                            position={resourceContext.toast.position}
                            close={(e) => {
                                resourceContext.clearToast()
                            }}
                        />

                        {component}
                    </div>
                </div>

            </main>

        </>
    )
};

export default DashboardMaster;
