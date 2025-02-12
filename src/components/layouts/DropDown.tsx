import React from 'react';
import DropSelect from './DropSelect'
import { IDropdown } from '../../utils/interfaces.util';

const DropDown = ({
    options,
    className,
    selected,
    defaultValue,
    placeholder,
    disabled,
    size = 'rg',
    search = {
        bgColor: '#fff',
        color: '#000',
        enable: true
    },
    control = {
        image: true,
        label: true,
        left: false,
        className: ''
    },
    menu = {
        bgColor: '#fff',
        itemColor: '000',
        itemLabel: true,
        itemLeft: true,
        position: 'bottom',
        style: {},
        className: ''
    },
}: Partial<IDropdown>) => {

    const onSelectChange = (sel: any) => {
        selected(sel);
    }

    const getDefault = () => {

        if (defaultValue && typeof (defaultValue) === 'object') {
            return defaultValue;
        } else if (defaultValue && typeof (defaultValue) === 'number') {
            return options ? options()[defaultValue] : options()[0];
        } else {
            return;
        }


    }

    const computeControlClass = () => {

        let result: string = `${size}`

        if(control && control.className){
            result = `${result} ${control.className}`;
        }

        return result;

    }

    return (
        <>

            <DropSelect
                isSearchable={search ? search.enable : true}
                disableSeparator={true}
                className={className ? className : ''}
                controlClassName={computeControlClass()}
                controlDisplayImage={control ? control.image : false}
                controlDisplayLabel={control ? control.label : false}
                controlDisplayLeft={control ? control.left : false}
                optionDisplayLeft={menu ? menu.itemLeft : false}
                optionDisplayLabel={menu ? menu.itemLabel : true}
                optionDisplayImage={control ? control.image : false}
                defaultValue={getDefault()}
                options={options}
                onChange={(item: any) => onSelectChange(item)}
                placeholder={placeholder ? placeholder : 'Select option'}
                isDisabled={disabled ? disabled : false}
                menuPosition={menu ? menu.position : 'bottom'}
                menuBackground={menu ? menu.bgColor : ''}
                menuClassName={menu.className}
                menuStyle={menu.style}
                searchBackground={search ? search.bgColor : ''}
                searchColor={search ? search.color : ''}
                optionColor={menu ? menu.itemColor : ''}
            />

        </>
    )

}

export default DropDown;