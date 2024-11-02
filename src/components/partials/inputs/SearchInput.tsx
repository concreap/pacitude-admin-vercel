import React, { useEffect, useState, useRef } from "react"
import { ISearchInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";
import Icon from "../icons/Icon";

const SearchInput = (props: ISearchInput) => {

    const {
        name, id, value, defaultValue, placeholder,
        autoComplete, className, label, ref, readonly,
        size = 'sz-md',
        showFocus = false,
        onChange, onSearch
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

        let result: string = 'form-control font-manrope pas-950 fs-14';

        result = result + ` ${size} ${showFocus ? 'show-focus' : ''}`;

        if (className) {
            result = result + `${className}`
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
            <div className="search-input ui-relative">
                <Icon 
                    type="polio"
                    name={'search'}
                    size={20}
                    clickable={true}
                    position="absolute"
                    style={{ top: '1rem', right: '1rem' }}
                    onClick={onSearch}
                />
                <input
                    ref={ref ? ref : inputRef}
                    id={id ? id : inputId}
                    name={name ? name : ''}
                    defaultValue={defaultValue ? defaultValue : ''}
                    type={'text'}
                    className={computeClass()}
                    placeholder={placeholder ? placeholder : 'Type here'}
                    autoComplete={autoComplete ? 'on' : 'off'}
                    readOnly={readonly ? readonly : false}
                    onChange={(e) => { onChange(e) }}
                />
            </div>
        </>
    )

};

export default SearchInput;
