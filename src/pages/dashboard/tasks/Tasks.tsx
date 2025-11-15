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
                title="See all tasks created"
                description="Manage your tasks and see the task  created"
            />


            <Divider show={false} />

            <TaskList type="self" />
        </>
    )
};

export default TasksPage;
