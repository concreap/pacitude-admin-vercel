import React, { useEffect, useState, useRef, CSSProperties, MouseEvent, Fragment, useImperativeHandle, ForwardedRef, forwardRef } from "react"
import { IFilter, IFilterItem } from "../../../utils/interfaces.util";
import helper from "../../../utils/helper.util";
import Icon from "../icons/Icon";
import { Link } from "react-router-dom";
import LinkButton from "../buttons/LinkButton";

const Filter = forwardRef((props: IFilter, ref: ForwardedRef<any>) => {

    const {
        id = helper.random(6, true),
        readonly = false,
        disabled = false,
        noFilter = false,
        name = 'filter-box',
        defaultValue = '',
        size = 'md',
        className = '',
        placeholder = 'Filter',
        showFocus = true,
        isError = false,
        position = 'bottom',
        icon = {
            name: 'calendar',
            type: 'feather',
            style: {}
        },
        items,
        onChange
    } = props;

    const menuRef = useRef<any>(null)

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selected, setSelected] = useState<IFilterItem>()
    const [item, setItem] = useState<IFilterItem>()
    const [step, setStep] = useState<number>(0);
    const [subitems, setSubItems] = useState<Array<{ label: string, value: string }>>([])

    useEffect(() => {

    }, [])

    useEffect(() => {

        const dropBarOut = (e: any) => {
            if (!menuRef.current) {
                return;
            }

            if (!menuRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }

        window.addEventListener('mousedown', dropBarOut, true)

        return () => {
            window.removeEventListener('mousedown', dropBarOut)
        }

    }, [])

    useEffect(() => {

        if (defaultValue) {
            const item = items.find((x) => x.value === defaultValue);
            if (item) {
                setSelected(item)
            }
        }

    }, [defaultValue])

    const computeClass = () => {

        let result: string = `filter ${isError ? 'error' : ''} fs-14 ${showFocus ? 'show-focus' : ''} ${disabled ? 'disabled-light' : ''}`;

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

    const selectItem = (e: MouseEvent<HTMLAnchorElement>, value: any, subvalue?: string) => {
        e.preventDefault()

        const item = items.find((x) => x.value === value);

        if (item && step === 0 && item.subitems && item.subitems.length > 0) {

            setSubItems(item.subitems!);
            setItem(item);
            setStep(1);

        } else if (item && item.subitems && step === 1 && subvalue) {

            const subitem = item.subitems.find((x) => x.value === subvalue);

            if (subitem) {
                setSelected(subitem)
                onChange({ ...subitem, item: item });
            } else {
                setSelected(undefined)
            }

            setIsOpen(false)

        } else {

            if (item) {
                setSelected(item)
                onChange(item);
            } else {
                setSelected(undefined)
            }

            setIsOpen(false)

        }



    }

    const toggleStep = (e: any) => {
        if (e) { e.preventDefault() }

        if (step === 0) {
            setStep(1)
        } else {
            setStep(0);
            setItem(undefined);
            setSelected(undefined)
        }
    }

    const toggleMenu = (e: any) => {
        if (e) { e.preventDefault() }
        setIsOpen(!isOpen)
        setStep(0)
    }

    const handleClear = (e: any) => {
        if (e) { e.preventDefault() }
        setIsOpen(false)
        setItem(undefined)
        setSelected(undefined)
        setStep(0)
    }

    const handleReset = (e: any) => {
        if (e) { e.preventDefault() }
        setItem(undefined)
        setSelected(undefined)
        setStep(0)
    }

    // expose child component functions to parent component
    useImperativeHandle(ref, () => ({
        clear: handleClear,
        reset: handleReset,
        isOpen: isOpen
    }))

    return (
        <>
            <div className={computeClass()}>

                <div onClick={(e) => toggleMenu(e)} className={`selected ${size}`}>
                    <span
                        className="font-hostgro fs-14 ui-relative pdr1"
                        style={{ top: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
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
                        style={icon.style}
                    />
                </div>

                <div ref={menuRef} className={`menu ${isOpen ? 'open' : 'close'} ${position}`}>
                    {
                        items.length === 0 &&
                        <div className="empty">
                            <span className="fs-15 lag-500">No Items</span>
                        </div>
                    }
                    {
                        items.length > 0 &&
                        <>
                            {
                                noFilter &&
                                <Link onClick={(e) => selectItem(e, 'no-filter')} to="" className="filter-item">
                                    <span className="fs-14 lag-800">No Filter</span>
                                </Link>
                            }

                            {
                                step === 0 &&
                                items.map((item, index) =>
                                    <Fragment key={`${item.value}-${index + 1}`}>
                                        <Link onClick={(e) => selectItem(e, item.value)} to="" className="filter-item">
                                            <span className="fs-14 lag-800">{item.label}</span>
                                        </Link>
                                    </Fragment>
                                )
                            }

                            {
                                step === 1 && item &&
                                subitems.length > 0 &&
                                <>
                                    <div className="mrgb">
                                        <Icon
                                            type="polio"
                                            name={'arrow-left'}
                                            size={18}
                                            clickable={true}
                                            position="relative"
                                            style={{ top: '1px' }}
                                            className="ui-ml-auto"
                                            onClick={(e) => toggleStep(e)}
                                        />
                                    </div>
                                    <div className="sub-filter-list">
                                        {
                                            subitems.map((subitem, index) =>
                                                <Fragment key={`${subitem.value}-${index + 1}`}>
                                                    <Link onClick={(e) => selectItem(e, item.value, subitem.value)} to="" className="filter-item">
                                                        <span className="fs-14 lag-800">{subitem.label}</span>
                                                    </Link>
                                                </Fragment>
                                            )
                                        }
                                    </div>
                                </>
                            }

                        </>

                    }
                </div>

            </div>
        </>
    )
});

export default Filter;
