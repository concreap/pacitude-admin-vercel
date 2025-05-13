import React, { useEffect, useState, useContext } from "react"
import PageHeader from "../../../../components/partials/ui/PageHeader";
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import Divider from "../../../../components/partials/Divider";
import useSidebar from "../../../../hooks/useSidebar";
import FieldList from "./FieldList";

const FieldsPage = ({ }) => {

    useSidebar({ type: 'page', init: true })

    useEffect(() => {

    }, [])

    return (
        <>
            <PageHeader
                title="All platform fields"
                description="Manage platform fields"
            >
                <div className="flex items-center">
                    <Button
                        type="primary"
                        size="sm"
                        className="form-button"
                        text={{
                            label: "New Field",
                            size: 13,
                            weight: 'regular'
                        }}
                        icon={{
                            enable: true,
                            child: <Icon name="plus" type="feather" size={16} className="color-white" />
                        }}
                        reverse="row"
                        onClick={(e) => {}}
                    />
                </div>

            </PageHeader>

            <Divider show={false} />

            <FieldList type="self" />
        </>
    )
};

export default FieldsPage;
