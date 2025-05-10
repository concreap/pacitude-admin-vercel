import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, ForwardedRef } from "react"
import { ISearchInput, ITextInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";
import Icon from "../icons/Icon";
import useSize from "../../../hooks/useSize";

const SearchInput = forwardRef((props: ISearchInput, ref: ForwardedRef<any>) => {

    const {
        id,
        name,
        defaultValue,
        placeholder,
        autoComplete,
        className,
        label,
        readonly,
        isError = false,
        size = 'rg',
        showFocus = true,
        hasResult = false,
        onChange,
        onFocus,
        onSearch
    } = props

    const ch = useSize({ size })
    const { pos } = useSize({ size, type: 'input-icon' })

    const [inputId, setInputId] = useState<string>(helper.random(8, true))
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {

    }, [])

    useEffect(() => {

        if(inputRef.current && inputRef.current.value){
            inputRef.current.value = '';
        }

    }, [hasResult])

    const lfs = () => {

        let result: string = 'text-[12px]';

        if (label && label.fontSize) {
            result = `text-[${label.fontSize.toString()}px]`
        }

        return result;
    }

    const cc = () => {

        let result: string = `form-control transition-all duration-250 w-full py-[0.5rem] px-[1rem] font-rethink text-[13px] border ${ch.h}`;

        // colors, borders and focus
        if (isError) {
            result = result + ` par-700 bdr-par-700`
        } else {
            result = result + ` color-black bdr-pag-200 ${showFocus ? 'bdrf-pacb-400 bdrh-pacb-200' : ''}`
        }

        if (className) {
            result = result + ` ${className}`
        }

        return result;

    }

    const cic = () => {

        let result: string = `absolute right-[0.7rem] ${pos}`;

        return result;
    }

    const handleClear = () => {
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    const handleFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    // expose child component functions to parent component
    useImperativeHandle(ref, () => ({
        clear: handleClear,
        focus: handleFocus
    }))

    return (
        <>

            {
                label &&
                <label htmlFor={id ? id : inputId} className={`mrgb0 ${label.className ? label.className : ''}`}>
                    <span className={`font-rethink pag-900`} style={{ fontSize: `${label.fontSize}px` }}>{label.title}</span>
                    {label.required ? <span className="color-red font-rethink-medium relative text-[16px] top-[5px] left-[3px]">*</span> : ''}
                </label>
            }

            <div className="w-full relative">

                <span className={`${cic()}`}>
                    <Icon
                        name={hasResult ? 'x' : 'search'}
                        type="feather"
                        className={`${hasResult ? 'par-600' : 'pacb-800'}`}
                        size={16}
                        clickable={true}
                        onClick={(e) => {
                            onSearch(e)
                        }}
                    />
                </span>

                <input
                    ref={inputRef}
                    id={id ? id : inputId}
                    name={name ? name : ''}
                    defaultValue={defaultValue ? defaultValue : ''}
                    type={'text'}
                    className={cc()}
                    placeholder={placeholder ? placeholder : 'Type here'}
                    autoComplete={autoComplete ? 'on' : 'off'}
                    readOnly={readonly ? readonly : false}
                    onChange={(e) => onChange(e)}
                    onFocus={(e) => onFocus ? onFocus(e) : {}}
                />
            </div>

        </>
    )

})

export default SearchInput;
