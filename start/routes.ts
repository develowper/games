/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import webRoutes from './routes/web.js';
import apiRoutes from './routes/api.js';
import adminWebRoutes from './routes/admin_web.js';
import adminApiRoutes from './routes/admin_api.js';

webRoutes()
apiRoutes()
adminWebRoutes()
adminApiRoutes()


