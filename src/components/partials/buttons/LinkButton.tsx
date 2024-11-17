import React, { useEffect, MouseEvent } from "react"
import { Link, useNavigate } from "react-router-dom";
import Icon from "../icons/Icon";
import { ILinkButton } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";
import { SizeType } from "../../../utils/types.util";

const LinkButton = (props: ILinkButton) => {

    const navigate = useNavigate()

    const {
        id = helper.random(6, true),
        text,
        className,
        disabled = false,
        lineHeight = 16,
        loading = false,
        weight = 'bold',
        size = 'rg',
        color = 'pab-600',
        newtab = false,
        icon = {
            enable: true,
            name: 'check',
            size: 16,
            loaderColor: 'white',
            style: { position: 'relative' }
        },
        url = '',
        onClick
    } = props;

    useEffect(() => {

    }, [])

    const getSize = (size: SizeType) => {

        let result: number = 14;

        switch (size) {
            case 'sm':
                result = 12;
                break;
            case 'rg':
                result = 13;
                break;
            case 'md':
                result = 16;
                break;
            case 'lg':
                result = 20;
                break;
            case 'xlg':
                result = 24;
                break;
            default:
                result = 13
                break;
        }

        return result;

    }

    const computeClass = () => {

        let result: string = `link-button font-hostgro-${weight} ${color} ${disabled ? 'disabled' : loading ? 'disabled loading' : ''}`
        let text: string = `fs-${getSize(size)} lh-${lineHeight}`

        if (className) {
            result = result + ` ${className}`
        }

        return { button: result, text }

    }

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        if (onClick) {
            onClick(e)
        } else if (url) {
            navigate(url)
        }
    }

    const linkContent = () => {

        return <>
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

    return (
        <>
            {
                newtab && url &&
                <a id={id} href={url} target="_blank" className={computeClass().button}>
                    {linkContent()}
                </a>
            }

            {
                !newtab &&
                <>
                    <Link id={id} to="" onClick={(e) => handleClick(e)} className={computeClass().button}>
                        {linkContent()}
                    </Link>
                </>
            }

        </>
    )
};

export default LinkButton;
