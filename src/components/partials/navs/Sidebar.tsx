import React, { useEffect, useState, useContext, Fragment, MouseEvent } from "react"
import { Link, useNavigate } from 'react-router-dom'
import Icon from "../icons/Icon";
import routes from '../../../routes/sidebar.route'
import helper from "../../../utils/helper.util";
import { ISidebar } from "../../../utils/interfaces.util";
import useGoTo from "../../../hooks/useGoTo";
import RoundButton from "../buttons/RoundButton";

interface INavItem {
    active?: boolean,
    icon: string,
    label: string,
    action: string,
    path?: string
}

const Sidebar = (props: ISidebar) => {

    const navigate = useNavigate()

    const {
        pageTitle
    } = props;

    useEffect(() => {

    }, [])

    // functions
    const getAction = (name: string) => {

        let result: string = 'navigate';

        if (name === 'account') {
            result = 'toggle-subnav'
        } else if (name === 'logout') {
            result = 'toggle-subnav'
        } else {
            result = 'navigate'
        }

        return result;

    }

    const handleNav = (e: MouseEvent<HTMLAnchorElement>, nav: INavItem) => {

        e.preventDefault();

        if (nav.action === 'navigate' && nav.path) {
            navigate(nav.path)
        } else if (nav.action === 'toggle-subnav') {
            alert('toggled')
        }

    }

    // components 

    const NavItem = (params: INavItem) => {

        const {
            active = false,
            icon = 'layout-left',
            label,
            action
        } = params;

        return (
            <>
                <li className="nav-item">
                    <Link onClick={(e) => handleNav(e, params)} to="" className={`nav-link ${active ? 'active' : ''}`}>
                        <Icon
                            type="polio"
                            clickable={false}
                            name={icon}
                            size={18}
                            className="nav-icon ui-relative pdr1"
                            style={{
                                top: '0px'
                            }}
                        />
                        <span className="nav-text font-hostgro fs-14">{label}</span>
                    </Link>
                </li>
            </>
        )

    }

    const NavDivider = () => {
        return (
            <>
                <div className="nav-divider">
                    <div className="line"></div>
                </div>
            </>
        )
    }

    return (
        <>
            <section className="ui-sidebar">

                <div className="sidebar-secondary">

                    <div className="bar-header">
                        <RoundButton
                            className="ui-ml-auto bg-pab-200"
                            clickable={true}
                            icon={
                                <Icon
                                    type="polio"
                                    clickable={false}
                                    name={'cancel'}
                                    size={16}
                                />
                            }
                            onClick={(e) => {}}
                        />
                    </div>

                </div>

                <div className="sidebar-primary open">

                    <div className="bar-header">
                        <img className="logo" src="../../../images/assets/logo.svg" alt="logo" />
                    </div>

                    <div className="bar-body">

                        <ul className="nav-list main-list">
                            {
                                routes.map((route, index) =>
                                    <Fragment key={route.name + `${index + 1}`}>

                                        {
                                            route.name !== 'divider' &&
                                            <NavItem
                                                label={route.title ? route.title : helper.capitalize(route.name)}
                                                icon={route.iconName!}
                                                active={route.title && route.title === pageTitle ? true : false}
                                                action={getAction(route.name)}
                                                path={route.url}
                                            />
                                        }

                                        {
                                            route.name === 'divider' &&
                                            <NavDivider />
                                        }

                                    </Fragment>
                                )
                            }

                        </ul>

                        <ul className="nav-list">
                            <NavItem
                                label={'Logout'}
                                icon={'layout-left'}
                                action={getAction('logout')}
                            />
                        </ul>

                    </div>

                </div>

            </section>
        </>
    )

};

export default Sidebar;
