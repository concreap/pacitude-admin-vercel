import React, { useEffect, useState, forwardRef, useImperativeHandle, ForwardedRef, useRef, MouseEvent, Fragment } from "react"
import { IFilter, IFilterItem, ISearchFilter, ISearchFilterItem } from "../../../utils/interfaces.util";
import Icon from "../icons/Icon";
import AvatarUI from "../ui/AvatarUI";
import TextInput from "../inputs/TextInput";
import { Link } from "react-router-dom";
import UserAvatar from "../ui/UserAvatar";
import useSize from "../../../hooks/useSize";

const SearchFilter = forwardRef((props: ISearchFilter, ref: ForwardedRef<any>) => {

    const {
        id = '',
        readonly = false,
        disabled = false,
        noFilter = true,
        name = 'filter-box',
        defaultValue = '',
        size = 'md',
        className = '',
        placeholder = 'Filter',
        showFocus = true,
        isError = false,
        position = 'bottom',
        menu = {
            style: {},
            search: true,
            className: 'min-w-[13rem] max-w-[16rem]',
            fullWidth: false,
            limitHeight: 'sm'
        },
        icon = {
            name: 'calendar',
            type: 'feather',
            style: {},
            child: <Icon type="feather" name="chevron-down" size={16} className="ml-auto w-[16px] h-[16px] pag-600 relative top-[1px]" />
        },
        items,
        onChange
    } = props;

    const menuRef = useRef<any>(null);
    const searchRef = useRef<any>(null);

    const ch = useSize({ size })

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selected, setSelected] = useState<ISearchFilterItem>()
    const [item, setItem] = useState<ISearchFilterItem>()
    const [step, setStep] = useState<number>(0);
    const [limitHeight, setLimitHeight] = useState<boolean>(true);
    const [search, setSearch] = useState<Array<ISearchFilterItem>>([]);
    const [selectedDate, setSelectedDate] = useState({
        start: '',
        end: ''
    })

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
        handleAutoSelect()
    }, [])

    const cc = () => {

        let result: string = `filter search border bdr-pag-200 ${isError ? 'bdr-par-600 color-red' : ''} text-[13px] ${showFocus ? 'bdrf-pacb-400 bdrh-pacb-600' : ''} ${disabled ? 'disabled-light' : ''}`;

        if (menu.fullWidth) {
            result = result + ` full-width`
        }

        if (className) {
            result = result + ` ${className}`
        }

        return result;

    }

    const cmh = () => {
        let result = 'max-h-[170px] overflow-y-scroll scrollbar-hide';

        if (menu.limitHeight) {

            switch (menu.limitHeight) {
                case 'sm':
                    result = 'max-h-[130px] overflow-y-scroll scrollbar-hide'
                    break;
                case 'rg':
                case 'md':
                    result = 'max-h-[220px] overflow-y-scroll scrollbar-hide'
                    break;
                default:
                    result = 'max-h-[170px] overflow-y-scroll scrollbar-hide'
                    break;
            }

        }

        return result;
    }

    const handleAutoSelect = () => {

        if (defaultValue) {
            const item = items.find((x) => x.value === defaultValue);
            if (item) {
                setSelected(item)
            }
        }

    }

    const selectItem = (e: MouseEvent<HTMLAnchorElement>, value: any, subvalue?: string) => {
        e.preventDefault()

        const item = items.find((x) => x.value === value);

        if (item) {

            setSelected(item)
            onChange(item);
            setIsOpen(false)
            setSearch([])
            if (searchRef.current) {
                searchRef.current.clear()
            }
        } else {
            setSelected(undefined)
            setIsOpen(false)
            setSearch([])
        }

    }

    const handleFocus = (e: any) => {
        if (e) { e.preventDefault() }

        if (!selected) {
            setIsOpen(true);
            if (searchRef.current) {
                searchRef.current.focus()
            }
        }

    }

    const handleClear = (e: any) => {
        if (e) { e.preventDefault() }
        setIsOpen(false)
        setItem(undefined)
        setSelected(undefined)
        setStep(0)
        setSearch([])
    }

    const clearSelected = (e: any) => {
        if (e) { e.preventDefault() }
        handleClear(e);
        setIsOpen(true);
        setTimeout(() => {
            if (searchRef.current) {
                searchRef.current.focus()
            }
        }, 50)
    }

    const handleReset = (e: any) => {
        if (e) { e.preventDefault() }
        setItem(undefined)
        setSelected(undefined)
        setStep(0)
    }

    const handleSearch = (value: string) => {

        let currentList = items;
        let newList: Array<ISearchFilterItem> = [];

        if (value !== '') {

            newList = currentList.filter((item: ISearchFilterItem) => {
                const n = item.label.toLowerCase();
                const v = value.toLowerCase();
                return n.includes(v)
            });

        } else {
            newList = [];
        }

        setSearch(newList)

    }

    // expose child component functions to parent component
    useImperativeHandle(ref, () => ({
        clear: handleClear,
        reset: handleReset,
        isOpen: isOpen
    }))

    return (
        <>
            <div className={cc()}>

                <div onClick={(e) => handleFocus(e)} className={`filter-input relative cursor-text ${selected ? 'item-selected' : ''} ${ch.h}`}>

                    {
                        selected &&
                        <>
                            <Link onClick={(e) => clearSelected(e)} to={''} className="absolute h-[13px] w-[13px] rounded-full bg-pag-300 bgh-par-400 right-[0.8rem] flex items-center justify-center">
                                <Icon name="cancel" className="color-white" type="polio" size={10} />
                            </Link>
                            <div className="flex items-center grow">
                                {
                                    selected.image &&
                                    <>
                                        <UserAvatar
                                            size="min-w-[1.2rem] min-h-[1.2rem]"
                                            avatar={selected.image}
                                            name={selected.label}
                                        />
                                        <span className="pl-[0.5rem]"></span>
                                    </>
                                }
                                <span className="text-[13px] font-rethink pag-600 relative pr-[0.5rem] truncate top-[0px]">{selected.label}</span>
                            </div>
                        </>
                    }

                    {
                        !selected &&
                        <TextInput
                            ref={searchRef}
                            type="text"
                            size={size}
                            className="bdr-none w-full"
                            placeholder={placeholder}
                            icon={{
                                enable: true,
                                position: 'right',
                                child: <Icon name="search" className="pacb-800 top-[2px]" type="polio" size={16} />
                            }}
                            onFocus={(e) => {

                            }}
                            onChange={(e) => {
                                handleSearch(e.target.value);
                            }}
                        />
                    }

                </div>

                <div ref={menuRef} className={`menu sm menu-list ${isOpen ? 'open' : 'close'} ${position}`} style={menu.style}>

                    {
                        items.length === 0 &&
                        <div className="empty">
                            <span className="text-[14px] font-rethink pag-600">No Items</span>
                        </div>
                    }
                    {
                        items.length > 0 &&
                        <>

                            <div className={`inner ${cmh()}`}>

                                {
                                    search.length === 0 &&
                                    <div className="empty">
                                        <span className="text-[14px] font-rethink pag-600">No Results</span>
                                    </div>
                                }

                                {
                                    search.length > 0 &&
                                    search.map((item, index) =>
                                        <Fragment key={`${item.value}-${index + 1}`}>
                                            <Link onClick={(e) => selectItem(e, item.value)} to="" className={`filter-item ${menu.fullWidth ? '' : menu.className}`}>
                                                {
                                                    item.image &&
                                                    <>
                                                        <UserAvatar
                                                            avatar={item.image}
                                                            name={item.label}
                                                            size="min-w-[1.2rem] min-h-[1.2rem]"
                                                        />
                                                        <span className="pl-[0.5rem]"></span>
                                                    </>
                                                }
                                                <span className="text-[13px] font-rethink pag-900">{item.label}</span>

                                                {
                                                    selected && selected.value === item.value &&
                                                    <Icon name="check" className="pacb-800 ml-auto" type="feather" size={16} />
                                                }
                                            </Link>
                                        </Fragment>
                                    )
                                }

                            </div>

                        </>

                    }
                </div>

            </div>
        </>
    )
});

export default SearchFilter;
