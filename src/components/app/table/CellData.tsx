import React, { useEffect } from "react"
import { ICellData } from "../../../utils/interfaces.util";
import Badge from "../../partials/badges/Badge";
import { SemanticType } from "../../../utils/types.util";

const CellData = (props: ICellData) => {

    const {
        fontSize = 14,
        className = '',
        status = {
            enable: false,
            type: 'enabled',
            value: false
        },
        render,
        onClick
    } = props;

    useEffect(() => {

    }, [])

    const getBadgeType = () => {

        let result: { type: SemanticType, label: string } = { type: 'success', label: 'Enabled' }

        if(status.type === 'enabled' && typeof(status.value) === 'boolean'){
            result.type = status.value ? 'success' : 'error';
            result.label = status.value ? 'Enabled' : 'Disabled'
        }
        
        else if(status.type === 'enabled' && typeof(status.value) === 'string'){
            result.type = status.value === 'enabled' ? 'success' : 'error';
            result.label = status.value === 'enabled' ? 'Enabled' : 'Disabled'
        }

        else if(status.type === 'active' && typeof(status.value) === 'boolean'){
            result.type = status.value ? 'success' : 'error';
            result.label = status.value ? 'Active' : 'Inactive'
        }

        else if(status.type === 'active' && typeof(status.value) === 'string'){
            result.type = status.value === 'active' ? 'success' : 'error';
            result.label = status.value === 'active' ? 'Enabled' : 'Disabled'
        }

        return result;

    }

    const fireClick = (e: any) => {

        if(onClick) {
            onClick(e)
        }

    }

    return (
        <>
            <td onClick={(e) => fireClick(e)} className={`cell-data ${onClick ? 'ui-cursor-pointer' : ''} fs-${fontSize} ${className}`}>

                { !status.enable && render }
                {
                    status.enable &&
                    <>
                        <Badge type={getBadgeType().type} label={getBadgeType().label} />
                    </>
                }

            </td>
        </>
    )
};

export default CellData;
