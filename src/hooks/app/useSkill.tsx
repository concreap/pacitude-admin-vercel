import { useCallback, useEffect, useRef, useState } from 'react'
import { ICollection, IListQuery } from '../../utils/interfaces.util'
import useContextType from '../useContextType'
import { GET_SKILL, GET_SKILLS, } from '../../context/types'
import AxiosService from '../../services/axios.service'
import { URL_FIELD, URL_SKILL } from '../../utils/path.util'
import useNetwork from '../useNetwork'
import useToast from '../useToast'

interface ISkillData {
    name: string,
    label: string,
    description: string,
    isEnabled: boolean,
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
        isEnabled: false,
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

        const pay = skillData
        console.log('validated', pay)

        const isValidated = validateSkill()

        console.log('validate', isValidated)

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
                else if (response.data) {
                    console.log(`Error! Could not create skill ${response.data}`)
                }
                else if (response.status === 500) {
                    console.log(`Sorry, there was an error processing your request. Please try again later. ${response.data}`)
                }

            }
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
        getSkills,
        getResourceSkills,
        getSkill
    }
}

export default useSkill