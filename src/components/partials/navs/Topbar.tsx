import React, { useEffect, useState, useContext } from "react"
import { ITopbar, IUserContext } from "../../../utils/interfaces.util";
import UserContext from "../../../context/user/userContext";
import RoundButton from "../buttons/RoundButton";
import Icon from "../icons/Icon";
import { Link } from "react-router-dom";

const Topbar = (props: ITopbar) => {

    const {
        pageTitle
    } = props;

    const userContext = useContext<IUserContext>(UserContext)

    useEffect(() => {

    }, [])

    return (
        <>
            <section className={`ui-topbar stick ${userContext.sidebar.collapsed ? 'collapsed' : 'expand'}`}>

                <div className="topbar-wrapper">


                    <div className="page-bar">
                        <RoundButton
                            size="rg"
                            icon={<Icon type="polio" name="arrow-left" clickable={false} size={16} />}
                            className=""
                            clickable={true}
                            onClick={(e) => { }}
                        />
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

                        <Link to="" className="user-bar">
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

                    </div>

                </div>


            </section>
        </>
    )
};

export default Topbar;
