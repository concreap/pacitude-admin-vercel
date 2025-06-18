import React, { Fragment, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

// Functionalities && Context States
import UserState from './context/user/userState'
import AppState from './context/app/appState'

// Pages imported
import MainLoader from './pages/MainLoader'
import ErrorPage from './pages/ErrorPage'
import DynamicRoutes from './components/app/navigation/DynamicRoutes';

function App() {

    const errorHandler = (err: any, info: any) => {
        console.log(err, 'logged error');
        console.log(info, 'logged error info');
    }

    return (
        <>
            <Router>

                <UserState>

                    <AppState>

                        <ErrorBoundary FallbackComponent={() => (<ErrorPage />)} onReset={() => { window.location.reload() }} onError={errorHandler}>

                            <Suspense fallback={<MainLoader />}>

                                <DynamicRoutes />

                            </Suspense>

                        </ErrorBoundary>

                    </AppState>

                </UserState>

            </Router>
        </>
    )
}

export default App
