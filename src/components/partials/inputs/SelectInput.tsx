import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, ForwardedRef, Fragment } from "react"
import { ISelectInput, ITextInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";
import Icon from "../icons/Icon";
import useSize from "../../../hooks/useSize";

const SelectInput = forwardRef((props: ISelectInput, ref: ForwardedRef<any>) => {

    const {
        id,
        name,
        selected,
        options,
        placeholder,
        className,
        label,
        readonly,
        isError = false,
        size = 'rg',
        showFocus = true,
        onSelect
    } = props

    const ch = useSize({ size })
    const { pos } = useSize({ size, type: 'input-icon' })

    const [inputId, setInputId] = useState<string>(helper.random(8, true))
    const inputRef = useRef<HTMLSelectElement>(null)

    useEffect(() => {

    }, [])

    const lfs = () => {

        let result: string = 'text-[12px]';

        if (label && label.fontSize) {
            result = `text-[${label.fontSize.toString()}px]`
        }

        return result;
    }

    const cc = () => {

        let result: string = `form-control transition-all duration-250 w-full appearance-none font-rethink text-[13px] border ${ch.h}`;

        // colors, borders and focus
        if (isError) {
            result = result + ` par-700 bdr-par-700`
        } else {
            result = result + ` color-black bdr-pag-200 ${showFocus ? 'bdrf-pacb-400 bdrh-pacb-200' : ''}`
        }

        // padding
        result = result + ` py-[0.5rem] px-[0.7rem]`

        if (className) {
            result = result + ` ${className}`
        }

        return result;

    }

    const cic = () => {

        let result: string = `absolute right-[1rem] ${pos}`;

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

            <div className={`select-input w-full relative  ${readonly ? 'readonly' : ''}`}>

                <span className={`pointer-events-none ${cic()}`}>
                    <Icon name="chevron-down" type="feather" className={`pacb-800 pointer-events-none`} size={16} />
                </span>

                <select
                    ref={inputRef}
                    id={id ? id : inputId}
                    name={name ? name : ''}
                    className={cc()}
                    // defaultValue={''}
                    aria-label="drop-down combobox"
                    onChange={(e) => { onSelect(e) }}
                >
                    {
                        placeholder.enable &&
                        <option value="">{helper.capitalize(placeholder.value)}</option>
                    }
                    {
                        options.map((item, index) =>
                            <Fragment key={index}>
                                <option key={item.value} value={item.value}
                                    selected={selected && selected === item.value ? true : false}>
                                    {helper.capitalize(item.name)}
                                </option>
                            </Fragment>
                        )
                    }
                </select>

            </div>

        </>
    )

})

export default SelectInput;
