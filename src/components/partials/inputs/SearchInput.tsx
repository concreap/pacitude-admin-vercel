import React, { useEffect, useState, useRef, CSSProperties } from "react"
import { ISearchInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";
import Icon from "../icons/Icon";

const SearchInput = (props: ISearchInput) => {

    const {
        name, id, value, defaultValue, placeholder,
        autoComplete, className, label, ref, readonly,
        isError = false,
        size = 'md',
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

        let result: string = `form-control ${isError ? 'error' : ''} color-black fs-14 sz-${size} ${showFocus ? 'show-focus' : ''}`;

        if (className) {
            result = result + ` ${className}`
        }

        return result;

    }

    const iconPosition = (): CSSProperties => {
        let result: CSSProperties = { top: '1rem', right: '1rem' }

        if(size === 'md'){
            result = { top: '1rem', right: '1rem' }
        }else if(size === 'sm'){
            result = { top: '0.6rem', right: '1rem' }
        }

        return result;
    }

    const iconSize = (): number => {
        let result: number = 20;

        if(size === 'md'){
            result = 20;
        }else if(size === 'sm') {
            result = 16
        }

        return result;
    }

    return (
        <>
            {
                label &&
                <label htmlFor={id ? id : inputId} className={`fs-${labelFontSize()} font-manrope-medium color-black mrgb0 ${label.className}`}>
                    {label.title}
                    {label.required ? <span className="color-red font-manrope-bold ui-relative fs-16" style={{ top: '4px', left: '1px' }}>*</span> : ''}
                </label>
            }
            <div className="search-input ui-relative">
                <Icon 
                    type="polio"
                    name={'search'}
                    size={iconSize()}
                    clickable={true}
                    position="absolute"
                    style={iconPosition()}
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
