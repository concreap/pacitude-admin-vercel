import React, { useEffect, useState, useRef, ChangeEvent, KeyboardEvent, Fragment } from "react"
import { IPinInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";

const PinInput = (props: IPinInput) => {

    const {
        type,
        label,
        className,
        readonly,
        showFocus,
        isError = false,
        size,
        length,
        onChange
    } = props

    const pinRef = useRef<any>([])
    const [pin, setPin] = useState<Array<string>>(new Array(length).fill(""))
    const [inputId, setInputId] = useState<string>(helper.random(8, true))
    const [keyList, setKeyList] = useState<Array<string>>([])

    useEffect(() => {

        init()

    }, [])

    const init = () => {

        let result: Array<string> = [];

        for(let i = 0; i < length; i++){
            result.push(helper.random(6))
        }

        setKeyList(result)

    }

    const labelFontSize = () => {

        let result: string = '12';

        if (label && label.fontSize) {
            result = label.fontSize.toString()
        }

        return result;
    }

    const handlePinChange = (value: string, index: number) => {

        let newList = [...pin];
        newList[index] = value;
        setPin(newList);
        onChange(newList.join("").toString())

        if (value && index < (length - 1)) {
            pinRef.current[index + 1].focus()
        }

    }

    const handlePinNextBack = (e: any, index: number) => {

        if (e.key === "Backspace" && !e.target.value && index > 0) {
            pinRef.current[index - 1].focus()
        }

        if (e.key === "Enter" && e.target.value && index < (length - 1)) {
            pinRef.current[index + 1].focus()
        }

    }

    return (
        <>
            {
                label &&
                <label htmlFor={inputId} className={`fs-${labelFontSize()} font-manrope-medium color-black mrgb0 ${label.className}`}>
                    {label.title}
                    {label.required ? <span className="color-red font-manrope-bold ui-relative fs-16" style={{ top: '4px', left: '1px' }}>*</span> : ''}
                </label>
            }
            <div className={`pin-input ${className ? className : ''}`}>

                {
                    pin.map((char: string, index: number) =>
                        <Fragment key={`pin` + index}>
                            <input
                                ref={(refx) => (pinRef.current[index] = refx)}
                                id={keyList[index]}
                                name={`pin-` + keyList[index]}
                                defaultValue={char}
                                type={type}
                                maxLength={1}
                                max={1}
                                min={1}
                                className={`form-control ${isError ? 'error' : ''} font-manrope color-black fs-14 ${size ? 'sz-' + size : 'sz-md'} ${showFocus ? 'show-focus' : ''}`}
                                placeholder={'0'}
                                autoComplete={'off'}
                                readOnly={readonly ? true : false}
                                onChange={(e) => handlePinChange(e.target.value, index)}
                                onKeyUp={(e) => handlePinNextBack(e, index)}
                            />
                        </Fragment>
                    )
                }

            </div>
        </>
    )

};

export default PinInput;
