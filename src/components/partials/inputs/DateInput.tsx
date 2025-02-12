import React, { useEffect, useState, useRef, Fragment } from "react"
import { IDateInput, ISelectInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";
import WebfixCalendar from "../../layouts/WebfixCalendar";

const DateInput = (props: IDateInput) => {

    const {
        name, id, defaultValue,
        className, label,
        isError = false,
        size = 'md',
        showFocus = false,
        position = 'bottom',
        placeholder = { value: 'Choose', enable: true },
        onChange
    } = props

    const [inputId, setInputId] = useState<string>(helper.random(8, true));

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

        let result: string = `form-control ${isError ? 'error' : ''} sz-${size} ${showFocus ? 'show-focus' : ''}`;

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
            <div className="date-input ui-relative">

                <WebfixCalendar
                    date={defaultValue}
                    position={position}
                    placeholder={ placeholder.enable ? placeholder.value : undefined }
                    display={{
                        name: name,
                        className: computeClass()
                    }}
                    onChange={onChange}
                />

            </div>
        </>
    )

};

export default DateInput;
