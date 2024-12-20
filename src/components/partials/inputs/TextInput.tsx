import React, { useEffect, useState, useRef } from "react"
import { ITextInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";

const TextInput = (props: ITextInput) => {

    const {
        name, id, value, defaultValue, type, placeholder,
        autoComplete, className, label, ref, readonly,
        isError = false,
        size = 'md',
        showFocus = false,
        onChange, onKeyUp
    } = props

    const [inputId, setInputId] = useState<string>(helper.random(8, true))
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {

    }, [])

    const labelFontSize = () => {

        let result: string = '12';

        if (label && label.fontSize) {
            result = label.fontSize.toString()
        }

        return result;
    }

    const computeClass = () => {

        let result: string = `form-control font-manrope color-black fs-14 ${isError ? 'error' : ''} sz-${size} ${showFocus ? 'show-focus' : ''}`;

        if (className) {
            result = result + ` ${className}`
        }

        return result;

    }

    return (
        <>
            {
                label &&
                <label htmlFor={id ? id : inputId} className={`mrgb0 ${label.className ? label.className : ''}`}>
                    <span className={`fs-${labelFontSize()} font-manrope-medium color-black`}>{label.title}</span>
                    {label.required ? <span className="color-red font-manrope-bold ui-relative fs-16" style={{ top: '4px', left: '1px' }}>*</span> : ''}
                </label>
            }
            <input
                ref={ref ? ref : inputRef}
                id={id ? id : inputId}
                name={name ? name : ''}
                defaultValue={defaultValue ? defaultValue : ''}
                type={type ? type : 'text'}
                className={computeClass()}
                placeholder={placeholder ? placeholder : 'Type here'}
                autoComplete={autoComplete ? 'on' : 'off'}
                readOnly={readonly ? readonly : false}
                onChange={(e) => onChange(e)}
                onKeyUp={(e) => onKeyUp ? onKeyUp(e) : {}}
            />
        </>
    )

};

export default TextInput;
