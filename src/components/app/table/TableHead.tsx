import React, { useEffect, useState, useContext, Fragment } from "react"
import { ITableHead } from "../../../utils/interfaces.util";
import CellHead from "./CellHead";

const TableHead = (props: ITableHead) => {

    const {
        className = '',
        items
    } = props;

    useEffect(() => {

    }, [])

    return (
        <>
            <thead className={`table-head ${className}`}>
                <tr className="head-row">
                    {
                        items.length > 0 &&
                        items.map((cell, index) =>

                            <CellHead
                                key={`${cell.label}-${index + 1}`}
                                label={cell.label}
                                className={cell.className}
                                fontSize={cell.fontSize}
                                style={cell.style}
                            />

                        )
                    }
                </tr>
            </thead>
        </>
    )
};

export default TableHead;
