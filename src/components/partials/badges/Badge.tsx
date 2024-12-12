import React, { useEffect, useState, useContext } from "react"
import { IBadge } from "../../../utils/interfaces.util";

const Badge = (props: IBadge) => {

    const {
        style,
        className,
        size = 'rg',
        type,
        label
    } = props;

    useEffect(() => {

    }, [])

    return (
        <>
            <span
                className={`badge ${size} ${type} fs-11 font-hostgro-light ${className}`}
                style={style}>
                {label}
            </span>
        </>
    )
};

export default Badge;
