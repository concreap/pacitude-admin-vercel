import React, { useEffect, useState, useContext, Fragment } from "react"
import { IGroupedResource } from "../../utils/interfaces.util";
import IconButton from "../partials/buttons/IconButton";
import helper from "../../utils/helper.util";
import Dot from "../partials/ui/Dot";
import { ITaskResource } from "../../models/Task.model";

interface IUIResource {
    index: number
    resource: IGroupedResource,
    edit: boolean,
    onEdit?(data: IGroupedResource): void
}

const UIResource = (props: IUIResource) => {

    const {
        index,
        resource,
        edit,
        onEdit
    } = props;

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {

    }, [])

    return (
        <>
            <div className={`${isOpen ? 'space-y-[0.65rem]' : ''} border bdr-pag-100 rounded-[5px] px-[1rem] py-[0.5rem]`}>

                <div className="flex items-center">
                    <h3 className="font-mona-medium pag-900 text-[15px]">{index + 1}. {helper.capitalize(resource.name)} Resources ({ resource.links.length })</h3>
                    <div className="flex items-center gap-x-[1rem] ml-auto">
                        {
                            isOpen && edit &&
                            <IconButton
                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700"
                                icon={{
                                    type: 'feather',
                                    name: 'edit-2',
                                    size: 14,
                                }}
                                onClick={(e) => { 
                                    if(onEdit){
                                        onEdit(resource)
                                    }
                                }}
                            />
                        }
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

                    <ul className="pl-[1rem] space-y-[0.65rem]">
                        {
                            resource.links.map((link, index) =>
                                <Fragment key={link.title + index}>
                                    <li>
                                        <div className="flex items-center gap-x-[0.5rem]">
                                            <Dot />
                                            <a href={link.url} target="_blank" className="font-mona pab-600 text-[14px]">{link.title}</a>
                                        </div>
                                    </li>
                                </Fragment>
                            )
                        }
                    </ul>

                </div>

            </div>
        </>
    )
};

export default UIResource;
