import React from 'react'
import { useNavigate } from 'react-router-dom'

const useGoTo = () => {

    const navigate = useNavigate()

    const goTo = (url: string) => {
        if(url){
            navigate(url)
        }
    }

    return { goTo }

}

export default useGoTo