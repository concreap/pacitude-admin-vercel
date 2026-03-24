import React, { useEffect, useState, useContext } from "react"
import EmptyState from "../../../components/partials/dialogs/EmptyState";
import useSidebar from "../../../hooks/useSidebar";
import Button from "../../../components/partials/buttons/Button";
import PageHeader from "../../../components/partials/ui/PageHeader";
import Icon from "../../../components/partials/icons/Icon";
import Divider from "../../../components/partials/Divider";
import TaskList from "./TaskList";
import useGoTo from "../../../hooks/useGoTo";

const TasksPage = ({ }) => {

    useSidebar({ type: 'page', init: true })
    const { toDetailRoute } = useGoTo()

    useEffect(() => {

    }, [])

    return (
        <>
            <PageHeader
                title="All Tasks Created"
                description="Manage tasks created on the system"
            >
                <div className="flex items-center">
                    <Button
                        type="primary"
                        size="sm"
                        className="form-button"
                        text={{
                            label: "New Task",
                            size: 13,
                            weight: 'regular'
                        }}
                        icon={{
                            enable: true,
                            child: <Icon name="plus" type="feather" size={16} className="color-white" />
                        }}
                        reverse="row"
                        onClick={(e) => toDetailRoute(e, { route: 'tasks', name: `create-task` })}
                    />
                </div>
            </PageHeader>


            <Divider show={false} />

            <TaskList type="self" />
        </>
    )
};

export default TasksPage;
