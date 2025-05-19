import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './_theme/fonts/icons/fa/all.min.css'
import './_theme/fonts/icons/fad/css/all.min.css'
import './_theme/fonts/icons/fe/fe.css'
import './_theme/fonts/icons/po/po.css'
import './_theme/fonts/webfont/uncut/style.css'
import './_theme/fonts/webfont/hostgro/style.css'
import './_theme/fonts/webfont/rethink/style.css'
import './_theme/fonts/webfont/mona/style.css'
import './index.css'
import './_theme/css/custom.css'
import './_theme/css/brand.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
