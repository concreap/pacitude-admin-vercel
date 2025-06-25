import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { ICollection, IListQuery } from '../../utils/interfaces.util'
import useContextType from '../useContextType'
import { GET_CAREER, GET_CAREERS } from '../../context/types'
import AxiosService from '../../services/axios.service'
import { URL_CAREER } from '../../utils/path.util'
import useNetwork from '../useNetwork'
import Career from '../../models/Career.model'
import useGoTo from '../useGoTo'
import useToast from '../useToast'
import helper from '../../utils/helper.util'

interface ICareerData {
    name: string,
    label: string,
    description: string,
    isEnabled: any,
    industryId: string,
    synonyms: string[]
}

const useCareer = () => {

    const { toDetailRoute } = useGoTo()

    const { appContext } = useContextType()
    const { popNetwork } = useNetwork(false)
    const { toast, setToast } = useToast()
    const [industry, setIndustry] = useState({ _id: '', name: '' })

    const {
        careers,
        career,
        loading,
        setCollection,
        setResource,
        setLoading,
        unsetLoading
    } = appContext

    const [careerData, setCareerData] = useState<ICareerData>({
        name: '',
        label: '',
        description: '',
        isEnabled: null,
        industryId: '',
        synonyms: []
    })
    const [synonyms, setSynonyms] = useState<Array<string>>([])

    useEffect(() => {

    }, [])


    const toggleAddCareer = (e: any) => {

        if (e) { e.preventDefault(); }

        toDetailRoute(e, { route: 'core', name: 'create-career' })

    }

    const handleChange = <K extends keyof ICareerData>(field: K, value: ICareerData[K]) => {
        setCareerData((prev) => ({
            ...prev,
            [field]: value
        }))
    };

    const handleSynonyms = (value: string) => {
        if (!value) return [];
        return value
            .split(/\s*,\s*/g)         // Split by commas and optional spaces
            .map(item => item.trim()) // Trim whitespace
            .filter(item => item.length > 0); // Remove empty items
    };

    const onSynonymsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const synonymsArray = handleSynonyms(value);
        setCareerData(prev => ({
            ...prev,
            synonyms: synonymsArray
        }));
    };

    const getCareerById = (id: string) => {

        let result: Career | null = null;

        if (careers.data.length > 0) {

            const cr = careers.data.find((x) => x._id === id);

            if (cr) {
                result = cr;
            }
        }

        return result;
    }

    /**
     * @name getCareers
     */
    const getCareers = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        setLoading({ option: 'resource', type: GET_CAREERS })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_CAREER}?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: response.data,
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: response.data.length > 0 ? `displaying ${response.count!} careers` : 'There are no careers currently'
                }

                setCollection(GET_CAREERS, result)

            }

        }

        if (response.error === true) {

            unsetLoading({
                option: 'resource',
                type: GET_CAREERS,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                AxiosService.logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get careers ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setCollection])

    const getResourceCareers = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order, resource, resourceId } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}&paginate=relative`;

        if (resource && resourceId) {

            setLoading({ option: 'resource', type: GET_CAREERS })

            const response = await AxiosService.call({
                type: 'default',
                method: 'GET',
                isAuth: true,
                path: `/${resource}/careers/${resourceId}?${q}`
            })

            if (response.error === false) {

                if (response.status === 200) {

                    const result: ICollection = {
                        data: response.data,
                        count: response.count!,
                        total: response.total!,
                        pagination: response.pagination!,
                        loading: false,
                        message: response.data.length > 0 ? `displaying ${response.count!} careers` : 'There are no careers currently'
                    }

                    setCollection(GET_CAREERS, result)

                }

            }

            if (response.error === true) {

                unsetLoading({
                    option: 'resource',
                    type: GET_CAREERS,
                    message: response.message ? response.message : response.data
                })

                if (response.status === 401) {
                    AxiosService.logout()
                } else if (response.message && response.message === 'Error: Network Error') {
                    popNetwork();
                } else if (response.data) {
                    console.log(`Error! Could not get careers ${response.data}`)
                }

            }

        } else {

            unsetLoading({
                option: 'resource',
                type: GET_CAREERS,
                message: 'invalid resource / resourceId'
            })

        }


    }, [setLoading, unsetLoading, setCollection])

    /**
     * @name getCareer
     */
    const getCareer = useCallback(async (id: string) => {

        setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_CAREER}/${id}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                setResource(GET_CAREER, response.data)
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
                setToast({ ...toast, show: true, error: 'career', type: 'error', message: `Error! Could not get career ${response?.data}` })
            }
            else if (response.errors && response.errors.length > 0) {
                setToast({ ...toast, show: true, error: 'career', type: 'error', message: `Error! Could not get career ${response?.errors[0]}` })
            }
            else if (response.status === 500) {
                setToast({ ...toast, show: true, error: 'career', type: 'error', message: `Sorry, there was an error processing your request. Please try again later.` })
            }
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 3000)

        }

    }, [setLoading, unsetLoading, setResource])


    /**
        * @name createSkill
        */
    const createCareer = useCallback(async (validate: () => boolean) => {

        const isValidated = validate()

        if (isValidated === true) {
            let payload = { ...careerData }

            console.log('pay', payload)

            setLoading({ option: 'default' })

            const response = await AxiosService.call({
                type: 'default',
                method: 'POST',
                isAuth: true,
                path: `${URL_CAREER}`,
                payload: payload
            })

            if (response.error === false) {

                if (response.status === 200) {
                    setToast({ ...toast, show: true, type: 'success', message: 'Career created successfully' })
                    setCareerData({
                        name: '',
                        label: '',
                        description: '',
                        isEnabled: false,
                        industryId: '',
                        synonyms: []
                    })
                    setSynonyms([]);
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
                    setToast({ ...toast, show: true, error: 'career', type: 'error', message: `Error! Could not create career ${response?.errors[0]}` })
                }
                else if (response.status === 500) {
                    setToast({ ...toast, show: true, error: 'career', type: 'error', message: `Sorry, there was an error processing your request. Please try again later.` })
                }
                setTimeout(() => {
                    setToast({ ...toast, show: false })
                }, 3000)

            }
        }

    }, [careerData, synonyms, setLoading, unsetLoading, setResource])

    /**
        * @name editCareer
        */
    const updateCareer = useCallback(async (e: MouseEvent<HTMLAnchorElement>) => {

        if (e) { e.preventDefault(); }

        let payload: any = { ...careerData }

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
            path: `${URL_CAREER}/${career._id}`,
            payload: payload
        })

        if (response.error === false) {

            if (response.status === 200) {
                setToast({ ...toast, show: true, type: 'success', message: 'Career created successfully' })
                setSynonyms([]);
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
                setToast({ ...toast, show: true, error: 'career', type: 'error', message: `Error! Could not update career ${response?.data}` })
            }
            else if (response.errors && response.errors.length > 0) {
                setToast({ ...toast, show: true, error: 'career', type: 'error', message: `Error! Could not update career ${response?.errors[0]}` })
            }
            else if (response.status === 500) {
                setToast({ ...toast, show: true, error: 'career', type: 'error', message: `Sorry, there was an error processing your request. Please try again later.` })
            }
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 3000)

        }

    }, [careerData, synonyms, setLoading, unsetLoading, setResource])

    return {
        industry,
        careerData,
        synonyms,
        careers,
        career,
        loading,

        setIndustry,
        toggleAddCareer,
        handleChange,
        onSynonymsChange,
        getCareerById,
        getCareers,
        getResourceCareers,
        getCareer,
        createCareer,
        updateCareer
    }
}

export default useCareer