import React, { CSSProperties, ReactNode, useEffect, useState } from "react"
import IconButton from "../buttons/IconButton";
import helper from "../../../utils/helper.util";

interface IAccordionUI {
    control?: ReactNode,
    actions?: ReactNode,
    children: ReactNode,
    className?: string,
    flat?: boolean,
    radius?: number,
    style?: CSSProperties,
    padding?: {
        x: number,
        y: number
    }
    noBorder?: boolean,
    index?: number,
    overflow?: boolean,
    opened?: boolean,
    toggle?: {
        enable: boolean,
        right: boolean
    },
    content?: {
        height: number
    }
}

const AccordionUI = (props: IAccordionUI) => {

    const {
        control,
        actions,
        children,
        className = '',
        style,
        flat = false,
        noBorder = false,
        radius,
        toggle = {
            enable: true,
            right: true,
        },
        padding = {
            x: 1,
            y: 0.5
        },
        content = {
            height: 0
        },
        index = -1,
        overflow = false,
        opened = false
    } = props;

    const [isOpen, setIsOpen] = useState(opened);

    useEffect(() => {

    }, [])

    const cov = () => {

        let result = 'overflow-hidden';

        if (overflow) {
            if (isOpen) {
                result = 'overflow-visible'
            } else {
                result = 'overflow-hidden'
            }
        }

        return result;

    }

    const ch = () => {

        let result = 'h-auto';

        if(content && content.height > 0){
            result = content.height + 'px'
        }

        return result

    }

    return (
        <>
            <div
                className={`${isOpen ? 'space-y-[0.65rem]' : ''} ${noBorder ? '' : 'border bdr-pag-100'} ${className || ''}`}
                style={{
                    padding: !flat ? `${padding.y}rem ${padding.x}rem` : '0',
                    borderRadius: `${radius && radius > 0 ? radius + 'px' : '0.6rem'}`,
                    ...style
                }}
            >

                <div className="flex items-center min-h-[40px] gap-x-[1rem]">
                    {control && <> {control} </>}
                    {!control && <h3 className="font-mona-medium pag-900 text-[15px]">Accordion UI</h3>}
                    {
                        !actions && toggle && toggle.enable && 
                        <div className={`flex items-center gap-x-[1rem] ${toggle.right ? 'ml-auto' : ''}`}>
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
                    }
                    {
                        actions &&
                        <>{ actions }</>
                    }
                </div>

                {/* change h-auto to max-h-[value] to allow for the fade-in animation */}
                <div 
                className={`${cov()} transition-all duration-300 ${isOpen ? ch() + " opacity-100" : "max-h-0 opacity-0"}`}
                style={{ height: isOpen ? ch() : '' }}
                >
                    {children}
                </div>

            </div>
        </>
    )
};

export default AccordionUI;
