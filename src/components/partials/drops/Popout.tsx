import React, { useEffect, useState, MouseEvent, useRef, Fragment } from "react"
import { Link } from "react-router-dom";
import Icon from "../icons/Icon";
import { IPopout, IPopoutItem } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";

const Popout = (props: IPopout) => {

    const menuRef = useRef<any>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const {
        id = helper.random(6, true),
        ref,
        readonly = false,
        name = 'popout-box',
        className = '',
        position = 'left',
        items,
    } = props;

    useEffect(() => {

    }, [])

    useEffect(() => {

        const handleOutside = (e: any) => {
            if (!menuRef.current) {
                return;
            }

            if (!menuRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }

        window.addEventListener('mousedown', handleOutside, true)

        return () => {
            window.removeEventListener('mousedown', handleOutside)
        }

    }, [])

    const computeClass = () => {

        let result: string = `popout fs-14`;

        if (className) {
            result = result + ` ${className}`
        }

        return result;

    }

    const toggleMenu = (e: any) => {
        if (e) { e.preventDefault() }
        setIsOpen(!isOpen)
    }

    const handleClick = (e: MouseEvent<HTMLAnchorElement>, item: IPopoutItem) => {
        e.preventDefault();
        const { onClick } = item;
        onClick(e);
        setIsOpen(false)
    }

    return (
        <>
            <div className={computeClass()}>

                <Link onClick={(e) => toggleMenu(e)} to="" className="trigger">
                    <Icon
                        type="feather"
                        name={'more-horizontal'}
                        size={18}
                        clickable={false}
                        position="relative"
                        className="table-icon"
                        style={{ color: "#838b93", top: '1px' }}
                    />
                </Link>

                <div ref={menuRef} className={`menu ${isOpen ? 'open' : 'close'} ${position}`}>
                    {
                        items.length === 0 &&
                        <div className="empty">
                            <span className="fs-15 pag-500">No Items</span>
                        </div>
                    }
                    {
                        items.length > 0 &&
                        <>
                            {
                                items.map((item, index) =>
                                    <Fragment key={`${item.value}-${index + 1}`}>
                                        <Link onClick={(e) => handleClick(e, item)} to="" className="popout-item">
                                            <span className="fs-14 pag-800">{item.label}</span>
                                            {
                                                item.icon &&
                                                <Icon
                                                    type={item.icon.type}
                                                    name={item.icon.name}
                                                    size={item.icon.size ? item.icon.size : 14}
                                                    clickable={false}
                                                    position="relative"
                                                    className="popout-icon ui-ml-auto"
                                                    style={{ color: "#838b93" }}
                                                />
                                            }
                                        </Link>
                                    </Fragment>
                                )
                            }
                        </>
                    }
                </div>

            </div>
        </>
    )
};

export default Popout;
