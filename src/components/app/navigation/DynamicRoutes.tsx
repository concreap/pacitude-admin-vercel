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
const CreateIndustry = lazy(() => import('../../../pages/dashboard/core/industries/NewIndustry'))
const EditIndustry = lazy(() => import('../../../pages/dashboard/core/industries/EditIndustry'))
const Careers = lazy(() => import('../../../pages/dashboard/core/careers/Careers'))
const CreateCareer = lazy(() => import('../../../pages/dashboard/core/careers/NewCareer'))
const EditCareer = lazy(() => import('../../../pages/dashboard/core/careers/EditCareer'))
const Fields = lazy(() => import('../../../pages/dashboard/core/fields/Fields'))
const CreateField = lazy(() => import('../../../pages/dashboard/core/fields/NewField'))
const EditField = lazy(() => import('../../../pages/dashboard/core/fields/EditField'))
const Skills = lazy(() => import('../../../pages/dashboard/core/skills/Skills'))
const CreateSkill = lazy(() => import('../../../pages/dashboard/core/skills/NewSkill'))
const EditSkill = lazy(() => import('../../../pages/dashboard/core/skills/EditSkill'))
const Topics = lazy(() => import('../../../pages/dashboard/core/topics/Topics'))
const CreateTopic = lazy(() => import('../../../pages/dashboard/core/topics/NewTopic'))
const EditTopic = lazy(() => import('../../../pages/dashboard/core/topics/EditTopic'))
const Questions = lazy(() => import('../../../pages/dashboard/core/questions/Questions'))
const CreateQuestion = lazy(() => import('../../../pages/dashboard/core/questions/CreateQuestion'))
const QuestionDetails = lazy(() => import('../../../pages/dashboard/core/questions/QuestionDetails'))

// support/updates/announcement pages
const UpdatesPage = lazy(() => import('../../../pages/dashboard/support/updates/Updates'));
const FeedbackPage = lazy(() => import('../../../pages/dashboard/support/feedback/Feedback'))
const HelpPage = lazy(() => import('../../../pages/dashboard/support/help/Help'))

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
            case 'create-industry':
                return <CreateIndustry />
            case 'edit-industry':
                return <EditIndustry />
            case 'careers':
                return <Careers />
            case 'create-career':
                return <CreateCareer />
            case 'edit-career':
                return <EditCareer />
            case 'fields':
                return <Fields />
            case 'create-field':
                return <CreateField />
            case 'edit-field':
                return <EditField />
            case 'skills':
                return <Skills />
            case 'create-skill':
                return <CreateSkill />
            case 'edit-skill':
                return <EditSkill />
            case 'topics':
                return <Topics />
            case 'create-topic':
                return <CreateTopic />
            case 'edit-topic':
                return <EditTopic />
            case 'questions':
                return <Questions />
            case 'create-question':
                return <CreateQuestion />
            case 'question-details':
                return <QuestionDetails />
            case 'updates':
                return <UpdatesPage />
            case 'feedback':
                return <FeedbackPage />
            case 'help':
                return <HelpPage />
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
