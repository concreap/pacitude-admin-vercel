import React, { useEffect, useState, useContext } from "react"
import PageHeader from "../../../../components/partials/ui/PageHeader";
import Button from "../../../../components/partials/buttons/Button";
import Icon from "../../../../components/partials/icons/Icon";
import Divider from "../../../../components/partials/Divider";
import useSidebar from "../../../../hooks/useSidebar";
import SkillList from "./SkillList";
import useApp from "../../../../hooks/app/useApp";
import { coreTypeEnum } from "../../../../utils/enums.util";

const SkillsPage = ({ }) => {

    useSidebar({ type: 'page', init: true })
    const { toggleAddResource } = useApp()

    useEffect(() => {

    }, [])

    return (
        <>
            <PageHeader
                title="All platform skills"
                description="Manage platform skills"
            >
                <div className="flex items-center">
                    <Button
                        type="primary"
                        size="sm"
                        className="form-button"
                        text={{
                            label: "New Skill",
                            size: 13,
                            weight: 'regular'
                        }}
                        icon={{
                            enable: true,
                            child: <Icon name="plus" type="feather" size={16} className="color-white" />
                        }}
                        reverse="row"
                        onClick={(e) => toggleAddResource(e, coreTypeEnum.SKILL)}
                    />
                </div>

            </PageHeader>

            <Divider show={false} />

            <SkillList type="self" />
        </>
    )
};

export default SkillsPage;
