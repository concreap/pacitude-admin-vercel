import React, { useEffect, useState, useContext } from "react"
import { IToast } from "../../../utils/interfaces.util";
import { Link } from "react-router-dom";

const Toast = (props: IToast) => {

    const {
        position,
        show,
        title,
        message,
        type,
        close
    } = props;

    useEffect(() => {

    }, [])

    const computeColors = (type: any) => {

        let result = {
            bg: 'bg-color-black',
            color: 'color-white'
        }

        if (type === 'success') {
            result = {
                bg: 'bg-color-green',
                color: 'color-white'
            }
        }

        if (type === 'error') {
            result = {
                bg: 'bg-color-red',
                color: 'color-white'
            }
        }

        if (type === 'info') {
            result = {
                bg: 'bg-color-blue',
                color: 'color-white'
            }
        }

        if (type === 'warning') {
            result = {
                bg: 'bg-color-orange',
                color: 'color-white'
            }
        }

        return result;

    }

    const handleClose = (e: any) => {
        if (e) { e.preventDefault() };
        close(e);
    }



    return (
        <>
            <div className={`toast ${computeColors(type).bg} ${show && show === true ? '' : 'ui-hide'} ${position ? position : 'top-right'}`}>

                <div className="ui-flexbox align-center">
                    <h3 className="font-hostgro-medium fs-14 onwhite">{ title ? title : 'Notification' }</h3>
                    <Link to="" className="ui-ml-auto" onClick={(e) => handleClose(e)}><span className="fe fe-x fs-15 onwhite"></span></Link>
                </div>

                <span className={`font-aeonik-medium fs-13 ${computeColors(type).color} mrgb0`}>
                    {message ? message : 'No message'}
                </span>

            </div>
        </>
    )
};

export default Toast;
