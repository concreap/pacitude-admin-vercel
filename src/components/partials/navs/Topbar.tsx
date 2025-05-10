import React, { useEffect, useState, useContext, useRef } from "react"
import { ITopbar } from "../../../utils/interfaces.util";
import useGoTo from "../../../hooks/useGoTo";
import IconButton from "../buttons/IconButton";
import useGoBack from "../../../hooks/useGoBack";
import Icon from "../icons/Icon";
import { Link } from "react-router-dom";
import NavItem from "./NavItem";
import NavDivider from "./NavDivider";
import useSidebar from "../../../hooks/useSidebar";
import UserAvatar from "../ui/UserAvatar";

const Topbar = (props: ITopbar) => {

    const {
        pageTitle,
        showBack,
        sticky = true
    } = props;

    const { sidebar } = useSidebar()
    const { goBack } = useGoBack()
    const dropRef = useRef<any>(null)

    const [avatarDrop, setAvatarDrop] = useState<boolean>(false)

    useEffect(() => {

    }, [])

    // use-effect to close avatar-drop when clicking outside
    useEffect(() => {

        const dropBarOut = (e: any) => {
            if (!dropRef.current) {
                return;
            }

            if (!dropRef.current.contains(e.target)) {
                setAvatarDrop(false)
            }
        }

        window.addEventListener('mousedown', dropBarOut, true)

        return () => {
            window.removeEventListener('mousedown', dropBarOut)
        }

    }, [])

    const tc = () => {

        let result = `w-[100%] px-0 py-0 h-[80px] max-h-[80px] border-b bdr-pag-100`;

        if (sticky) {
            result = result + ` fixed z-[800] right-0 left-0 top-0 bg-white`
        }

        if (sidebar.collapsed) {
            result = result + ` pl-[84px]`
        } else {
            result = result + ` pl-[260px]`
        }

        return result

    }

    const tw = () => {

        let result = `w-[100%] h-[100%] max-h-[100%] flex items-center py-0 px-[2rem]`;

        return result

    }

    const adc = () => {

        let result = `w-[200px] min-h-[200px] bg-white shadow-subtle border bdr-pag-100 py-[0.55rem] px-[1rem] absolute z-[1000] right-0 top-0 mt-[2rem] rounded-[8px]`;
        result = result + ` transition-all duration-[0.15s] ease`

        if (avatarDrop) {
            result = result + `  opacity-[1] visible transform translate-y-[30px]`
        } else {
            result = result + ` opacity-[0] invisible transform translate-y-[90px]`
        }

        return result

    }

    return (
        <>
            <div className={`topbar ${tc()}`}>

                <div className={`topbar-wrapper ${tw()}`}>

                    <div className="page-bar flex items-center gap-x-[1rem]">

                        {
                            showBack &&
                            <IconButton
                                size="min-w-[1.8rem] min-h-[1.8rem]"
                                className="ml-auto bg-pab-50 bgh-pab-100"
                                icon={{
                                    type: 'polio',
                                    name: 'arrow-left',
                                    size: 16,
                                    className: 'pab-800'
                                }}
                                onClick={(e) => {
                                    goBack()
                                }}
                            />
                        }

                        <h3 className="font-rethink-medium mrgb0 text-[18px] pas-950">{pageTitle}</h3>

                    </div>

                    <div className="action-bar flex items-center ml-auto gap-x-[1.5rem] relative">

                        <div className="action-message relative">
                            <span className="indicator inline-flex absolute right-0 top-[2px] z-[1] w-[10px] h-[10px] rounded-full bg-pag-200"></span>
                            <Icon
                                type="polio"
                                name="bell"
                                clickable={false}
                                size={22}
                                position="relative"
                                style={{ top: '4px', color: 'var(--pas-900)' }}
                            />
                        </div>

                        <Link
                            onClick={(e) => { setAvatarDrop(!avatarDrop) }}
                            to=""
                            className="user-bar ml-auto relative inline-flex items-center gap-x-[0.2rem]">
                            <UserAvatar
                                size="w-[40px] h-[40px]"
                                className="topbar-avatar"
                                avatar={'../../../images/assets/avatar.png'}
                                name={'User Avatar'}
                            />
                            <Icon
                                type="polio"
                                name="nav-arrow-right"
                                clickable={false}
                                size={18}
                                position="relative"
                                style={{ transform: 'rotate(90deg)', top: '3px', color: 'var(--pas-900)' }}
                            />
                        </Link>

                        <div ref={dropRef} className={`user-bardrop ${adc()}`}>
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

            </div>
        </>
    )
};

export default Topbar;
