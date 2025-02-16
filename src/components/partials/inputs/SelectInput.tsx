import React, { useEffect, useState, useRef, Fragment } from "react"
import { ISelectInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";

const SelectInput = (props: ISelectInput) => {

    const {
        name, id, defaultValue,
        selected, className, label,
        options,
        isError = false,
        size = 'md',
        showFocus = false,
        placeholder = { value: 'Choose', enable: true },
        readonly = false,
        onSelect
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

        let result: string = `form-select ${isError ? 'error' : ''} form-control font-golos color-black fs-14 sz-${size} ${showFocus ? 'show-focus' : ''}`;

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
                    <span className={`fs-${labelFontSize()} font-golos`}>{label.title}</span>
                    {label.required ? <span className="color-red font-golos-semibold ui-relative fs-16" style={{ top: '4px', left: '1px' }}>*</span> : ''}
                </label>
            }
            <div className={`select-input ui-relative ${readonly ? 'readonly' : ''}`}>
                <select
                    id={id ? id : inputId}
                    name={name ? name : ''}
                    className={computeClass()}
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

};

export default SelectInput;
