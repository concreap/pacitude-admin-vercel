import React, { useEffect } from 'react'
import pop from '../utils/loader.util'

const useNetwork = () => {

    const toggleNetwork = (e: any) => {
        pop.popNetwork()
    }

    useEffect(() => {

        window.addEventListener(`offline`, toggleNetwork, false);
        window.addEventListener(`online`, () => { }, false);

    }, [])

}

export default useNetwork