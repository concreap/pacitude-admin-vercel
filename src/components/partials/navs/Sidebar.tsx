import React, { useEffect, useState, useContext, Fragment, MouseEvent } from "react"
import { Link, useNavigate } from 'react-router-dom'
import Icon from "../icons/Icon";
import routes from '../../../routes/sidebar.route'
import helper from "../../../utils/helper.util";
import { IResourceContext, IRouteItem, ISidebar, IUserContext } from "../../../utils/interfaces.util";
import useGoTo from "../../../hooks/useGoTo";
import RoundButton from "../buttons/RoundButton";
import AxiosService from "../../../services/axios.service";
import NavItem from "./NavItem";
import NavDivider from "./NavDivider";
import { RouteActionType } from "../../../utils/types.util";
import UserContext from "../../../context/user/userContext";
import ResourceContext from "../../../context/resource/resourceContext";
import storage from "../../../utils/storage.util";

const Sidebar = (props: ISidebar) => {

    const DASHBOARD_ROUTE = process.env.REACT_APP_DASHBOARD_ROUTE || '/dashboard';

    const {
        pageTitle,
        collapsed
    } = props;

    const userContext = useContext<IUserContext>(UserContext)
    const resourceContext = useContext<IResourceContext>(ResourceContext)

    const navigate = useNavigate()
    const [currentRoute, setCurrentRoute] = useState<IRouteItem>(routes[0])
    const [ticon, setTicon] = useState<string>('menu')

    useEffect(() => {
        initSidebar()
    }, [])

    useEffect(() => {

        if (resourceContext.countries.length === 0) {
            resourceContext.getCountries()
        }

        if (helper.isEmpty(userContext.user, 'object')) {
            userContext.getUser(storage.getUserID())
        }

    }, [userContext.user])

    // functions
    const initSidebar = () => {

        const name = storage.fetch('route.name');

        if (name) {
            userContext.setSidebar({
                collapsed,
                route: getRoute(name),
                subroutes: [],
                isOpen: false
            })
        } else {
            userContext.setSidebar({
                collapsed,
                route: routes[0],
                subroutes: [],
                isOpen: false
            })
        }

    }

    const computePath = (route: string) => {

        if (route === '/dashboard') {
            return route;
        } else {
            return DASHBOARD_ROUTE + route
        }

    }

    const setNavAction = (action?: RouteActionType) => {
        let result: string = action ? action : 'navigate';
        return result;
    }

    const getSubroutes = (name: string): Array<IRouteItem> => {

        let result: Array<IRouteItem> = [];

        const route = routes.find((x) => x.name === name);

        if (route && route.subroutes && route.subroutes.length > 0) {
            result = route.subroutes;
        }

        return result;

    }

    const getRoute = (name: string, subroute?: string): IRouteItem => {

        let result: any;
        const route = routes.find((x) => x.name === name);

        if (subroute && route && route.subroutes && route.subroutes.length > 0) {

            const sub = route.subroutes.find((m) => m.name === subroute);

            if (sub) {
                result = sub;
            }

        } else if (route) {
            result = route
        }

        return result;

    }

    const handleNav = (e: MouseEvent<HTMLAnchorElement>, nav: { parent: string, name: string, path: string, action: string }) => {

        e.preventDefault();

        const route = getRoute(nav.parent);
        const subroute = getRoute(nav.parent, nav.name);

        if (nav.action === 'navigate' && nav.path) {

            setCurrentRoute(route)
            navigate(nav.path);

            userContext.setSidebar({
                collapsed: collapsed,
                route: route,
                subroutes: userContext.sidebar.subroutes,
                isOpen: userContext.sidebar.subroutes.length > 0 ? true : false
            });

            // store current route name in local storage
            storage.keep('route.name', route.name);
            
            if (subroute && route.name !== subroute.name) {
                storage.keep('route.subroute', subroute.name);
            } else {
                storage.deleteItem('route.subroute')
            }

        } else if (nav.action === 'open-secondary') {

            userContext.setSidebar({
                collapsed: collapsed,
                route: route,
                subroutes: getSubroutes(nav.name),
                isOpen: true
            });

            // store current route name in local storage
            storage.keep('route.name', route.name);
            if (subroute){
                storage.keep('route.subroute', subroute.name);
            }

        } else if (nav.action === 'logout') {
            navigate('/login');
            AxiosService.logout()
        }



    }

    const toggleSidebar = (e: MouseEvent<HTMLAnchorElement>) => {

        e.preventDefault();

        if (userContext.sidebar.collapsed) {
            setTicon('nav-arrow-right')
        } else {
            setTicon('menu')
        }

        userContext.setSidebar({
            collapsed: !userContext.sidebar.collapsed,
            route: userContext.sidebar.route,
            subroutes: userContext.sidebar.subroutes,
            isOpen: false
        })

    }

    return (
        <>
            <section className={`ui-sidebar ${userContext.sidebar.collapsed ? 'expand' : 'collapsed'}`}>

                <div className={`sidebar-secondary ${userContext.sidebar.isOpen ? 'open' : 'close'}`}>

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
                            onClick={(e) => {

                                userContext.setSidebar({
                                    collapsed: userContext.sidebar.collapsed,
                                    route: userContext.sidebar.route,
                                    subroutes: [],
                                    isOpen: false
                                })

                                storage.deleteItem('route.subroute')

                            }}
                        />
                    </div>

                    <div className="bar-body">

                        <ul className="nav-list main-list">

                            {
                                userContext.sidebar.subroutes.length > 0 &&
                                userContext.sidebar.subroutes.map((route, index) =>
                                    <Fragment key={route.name + `${index + 1}`}>

                                        {
                                            route.name !== 'divider' &&
                                            <NavItem
                                                type="sidebar"
                                                label={route.title ? route.title : helper.capitalize(route.name)}
                                                icon={{ enable: true, name: route.iconName!, className: 'pdr1' }}
                                                active={route.title && route.title === pageTitle ? true : storage.fetch('route.subroute') === route.name ? true : false}
                                                path={computePath(userContext.sidebar.route.url + route.url)}
                                                onClick={(e) => handleNav(e, { parent: userContext.sidebar.route.name, name: route.name, path: computePath(userContext.sidebar.route.url + route.url), action: setNavAction(route.action) })}
                                            />
                                        }

                                        {
                                            route.name === 'divider' &&
                                            <NavDivider type="sidebar" show={true} />
                                        }

                                    </Fragment>
                                )
                            }

                        </ul>

                    </div>

                </div>

                <div className="sidebar-primary">

                    <div className="bar-header">
                        {userContext.sidebar.collapsed && <img className="logo" src="../../../images/assets/logo.svg" alt="logo" />}
                        {!userContext.sidebar.collapsed && <img className="logo-icon" src="../../../images/assets/logo-icon.svg" alt="logo" />}
                        <Icon
                            type="polio"
                            clickable={true}
                            name={ticon}
                            size={18}
                            className={`ui-relative ui-ml-auto`}
                            style={{
                                top: '0px'
                            }}
                            onClick={(e) => toggleSidebar(e)}
                        />
                    </div>

                    <div className="bar-body">

                        <ul className="nav-list main-list">
                            {
                                routes.map((route, index) =>
                                    <Fragment key={route.name + `${index + 1}`}>

                                        {
                                            route.name !== 'divider' &&
                                            <NavItem
                                                type="sidebar"
                                                label={route.title ? route.title : helper.capitalize(route.name)}
                                                icon={{ enable: true, name: route.iconName!, className: 'pdr1' }}
                                                active={userContext.sidebar.route.name === route.name ? true : false}
                                                path={computePath(route.url)}
                                                onClick={(e) => handleNav(e, { parent: route.name, name: route.name, path: computePath(route.url), action: setNavAction(route.action) })}
                                            />
                                        }

                                        {
                                            route.name === 'divider' &&
                                            <NavDivider type="sidebar" show={true} />
                                        }

                                    </Fragment>
                                )
                            }

                        </ul>

                        <ul className="nav-list">
                            <NavItem
                                type="sidebar"
                                label={'Logout'}
                                icon={{ enable: true, name: 'layout-left', className: 'pdr1' }}
                                onClick={(e) => handleNav(e, { parent: 'logout', name: 'logout', path: '/logout', action: setNavAction('logout') })}
                            />
                        </ul>

                    </div>

                </div>

            </section>
        </>
    )

};

export default Sidebar;
