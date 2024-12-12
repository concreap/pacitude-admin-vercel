import React, { useEffect, useState, useRef, CSSProperties } from "react"
import { IPasswordInput } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";
import Icon from "../icons/Icon";

const PasswordInput = (props: IPasswordInput) => {

    const {
        name, id, value, defaultValue, placeholder,
        autoComplete, className, label, ref, readonly,
        isError = false,
        size = 'md',
        showFocus = false,
        onChange, onKeyUp
    } = props

    const [inputId, setInputId] = useState<string>(helper.random(8, true))
    const inputRef = useRef<HTMLInputElement>(null)
    const [type, setType] = useState<string>('password');

    useEffect(() => {

    }, [])

    const toggleType = (e: any) => {
        e.preventDefault();
        if (type === 'password') {
            setType('text');
        } else {
            setType('password');
        }
    }

    const labelFontSize = () => {

        let result: string = '12';

        if (label && label.fontSize) {
            result = label.fontSize.toString()
        }

        return result;
    }

    const computeClass = () => {

        let result: string = `form-control ${isError ? 'error' : ''} font-manrope pas-950 fs-14 sz-${size} ${showFocus ? 'show-focus' : ''}`;

        if (className) {
            result = result + ` ${className}`
        }

        return result;

    }

    const iconPosition = (): CSSProperties => {
        let result: CSSProperties = { top: '1rem', right: '1rem' }

        if (size === 'md') {
            result = { top: '1rem', right: '1rem' }
        } else if (size === 'sm') {
            result = { top: '0.6rem', right: '1rem' }
        }

        return result;
    }

    const iconSize = (): number => {
        let result: number = 20;

        if (size === 'md') {
            result = 20;
        } else if (size === 'sm') {
            result = 16
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
            <div className="password-input ui-relative">
                <Icon
                    type="polio"
                    name={type === 'password' ? 'eye-alt' : 'eye-close'}
                    size={iconSize()}
                    clickable={true}
                    position="absolute"
                    style={iconPosition()}
                    onClick={toggleType}
                />
                <input
                    ref={ref ? ref : inputRef}
                    id={id ? id : inputId}
                    name={name ? name : ''}
                    defaultValue={defaultValue ? defaultValue : ''}
                    type={type}
                    className={computeClass()}
                    placeholder={placeholder ? placeholder : 'Type here'}
                    autoComplete={autoComplete ? 'on' : 'off'}
                    readOnly={readonly ? readonly : false}
                    onChange={(e) => { onChange(e) }}
                    onKeyUp={(e) => onKeyUp ? onKeyUp(e) : {}}
                />
            </div>
        </>
    )

};

export default PasswordInput;
