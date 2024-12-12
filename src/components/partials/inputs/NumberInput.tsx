import React, { useEffect, useState, useRef } from "react"
import { INumberInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";

const NumberInput = (props: INumberInput) => {

    const {
        name, id, value, defaultValue, placeholder,
        autoComplete, className, label, ref, readonly,
        isError = false,
        size = 'md',
        showFocus = false,
        min = '',
        max = '',
        step = '',
        onChange,
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

        let result: string = `form-control ${isError ? 'error' : ''} font-manrope pas-950 fs-14 sz-${size} ${showFocus ? 'show-focus' : ''}`;

        if (className) {
            result = result + ` ${className}`
        }

        return result;

    }

    return (
        <>
            {
                label &&
                <label htmlFor={id ? id : inputId} className={`fs-${labelFontSize()} font-manrope-medium pas-950 mrgb0 ${label.className}`}>
                    {label.title}
                    {label.required ? <span className="color-red font-manrope-bold ui-relative fs-16" style={{ top: '4px', left: '1px' }}>*</span> : ''}
                </label>
            }
            <input
                ref={ref ? ref : inputRef}
                id={id ? id : inputId}
                name={name ? name : ''}
                defaultValue={defaultValue ? defaultValue : ''}
                type={'number'}
                className={computeClass()}
                placeholder={placeholder ? placeholder : 'Type here'}
                autoComplete={autoComplete ? 'on' : 'off'}
                readOnly={readonly ? readonly : false}
                min={min ? min : ''}
                max={max ? max : ''}
                step={step ? step : ''}
                onChange={(e) => onChange(e)}
            />
        </>
    )

};

export default NumberInput;
