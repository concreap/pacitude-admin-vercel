import React, { useEffect, useState, useContext } from "react"
import { IDashboardMaster } from "../../utils/interfaces.util";
import useNetwork from "../../hooks/useNetwork";
import useRedirect from "../../hooks/useRedirect";
import Sidebar from "../partials/navs/Sidebar";

const DashboardMaster = ({ component, back, sidebar, title }: IDashboardMaster) => {

    useEffect(() => {

    }, [])

    useNetwork()
    useRedirect(['admin', 'superadmin'])

    return (
        <>
            {/* sidebar here */}
            <Sidebar pageTitle={title} />
            <main id="ui-dashboard-body" className="ui-dashboard-body">

                {/* topbar here */}

                <div className="ui-body-content">
                    <div className="ui-body-content-inner">
                        { component }
                    </div>
                </div>

            </main>
        </>
    )
};

export default DashboardMaster;
