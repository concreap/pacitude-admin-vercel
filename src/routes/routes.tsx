import navbar from './navbar.route'
import footer from './footer.route'
import sidebar from './sidebar.route'
import { IRoute } from '../utils/interfaces.util'
import appRoutes from './app.route';

const routes: Array<IRoute> = [
    ...appRoutes,
    ...navbar,
    ...footer,
    ...sidebar
];

export default routes;
