import React, { useEffect, useState, useContext } from "react"
import { INavItem } from "../../../utils/interfaces.util";
import { Link } from "react-router-dom";
import Icon from "../icons/Icon";

const NavItem = (props: INavItem) => {

    const {
        type,
        active = false,
        icon = {
            enable: true,
            name: 'layout-left',
            className: ''
        },
        label,
        onClick
    } = props;

    useEffect(() => {

    }, [])



    return (
        <>
            {
                type === 'sidebar' &&
                <>
                    <li className="nav-item">
                        <Link onClick={(e) => onClick(e)} to="" className={`nav-link ${active ? 'active' : ''}`}>
                            {
                                icon.enable &&
                                <Icon
                                    type="polio"
                                    clickable={false}
                                    name={icon.name}
                                    size={18}
                                    className={`nav-icon ui-relative ${icon.className ? icon.className : ''}`}
                                    style={{
                                        top: '0px'
                                    }}
                                />

                            }
                            <span className="nav-text font-hostgro fs-14">{label}</span>
                        </Link>
                    </li>
                </>
            }
        </>
    )
};

export default NavItem;
