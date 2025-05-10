import React, { useEffect, useState, useContext } from "react"
import { IIconButton } from "../../../utils/interfaces.util";
import { Link } from "react-router-dom";
import Icon from "../icons/Icon";

const IconButton = (props: IIconButton) => {

    const {
        icon = {
            name: 'edit2',
            type: 'feather',
            size: 16,
            className: ''
        },
        url = '',
        active = false,
        size = 'min-w-[2.2rem] min-h-[2.2rem]',
        radius = 'full',
        className = '',
        onClick
    } = props;

    useEffect(() => {

    }, [])

    const cc = () => {

        let result = `rounded-${radius} inline-flex items-center justify-center ${size} transition-colors duration-[0.25s]`

        if (active) {
            result = result + ` bg-pacb-100 bgh-pacb-200 pacb-800 pacbh-900`
        } else {
            result = result + ` bgh-pag-50 pagh-800 pag-600`
        }

        if (className) {
            result = result + ` ${className}`
        }

        return result;

    }

    const handleClick = (e: any) => {

        if (e) { e.preventDefault() }

        if (url) {
            onClick(e);
            window.open(url, '_blank');

        } else {
            onClick(e)
        }

    }

    return (
        <>
            <Link to={''}
                onClick={(e) => handleClick(e)}
                className={cc()}>
                <Icon 
                    type={icon.type}
                    name={icon.name}
                    className={icon.className}
                    size={icon.size}
                />
            </Link>
        </>
    )
};

export default IconButton;
