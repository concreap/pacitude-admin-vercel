import React, { useEffect, useState, useContext } from "react"
import Icon from "../icons/Icon";
import { Link } from "react-router-dom";
import { IAlert } from "../../../utils/interfaces.util";
import { SemanticType } from "../../../utils/types.util";

const Alert = (props: IAlert) => {

    const {
        type,
        dismiss = true,
        message = 'Checkout this alert!',
        className
    } = props;


    useEffect(() => {

    }, [])

    const getAlertType = (type: SemanticType) => {

        let result: string = 'alert-primary';
        let icon: string = 'info-empty'

        switch (type) {
            case 'info':
                result = 'alert-primary'
                icon = 'info-empty'
                break;
            case 'error':
                result = 'alert-danger'
                icon = 'delete-circle'
                break;
            case 'success':
                result = 'alert-success'
                icon = 'check'
                break;
            case 'warning':
                result = 'alert-warning'
                icon = 'warning-triangle'
                break;
            case 'ongoing':
                result = 'alert-info'
                icon = 'refresh-double'
                break;
            default:
                result = 'alert-primary'
                icon = 'info-empty'
                break;
        }

        return { type: result, icon }

    }

    const computeClass = () => {

        const alert = getAlertType(type)

        let result: string = `alert ${alert.type}`

        if (className) {
            result = result + ` ${className}`
        }

        return result;
    }


    return (
        <>
            <div className={computeClass()} role="alert">

                <Icon
                    type="polio"
                    clickable={false}
                    name={getAlertType(type).icon}
                    size={20}
                    className="icon-alert"
                />

                <span className="pdl"></span>
                <span>{message}</span>

                {
                    dismiss &&
                    <Link to="" data-bs-dismiss="alert" className="ui-line-height-msmall ms-auto">
                        <Icon
                            type="polio"
                            clickable={false}
                            name="cancel"
                            size={18}
                            className="icon-close"
                        />
                    </Link>
                }

            </div>
        </>
    )
};

export default Alert;
