import React, { useEffect, useState, useContext, MouseEvent } from "react"
import { Link } from "react-router-dom";
import { IRoundButton } from "../../../utils/interfaces.util";

const RoundButton = (props: IRoundButton) => {

    const {
        icon,
        size = 'default',
        clickable = true,
        className = '',
        style = {},
        onClick = (e: MouseEvent<HTMLAnchorElement>) => { }
    } = props;

    useEffect(() => {

    }, [])

    const computeClass = () => {

        let result: string = `round-button ${size}`;

        if (className) {
            result = result + ` ${className}`
        }

        return result;

    }

    return (
        <>
            {
                clickable &&
                <Link onClick={(e) => onClick(e)} to="" className={computeClass()} style={style}>
                    {icon}
                </Link>
            }

            {
                !clickable &&
                <span className={computeClass()} style={style}>
                    {icon}
                </span>
            }
        </>
    )
};

export default RoundButton;
