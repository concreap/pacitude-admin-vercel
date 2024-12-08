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
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [subroutes, setSubroutes] = useState<Array<IRouteItem>>([])
    const [currentRoute, setCurrentRoute] = useState<IRouteItem>(routes[0])
    const [ticon, setTicon] = useState<string>('menu')

    useEffect(() => {
        userContext.setSidebar({ collapsed })
    }, [])

    useEffect(() => {

        if(resourceContext.countries.length === 0){
            resourceContext.getCountries()
        }

        if(helper.isEmpty(userContext.user, 'object')){
            userContext.getUser(storage.getUserID())
        }

    }, [userContext.user])

    // functions
    const computePath = (route: string) => {

        if(route === '/dashboard'){
            return route;
        }else {
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

    const getRoute = (name: string): IRouteItem => {

        let result = currentRoute;

        const route = routes.find((x) => x.name === name);

        if (route) {
            result = route;
        }

        return result;

    }

    const handleNav = (e: MouseEvent<HTMLAnchorElement>, nav: { name: string, path: string, action: string }) => {

        e.preventDefault();

        if (nav.action === 'navigate' && nav.path) {
            setCurrentRoute(getRoute(nav.name))
            navigate(nav.path)
        } else if (nav.action === 'open-secondary') {
            setCurrentRoute(getRoute(nav.name))
            setSubroutes(getSubroutes(nav.name))
            setIsOpen(true)
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
        userContext.setSidebar({ collapsed: !userContext.sidebar.collapsed })

    }

    return (
        <>
            <section className={`ui-sidebar ${userContext.sidebar.collapsed ? 'expand' : 'collapsed'}`}>

                <div className={`sidebar-secondary ${isOpen ? 'open' : 'close'}`}>

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
                            onClick={(e) => { setIsOpen(false) }}
                        />
                    </div>

                    <div className="bar-body">

                        <ul className="nav-list main-list">

                            {
                                subroutes.length > 0 && subroutes.map((route, index) =>
                                    <Fragment key={route.name + `${index + 1}`}>

                                        {
                                            route.name !== 'divider' &&
                                            <NavItem
                                                type="sidebar"
                                                label={route.title ? route.title : helper.capitalize(route.name)}
                                                icon={{ enable: true, name: route.iconName!, className: 'pdr1' }}
                                                active={route.title && route.title === pageTitle ? true : false}
                                                path={computePath(currentRoute.url + route.url)}
                                                onClick={(e) => handleNav(e, { name: route.name, path: computePath(currentRoute.url + route.url), action: setNavAction(route.action) })}
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
                                                active={currentRoute.name === route.name ? true : false}
                                                path={computePath(route.url)}
                                                onClick={(e) => handleNav(e, { name: route.name, path: computePath(route.url), action: setNavAction(route.action) })}
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
                                onClick={(e) => handleNav(e, { name: 'logout', path: '/logout', action: setNavAction('logout') })}
                            />
                        </ul>

                    </div>

                </div>

            </section>
        </>
    )

};

export default Sidebar;
