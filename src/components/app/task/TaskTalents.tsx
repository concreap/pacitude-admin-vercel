import React, { useEffect, useState, useContext, Fragment } from "react"
import { IGroupedResource } from "../../../utils/interfaces.util";
import IconButton from "../../partials/buttons/IconButton";
import helper from "../../../utils/helper.util";
import Dot from "../../partials/ui/Dot";
import { ITaskResource } from "../../../models/Task.model";
import useTask from "../../../hooks/app/useTask";
import Talent from "../../../models/Talent.model";
import UserAvatar from "../../partials/ui/UserAvatar";

interface ITaskTalents {

}

const TaskTalents = (props: ITaskTalents) => {

    const {

    } = props;

    const { task } = useTask()
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {

    }, [])

    return (
        <>
            <div className={`${isOpen ? 'space-y-[1rem]' : ''} rounded-[5px] `}>

                <div className="flex items-center">
                    <h3 className="font-mona text-[13px] pag-800">Already Assigned to ({task.talents.length}) Talents</h3>
                    <div className="flex items-center gap-x-[1rem] ml-auto">
                        <IconButton
                            size="min-w-[1.8rem] min-h-[1.8rem]"
                            className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700"
                            icon={{
                                type: 'feather',
                                name: isOpen ? 'chevron-up' : 'chevron-down',
                                size: 14,
                            }}
                            onClick={(e) => setIsOpen(!isOpen)}
                        />
                    </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>

                    <div className="flex items-center gap-x-[0.6rem] max-w-[100%] flex-wrap gap-y-[1rem]">
                        {
                            task.talents.map((talent: Talent) =>
                                <Fragment key={talent._id}>
                                    <div className="relative inline-block">
                                        {/* <IconButton
                                            size="min-w-[1rem] min-h-[1rem]"
                                            className="absolute bg-par-50 par-600 parh-600 bgh-par-100 right-0 bottom-[-0.1rem]"
                                            icon={{
                                                type: 'polio',
                                                name: 'cancel',
                                                size: 14,
                                            }}
                                            onClick={(e) => {}}
                                        /> */}
                                        <UserAvatar
                                            avatar={talent.avatar || ''}
                                            name={talent.firstName + " " + talent.lastName}
                                            width='min-w-[35px]'
                                            height='min-h-[35px]'
                                        />
                                    </div>
                                </Fragment>
                            )
                        }
                    </div>

                </div>

            </div>
        </>
    )
};

export default TaskTalents;
