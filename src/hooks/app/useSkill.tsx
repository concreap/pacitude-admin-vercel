import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { ICollection, IListQuery } from '../../utils/interfaces.util'
import useContextType from '../useContextType'
import { GET_SKILL, GET_SKILLS, } from '../../context/types'
import AxiosService from '../../services/axios.service'
import { URL_SKILL } from '../../utils/path.util'
import useNetwork from '../useNetwork'
import useToast from '../useToast'
import helper from '../../utils/helper.util'

interface ISkillData {
    name: string,
    label: string,
    description: string,
    isEnabled: any,
    careerId: string,
    fields: string[]
}

const useSkill = () => {

    const fieldRef = useRef<any>(null)
    const careerRef = useRef<any>(null)
    const { appContext } = useContextType()
    const { popNetwork } = useNetwork(false)
    const [career, setCareer] = useState({ _id: '', name: '' })
    const [fieldList, setFieldList] = useState<Array<{ id: string, name: string, ex: boolean }>>([])

    const [skillData, setSkillData] = useState<ISkillData>({
        name: '',
        label: '',
        description: '',
        isEnabled: null,
        careerId: '',
        fields: []
    })

    const { toast, setToast } = useToast()

    const {
        skills,
        skill,
        loading,
        setCollection,
        setResource,
        setLoading,
        unsetLoading
    } = appContext

    useEffect(() => {

    }, [])

    const handleAddFieldsChange = (val: string) => {

        setSkillData((prev) => ({
            ...prev,
            fields: [...prev.fields, val]
        }))
    }

    const addField = (val: any) => {

        let fieldIds = fieldList.map((x) => x.id);

        if (!fieldIds.includes(val.id)) {
            handleAddFieldsChange(val.id)
            setFieldList(prev => [...prev, val])
        }

    }

    const removeField = (id: string) => {

        setSkillData(prev => ({
            ...prev,
            fields: prev.fields.filter((x) => x !== id)
        }))
        setFieldList(prev => prev.filter((x) => x.id !== id))

    }

    const handleChange = <K extends keyof ISkillData>(field: K, value: ISkillData[K]) => {
        setSkillData((prev) => ({
            ...prev,
            [field]: value
        }))
    };

    const validateSkill = () => {

        let isValid: boolean = true;

        if (!skillData.name) {
            setToast({ ...toast, show: true, error: 'skill', type: 'error', message: 'Skill name is required' })
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 2500)
            isValid = false;

        } else if (!skillData.label) {
            setToast({ ...toast, show: true, error: 'skill', type: 'error', message: 'Skill display name is required' })
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 2500)
            isValid = false;
        }
        else if (!skillData.careerId) {
            setToast({ ...toast, show: true, error: 'skill', type: 'error', message: 'Career is required' })
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 2500)
            isValid = false;
        }
        else if (skillData.fields.length === 0) {
            setToast({ ...toast, show: true, error: 'skill', type: 'error', message: 'At least one field is required' })
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 2500)
            isValid = false;
        } else if (skillData.description.length < 10) {
            setToast({ ...toast, show: true, error: 'skill', type: 'error', message: 'Description must be at least 10 characters long' })
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 2500)
            isValid = false;
        }

        return isValid

    }

    /**
     * @name getSkills
     */
    const getSkills = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        setLoading({ option: 'resource', type: GET_SKILLS })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_SKILL}?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: response.data,
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: response.data.length > 0 ? `displaying ${response.count!} skills` : 'There are no skills currently'
                }

                setCollection(GET_SKILLS, result)

            }

        }

        if (response.error === true) {

            unsetLoading({
                option: 'resource',
                type: GET_SKILLS,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                AxiosService.logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get skills ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setCollection])

    const getResourceSkills = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order, resource, resourceId } = data;
        const q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}&paginate=relative`;

        if (resource && resourceId) {

            setLoading({ option: 'resource', type: GET_SKILLS })

            const response = await AxiosService.call({
                type: 'default',
                method: 'GET',
                isAuth: true,
                path: `/${resource}/skills/${resourceId}?${q}`
            })

            if (response.error === false) {

                if (response.status === 200) {

                    const result: ICollection = {
                        data: response.data,
                        count: response.count!,
                        total: response.total!,
                        pagination: response.pagination!,
                        loading: false,
                        message: response.data.length > 0 ? `displaying ${response.count!} skills` : 'There are no skills currently'
                    }

                    setCollection(GET_SKILLS, result)

                }

            }

            if (response.error === true) {

                unsetLoading({
                    option: 'resource',
                    type: GET_SKILLS,
                    message: response.message ? response.message : response.data
                })

                if (response.status === 401) {
                    AxiosService.logout()
                } else if (response.message && response.message === 'Error: Network Error') {
                    popNetwork();
                } else if (response.data) {
                    console.log(`Error! Could not get skills ${response.data}`)
                }

            }

        } else {

            unsetLoading({
                option: 'resource',
                type: GET_SKILLS,
                message: 'invalid resource / resourceId'
            })

        }


    }, [setLoading, unsetLoading, setCollection])

    /**
     * @name getSkill
     */
    const getSkill = useCallback(async (id: string) => {

        setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_SKILL}/${id}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                setResource(GET_SKILL, response.data)
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
                console.log(`Error! Could not get skill ${response.data}`)
            }
            else if (response.status === 500) {
                console.log(`Sorry, there was an error processing your request. Please try again later. ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setResource])

    /**
     * @name createSkill
     */
    const createSkill = useCallback(async () => {

        const isValidated = validateSkill()

        if (isValidated === true) {
            const payload = { ...skillData }

            console.log('payload', payload)

            setLoading({ option: 'default' })

            const response = await AxiosService.call({
                type: 'default',
                method: 'POST',
                isAuth: true,
                path: `${URL_SKILL}`,
                payload: payload
            })

            if (response.error === false) {

                // if (response.status === 200) {

                //     setResource(GET_SKILL, response.data)
                // }

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
                    console.log(`Error! Could not create skill ${response.data}`)
                }
                else if (response.errors && response.errors.length > 0) {
                    console.log(`Error! Could not create skill ${response.errors[0]}`)
                }
                else if (response.status === 500) {
                    console.log(`Sorry, there was an error processing your request. Please try again later. ${response.data}`)
                }

            }
        }

    }, [skillData, setLoading, unsetLoading, setResource])

    /**
     * @name updateSkill
     */
    const updateSkill = useCallback(async (e: MouseEvent<HTMLAnchorElement>) => {

        const payload: any = { ...skillData }

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
            path: `${URL_SKILL}/${skill._id}`,
            payload: payload
        })

        if (response.error === false) {

            if (response.status === 200) {
                setToast({ ...toast, show: true, error: 'skill', type: 'success', message: `Skill updated successfully` })
                setResource(GET_SKILL, response.data)
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
                setToast({ ...toast, show: true, error: 'skill', type: 'error', message: `Error! Could not update skill ${response?.data}` })
            }
            else if (response.errors && response.errors.length > 0) {
                setToast({ ...toast, show: true, error: 'skill', type: 'error', message: `Error! Could not update skill ${response?.errors[0]}` })
            }
            else if (response.status === 500) {
                setToast({ ...toast, show: true, error: 'skill', type: 'error', message: `Sorry, there was an error processing your request. Please try again later.` })
            }
            setTimeout(() => {
                setToast({ ...toast, show: false })
            }, 3000)

        }


    }, [skillData, setLoading, unsetLoading, setResource])

    return {
        fieldRef,
        careerRef,
        career,
        fieldList,
        skillData,
        skills,
        skill,
        loading,

        setCareer,
        setFieldList,
        setSkillData,
        addField,
        removeField,
        handleChange,
        handleAddFieldsChange,
        createSkill,
        updateSkill,
        getSkills,
        getResourceSkills,
        getSkill
    }
}

export default useSkill