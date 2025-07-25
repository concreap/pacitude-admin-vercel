import React, { useEffect, useState, useContext } from "react"
import { IButton } from "../../../utils/interfaces.util";
import { Link } from "react-router-dom";
import useSize from "../../../hooks/useSize";

const Button = (props: IButton) => {

    const {
        id,
        url = '',
        text,
        size = 'rg',
        type = 'primary',
        semantic = 'normal',
        reverse = 'default',
        style = {},
        loading = false,
        block = false,
        fill = false,
        className = '',
        disabled = false,
        disabledType,
        icon = {
            enable: false,
            className: '',
            child: <></>
        },
        onClick
    } = props;


    const ch = useSize({ size, type: 'button' })

    useEffect(() => {

    }, [])

    const cc = () => {

        // basic style
        let result = `inline-flex items-center justify-center rounded-[5px] transition-all duration-[0.25s] px-[1rem]`;
        result = result + ` ${ch.h}` // add height styles

        // block style
        if (block) {
            result = result + `flex w-[100%]`
        }

        // flex reverse style
        if (reverse && reverse !== 'default') {

            if (reverse === 'row') {
                result = result + ` flex-row-reverse gap-x-[0.5rem]`
            } else if (reverse === 'column') {
                result = result + ` flex-col-reverse gap-x-[0.5rem]`
            } else if (reverse === 'wrap') {
                result = result + ` flex-wrap-reverse gap-x-[0.5rem]`
            }

        } else {
            result = result + ` ${icon.enable ? ' gap-x-[0.5rem]' : ''}`
        }

        if (disabled) {
            if (disabledType) {
                result = result + `${disabledType === 'default' ? ' disabled' : ' disabled-' + disabledType}`;
            } else {
                result = result + `${disabled ? ' pointer-events-none opacity-[.45]' : ''}`;
            }
        }

        if (className) {
            result = result + ` ${className}`
        }


        if (type === 'primary') {

            switch (semantic) {
                case 'info':
                    result = result + ` bg-color-blue bgh-pab-700 color-white`
                    break;
                case 'error':
                    result = result + ` bg-par-600 bgh-par-800 color-white`
                    break;
                case 'ongoing':
                    result = result + ` bg-pap-600 bgh-pap-800 color-white`
                    break;
                case 'success':
                    result = result + ` bg-pae-600 bgh-pae-800 color-white`
                    break;
                case 'warning':
                    result = result + ` bg-pay-400 bgh-pay-700 pay-900`
                    break;
                case 'warning-2':
                    result = result + ` bg-pao-300 bgh-pay-700 pao-950`
                    break;
                case 'normal':
                    result = result + ` bg-pas-950 bgh-pas-900 color-white`
                    break;
                default:
                    result = result + ` bg-pag-200 bgh-pag-200 pag-900`
            }

        }

        if (type === 'secondary') {

            switch (semantic) {
                case 'info':
                    result = result + ` bg-pab-100 bgh-pab-600 pab-900`
                    break;
                case 'error':
                    result = result + ` bg-par-100 bgh-par-600 par-900`
                    break;
                case 'ongoing':
                    result = result + ` bg-pav-100 bgh-pav-600 pap-900`
                    break;
                case 'success':
                    result = result + ` bg-pae-100 bgh-pae-600 pae-900`
                    break;
                case 'warning':
                    result = result + ` bg-pay-200 bgh-pay-600 pay-900`
                    break;
                case 'warning-2':
                    result = result + ` bg-pao-100 bgh-pao-600 pao-900`
                    break;
                case 'normal':
                    result = result + ` bg-pacb-600 bgh-pcb-800 color-white`
                    break;
                default:
                    result = result + ` bg-pag-200 bgh-pag-200 pag-900`
            }

        }

        if (type === 'ghost') {

            switch (semantic) {
                case 'info':
                    result = result + ` border-[1px] bdr-pab-500 bdrh-pab-700 pab-600 ${fill ? 'bg-pab-50' : ''}`
                    break;
                case 'error':
                    result = result + ` border-[1px] bdr-par-600 bdrh-par-700 par-700 ${fill ? 'bg-par-50' : ''}`
                    break;
                case 'ongoing':
                    result = result + ` border-[1px] bdr-pap-500 bdrh-pap-700 pap-600 ${fill ? 'bg-pap-50' : ''}`
                    break;
                case 'success':
                    result = result + ` border-[1px] bdr-pae-500 bdrh-pae-700 goe-600 ${fill ? 'bg-pae-50' : ''}`
                    break;
                case 'warning':
                    result = result + ` border-[1px] bdr-pay-500 bdrh-pay-700 pay-600 ${fill ? 'bg-pay-50' : ''}`
                    break;
                case 'warning-2':
                    result = result + ` border-[1px] bdr-pao-500 bdrh-pao-700 pao-600 ${fill ? 'bg-pao-50' : ''}`
                    break;
                case 'normal':
                    result = result + ` border-[1px] bdr-pas-700 bdrh-pas-900 pas-950 ${fill ? 'bg-pas-50' : ''}`
                    break;
                default:
                    result = result + ` border-[1px] bdr-pag-200 bdrh-pag-300 pag-600 ${fill ? 'bg-pag-50' : ''}`
            }

        }

        return result;
    }

    const handleClick = (e: any) => {

        if (e) { e.preventDefault() }

        if (url) {
            onClick(e);
            window.open(url, '_blank');

        } else {
            onClick(e)
        }

    }

    return (
        <>
            <Link
                to=""
                style={style}
                className={cc()}
                onClick={(e) => handleClick(e)}
            >
                {loading && <span className={`loader md ${type !== 'primary' ? 'primary' : 'white'}`}></span>}
                {
                    !loading &&
                    <>
                        <span className={`font-mona${text.weight ? '-' + text.weight : ''}`} style={{ fontSize: `${text.size ? text.size : '14'}px` }}>{text.label}</span>
                        {icon.enable && <>{icon.child}</>}
                    </>
                }
            </Link>
        </>
    )
};

export default Button;
