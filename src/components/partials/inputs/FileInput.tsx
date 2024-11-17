import React, { useEffect, useState, useRef } from "react"
import { IFileInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";
import Icon from "../icons/Icon";

const FileInput = (props: IFileInput) => {

    const {
        name, id, value, defaultValue, placeholder,
        autoComplete, className, label, ref, file,
        isError = false,
        size = 'sz-md',
        showFocus = false,
        onChange
    } = props

    const [inputId, setInputId] = useState<string>(helper.random(8, true))
    const inputRef = useRef<HTMLInputElement>(null)
    const fileRef = useRef<any>(null)

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

        let result: string = `form-control ${isError ? 'error' : ''} font-manrope pas-950 fs-14`;

        result = result + ` ${size} ${showFocus ? 'show-focus' : ''}`;

        if (className) {
            result = result + ` ${className}`
        }

        return result;

    }

    const openDialogue = (e: any) => {

        if (e) { e.preventDefault() }

        if (fileRef.current) {
            fileRef.current.click()
        }
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

            <input ref={fileRef} type="file" className="ui-hide" onChange={(e) => { onChange(e, file.type) }} />

            <div className="search-input ui-relative">
                <Icon 
                    type="polio"
                    name={'cloud-upload'}
                    size={20}
                    clickable={true}
                    position="absolute"
                    style={{ top: '1rem', right: '1rem' }}
                    onClick={(e) => openDialogue(e)}
                />
                <input
                    ref={ref ? ref : inputRef}
                    id={id ? id : inputId}
                    name={name ? name : ''}
                    defaultValue={defaultValue ? defaultValue : ''}
                    type={'text'}
                    className={computeClass()}
                    placeholder={placeholder ? placeholder : 'No file chosen'}
                    autoComplete={autoComplete ? 'on' : 'off'}
                    readOnly={true}
                    onChange={(e) => {  }}
                />
            </div>
        </>
    )

};

export default FileInput;
