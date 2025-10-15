import React, { useEffect, useState, useContext } from "react"
import PageHeader from "../../../../components/partials/ui/PageHeader";
import Icon from "../../../../components/partials/icons/Icon";
import Button from "../../../../components/partials/buttons/Button";
import TalentList from "./TalentList";
import Divider from "../../../../components/partials/Divider";
import InviteTalent from "./InviteTalent";
import useSidebar from "../../../../hooks/useSidebar";
import useUser from "../../../../hooks/app/useUser";

const TalentsPage = ({ }) => {

    const [isInvite, setIsInvite] = useState<boolean>(false)
    useSidebar({ type: 'page', init: true });

    useEffect(() => {

    }, [])


    return (
        <>

            <PageHeader
                title="All Talents"
                description="Manage platform talents"
            >
                <div className="flex items-center">
                    <Button
                        type={isInvite ? "ghost" : "primary"}
                        semantic={ isInvite ? 'error' : 'normal' }
                        size="sm"
                        className="form-button"
                        text={{
                            label: isInvite ? 'Close Invite' : "Invite Talent",
                            size: 13,
                            weight: 'regular'
                        }}
                        icon={{
                            enable: true,
                            child: <Icon name="plus" type="feather" size={16} className={`${isInvite ? 'par-600' : 'color-white'}`} />
                        }}
                        reverse="row"
                        onClick={(e) => setIsInvite(!isInvite)}
                    />
                </div>

            </PageHeader>

            <Divider show={false} />

            {
                isInvite &&
                <InviteTalent />
            }

            {
                !isInvite &&
                <TalentList type="self" />
            }

        </>
    )
};

export default TalentsPage;
