import React, { MouseEvent, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import storage from '../utils/storage.util'
import { IResourceContext } from '../utils/interfaces.util'
import ResourceContext from '../context/resource/resourceContext'

const useCopyText = () => {

    const resourceContext = useContext<IResourceContext>(ResourceContext)

    const copyText = (e: MouseEvent<HTMLElement>, text: string) => {

        if (e) e.preventDefault()

        storage.copyCode(text)
        resourceContext.setToast({
            ...resourceContext.toast,
            show: true,
            type: 'info',
            message: `Code ${text} copied to clipboard`
        })

    }

    return { copyText }

}

export default useCopyText