import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

// Pages
const Home = React.lazy(() => import('./pages/Home'));


const App = () => {

    const errorHandler = (err: any, info: any) => {
        console.log(err, 'logged error');
        console.log(info, 'logged error info');
    }

    return (

        <Router>

            <Suspense fallback={(<></>)}>

                <ErrorBoundary FallbackComponent={() => (<></>)} onReset={() => { window.location.reload() }} onError={errorHandler}>

                    <Routes>

                        <Route path='/' element={<Home />} />
                        <Route path='/home' element={<Home />} />

                    </Routes>

                </ErrorBoundary>

            </Suspense>

        </Router>

    )

}

export default App;