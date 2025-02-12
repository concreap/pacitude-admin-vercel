import React from 'react'
import { useNavigate } from 'react-router-dom'

const useGoTo = (url: string) => {

    const navigate = useNavigate()

    const goTo = () => {
        if(url){
            navigate(url)
        }
    }

    return { goTo }

}

export default useGoTo