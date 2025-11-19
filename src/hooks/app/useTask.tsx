import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { ICollection, IGroupedResource, IListQuery, IPoller } from '../../utils/interfaces.util'
import useContextType from '../useContextType'
import { GET_COMMENTS, GET_FIELD, GET_FIELDS, GET_TASK, GET_TASKS, SET_POLLER } from '../../context/types'
import AxiosService from '../../services/axios.service'
import { URL_FIELD, URL_TASK } from '../../utils/path.util'
import useNetwork from '../useNetwork'
import useToast from '../useToast'
import helper from '../../utils/helper.util'
import { ActionModify, FormActionType, ResourceType, TaskFieldType, UIType } from '../../utils/types.util'
import { StatusEnum, TaskFieldEnum, UIEnum } from '../../utils/enums.util'
import { UIPoller } from '../../_data/seed'
import { ITaskResource } from '../../models/Task.model'

interface ICreateTask {
    fieldId: any,
    topicId: any,
    level: string,
    poll: boolean
}

interface IUpdateUITask {
    action: ActionModify
    data: Array<any>,
    field: TaskFieldType
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
        poller,
        setCollection,
        setResource,
        setLoading,
        unsetLoading
    } = appContext

    const TaskStatus = helper.pickFrom(StatusEnum, [
        'DRAFT', 'PENDING', 'INPROGRESS', 'REVIEWED', 'DEFAULTED', 'ABANDONED', 'COMPLETED'
    ] as const)

    const [isPolling, setIsPolling] = useState<boolean>(false);

    useEffect(() => {

        if (!isPolling) {
            return;
        }

        const pollAPI = async () => {

            // Call the API immediately when polling starts
            const response = await getTaskByCode(poller.key, true);

            if (!response.error) {
                // console.log('POLL', response.data);
                setIsPolling(false)

                // set polling details
                setResource(SET_POLLER, {
                    loading: false,
                    status: StatusEnum.COMPLETED,
                    key: response.data._id,
                    code: response.data.code
                });

            } else {

                // set polling details
                setResource(SET_POLLER, {
                    loading: true,
                    status: StatusEnum.PENDING,
                    key: response.data.code,
                    code: response.data.code
                });

            }

        }

        pollAPI();

        // Set up the interval to poll the API repeatedly
        const intervalId = setInterval(pollAPI, 5000);

        // Cleanup function to clear the interval when the component unmounts
        // or when the dependencies of the useEffect hook change.
        return () => {
            clearInterval(intervalId);
            console.log('Polling interval cleared.');
        };

    }, [isPolling, poller])

    const startPolling = () => {
        setIsPolling(true);
    };

    const updateUITask = ({ data, action, field }: IUpdateUITask) => {

        if (!helper.isEmpty(task, 'object') && data.length > 0) {

            if (field === TaskFieldEnum.SKILLS) {
                let currSkills = task.skills;
                data.forEach((item) => {

                    if (action === 'add') {

                        let ex = currSkills.find((sk) => sk.code === item.code);
                        if (!ex) {
                            currSkills.push(item)
                        }

                    }

                    if (action === 'remove') {
                        currSkills = currSkills.filter((sk) => sk.code !== item.code)
                    }

                })
                setResource(GET_TASK, { ...task, skills: currSkills })
            }

        }

    }

    const countTaskFields = (field: TaskFieldType, ui?: UIType) => {

        let result: number = 0;

        if (!helper.isEmpty(task, 'object')) {

            if (field === TaskFieldEnum.SKILLS) {

                if (ui) {
                    if (ui === UIEnum.NEW) {
                        task.skills.forEach((sk) => {
                            if (sk && sk.ui && sk.ui === ui) {
                                result += 1;
                            }
                        })
                    }
                } else {
                    result = task.skills.length;
                }

            }

        }

        return result;

    }

    const groupTaskResources = (data: Array<ITaskResource>) => {

        const group: Array<IGroupedResource> = [];

        for (let i = 0; i < data.length; i++) {

            let name = group.find((x) => x.name === data[i].name);

            if (name) {
                name.links.push({
                    url: data[i].url,
                    snippet: data[i].description,
                    title: data[i].title
                })
            } else {
                group.push({
                    name: data[i].name,
                    links: [{
                        url: data[i].url,
                        snippet: data[i].description,
                        title: data[i].title
                    }]
                })
            }

        }

        return group

    }

    const formatTaskStatus = (status: string) => {
        let result = { label: '', type: 'default' }
        switch (status) {
            case StatusEnum.COMPLETED:
                result = { label: 'completed', type: 'green' }
                break;
            case StatusEnum.ABANDONED:
                result = { label: 'abandoned', type: 'error' }
                break;
            case StatusEnum.PENDING:
                result = { label: 'pending', type: 'warning' }
                break;
            case StatusEnum.REVIEWED:
                result = { label: 'reviewed', type: 'pink' }
                break;
            case StatusEnum.SUBMITTED:
                result = { label: 'submitted', type: 'ongoing' }
                break;
            case StatusEnum.INPROGRESS:
                result = { label: 'in-progress', type: 'info' }
                break;
            case StatusEnum.DEFAULTED:
                result = { label: 'defaulted', type: 'blue' }
                break;
            case StatusEnum.DRAFT:
                result = { label: 'draft', type: 'lightblue' }
                break;
            default:
                result = { label: 'pending', type: 'warning' }
                break;
        }

        return result
    }

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
     * @name getTaskByCode
     */
    const getTaskByCode = useCallback(async (code: string, poll: boolean) => {

        setLoading({ option: 'default' })

        const response = await AxiosService.call({
            type: 'default',
            method: 'GET',
            isAuth: true,
            path: `${URL_TASK}/code?value=${code}`
        })

        if (response.error === false) {

            if (response.status === 200) {

                setResource(GET_TASK, response.data);

                if (poll) {
                    let poller: IPoller = {
                        code: response.data.code,
                        key: response.data._id,
                        loading: false,
                        status: StatusEnum.COMPLETED
                    }

                    setResource(SET_POLLER, poller);
                }

            }

            unsetLoading({
                option: 'default',
                message: 'data fetched successfully'
            })

        }

        if (response.error === true) {

            if (poll) {
                let poller: IPoller = {
                    code: response.data.taskCode,
                    key: response.data.taskCode,
                    loading: true,
                    status: StatusEnum.PENDING
                }
                setResource(SET_POLLER, poller);
            }

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

        return response

    }, [setLoading, unsetLoading, setResource])


    /**
    * @name createTask
    */
    const createTask = useCallback(async (data: ICreateTask) => {

        setLoading({ option: 'default' })

        if (data.poll) {
            // start polling immediately before call is made
            setTimeout(() => {
                startPolling()
            }, 3000)
        }

        const response = await AxiosService.call({
            type: 'default',
            method: 'POST',
            isAuth: true,
            path: `${URL_TASK}`,
            payload: data
        })

        if (response.error === false) {

            unsetLoading({
                option: 'default',
                message: 'data saved successfully'
            })

            if (data.poll) {
                // set poller with code
                let poller: IPoller = {
                    code: response.data.taskCode,
                    key: response.data.taskCode,
                    loading: true,
                    status: StatusEnum.PENDING
                }

                setResource(SET_POLLER, poller);
            }

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
        poller,
        TaskStatus,

        updateUITask,
        countTaskFields,
        groupTaskResources,
        formatTaskStatus,

        getTasks,
        getTask,
        getTaskByCode,
        getTaskComments,
        createTask,
        deleteTask
    }
}

export default useTask