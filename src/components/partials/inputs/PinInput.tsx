import React, { useEffect, useState, useRef } from "react"
import { IPinInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";

const PinInput = (props: IPinInput) => {

    const {
        type,
        label,
        className,
        readonly,
        showFocus,
        size,
        onChange, onKeyUp
    } = props

    const [inputId, setInputId] = useState<string>(helper.random(8, true))

    useEffect(() => {

    }, [])

    const labelFontSize = () => {

        let result: string = '12';

        if (label && label.fontSize) {
            result = label.fontSize.toString()
        }

        return result;
    }

    return (
        <>
            {
                label &&
                <label htmlFor={inputId} className={`fs-${labelFontSize()} font-manrope-medium pas-950 mrgb0 ${label.className}`}>
                    {label.title}
                    {label.required ? <span className="color-red font-manrope-bold ui-relative fs-16" style={{ top: '4px', left: '1px' }}>*</span> : ''}
                </label>
            }
            <div className={`pin-input ${className ? className : ''}`}>

                <input
                    ref={null}
                    id={helper.random(4, true)}
                    name={`pin-` + helper.random(4, true)}
                    defaultValue={''}
                    type={type}
                    maxLength={1}
                    className={`form-control font-manrope pas-950 fs-14 ${size ? size : 'sz-md'} ${showFocus ? 'show-focus' : ''}`}
                    placeholder={'0'}
                    autoComplete={'off'}
                    readOnly={readonly ? true : false}
                    onChange={(e) => onChange(e)}
                    onKeyUp={(e) => onKeyUp ? onKeyUp(e) : {}}
                />

            </div>
        </>
    )

};

export default PinInput;
