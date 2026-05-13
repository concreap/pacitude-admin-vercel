import React, { useCallback, useEffect } from 'react'
import { ICollection, IListQuery } from '../../utils/interfaces.util'
import useContextType from '../useContextType'
import AxiosService from '../../services/axios.service'
import { URL_CREDITS } from '../../utils/path.util'
import useNetwork from '../useNetwork'
import storage from '../../utils/storage.util'
import { GET_CREDIT, GET_CREDITS } from '../../context/types'
import helper from '../../utils/helper.util'
import { CurrencyName, CurrencySymbol, CurrencyType, StatusEnum } from '../../utils/enums.util'
import { SemanticType } from '../../utils/types.util'

interface IGrantCredit {
    id: string,
    months: number,
    note?: string
}

interface IRevokeCredit {
    id: string,
}

const useCredit = () => {

    const { appContext } = useContextType()
    const { popNetwork } = useNetwork(false)
    const {
        credits,
        credit,
        loading,
        loader,
        setCollection,
        setResource,
        setLoading,
        unsetLoading
    } = appContext;

    const CreditStatus = helper.pickFrom(StatusEnum, [
        'ACTIVE', 'REVOKED', 'EXHAUSTED'
    ] as const)

    useEffect(() => {
    }, [])

    const displayValue = (currency: string, value: number) => {

        let result: string = value.toLocaleString()

        if (currency === CurrencyType.NGN) {
            result = `${CurrencySymbol.NGN}${value.toLocaleString()}`
        } else if (currency === CurrencyType.USD) {
            result = `${CurrencySymbol.USD}${value.toLocaleString()}`
        }

        return result;

    }

    const displayCurrency = (currency: string) => {

        let result: string = ''

        if (currency === CurrencyType.NGN) {
            result = `${CurrencySymbol.NGN} ${helper.capitalize(CurrencyName.NGN)}`
        } else if (currency === CurrencyType.USD) {
            result = `${CurrencySymbol.USD} ${helper.capitalize(CurrencyName.USD)}`
        }

        return result;

    }

    const getStatusType = (status: string) => {

        let result: SemanticType = 'warning';

        switch (status) {
            case CreditStatus.REVOKED:
                result = 'error'
                break;
            case CreditStatus.ACTIVE:
                result = 'success'
                break;
            case CreditStatus.EXHAUSTED:
                result = 'ongoing'
                break;
            default:
                result = 'success'
                break;
        }

        return result;

    }

    /**
     * @name getCredits
     */
    const getCredits = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        setLoading({ option: 'resource', type: GET_CREDITS })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_CREDITS}?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: response.data,
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: response.data.length > 0 ? `displaying ${response.count!} credits` : 'There are no credits currently'
                }

                setCollection(GET_CREDITS, result);

            }

        }

        if (response.error === true) {

            unsetLoading({
                option: 'resource',
                type: GET_CREDITS,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                AxiosService.logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get credits ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setCollection])

    /**
     * @name getCredit
     */
    const getCredit = useCallback(async (id: string) => {

        setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_CREDITS}/${id}`
        })

        if (response.error === false) {

            if (response.status === 200) {
                setResource(GET_CREDIT, response.data)
            }

            unsetLoading({
                option: 'default',
                message: 'data fetched successfully'
            })

        }

        if (response.error === true) {

            unsetLoading({
                option: 'default',
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                AxiosService.logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                popNetwork();
            }
            else if (response.data) {
                console.log(`Error! Could not get credit ${response.data}`)
            }
            else if (response.status === 500) {
                console.log(`Sorry, there was an error processing your request. Please try again later. ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setResource])

    /**
     * @name grantCredit
     */
    const grantCredit = useCallback(async (data: IGrantCredit) => {

        setLoading({ option: 'loader' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'POST',
            isAuth: true,
            path: `${URL_CREDITS}/${data.id}`,
            payload: {
                months: data.months,
                note: data.note
            }
        })

        if (response.error === false) {

            unsetLoading({
                option: 'loader',
                message: 'Credits granted successfully'
            })

            response.message = 'Credits granted successfully'

        }

        if (response.error === true) {

            unsetLoading({
                option: 'loader',
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                AxiosService.logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                popNetwork();
            }

        }

        return response

    }, [setLoading, unsetLoading])

    /**
     * @name revokeCredit
     */
    const revokeCredit = useCallback(async (data: IRevokeCredit) => {

        setLoading({ option: 'loader' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'PUT',
            isAuth: true,
            path: `${URL_CREDITS}/revoke/${data.id}`,
            payload: {}
        })

        if (response.error === false) {

            unsetLoading({
                option: 'loader',
                message: 'lesson updated successfully'
            })

        }

        if (response.error === true) {

            unsetLoading({
                option: 'loader',
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                AxiosService.logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                popNetwork();
            }

        }

        return response

    }, [setLoading, unsetLoading])


    return {
        credits,
        credit,
        loading,
        loader,

        CreditStatus,
        getStatusType,
        displayCurrency,
        displayValue,

        getCredits,
        getCredit,
        grantCredit,
        revokeCredit
    }
}

export default useCredit