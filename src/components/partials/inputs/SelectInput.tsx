import React, { useEffect, useState, useRef, Fragment } from "react"
import { ISelectInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";
import Icon from "../icons/Icon";

const SelectInput = (props: ISelectInput) => {

    const {
        name, id, defaultValue,
        selected, className, label,
        options,
        size = 'sz-md',
        showFocus = false,
        placeholder = { value: 'Choose', enable: true },
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

        let result: string = 'form-select form-control font-manrope pas-950 fs-14';

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
            <div className="select-input ui-relative">
                <select
                    id={id ? id : inputId}
                    name={name ? name : ''}
                    className={computeClass()}
                    defaultValue={defaultValue ? defaultValue : ''}
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
