import React, { Fragment, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import routes from './routes/routes'
import DashboardMaster from './components/layouts/DashboardMaster'

// Context:States
import UserState from './context/user/userState'

// Pages | Routes
const Home = React.lazy(() => import('./pages/Home'));
const Components = React.lazy(() => import('./pages/Renderer'))
const Login = React.lazy(() => import('./pages/auth/Login'))
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'))
const About: any = React.lazy(() => import('./pages/About'))
const Contact: any = React.lazy(() => import('./pages/Contact'))
const NotFoundPage = React.lazy(() => import('./pages/404'));
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));


const App = () => {

    const errorHandler = (err: any, info: any) => {
        console.log(err, 'logged error');
        console.log(info, 'logged error info');
    }

    const getAppPages = (name: string) => {

        switch (name) {
            case 'components':
                return <Components />
            case '/':
                return <Login />
            case 'login':
                return <Login />
            case 'reset-password':
                return <ResetPassword />
            case 'home':
                return <Login />
            case 'not-found':
                return <NotFoundPage />
            case 'about':
                return <About />
            case 'contact':
                return <Contact />
            case 'dashboard':
                return <Dashboard />
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
                                    <Fragment key={`route-${index + 1}`}>

                                        {
                                            !route.isAuth &&
                                            <Route
                                                path={route.url}
                                                element={getAppPages(route.name)}
                                            />
                                        }

                                        {
                                            route.isAuth && route.name !== 'divider' &&
                                            <>
                                                <Route
                                                    path={route.url}
                                                    element={
                                                        <DashboardMaster
                                                            component={getAppPages(route.name)}
                                                            title={route.title ? route.title : route.name}
                                                            back={true}
                                                            sidebar={{
                                                                collapsed: false
                                                            }}
                                                        />
                                                    }
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