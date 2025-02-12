import React, { useEffect, useState, useContext } from "react"
import { IEmptyState } from "../../../utils/interfaces.util";

const EmptyState = (props: IEmptyState) => {

    const {
        children, bgColor, size, className, bound = false
    } = props;

    useEffect(() => {

    }, [])
    return (
        <>

            <div className={`empty-state ${className ? className : ''} ${size ? size : 'rg'}`} style={{ backgroundColor: `${bgColor ? bgColor : ''}` }}>

                <div className="ui-text-center">
                    {
                        bound &&
                        <div className="wp-100 ui-text-center">
                            {children}
                        </div>
                    }
                    {
                        !bound &&
                        <div className="row">
                            <div className="col-md-10 mx-auto ui-text-center">
                                {children}
                            </div>
                        </div>
                    }
                </div>

            </div>

        </>
    )
};

export default EmptyState;
