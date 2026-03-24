import React, { useEffect, useState, useContext } from "react"
import Divider from "../../partials/Divider";
import Talent from "../../../models/Talent.model";
import UserAvatar from "../../partials/ui/UserAvatar";
import Career from "../../../models/Career.model";
import useGroup from "../../../hooks/app/useGroup";
import useUser from "../../../hooks/app/useUser";
import Group from "../../../models/Group.model";

interface ITalentCard {
    talent: Talent,
    onClick?(e: any): void
}

const TalentCard = (props: ITalentCard) => {

    const {
        talent,
        onClick
    } = props;

    const { getFullname } = useUser();
    const { extractGroup } = useGroup();
    const [career, setCareer] = useState<Career>()
    const [groups, setGroups] = useState<Array<Group>>([])

    useEffect(() => {

        if(talent.careers && talent.careers.length > 0){
            setCareer(talent.careers[0].career)
        }

        if(talent.groups && talent.groups.length > 0){
            const extract = extractGroup({ type: 'talent', id: talent._id, groups: talent.groups });
            setGroups(extract)
        }

    }, [talent])

    const displayGroup = () => {

        let result: string = 'N/A';

        if(groups.length > 0){

            result = groups[0].name;

            if(groups.length > 1){
                result = result + ` ${groups.length - 1}`;
            }

        }

        return result;

    }

    const handleClick = (e: any) => {
        if(onClick){
            onClick(e)
        }
    }

    return (
        <>
            <div onClick={(e) => onClick ? handleClick(e) : {}} className={`${ onClick ? 'cursor-pointer' : '' } min-h-[158px] p-[5px] rounded-[10px] border-[0.5px] border-[#E4E8F0]`}>
                <div className="min-h-[72px] w-full rounded-[8px] flex items-center gap-4 px-4 py-4 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('../../../images/assets/bg@group-banner.png')` }}>
                    <div>
                        <UserAvatar
                            size="w-[50px] h-[50px]"
                            className="topbar-avatar bg-color-white"
                            avatar={talent.avatar ? talent.avatar : ''}
                            name={getFullname(talent)}
                        />
                    </div>
                    <div>
                        <h3 className="font-mona-medium text-[14px] text-[#2F303B]">{getFullname(talent)}</h3>
                        <p className="font-mona text-[12px] text-[#444767] truncate ... w-[80%]">@{talent.username}</p>
                    </div>
                </div>
                <Divider show={false} padding={{ enable: true, top: 'pt-0', bottom: 'pb-4' }} />
                <div className="pl-4">
                    <h3 className="font-mona text-[13px] text-[#2F303B] mb-1">{ career ? career.name : 'Talent\'s Career' }</h3>
                    <p className="font-mona text-[12px] text-[#84869A]">
                        <span className="font-mona text-[12px] pag-700">Group: </span>
                        <span className="font-mona text-[12px] text-[#84869A]">{ displayGroup() }</span>
                    </p>
                </div>
                <Divider show={false} padding={{ enable: true, top: 'pt-0', bottom: 'pb-4' }} />
            </div>
        </>
    )
};

export default TalentCard;
