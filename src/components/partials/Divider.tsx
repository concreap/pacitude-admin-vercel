import React, { useEffect, useState, useContext } from "react"
import { IDivider } from "../../utils/interfaces.util";

const Divider = (props: IDivider) => {

    const {
        show = true,
        bg = 'bg-pag-100',
        padding = {
            enable: true,
            top: 'pt-[1.2rem]',
            bottom: 'pb-[1.2rem]'
        }
    } = props

    useEffect(() => {

    }, [])

    const cc = () => {
        let result = `divider h-auto`
        if(padding){
            result = result + ` ${padding.top && padding.enable ? `${padding.top}` : ''} ${padding.bottom && padding.enable ? `${padding.bottom}` : ''}`
        }else {
            result = result + ` py-[2.5rem]`
        }
        return result;
    }

    return (
        <>
            <div className={cc()}>
                { show && <div className={`${bg ? bg : 'bg-pag-100'} w-[100%] h-[1px]`}></div> }
            </div>
        </>
    )
};

export default Divider;
