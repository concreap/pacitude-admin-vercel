import React, { useEffect, useState, useRef, CSSProperties, MouseEvent, Fragment } from "react"
import { IFilter, IFilterItem } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";
import Icon from "../icons/Icon";
import { Link } from "react-router-dom";

const Filter = (props: IFilter) => {

    const menuRef = useRef<any>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selected, setSelected] = useState<IFilterItem>()

    const {
        id = helper.random(6, true),
        ref,
        readonly = false,
        noFilter = true,
        name = 'filter-box',
        size = 'md',
        className = '',
        placeholder = 'Filter',
        showFocus = true,
        isError = false,
        position = 'bottom',
        icon = {
            name: 'calendar',
            type: 'feather'
        },
        items,
        onChange
    } = props;

    useEffect(() => {

    }, [])

    // useEffect(() => {

    //     const dropBarOut = (e: any) => {
    //         if (!menuRef.current) {
    //             return;
    //         }

    //         if (!menuRef.current.contains(e.target)) {
    //             setIsOpen(false)
    //         }
    //     }

    //     window.addEventListener('mousedown', dropBarOut, true)

    //     return () => {
    //         window.removeEventListener('mousedown', dropBarOut)
    //     }

    // }, [])

    const computeClass = () => {

        let result: string = `filter ${isError ? 'error' : ''} color-black fs-14 ${showFocus ? 'show-focus' : ''}`;

        if (className) {
            result = result + ` ${className}`
        }

        return result;

    }

    const iconSize = (): number => {
        let result: number = 20;

        if (size === 'md') {
            result = 20;
        } else if (size === 'sm') {
            result = 16
        }

        return result;
    }

    const selectItem = (e: MouseEvent<HTMLAnchorElement>, value: any) => {
        e.preventDefault()

        const item = items.find((x) => x.value === value);

        if (item) {
            setSelected(item)
            onChange(item)
        } else {
            setSelected(undefined)
        }

        setIsOpen(false)
    }

    const toggleMenu = (e: any) => {
        if (e) { e.preventDefault() }
        setIsOpen(!isOpen)
    }

    return (
        <>
            <div className={computeClass()}>

                <div onClick={(e) => toggleMenu(e)} className={`selected ${size}`}>
                    <span className="font-hostgro fs-14 ui-relative pdr1" style={{ top: '1px' }}>
                        {selected && selected.label && <> {selected.label} </>}
                        {!selected && <> {placeholder} </>}
                    </span>
                    <Icon
                        type={icon.type}
                        name={icon.name}
                        size={iconSize()}
                        clickable={false}
                        position="relative"
                        className="icon"
                        style={{ color: "#838b93" }}
                    />
                </div>

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
                                noFilter &&
                                <Link onClick={(e) => selectItem(e, 'no-filter')} to="" className="filter-item">
                                    <span className="fs-14 pag-800">No Filter</span>
                                </Link>
                            }

                            {
                                items.map((item, index) =>
                                    <Fragment key={`${item.value}-${index + 1}`}>
                                        <Link onClick={(e) => selectItem(e, item.value)} to="" className="filter-item">
                                            <span className="fs-14 pag-800">{item.label}</span>
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

export default Filter;
