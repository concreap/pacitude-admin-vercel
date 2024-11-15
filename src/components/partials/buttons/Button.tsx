import React, { useEffect, useState, useContext } from "react"
import { Link } from 'react-router-dom'
import Icon from "../icons/Icon";
import { IButton } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";

const Button = (props: IButton) => {

    const {
        id = helper.random(6, true),
        text,
        type = 'primary',
        size = 'rg',
        loading = false,
        disabled = false,
        fontSize = 14,
        lineHeight = 16,
        className,
        icon = {
            enable: true,
            name: 'check',
            size: 16,
            loaderColor: 'white',
            style: { position: 'relative' }
        },
        onClick
    } = props;

    useEffect(() => {

    }, [])

    const computeClass = () => {

        let result: string = `button ${size ? size : 'md'} button-${type} ${disabled ? 'disabled' : loading ? 'disabled loading' : ''}`
        let text: string = `font-hostgro-bold fs-${fontSize} lh-${lineHeight}`

        if (className) {
            result = result + ` ${className}`
        }

        return { button: result, text }

    }

    return (
        <>
            <Link
                id={id}
                onClick={onClick}
                to="" className={computeClass().button}>
                {
                    loading && <span className={`loader md ${icon.loaderColor}`}></span>
                }
                {
                    !loading &&
                    <>

                        <span className={computeClass().text}>{text}</span>

                        {
                            icon.enable &&
                            <Icon
                                type="polio"
                                name={icon.name!}
                                clickable={false}
                                size={icon.size!}
                                style={icon.style ? icon.style : { position: 'relative' }}
                            />

                        }

                    </>
                }
            </Link>
        </>
    )
};

export default Button;
