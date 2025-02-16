import React, { useEffect, useState, useContext } from "react"
import { IBadge } from "../../../utils/interfaces.util";
import Icon from "../icons/Icon";

const Badge = (props: IBadge) => {

    const {
        style,
        className,
        size = 'rg',
        type,
        label,
        close = false,
        onClose = (e: any) => { }
    } = props;

    useEffect(() => {

    }, [])

    return (
        <>
            <div className={`badge ${close ? 'badge-close' : ''} ${size} ${type} fs-11 font-hostgro-light ${className}`} style={style}>
                <span className={`fs-11 font-hostgro-light ${ close ? 'pdr' : '' }`}>{label}</span>
                {
                    close &&
                    <Icon
                        type={'polio'}
                        name={'cancel'}
                        clickable={true}
                        size={13}
                        className="color-black ui-ml-auto"
                        style={{ position: 'relative', top: '1px'}}
                        onClick={(e) => onClose(e)}
                    />
                }
            </div>
        </>
    )
};

export default Badge;
