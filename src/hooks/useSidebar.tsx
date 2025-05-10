import React, { useContext, useEffect, useState } from 'react'
import useContextType from './useContextType'

const useSidebar = (init: boolean = true) => {

    const { userContext } = useContextType()

    const {
        sidebar,
        currentSidebar,
        setSidebar
    } = userContext;

    useEffect(() => {

        if (init) {
            initSidebar()
        }

    }, [init])

    const initSidebar = () => {

        const result = currentSidebar(sidebar.collapsed);

        if (result) {
            setSidebar(result)
        }

    }

    return {
        sidebar, currentSidebar, setSidebar, initSidebar
    }
}

export default useSidebar