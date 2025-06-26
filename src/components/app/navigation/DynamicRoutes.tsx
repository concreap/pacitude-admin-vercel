import React, { Fragment, lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import routes from '../../../routes/routes'
import DashboardLayout from '../../layout/DashboardLayout'

// Functionalities && Context States
import routil from '../../../utils/routes.util';

// Pages
import Renderer from '../../../pages/Renderer'
import Login from '../../../pages/auth/Login'
import NotFound from '../../../pages/NotFound'

const Home = lazy(() => import('../../../pages/Home'))
const Dashboard = lazy(() => import('../../../pages/dashboard/Dashboard'))
const Industries = lazy(() => import('../../../pages/dashboard/core/industries/Industries'))
const CreateIndustry = lazy(() => import('../../../pages/dashboard/core/industries/CreateIndustry'))
const EditIndustry = lazy(() => import('../../../pages/dashboard/core/industries/EditIndustry'))
const Careers = lazy(() => import('../../../pages/dashboard/core/careers/Careers'))
const CreateCareer = lazy(() => import('../../../pages/dashboard/core/careers/NewCareer'))
const EditCareer = lazy(() => import('../../../pages/dashboard/core/careers/EditCareer'))
const Fields = lazy(() => import('../../../pages/dashboard/core/fields/Fields'))
const CreateField = lazy(() => import('../../../pages/dashboard/core/fields/CreateField'))
const EditField = lazy(() => import('../../../pages/dashboard/core/fields/EditField'))
const Skills = lazy(() => import('../../../pages/dashboard/core/skills/Skills'))
const CreateSkill = lazy(() => import('../../../pages/dashboard/core/skills/CreateSkill'))
const EditSkill = lazy(() => import('../../../pages/dashboard/core/skills/EditSkill'))
const Topics = lazy(() => import('../../../pages/dashboard/core/topics/Topics'))
const CreateTopic = lazy(() => import('../../../pages/dashboard/core/topics/CreateTopic'))
const EditTopic = lazy(() => import('../../../pages/dashboard/core/topics/EditTopic'))
const Questions = lazy(() => import('../../../pages/dashboard/core/questions/Questions'))
const CreateQuestion = lazy(() => import('../../../pages/dashboard/core/questions/CreateQuestion'))
const QuestionDetails = lazy(() => import('../../../pages/dashboard/core/questions/QuestionDetails'))

const DynamicRoutes = () => {

    const getAppPages = (name: string) => {

        switch (name) {
            case 'render':
                return <Renderer />
            case '/':
                return <Login />
            case 'login':
                return <Login />
            case 'dashboard':
                return <Dashboard />
            case 'industries':
                return <Industries />
            case 'careers':
                return <Careers />
            case 'fields':
                return <Fields />
            case 'skills':
                return <Skills />
            case 'topics':
                return <Topics />
            case 'create-topic':
                return <CreateTopic />
            case 'update-topic':
                return <EditTopic />
            case 'questions':
                return <Questions />
            case 'create-question':
                return <CreateQuestion />
            case 'create-career':
                return <CreateCareer />
            case 'update-career':
                return <EditCareer />
            case 'create-field':
                return <CreateField />
            case 'update-field':
                return <EditField />
            case 'create-skill':
                return <CreateSkill />
            case 'update-skill':
                return <EditSkill />
            case 'create-industry':
                return <CreateIndustry />
            case 'update-industry':
                return <EditIndustry />
            case 'question-details':
                return <QuestionDetails />
            default:
                return <NotFound />
        }

    }

    return (
        <>
            <Routes>

                {
                    routes.map((route, index) =>
                        <Fragment key={`route-${index + 1}`}>

                            {
                                !route.isAuth &&
                                <Route
                                    path={routil.computeAppRoute(route)}
                                    element={getAppPages(route.name)}
                                />
                            }

                            {
                                route.isAuth && route.name !== 'divider' &&
                                <>
                                    <Route
                                        path={routil.computePath(route.url)}
                                        element={
                                            <DashboardLayout
                                                component={getAppPages(route.name)}
                                                title={route.title ? route.title : route.name}
                                                back={route.content.backButton ? route.content.backButton : false}
                                                sidebar={{
                                                    collapsed: route.content.collapsed ? route.content.collapsed : false
                                                }}
                                            />
                                        }
                                    />

                                    {
                                        route.subroutes && route.subroutes.length > 0 &&
                                        route.subroutes.map((subroute, index) =>
                                            <Fragment key={`${subroute.name}-route-${index + 1}`}>

                                                <Route
                                                    path={routil.computeSubPath(route, subroute)}
                                                    element={
                                                        subroute.name === 'onboard' ? getAppPages(`${subroute.name}`) :
                                                            <DashboardLayout
                                                                component={getAppPages(`${subroute.name}`)}
                                                                title={subroute.title ? subroute.title : subroute.name}
                                                                back={true}
                                                                sidebar={{
                                                                    collapsed: subroute.content.collapsed ? subroute.content.collapsed : false
                                                                }}
                                                            />
                                                    }
                                                />

                                            </Fragment>
                                        )
                                    }

                                    {
                                        route.inroutes && route.inroutes.length > 0 &&
                                        route.inroutes.map((inroute, index) =>
                                            <Fragment key={`${inroute.name}-route-${index + 1}`}>

                                                <Route
                                                    path={routil.computeInPath(inroute)}
                                                    element={
                                                        <DashboardLayout
                                                            component={getAppPages(`${inroute.name}`)}
                                                            title={inroute.title ? inroute.title : inroute.name}
                                                            back={true}
                                                            sidebar={{
                                                                collapsed: inroute.content.collapsed ? inroute.content.collapsed : false
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

        </>
    )

}

export default DynamicRoutes
