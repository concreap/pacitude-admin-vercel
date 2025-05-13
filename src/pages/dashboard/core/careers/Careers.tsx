import React, { useEffect, useState, useContext } from "react"
import PageHeader from "../../../../components/partials/ui/PageHeader";
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import Divider from "../../../../components/partials/Divider";
import CareerList from "./CareerList";
import useSidebar from "../../../../hooks/useSidebar";

const CareersPage = ({ }) => {

    useSidebar({ type: 'page', init: true })

    useEffect(() => {

    }, [])

    return (
        <>
            <PageHeader
                title="All platform careers"
                description="Manage platform careers"
            >
                <div className="flex items-center">
                    <Button
                        type="primary"
                        size="sm"
                        className="form-button"
                        text={{
                            label: "New Career",
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

            <CareerList type="self" />
        </>
    )
};

export default CareersPage;
