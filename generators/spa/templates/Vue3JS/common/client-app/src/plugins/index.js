/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import router from '../router'

export function registerPlugins(app) {
    app
        .use(router)
}
