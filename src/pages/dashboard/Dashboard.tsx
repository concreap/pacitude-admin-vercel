import React, { useEffect, useState, useContext, Fragment } from "react"
import Button from "../../components/partials/buttons/Button";
import ResourceContext from "../../context/resource/resourceContext";
import { IResourceContext } from "../../utils/interfaces.util";

const Dashboard = ({ }) => {

    const resourceContext = useContext<IResourceContext>(ResourceContext)

    useEffect(() => {

        

    }, [])

    return (
        <>
            <h1>This is Dashboard</h1>

                {
                    resourceContext.loading &&
                    <> <span className="loader primary"></span> </>
                }


                {
                    !resourceContext.loading &&
                    resourceContext.countries.map((country, index) => 
                    
                        <Fragment key={country._id}>
                            <div>{ country.name }</div>
                        </Fragment>

                    )
                }

        </>
    )
};

export default Dashboard;
