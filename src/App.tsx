import React, { Fragment, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import routes from './routes/routes'
import DashboardMaster from './components/layouts/DashboardMaster'

// Context:States
import UserState from './context/user/userState'
import ResourceState from './context/resource/resourceState'

// Pages | Routes
const Home = React.lazy(() => import('./pages/Home'));
const Components = React.lazy(() => import('./pages/Renderer'))
const Login = React.lazy(() => import('./pages/auth/Login'))
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'))
const About: any = React.lazy(() => import('./pages/About'))
const Contact: any = React.lazy(() => import('./pages/Contact'))
const NotFoundPage = React.lazy(() => import('./pages/404'));
const Dashboard = React.lazy(() => import('./pages/dashboard/Dashboard'));
const AccountProfile = React.lazy(() => import('./pages/dashboard/account/Profile'));
const AccountBilling = React.lazy(() => import('./pages/dashboard/account/Billing'));
const AccountPreferences = React.lazy(() => import('./pages/dashboard/account/Preferences'));
const Users = React.lazy(() => import('./pages/dashboard/users/Users'));
const Talents = React.lazy(() => import('./pages/dashboard/users/talents/Talents'));
const Businesses = React.lazy(() => import('./pages/dashboard/users/businesses/Businesses'));
const Admins = React.lazy(() => import('./pages/dashboard/users/admins/Admins'));
const Industries = React.lazy(() => import('./pages/dashboard/core/industries/Industries'));
const Careers = React.lazy(() => import('./pages/dashboard/core/careers/Careers'));
const Fields = React.lazy(() => import('./pages/dashboard/core/fields/Fields'));
const Skills = React.lazy(() => import('./pages/dashboard/core/skills/Skills'));
const Questions = React.lazy(() => import('./pages/dashboard/core/questions/Questions'));
const Topics = React.lazy(() => import('./pages/dashboard/core/topics/Topics'));
const Subscriptions = React.lazy(() => import('./pages/dashboard/payments/subscriptions/Subscriptions'));
const Transactions = React.lazy(() => import('./pages/dashboard/payments/transactions/Transactions'));
const Settings = React.lazy(() => import('./pages/dashboard/settings/Settings'));
const Feedbacks = React.lazy(() => import('./pages/dashboard/feedbacks/Feedbacks'));
const Referrals = React.lazy(() => import('./pages/dashboard/referrals/Referrals'));


const App = () => {

    const DASHBOARD_ROUTE = process.env.REACT_APP_DASHBOARD_ROUTE || '/dashboard';

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
            case 'account-profile':
                return <AccountProfile />
            case 'account-billing':
                return <AccountBilling />
            case 'account-preferences':
                return <AccountPreferences />
            case 'all-users':
                return <Users />
            case 'talents':
                return <Talents />
            case 'businesses':
                return <Businesses />
            case 'admins':
                return <Admins />
            case 'industries':
                return <Industries />
            case 'careers':
                return <Careers />
            case 'fields':
                return <Fields />
            case 'skills':
                return <Skills />
            case 'questions':
                return <Questions />
            case 'topics':
                return <Topics />
            case 'subscriptions':
                return <Subscriptions />
            case 'transactions':
                return <Transactions />
            case 'settings':
                return <Settings />
            case 'feedbacks':
                return <Feedbacks />
            case 'referrals':
                return <Referrals />
            default:
                return <NotFoundPage />
        }

    }

    const computePath = (route: string) => {

        if (route === '/dashboard') {
            return route;
        } else {
            return DASHBOARD_ROUTE + route
        }

    }

    return (

        <Router>

            <UserState>

                <ResourceState>

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
                                                        path={computePath(route.url)}
                                                        element={
                                                            <DashboardMaster
                                                                component={getAppPages(route.name)}
                                                                title={route.title ? route.title : route.name}
                                                                back={route.content.backButton ? route.content.backButton : false}
                                                                sidebar={{
                                                                    collapsed: route.content.sidebar !== undefined ? route.content.sidebar : false
                                                                }}
                                                            />
                                                        }
                                                    />

                                                    {
                                                        route.subroutes && route.subroutes.length > 0 &&
                                                        route.subroutes.map((subroute, index) =>
                                                            <Fragment key={`${subroute.name}-route-${index + 1}`}>

                                                                <Route
                                                                    path={computePath(route.url + subroute.url)}
                                                                    element={
                                                                        <DashboardMaster
                                                                            component={getAppPages(`${route.name}-${subroute.name}`)}
                                                                            title={subroute.title ? subroute.title : subroute.name}
                                                                            back={true}
                                                                            sidebar={{
                                                                                collapsed: subroute.content.sidebar !== undefined ? subroute.content.sidebar : false
                                                                            }}
                                                                        />
                                                                    }
                                                                />

                                                            </Fragment>
                                                        )
                                                    }
                                                </>
                                            }

                                        </Fragment>
                                    )
                                }

                            </Routes>

                        </ErrorBoundary>

                    </Suspense>

                </ResourceState>

            </UserState>

        </Router>

    )

}

export default App;