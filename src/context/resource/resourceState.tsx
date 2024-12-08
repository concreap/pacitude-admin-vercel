import { Children, useReducer, useState } from 'react'
import ResourceContext from './resourceContext'
import ResourceReducer from './resourceReducer'
import AxiosService from '../../services/axios.service'
import { GET_COUNTRIES, SET_LOADING } from '../types'


const ResourceState = (props: any) => {

    const initialState = {
        countries: [],
        country: {},
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

        if(response.error === false){

            setLoading(false)

            if(response.status === 200){

                dispatch({
                    type: GET_COUNTRIES,
                    payload: response.data
                })

            }

        }

        if(response.error === true){
            setLoading(false)
        }

    }

    const setLoading = (state: boolean) => {
        dispatch({
            type: SET_LOADING,
            payload: state
        })
    }

    return <ResourceContext.Provider
        value={{
            countries: state.countries,
            country: state.country,
            loading: state.loading,
            getCountries: getCountries
        }}
    >
        {props.children}
    </ResourceContext.Provider>

}

export default ResourceState;