import React, { useEffect, useState, useContext } from "react"
import { IDashboardMaster } from "../../utils/interfaces.util";

const DashboardMaster = ({ component, back, sidebar, title }: IDashboardMaster) => {

    useEffect(() => {

    }, [])

    return (
        <>
            {/* sidebar here */}
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
