import React, { useEffect, useState, useContext } from "react"
import useSidebar from "../../../hooks/useSidebar";
import useGoTo from "../../../hooks/useGoTo";
import PageHeader from "../../../components/partials/ui/PageHeader";
import Button from "../../../components/partials/buttons/Button";
import Icon from "../../../components/partials/icons/Icon";
import Divider from "../../../components/partials/Divider";
import TaskList from "../tasks/TaskList";
import LibraryList from "./LibraryList";

const LibrariesPage = ({ }) => {

    useSidebar({ type: 'page', init: true })
    const { toDetailRoute } = useGoTo()

    useEffect(() => {

    }, [])

    return (
        <>

            <PageHeader
                title="Manage Your Libraries"
                description="Create video resources for learning"
            >
                <div className="flex items-center">
                    <Button
                        type="primary"
                        size="sm"
                        className="form-button"
                        text={{
                            label: "New Library",
                            size: 13,
                            weight: 'regular'
                        }}
                        icon={{
                            enable: true,
                            child: <Icon name="plus" type="feather" size={16} className="color-white" />
                        }}
                        reverse="row"
                        onClick={(e) => {
                            toDetailRoute(e, { route: 'libraries', name: `new-library` })
                        }}
                    />
                </div>
            </PageHeader>

            <Divider show={false} />

            <LibraryList type="self" />

        </>
    )
};

export default LibrariesPage;
