import React, { useEffect, useState, useContext } from "react"
import { INavDivider } from "../../../utils/interfaces.util";

const NavDivider = (props: INavDivider) => {

    const {
        type,
        show = true
    } = props;

    useEffect(() => {

    }, [])

    return (
        <>
            {
                show &&
                <>
                
                    <div className="nav-divider">
                        <div className="line"></div>
                    </div>

                </>
            }
        </>
    )
};

export default NavDivider;
