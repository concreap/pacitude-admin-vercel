import React, { useEffect, useState, useRef } from "react"
import { IPhoneInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";
import DropDown from "../../layouts/DropDown";

const PhoneInput = (props: IPhoneInput) => {

    const {
        name, id, value, defaultValue, placeholder,
        autoComplete, className, label, ref, readonly, dropdown,
        size = 'sz-md',
        showFocus = false,
        onChange, onSelect
    } = props

    const [inputId, setInputId] = useState<string>(helper.random(8, true))
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {

    }, [])

    const getOptions = () => {

        const formatted = helper.readCountries().filter((i) => (i.phoneCode && i.flag !== ''))

        const cp = formatted.map((i) => {
            let c = {
                value: i.code3,
                label: i.name,
                left: i.phoneCode,
                image: i.flag ? i.flag : '../../../../images/assets/c-avatar.png'
            }
            return c;
        })

        return cp;

    }

    const setDefault = (code: string) => {

        const ct = helper.readCountries().find((i) => i.code2 === code);
        const fm = {
            value: ct._id,
            label: ct.name,
            left: ct.phoneCode,
            image: ct.flag ? ct.flag : '../../../images/assets/country-avatar.png'
        }

        if (fm) {
            return fm;
        } else {
            return 1
        }


    }

    const getSelected = (data: any) => {
        onSelect(data)
    }

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

            <div className="phone-input">

                <DropDown
                    options={getOptions}
                    selected={getSelected}
                    className={`font-manrope dropdown ${dropdown.className ? dropdown.className : ''}`}
                    placeholder={`NG`}
                    search={{
                        enable: true,
                        bgColor: '#fff',
                        color: '#1E1335'
                    }}
                    menu={{
                        bgColor: '#fff',
                        itemColor: '#000',
                        itemLabel: true,
                        itemLeft: true,
                        position: 'bottom'
                    }}
                    control={{
                        image: true,
                        className: `${dropdown.size ? dropdown.size : ''}`,
                        label: dropdown.contryName ? dropdown.contryName : false,
                        left: dropdown.countryCode ? dropdown.countryCode : false
                    }}
                    defaultValue={setDefault('NG')}
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
                    onChange={(e) => onChange(e)}
                />
            </div>
        </>
    )

};

export default PhoneInput;
