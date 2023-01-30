import React, {useCallback, useEffect} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import {AppRootStateType, useAppDispatch, useAppSelector} from './store'
import {initializeAppTC, RequestStatusType} from './app-reducer'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {Menu} from '@mui/icons-material';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Login} from "../components/Login/Login";
import {Navigate, Route, Routes} from "react-router-dom";
import {useSelector} from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import {logoutTC} from "../components/Login/login-reducer";

function App() {
    const status = useAppSelector<RequestStatusType| string>((state) => state.app.status)
    const initialized = useAppSelector<boolean>((state) => state.app.initialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.login.isLoggedIn);

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const logOutHandler = useCallback(() => {
        dispatch(logoutTC())
    }, [])

    console.log(initialized)
    if (!initialized) {
        return <div style={{position: 'fixed', top: '30%', width: '100%', textAlign: 'center'}}><CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <ErrorSnackbar/>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button onClick={logOutHandler} color="inherit">Logout</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistsList/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                    <Route path={'/404'} element={<div
                        style={{textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <h1>404 NOT FOUND</h1></div>}/>
                    <Route path={'*'} element={<Navigate to={'/404'}/>}/>
                </Routes>
            </Container>
        </div>
    )
}

export default App
