import React, { useEffect, useState, useContext } from "react"
import { ITopbar, IUserContext } from "../../../utils/interfaces.util";
import UserContext from "../../../context/user/userContext";
import RoundButton from "../buttons/RoundButton";
import Icon from "../icons/Icon";
import { Link, useNavigate } from "react-router-dom";
import NavItem from "./NavItem";
import NavDivider from "./NavDivider";

const Topbar = (props: ITopbar) => {

    const {
        pageTitle,
        showBack
    } = props;

    const navigate = useNavigate()

    const userContext = useContext<IUserContext>(UserContext)

    const [dropBar, setDropbar] = useState<boolean>(false)

    useEffect(() => {

    }, [])

    return (
        <>
            <section className={`ui-topbar stick ${userContext.sidebar.collapsed ? 'collapsed' : 'expand'}`}>

                <div className="topbar-wrapper">


                    <div className="page-bar">
                        {
                            showBack &&
                            <RoundButton
                                size="rg"
                                icon={<Icon type="polio" name="arrow-left" clickable={false} size={16} />}
                                className=""
                                clickable={true}
                                onClick={(e) => { navigate(-1) }}
                            />
                        }
                        <h3 className="font-hostgro-medium mrgb0 fs-18 pas-950">{pageTitle}</h3>
                    </div>

                    <div className="action-bar">

                        <div className="action-message ui-relative">
                            <span className="indicator"></span>
                            <Icon
                                type="polio"
                                name="bell"
                                clickable={false}
                                size={22}
                                position="relative"
                                style={{ top: '4px', color: 'var(--pas-900)' }}
                            />
                        </div>

                        <Link onClick={(e) => { setDropbar(!dropBar) }} to="" className="user-bar">
                            <div className="topbar-avatar ui-full-bg" style={{ backgroundImage: 'url("../../../images/assets/avatar_vivek.png")' }}>
                                <span className="empty">OI</span>
                            </div>
                            <Icon
                                type="polio"
                                name="nav-arrow-right"
                                clickable={false}
                                size={18}
                                position="relative"
                                style={{ transform: 'rotate(90deg)', top: '3px', color: 'var(--pas-900)' }}
                            />
                        </Link>

                        <div className={`user-bar-drop ${dropBar ? 'active' : ''}`}>
                            <NavItem
                                type="topbar"
                                label={'Profile'}
                                icon={{ enable: true, name: 'user', className: 'pdr1' }}
                                active={false}
                                path={''}
                                onClick={(e) => () => { }}
                            />
                            <NavItem
                                type="topbar"
                                label={'Tasks'}
                                icon={{ enable: true, name: 'user', className: 'pdr1' }}
                                active={false}
                                path={''}
                                onClick={(e) => () => { }}
                            />
                            <NavItem
                                type="topbar"
                                label={'Billing'}
                                icon={{ enable: true, name: 'user', className: 'pdr1' }}
                                active={false}
                                path={''}
                                onClick={(e) => () => { }}
                            />
                            <NavItem
                                type="topbar"
                                label={'Settings'}
                                icon={{ enable: true, name: 'user', className: 'pdr1' }}
                                active={false}
                                path={''}
                                onClick={(e) => () => { }}
                            />
                            <NavDivider type="sidebar" show={true} />
                            <NavItem
                                type="topbar"
                                label={'Logout'}
                                icon={{ enable: true, name: 'user', className: 'pdr1' }}
                                active={false}
                                path={''}
                                onClick={(e) => () => { }}
                            />
                        </div>

                    </div>

                </div>


            </section>
        </>
    )
};

export default Topbar;
