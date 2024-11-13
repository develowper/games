/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import webRoutes from './routes/web.ts';
import apiRoutes from './routes/api.ts';
import adminWebRoutes from './routes/admin_web.ts';
import adminApiRoutes from './routes/admin_api.ts';

webRoutes()
apiRoutes()
adminWebRoutes()
adminApiRoutes()


