import React, { useEffect } from "react"
import { ICellHead } from "../../../utils/interfaces.util";

const CellHead = (props: ICellHead) => {

    const {
        fontSize = 11,
        label,
        style,
        className
    } = props;

    useEffect(() => {

    }, [])

    return (
        <>
            <th className={`fs-${fontSize} ${className}`} style={style}>{label}</th>
        </>
    )
};

export default CellHead;
