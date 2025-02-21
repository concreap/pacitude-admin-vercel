import React, { useEffect, useState } from 'react'
import { IPlaceholder } from '../../utils/interfaces.util'

const Placeholder = (props : Partial<IPlaceholder>) => {

    // https://jamesinkala.com/blog/make-animated-content-placeholders-with-html-and-css/
    const {
        height, width, bgColor, animate, radius, className, flex = false,
        minHeight, minWidth, marginTop, marginBottom, top, left, right
    } = props
    
    useEffect(() => {

    }, [])

    return (
        <>

            <div className={`placeholder ui-relative ${flex ? 'flex' : ''} ${className ? className : ''}`} 
            style={{ 
                height: height,
                width: width,
                minHeight: height ? height : minHeight,
                minWidth: width ? width : minWidth,
                backgroundColor: bgColor,
                borderRadius: `${radius}`,
                marginTop: marginTop ? marginTop : '',
                marginBottom: marginBottom ? marginBottom : '',
                top: top ? top : '',
                left: left ? left : '',
                right: right ? right : ''
            }}
            >
                <div className={`activity ${animate ? 'flicker': ''}`}></div>
            </div>

        </>
    )
}

export default Placeholder