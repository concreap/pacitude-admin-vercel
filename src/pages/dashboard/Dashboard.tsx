import React, { useEffect, useState, useContext, Fragment } from "react"
import Button from "../../components/partials/buttons/Button";
import ResourceContext from "../../context/resource/resourceContext";
import { IResourceContext } from "../../utils/interfaces.util";

const Dashboard = ({ }) => {

    useEffect(() => {

    }, [])

    const da = {
        name: 'john',
        age: 31,
        bla: 'bla'
    }

    const { name, ...rest } = da;

    return (
        <>
            <h1 onClick={(e) => { console.log(rest) }}>This is Dashboard</h1>
        </>
    )
};

export default Dashboard;
