import React, { Fragment, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import routes from './routes/routes'

// Context:States
import UserState from './context/user/userState'

// Pages | Routes
const Home = React.lazy(() => import('./pages/Home'));
const Components = React.lazy(() => import('./pages/Renderer'))
const Login = React.lazy(() => import('./pages/auth/Login'))
const Register = React.lazy(() => import('./pages/auth/Register'))
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'))
const About: any = React.lazy(() => import('./pages/About'))
const Contact: any = React.lazy(() => import('./pages/Contact'))
const NotFoundPage = React.lazy(() => import('./pages/404'));


const App = () => {

    const errorHandler = (err: any, info: any) => {
        console.log(err, 'logged error');
        console.log(info, 'logged error info');
    }

    const getAppPages = (name: string) => {

        switch (name) {
            case 'components':
                return <Components />
            case 'login':
                return <Login />
            case 'register':
                return <Register />
            case 'reset-password':
                return <ResetPassword />
            case 'home':
                return <Home />
            case 'not-found':
                return <NotFoundPage />
            case 'about':
                return <About />
            case 'contact':
                return <Contact />
            default:
                return <NotFoundPage />
        }

    }

    return (

        <Router>

            <UserState>

                <Suspense fallback={(<></>)}>

                    <ErrorBoundary FallbackComponent={() => (<></>)} onReset={() => { window.location.reload() }} onError={errorHandler}>

                        <Routes>

                            {
                                routes.map((route, index) =>
                                    <Fragment key={`route-${index+1}`}>
                                        
                                        {
                                            !route.isAuth &&
                                            <Route
                                                path={route.url}
                                                element={getAppPages(route.name)}
                                            />
                                        }

                                        {
                                            route.isAuth &&
                                            <>
                                                <Route
                                                    path={route.url}
                                                    element={getAppPages(route.name)}
                                                />
                                            </>
                                        }

                                    </Fragment>
                                )
                            }

                        </Routes>

                    </ErrorBoundary>

                </Suspense>

            </UserState>

        </Router>

    )

}

export default App;