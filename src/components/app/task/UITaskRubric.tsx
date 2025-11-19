import React, { useEffect, useState, useContext, Fragment } from "react"
import { ITaskRubric } from "../../../models/Task.model";
import TableBox from "../../partials/table/TableBox";
import Table from "../../partials/table/Table";
import TableHeader from "../../partials/table/Tableheader";
import TableBody from "../../partials/table/TableBody";
import CellData from "../../partials/table/CellData";
import TableRow from "../../partials/table/TableRow";
import IconButton from "../../partials/buttons/IconButton";

interface IUITaskRubric {
    rubrics: Array<ITaskRubric>
}

const UITaskRubric = (props: IUITaskRubric) => {

    const {
        rubrics
    } = props;

    useEffect(() => {

    }, [])
    return (
        <>
            <div className="overflow-x-auto">
                <TableBox>
                    <Table className={""}>
                        <TableHeader
                            items={[
                                { label: '#' },
                                { label: 'Criteria', },
                                { label: 'Description' },
                                { label: 'Points' },
                                { label: 'Action' },
                            ]}
                        />
                        <TableBody>
                            {
                                rubrics.map((rubric, index) =>
                                    <Fragment key={rubric.criteria + index}>
                                        <TableRow>
                                            <CellData large={true} className="">{index + 1}</CellData>
                                            <CellData large={true} className="font-mona-medium">{rubric.criteria}</CellData>
                                            <CellData large={true} className="font-mona">{rubric.description}</CellData>
                                            <CellData large={true} className="font-mona text-center">{rubric.point}</CellData>
                                            <CellData large={true} className="text-center">
                                                <IconButton
                                                    size="min-w-[1.8rem] min-h-[1.8rem]"
                                                    className="bg-pag-50 bgh-pacb-200 pacb-700 pacbh-700"
                                                    icon={{
                                                        type: 'feather',
                                                        name: 'edit-2',
                                                        size: 14,
                                                    }}
                                                    onClick={(e) => { }}
                                                />
                                            </CellData>
                                        </TableRow>
                                    </Fragment>
                                )
                            }
                        </TableBody>

                    </Table>
                </TableBox>
            </div>
        </>
    )
};

export default UITaskRubric;
