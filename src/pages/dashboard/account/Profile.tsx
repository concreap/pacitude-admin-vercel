import React, {useEffect, useState, useContext, Fragment} from "react"
import { IResourceContext } from "../../../utils/interfaces.util";
import ResourceContext from "../../../context/resource/resourceContext";

const Profile = ({}) => {

    const resourceContext = useContext<IResourceContext>(ResourceContext)

    useEffect(() => {
        
    },[])

  return (
    <>
      <h1>This is Profile</h1>

                {
                    resourceContext.countries.map((country, index) => 
                    
                        <Fragment key={country._id}>
                            <div>{ country.name }</div>
                        </Fragment>

                    )
                }
    </>
  )
};

export default Profile;
