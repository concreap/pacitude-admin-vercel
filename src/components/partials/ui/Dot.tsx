import React, { useEffect, CSSProperties } from "react"
import { Tooltip } from "react-tooltip";

interface IDot {
    className?: string,
    bgColor?: string,
    style?: CSSProperties,
    tooltip?: {
        id: string,
        content: string
    },
}

const Dot = (props: IDot) => {

    const {
        className = '',
        bgColor = 'bg-pag-950',
        tooltip,
        style = {
            width: '5px',
            height: '5px'
        }
    } = props

    useEffect(() => {

    }, [])

    return (
        <>
            {
                tooltip &&
                <Tooltip 
                className='font-mona' 
                opacity={1}
                style={{ backgroundColor: 'rgba(3, 29, 69, 1)', padding: '4px 8px', fontSize: 12 }} 
                id={tooltip.id} place="top" variant="dark" />
            }
            <span
                data-tooltip-id={tooltip ? tooltip.id : ''}
                data-tooltip-html={tooltip ? tooltip.content : ''}
                style={style}
                className={`inline-block flex-shrink-0 ${bgColor} rounded-full ${className ? className : ''}`}
            ></span>
        </>
    )
};

export default Dot;
