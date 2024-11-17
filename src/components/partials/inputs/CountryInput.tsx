import React, { useEffect, useState, useRef } from "react"
import { ICountryInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";
import DropDown from "../../layouts/DropDown";

const CountryInput = (props: ICountryInput) => {

    const {
        id, defaultValue, placeholder,
        className, label, dropdown,
        isError = false,
        readonly = false,
        onSelect
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

    return (
        <>
            {
                label &&
                <label htmlFor={id ? id : inputId} className={`fs-${labelFontSize()} font-manrope-medium pas-950 mrgb0 ${label.className}`}>
                    {label.title}
                    {label.required ? <span className="color-red font-manrope-bold ui-relative fs-16" style={{ top: '4px', left: '1px' }}>*</span> : ''}
                </label>
            }

            <div className="country-input">
                <DropDown
                    options={getOptions}
                    selected={getSelected}
                    className={`font-manrope ${isError ? 'error' : ''} dropdown ${className ? className : ''}`}
                    placeholder={placeholder ? placeholder : 'Select'}
                    disabled={readonly ? true : false}
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
                        className: `${dropdown.size ? dropdown.size : 'sz-sm'}`,
                        label: dropdown.contryName ? dropdown.contryName : false,
                        left: dropdown.countryCode ? dropdown.countryCode : false
                    }}
                    defaultValue={setDefault('NG')}
                />
            </div>
        </>
    )

};

export default CountryInput;
