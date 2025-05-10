import React, { useEffect, useState, useContext } from "react"
import { IDashboardLayout, IUserContext } from "../../utils/interfaces.util";
import UserContext from "../../context/user/userContext";
import SideBar from "../partials/navs/Sidebar";
import Topbar from "../partials/navs/Topbar";
import Toast from "../partials/alerts/Toast";
import useToast from "../../hooks/useToast";
import useSidebar from "../../hooks/useSidebar";

const Name = ({ component, back, sidebar: sidenav, title }: IDashboardLayout) => {

    const { sidebar } = useSidebar(false)
    const { toast, clearToast } = useToast()

    useEffect(() => {

    }, [])

    const mc = () => {

        let result = 'dashboard-body min-h-[100vh]'

        if (sidebar.collapsed) {
            result = result + ` pl-[84px]`;
        } else {
            result = result + ` pl-[260px]`;
        }

        return result;

    }

    const wc = () => {

        let result = 'dashboard-body-wrapper mt-[5rem] px-[2rem] py-[1.5rem] min-h-[calc(100vh-5rem)]'

        return result;

    }

    return (
        <>
            {/* sidebar here */}
            <SideBar pageTitle={title} collapsed={sidenav.collapsed} />

            <main id='dashboard-body' className={mc()}>

                {/* topbar here */}
                <Topbar pageTitle={title} showBack={back} sticky={true} />

                <div className="dashboard-content w-[100%]">

                    <div className={wc()}>

                        <Toast
                            show={toast.show}
                            message={toast.message}
                            type={toast.type}
                            title={toast.title}
                            position={toast.position}
                            close={(e) => {
                                clearToast()
                            }}
                        />

                        {component}

                    </div>

                </div>

            </main>

        </>
    )

};

export default Name;
