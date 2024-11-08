import vuetify from './vuetify'
import 'vuetify/dist/vuetify.min.css';

export function registerPlugins(app) {
    app
        .use(vuetify)
}
