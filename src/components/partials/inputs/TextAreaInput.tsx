import React, { useEffect, useState, useRef } from "react"
import { ITextAreaInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";

const TextAreaInput = (props: ITextAreaInput) => {

    const {
        name, id, value, defaultValue, placeholder,
        autoComplete, className, label, ref, readonly,
        size = 'sz-xxlg',
        rows = 4,
        cols = 4,
        showFocus = false,
        onChange
    } = props

    const [inputId, setInputId] = useState<string>(helper.random(8, true))
    const inputRef = useRef<HTMLTextAreaElement>(null)

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

        let result: string = 'form-control font-manrope pas-950 fs-14';

        result = result + ` ${size} ${showFocus ? 'show-focus' : ''}`;

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
            <textarea
                ref={ref ? ref : inputRef}
                rows={rows}
                cols={cols}
                id={id ? id : inputId}
                name={name ? name : ''}
                defaultValue={defaultValue ? defaultValue : ''}
                className={computeClass()}
                placeholder={placeholder ? placeholder : 'Type here'}
                autoComplete={autoComplete ? 'on' : 'off'}
                readOnly={readonly ? readonly : false}
                onChange={(e) => onChange(e)}
            />
        </>
    )

};

export default TextAreaInput;
