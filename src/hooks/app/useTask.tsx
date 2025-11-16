import { MouseEvent, useCallback, useRef, useState } from 'react'
import { ICollection, IListQuery } from '../../utils/interfaces.util'
import useContextType from '../useContextType'
import { GET_COMMENTS, GET_FIELD, GET_FIELDS, GET_TASK, GET_TASKS } from '../../context/types'
import AxiosService from '../../services/axios.service'
import { URL_FIELD, URL_TASK } from '../../utils/path.util'
import useNetwork from '../useNetwork'
import useToast from '../useToast'
import helper from '../../utils/helper.util'
import { FormActionType, ResourceType } from '../../utils/types.util'
import { StatusEnum } from '../../utils/enums.util'

interface ICreateField {
    name: string,
    label: string,
    description: string,
    isEnabled: any,
    careerId: string,
    skills: Array<string>
}

interface IUPdateField extends ICreateField {
    id: string
}

interface IChangeResource {
    id: string,
    resource: ResourceType,
    type: 'attach' | 'detach',
    careerId?: string,
    skills?: Array<string>
}

const useTask = () => {

    const { appContext } = useContextType()
    const { popNetwork } = useNetwork(false)
    const {
        tasks,
        task,
        comments,
        comment,
        loading,
        loader,
        setCollection,
        setResource,
        setLoading,
        unsetLoading
    } = appContext

    const TaskStatus = helper.pickFrom(StatusEnum, [
        'DRAFT', 'PENDING', 'INPROGRESS', 'REVIEWED', 'DEFAULTED', 'ABANDONED', 'COMPLETED'
    ] as const)

    /**
     * @name getTasks
     */
    const getTasks = useCallback(async (data: IListQuery) => {

        const { limit, page, select, order, type } = data;
        let q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;
        if (type) {
            q = `type=${type}&` + q;
        }

        setLoading({ option: 'resource', type: GET_TASKS })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_TASK}?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: response.data,
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: response.data.length > 0 ? `displaying ${response.count!} tasks` : 'There are no tasks currently'
                }

                setCollection(GET_TASKS, result)

            }

        }

        if (response.error === true) {

            unsetLoading({
                option: 'resource',
                type: GET_TASKS,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                AxiosService.logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get tasks ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setCollection])

    /**
     * @name getTaskComments
     */
    const getTaskComments = useCallback(async (id: string, data: IListQuery) => {

        const { limit, page, select, order } = data;
        let q = `limit=${limit ? limit.toString() : 25}&page=${page ? page.toString() : 1}&order=${order ? order : 'desc'}`;

        setLoading({ option: 'resource', type: GET_COMMENTS })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_TASK}/comments/${id}?${q}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                const result: ICollection = {
                    data: response.data,
                    count: response.count!,
                    total: response.total!,
                    pagination: response.pagination!,
                    loading: false,
                    message: response.data.length > 0 ? `displaying ${response.count!} task comments` : 'There are no task comments currently'
                }

                setCollection(GET_COMMENTS, result)

            }

        }

        if (response.error === true) {

            unsetLoading({
                option: 'resource',
                type: GET_COMMENTS,
                message: response.message ? response.message : response.data
            })

            if (response.status === 401) {
                AxiosService.logout()
            } else if (response.message && response.message === 'Error: Network Error') {
                popNetwork();
            } else if (response.data) {
                console.log(`Error! Could not get task comments ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setCollection])

    /**
     * @name getTask
     */
    const getTask = useCallback(async (id: string) => {

        setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_TASK}/${id}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                setResource(GET_TASK, response.data)
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
                console.log(`Error! Could not get task ${response.data}`)
            }
            else if (response.status === 500) {
                console.log(`Sorry, there was an error processing your request. Please try again later. ${response.data}`)
            }

        }

    }, [setLoading, unsetLoading, setResource])


    /**
    * @name createTask
    */
    const createTask = useCallback(async (data: ICreateField) => {

        setLoading({ option: 'loader' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'POST',
            isAuth: true,
            path: `${URL_FIELD}`,
            payload: data
        })

        if (response.error === false) {

            unsetLoading({
                option: 'loader',
                message: 'data saved successfully'
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

    }, [setLoading, unsetLoading, setResource])


    const deleteTask = useCallback(async (id: string) => {

        setLoading({ option: 'loader' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'DELETE',
            isAuth: true,
            path: `${URL_FIELD}/${id}?type=permanent`,
            payload: {}
        })

        if (response.error === false) {

            unsetLoading({
                option: 'loader',
                message: 'field deleted successfully'
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

        return response;

    }, [setLoading, unsetLoading])

    return {
        tasks,
        task,
        comments,
        comment,
        loading,
        loader,
        TaskStatus,

        getTasks,
        getTask,
        getTaskComments,
        createTask,
        deleteTask
    }
}

export default useTask