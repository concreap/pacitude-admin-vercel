import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ICoreMetrics, IMetricQuery } from '../../utils/interfaces.util'
import useContextType from '../useContextType'
import { GET_METRICS } from '../../context/types'
import AxiosService from '../../services/axios.service'
import { URL_METRICS } from '../../utils/path.util'
import useNetwork from '../useNetwork'
interface IGenerate {
    model: string,
    prompt: string,
    total: number
}

const useMetrics = () => {

    const { appContext } = useContextType()
    const { popNetwork } = useNetwork(false)
    const {
        metrics,
        loading,
        setCollection,
        setResource,
        setLoading,
        unsetLoading
    } = appContext

    const [metric, setMetric] = useState({ total: 0, disabled: 0, enabled: 0 })

    useEffect(() => {

    }, [])

    const handleSetMetric = () => {

        const mt = metrics;
        const qmt = mt.question;

        if (qmt && mt.type === 'question' && mt.resource) {

            setMetric({
                ...metric,
                total: qmt.resource.total || qmt.total,
                enabled: qmt.resource.enabled || qmt.enabled,
                disabled: qmt.resource.disabled || qmt.disabled
            })

        } else if (qmt && mt.type === 'question') {
            setMetric({
                ...metric,
                total: qmt.total,
                enabled: qmt.enabled,
                disabled: qmt.disabled
            })
        }

    }

    const getResourceMetrics = useCallback(async (data: IMetricQuery) => {

        const { metric, type, difficulties, endDate, levels, questionTypes, resource, resourceId, startDate } = data;

        if (metric === 'overview') {

            await setLoading({ option: 'resource', type: GET_METRICS })

            const response = await AxiosService.call({
                type: 'default',
                method: 'POST',
                isAuth: true,
                path: `${URL_METRICS}/overview`,
                payload: {
                    type: type,
                    difficulties: difficulties,
                    endDate: endDate,
                    levels: levels,
                    questionTypes: questionTypes,
                    resource: resource,
                    resourceId: resourceId,
                    startDate: startDate
                }
            })

            if (response.error === false) {

                if (response.status === 200) {

                    const result: ICoreMetrics = {
                        type: type,
                        resource: resource,
                        question: response.data.question,
                        loading: false,
                        message: `successful`
                    }

                    setResource(GET_METRICS, result)

                }

            }

            if (response.error === true) {

                await unsetLoading({
                    option: 'resource',
                    type: GET_METRICS,
                    message: response.message ? response.message : response.data
                })

                if (response.status === 401) {
                    AxiosService.logout()
                } else if (response.message && response.message === 'Error: Network Error') {
                    popNetwork();
                } else if (response.data) {
                    console.log(`Error! Could not get metrics ${response.data}`)
                }

            }


        } else {

            await unsetLoading({
                option: 'resource',
                type: GET_METRICS,
                message: 'invalid metric type'
            })
        }


    }, [setLoading, unsetLoading, setCollection])

    return {
        metrics,
        metric,
        loading,

        handleSetMetric,

        getResourceMetrics
    }
}

export default useMetrics