import React, { useEffect, MouseEvent } from "react"
import { IICon } from "../../../utils/interfaces.util";
import { Link } from "react-router-dom";

const Icon = (props: IICon) => {

    const {
        clickable, name, type,
        className, onClick, url, style,
        position = 'relative',
        isActive = false,
        size = 16,
        height = 20
    } = props;

    useEffect(() => {

    }, [])

    const fireOnClick = (e: MouseEvent<HTMLAnchorElement>) => {

        e.preventDefault()

        if (onClick) {
            onClick(e)
        }

    }

    const computeClass = (): string => {

        let cl = type === 'feather' ? 'fe' : type === 'polio' ? 'po' : '';

        let result: string = `icon ${cl} ${cl}-${name} ui-${position} fs-${size}`;

        if (!clickable) {
            result = result + ` ${className ? className : ''}`
        }

        if (isActive) {
            result = `${result} active`
        }

        return result;

    }

    const computeIconClass = () => {

        let cl = type === 'feather' ? 'fe' : type === 'polio' ? 'po' : '';

        let icon: string = `icon ${cl} ${cl}-${name} fs-${size}`;
        let link: string = `link-icon ui-${position}`;

        if (clickable) {
            link = link + ` ${className ? className : ''}`
        }

        if (isActive) {
            icon = `${icon} active`
        }

        return { icon, link };

    }

    return (
        <>

            {
                clickable &&
                <>
                    <Link
                        to={url ? url : ''}
                        className={computeIconClass().link}
                        style={{
                            ...style,
                            display: 'inline-flex',
                            alignItems: 'center',
                            height: height
                        }}
                        onClick={(e) => onClick ? fireOnClick(e) : {}}
                    >
                        <span className={computeIconClass().icon} />
                    </Link>
                </>
            }

            {
                !clickable &&
                <>
                    <span
                        className={computeClass()}
                        style={style} />
                </>
            }

        </>
    )
};

export default Icon;
