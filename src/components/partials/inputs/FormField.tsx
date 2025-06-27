import React, { useEffect, useState, useContext, ReactNode } from "react"

interface IFormField {
    children: ReactNode,
    className?: string,
    label?: {
        title: string,
        className?: string,
        required?: boolean,
        fontSize?: number
    },
}

const FormField = (props: IFormField) => {

    const {
        children,
        className = '',
        label
    } = props;

    useEffect(() => {

    }, [])
    return (
        <>
            <div className={`form-field w-full ${className}`}>
                {
                    label &&
                    <label className={`mrgb0 ${label.className ? label.className : ''}`}>
                        <span className={`font-mona pag-900`} style={{ fontSize: `${label.fontSize}px` }}>{label.title}</span>
                        {label.required ? <span className="color-red font-mona-medium relative text-[16px] top-[5px] left-[3px]">*</span> : ''}
                    </label>
                }
                {children}
            </div>
        </>
    )
};

export default FormField;
