import { MouseEvent, useCallback, useRef, useState } from 'react'
import { ICollection, IListQuery } from '../../utils/interfaces.util'
import useContextType from '../useContextType'
import { GET_FIELD, GET_FIELDS } from '../../context/types'
import AxiosService from '../../services/axios.service'
import { URL_FIELD } from '../../utils/path.util'
import useNetwork from '../useNetwork'
import useToast from '../useToast'
import helper from '../../utils/helper.util'

interface IField {
    name: string,
    label: string,
    description: string,
    isEnabled: any,
    careerId: string,
}

const useField = () => {

    const skillRef = useRef<any>(null)
    const statusRef = useRef<any>(null)

    const { appContext } = useContextType()
    const { popNetwork } = useNetwork(false)
    const { toast, setToast } = useToast()
    const { fields, field, loading, setCollection, setResource, setLoading, unsetLoading } = appContext

    const [fieldData, setFieldData] = useState<IField>({
        name: '',
        label: '',
        description: '',
        isEnabled: null,
        careerId: '',
    })

    const [career, setCareer] = useState({ _id: '', name: '' })

    const handleChange = <K extends keyof IField>(field: K, value: IField[K]) => {
        setFieldData((prev) => ({
            ...prev,
            [field]: value
        }))
    };

    /**
     * @name getFields
     */
    const getFields = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        setLoading({ option: 'resource', type: GET_FIELDS })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_FIELD}?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: response.data,
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: response.data.length > 0 ? `displaying ${response.count!} fields` : 'There are no fields currently'
                }

                setCollection(GET_FIELDS, result)

            }

        }

        if (response.error === true) {

            unsetLoading({
                option: 'resource',
                type: GET_FIELDS,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                AxiosService.logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get fields ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setCollection])

    const getResourceFields = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order, resource, resourceId } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}&paginate=relative`;

        if (resource && resourceId) {

            setLoading({ option: 'resource', type: GET_FIELDS })

            const response = await AxiosService.call({
                type: 'default',
                method: 'GET',
                isAuth: true,
                path: `/${resource}/fields/${resourceId}?${q}`
            })

            if (response.error === false) {

                if (response.status === 200) {

                    const result: ICollection = {
                        data: response.data,
                        count: response.count!,
                        total: response.total!,
                        pagination: response.pagination!,
                        loading: false,
                        message: response.data.length > 0 ? `displaying ${response.count!} fields` : 'There are no fields currently'
                    }

                    setCollection(GET_FIELDS, result)

                }

            }

            if (response.error === true) {

                unsetLoading({
                    option: 'resource',
                    type: GET_FIELDS,
                    message: response.message ? response.message : response.data
                })

                if (response.status === 401) {
                    AxiosService.logout()
                } else if (response.message && response.message === 'Error: Network Error') {
                    popNetwork();
                } else if (response.data) {
                    console.log(`Error! Could not get fields ${response.data}`)
                }

            }

        } else {

            unsetLoading({
                option: 'resource',
                type: GET_FIELDS,
                message: 'invalid resource / resourceId'
            })

        }


    }, [setLoading, unsetLoading, setCollection])

    /**
     * @name getField
     */
    const getField = useCallback(async (id: string) => {

        setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_FIELD}/${id}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                setResource(GET_FIELD, response.data)
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
                console.log(`Error! Could not get field ${response.data}`)
            }
            else if (response.status === 500) {
                console.log(`Sorry, there was an error processing your request. Please try again later. ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setResource])


    /**
        * @name createField
        */
    const createField = useCallback(async (validate: () => boolean) => {

        const isValidated = validate()

        if (isValidated === true) {
            const payload = { ...fieldData }

            setLoading({ option: 'default' })

            const response = await AxiosService.call({
                type: 'default',
                method: 'POST',
                isAuth: true,
                path: `${URL_FIELD}`,
                payload: payload
            })

            if (response.error === false) {

                if (response.status === 200) {
                    setToast({ ...toast, show: true, type: 'success', message: 'Field created successfully' })
                    setFieldData({
                        name: '',
                        label: '',
                        description: '',
                        isEnabled: false,
                        careerId: '',
                    })
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
                    setToast({ ...toast, show: true, error: 'field', type: 'error', message: `Error! Could not create field ${response?.errors[0]}` })
                }
                else if (response.status === 500) {
                    setToast({ ...toast, show: true, error: 'field', type: 'error', message: `Sorry, there was an error processing your request. Please try again later.` })
                }
                setTimeout(() => {
                    setToast({ ...toast, show: false })
                }, 3000)

            }
        }

    }, [fieldData, setLoading, unsetLoading, setResource])

    /**
        * @name updateField
        */
    const updateField = useCallback(async (e: MouseEvent<HTMLAnchorElement>) => {

        if (e) e.preventDefault()

        const payload: any = { ...fieldData }

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
            path: `${URL_FIELD}/${field._id}`,
            payload: payload
        })

        if (response.error === false) {

            if (response.status === 200) {
                setToast({ ...toast, show: true, type: 'success', message: 'Field updated successfully' })
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
            else if (!helper.isEmpty(response.data, 'object')) {
                setToast({ ...toast, show: true, error: 'field', type: 'error', message: `Error! Could not update field ${response?.data}` })
            }
            else if (response.errors && response.errors.length > 0) {
                setToast({ ...toast, show: true, error: 'field', type: 'error', message: `Error! Could not update field ${response?.errors[0]}` })
            }
            else if (response.status === 500) {
                setToast({ ...toast, show: true, error: 'field', type: 'error', message: `Sorry, there was an error processing your request. Please try again later.` })
            }
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 3000)

        }

    }, [fieldData, setLoading, unsetLoading, setResource])

    return {
        skillRef,
        statusRef,
        fieldData,
        fields,
        field,
        career,
        loading,

        getFields,
        getResourceFields,
        getField,
        handleChange,
        setCareer,
        createField,
        updateField,
    }
}

export default useField