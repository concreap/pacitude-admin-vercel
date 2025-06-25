import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { ICollection, IListQuery, IUserContext } from '../../utils/interfaces.util'
import useContextType from '../useContextType'
import { GET_INDUSTRIES, GET_INDUSTRY } from '../../context/types'
import AxiosService from '../../services/axios.service'
import { URL_INDUSTRY } from '../../utils/path.util'
import useNetwork from '../useNetwork'
import useToast from '../useToast'
import helper from '../../utils/helper.util'


interface IIndustryData {
    name: string,
    label: string,
    description: string,
    isEnabled: any,
}

const useIndustry = () => {

    const statusRef = useRef<any>(null)
    const { appContext } = useContextType()
    const { popNetwork } = useNetwork(false)
    const { industries, industry, loading, setCollection, setResource, setLoading, unsetLoading } = appContext

    const { toast, setToast } = useToast()


    const [industryData, setIndustryData] = useState<IIndustryData>({
        name: '',
        label: '',
        description: '',
        isEnabled: null,
    })

    useEffect(() => {

    }, [])


    const handleChange = <K extends keyof IIndustryData>(field: K, value: IIndustryData[K]) => {
        setIndustryData((prev) => ({
            ...prev,
            [field]: value
        }))
    };

    /**
        * @name createIndustry
        */
    const createIndustry = useCallback(async (validate: () => boolean) => {

        const isValidated = validate()

        if (isValidated === true) {
            const payload = { ...industryData }

            setLoading({ option: 'default' })

            const response = await AxiosService.call({
                type: 'default',
                method: 'POST',
                isAuth: true,
                path: `${URL_INDUSTRY}`,
                payload: payload
            })

            if (response.error === false) {

                setIndustryData({
                    name: '',
                    label: '',
                    description: '',
                    isEnabled: false,
                })

                if (response.status === 200) {
                    setToast({ ...toast, show: true, type: 'success', message: 'Industry updated successfully' })
                }

                unsetLoading({
                    option: 'default',
                    message: 'data saved successfully'
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
                    setToast({ ...toast, show: true, error: 'industry', type: 'error', message: `Error! Could not create industry ${response?.errors[0]}` })
                }
                else if (response.status === 500) {
                    setToast({ ...toast, show: true, error: 'industry', type: 'error', message: `Sorry, there was an error processing your request. Please try again later.` })
                }
                setTimeout(() => {
                    setToast({ ...toast, show: false })
                }, 3000)

            }
        }

    }, [industryData, setLoading, unsetLoading, setResource])

    /**
        * @name editIndustry
        */
    const editIndustry = useCallback(async (e: MouseEvent<HTMLAnchorElement>) => {
        if (e) e.preventDefault();
        const payload: any = { ...industryData }

        Object.keys(payload).forEach((key) => {
            const k = key as keyof typeof payload;
            const value = payload[k];

            if (
                value === '' ||
                value === null ||
                value === undefined ||
                (Array.isArray(value) && value.length === 0)
            ) {
                delete payload[k];
            }
        });

        setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'PUT',
            isAuth: true,
            path: `${URL_INDUSTRY}/${industry.id}`,
            payload: payload
        })

        if (response.error === false) {

            if (response.status === 200) {
                setToast({ ...toast, show: true, type: 'success', message: 'Industry updated successfully' })
            }

            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 3000)

            unsetLoading({
                option: 'default',
                message: 'data saved successfully'
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
            else if (!helper.isEmpty(response.data, 'object')) {
                setToast({ ...toast, show: true, error: 'industry', type: 'error', message: `Error! Could not create industry ${response?.errors[0]}` })
            }
            else if (response.status === 500) {
                setToast({ ...toast, show: true, error: 'industry', type: 'error', message: `Sorry, there was an error processing your request. Please try again later.` })
            }
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 3000)

        }

    }, [industryData, setLoading, unsetLoading, setResource])

    /**
     * @name getIndustries
     */
    const getIndustries = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        setLoading({ option: 'resource', type: GET_INDUSTRIES })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_INDUSTRY}?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: response.data,
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: response.data.length > 0 ? `displaying ${response.count!} industries` : 'There are no industries currently'
                }

                setCollection(GET_INDUSTRIES, result)

            }

        }

        if (response.error === true) {

            unsetLoading({
                option: 'resource',
                type: GET_INDUSTRIES,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                AxiosService.logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get industries ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setCollection])

    const getResourceIndustries = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order, resource, resourceId } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}&paginate=relative`;

        if (resource && resourceId) {

            setLoading({ option: 'resource', type: GET_INDUSTRIES })

            const response = await AxiosService.call({
                type: 'default',
                method: 'GET',
                isAuth: true,
                path: `/${resource}/industries/${resourceId}?${q}`
            })

            if (response.error === false) {

                if (response.status === 200) {

                    const result: ICollection = {
                        data: response.data,
                        count: response.count!,
                        total: response.total!,
                        pagination: response.pagination!,
                        loading: false,
                        message: response.data.length > 0 ? `displaying ${response.count!} industries` : 'There are no industries currently'
                    }

                    setCollection(GET_INDUSTRIES, result)

                }

            }

            if (response.error === true) {

                unsetLoading({
                    option: 'resource',
                    type: GET_INDUSTRIES,
                    message: response.message ? response.message : response.data
                })

                if (response.status === 401) {
                    AxiosService.logout()
                } else if (response.message && response.message === 'Error: Network Error') {
                    popNetwork();
                } else if (response.data) {
                    console.log(`Error! Could not get industries ${response.data}`)
                }

            }

        } else {

            unsetLoading({
                option: 'resource',
                type: GET_INDUSTRIES,
                message: 'invalid resource / resourceId'
            })

        }


    }, [setLoading, unsetLoading, setCollection])

    /**
     * @name getIndustry
     */
    const getIndustry = useCallback(async (id: string) => {

        setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_INDUSTRY}/${id}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                setResource(GET_INDUSTRY, response.data)
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
                console.log(`Error! Could not get industry ${response.data}`)
            }
            else if (response.status === 500) {
                console.log(`Sorry, there was an error processing your request. Please try again later. ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setResource])

    return {
        statusRef,
        industryData,
        industries,
        industry,
        loading,

        handleChange,
        createIndustry,
        editIndustry,
        getIndustries,
        getResourceIndustries,
        getIndustry
    }
}

export default useIndustry