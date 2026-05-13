import React, { useEffect, useState, useContext } from "react"
import useSidebar from "../../../../hooks/useSidebar";
import useGoTo from "../../../../hooks/useGoTo";
import PageHeader from "../../../../components/partials/ui/PageHeader";
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import Divider from "../../../../components/partials/Divider";
import TaskList from "../../tasks/TaskList";
import LibraryList from "../../libraries/LibraryList";
import CreditList from "./CreditList";

const CreditsPage = ({ }) => {

    useSidebar({ type: 'page', init: true })
    const { goTo } = useGoTo()

    useEffect(() => {

    }, [])

    return (
        <>

            <PageHeader
                title="Platform Credits"
                description="Grant & revoke credits. Manage credits granted to businesses"
            >
                <div className="flex items-center">
                    <Button
                        type="primary"
                        size="sm"
                        className="form-button"
                        text={{
                            label: "Grant Credit",
                            size: 13,
                            weight: 'regular'
                        }}
                        icon={{
                            enable: true,
                            child: <Icon name="plus" type="feather" size={16} className="color-white" />
                        }}
                        reverse="row"
                        onClick={(e) => goTo('/dashboard/payments/credits/grant')}
                    />
                </div>
            </PageHeader>

            <Divider show={false} />

            <CreditList type="self" />

        </>
    )
};

export default CreditsPage;
