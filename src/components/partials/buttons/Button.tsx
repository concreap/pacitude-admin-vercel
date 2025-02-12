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
        semantic = 'normal',
        size = 'rg',
        loading = false,
        disabled = false,
        block = false,
        fontSize = 14,
        fontWeight = 'bold',
        lineHeight = 16,
        reverse = 'default',
        className,
        style = {},
        icon = {
            enable: true,
            name: 'check',
            size: 16,
            loaderColor: 'white',
            style: { position: 'relative' },
            type: 'polio'
        },
        onClick
    } = props;

    useEffect(() => {

    }, [])

    const computeClass = () => {

        let result: string = `button ${block ? 'block' : ''} ${size ? size : 'md'} button-${type} ${semantic} reverse-${reverse} ${disabled ? 'disabled' : loading ? 'disabled loading' : ''}`
        let text: string = `font-hostgro-${typeof(fontWeight) === 'string' ? fontWeight : 'bold'} fs-${fontSize} lh-${lineHeight}`

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
                to="" className={computeClass().button}
                style={style}
                >
                {
                    loading && <span className={`loader md white ${icon.loaderColor}`}></span>
                }
                {
                    !loading &&
                    <>

                        <span className={computeClass().text}>{text}</span>

                        {
                            icon.enable &&
                            <Icon
                                type={icon.type!}
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
