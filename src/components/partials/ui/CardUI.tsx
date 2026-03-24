import React, { useEffect, useState, useContext, ReactNode, CSSProperties } from "react"

interface ICardUI {
    children: ReactNode,
    className?: string,
    flat?: boolean,
    radius?: number,
    style?: CSSProperties,
    padding?: {
        x: number,
        y: number
    }
    noBorder?: boolean
}

const CardUI = (props: ICardUI) => {

    const {
        children,
        className = '',
        style,
        flat = false,
        noBorder = false,
        radius,
        padding = {
            x: 1,
            y: 1
        }
    } = props;


    useEffect(() => {

    }, [])

    const cc = () => {
        let result = `card w-full rounded-[0.6rem]`

        if (flat) {
            result = result
        } else {
            result = result + ` px-[1rem] py-[1rem]`
        }

        if (noBorder) {
            result = result
        } else {
            result = result + ` border bdr-pag-100`
        }

        if (className) {
            result = result + ` ${className}`
        }
        return result;
    }

    return (
        <>
            <div
                id="card"
                className={cc()}
                style={{
                    padding: !flat ? `${padding.y}rem ${padding.x}rem` : '0',
                    borderRadius: `${radius ? radius + 'px' : ''}`,
                    ...style
                }}>
                {children}
            </div>
        </>
    )
};

export default CardUI;
