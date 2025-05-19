import React, { useEffect, useState, useContext } from "react"
import Icon from "../icons/Icon";
import { ILinkButton } from "../../../utils/interfaces.util";
import { Link } from "react-router-dom";

const LinkButton = (props: ILinkButton) => {

    const {
        text = {
            label: 'Click Link',
            className: 'text-[13px]',
            weight: 'semibold'
        },
        url = '',
        className = '',
        disabled = false,
        loading = false,
        icon = {
            enable: true,
            child: <Icon type="feather" name="chevron-right" size={15} className="pacb-900" />
        },
        onClick
    } = props;

    useEffect(() => {

    }, [])

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
            <Link onClick={(e) => handleClick(e)} to={''} className={`inline-flex transition-all duration-[0.25s] items-center ${className}`}>
                <span className={`font-mona-${text.weight} pacb-900 pr-[0.5rem] ${text.className}`}>{text.label}</span>
                {
                    icon.enable &&
                    <span className="ml-auto">
                        {icon.child}
                    </span>
                }
            </Link>
        </>
    )
};

export default LinkButton;
