import {Dispatch} from 'redux'
import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI} from "../../api/todolists-api";
import {
    handleAsyncServerAppError,
    handleAsyncServerNetworkError,
} from "../../utils/error-utils";
import {
    createAsyncThunk,
    createSlice,
    PayloadAction
} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {LoginParamsType} from "../../api/types";

export const loginTC = createAsyncThunk<{isLoggedIn:boolean}, LoginParamsType,{rejectValue:{error:Array<string>, fieldErrors?:Array<any>}}>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.login(param)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {isLoggedIn: true}
        } else {
            // @ts-ignore
            handleAsyncServerAppError(res.data, thunkAPI.dispatch);
            return thunkAPI.rejectWithValue( {error: res.data.messages, fieldErrors:res.data.fieldsErrors})
        }
    } catch (err) {
        const error = err as AxiosError
        // @ts-ignore
        handleAsyncServerNetworkError(error, thunkAPI.dispatch);
        return thunkAPI.rejectWithValue( {error:[error.message], fieldErrors:undefined})
    }
})

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
        })
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

// thunks


export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                // @ts-ignore
                handleAsyncServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            // @ts-ignore
            handleAsyncServerNetworkError(error, dispatch);
        })
}




