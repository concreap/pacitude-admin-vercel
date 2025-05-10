import React, { useEffect, useState, useContext, ReactNode } from "react"

interface ICardUI {
    children: ReactNode,
    className?: string,
    flat?: boolean,
    noBorder?: boolean
}

const CardUI = ({ children, className = '', flat = false, noBorder = false }: ICardUI) => {

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
            <div id="card" className={cc()}>
                {children}
            </div>
        </>
    )
};

export default CardUI;
