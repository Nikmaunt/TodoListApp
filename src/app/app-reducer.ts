import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";

import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setIsLoggedIn} from "../features/Auth/auth-reducer";



const initialState = {
    status: 'idle',
    error: null ,
    initialized: false
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppInitializedAC:(state, action: PayloadAction<{ value: boolean }>) => {
            state.initialized = action.payload.value
        },
        setAppErrorAC:(state, action: PayloadAction<{ error:  any }>) => {
            state.error = action.payload.error
        },
        setAppStatusAC:(state, action: PayloadAction<{ status: RequestStatusType }>)  => {
            state.status = action.payload.status
        }
    }
})

export const appReducer = slice.reducer

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export const {setAppInitializedAC,setAppErrorAC,setAppStatusAC} = slice.actions

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedIn({value:true}));
        } else {
        }
        dispatch(setAppInitializedAC({value:true}));
    })
}
