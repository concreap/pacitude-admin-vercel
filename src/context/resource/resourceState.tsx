import { Children, useReducer, useState } from 'react'
import ResourceContext from './resourceContext'
import ResourceReducer from './resourceReducer'
import AxiosService from '../../services/axios.service'
import { GET_COUNTRIES, SET_LOADING, SET_TOAST } from '../types'
import { toast } from '../../_data/seed'
import { IToastState } from '../../utils/interfaces.util'


const ResourceState = (props: any) => {

    const initialState = {
        countries: [],
        country: {},
        toast: toast,
        loading: false
    }

    const [state, dispatch] = useReducer(ResourceReducer, initialState);

    const getCountries = async () => {

        setLoading(true)

        const response = await AxiosService.call({
            method: 'GET',
            type: 'resource',
            path: '/countries',
            isAuth: false,
        });

        if (response.error === false) {

            setLoading(false)

            if (response.status === 200) {

                dispatch({
                    type: GET_COUNTRIES,
                    payload: response.data
                })

            }

        }

        if (response.error === true) {
            setLoading(false)
        }

    }

    const setLoading = (state: boolean) => {
        dispatch({
            type: SET_LOADING,
            payload: state
        })
    }

    const setToast = (data: IToastState) => {
        dispatch({
            type: SET_TOAST,
            payload: data
        })
    }

    const clearToast = () => {
        dispatch({
            type: SET_TOAST,
            payload: {
                type: 'success',
                show: false,
                message: '',
                title: 'Feedback',
                position: 'top-right',
            }
        })
    }

    return <ResourceContext.Provider
        value={{
            countries: state.countries,
            country: state.country,
            toast: state.toast,
            loading: state.loading,
            setToast: setToast,
            clearToast: clearToast,
            getCountries: getCountries
        }}
    >
        {props.children}
    </ResourceContext.Provider>

}

export default ResourceState;