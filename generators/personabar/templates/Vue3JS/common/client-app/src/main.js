import { createApp } from 'vue'
import App from './App.vue'
import { getResx } from "./assets/api";
import vuetify from './plugins/vuetify'

const app = createApp(App);
app.use(vuetify)
app.config.devtools = true;

function getResxPromise(resxKey) {
    return new Promise((resolve) => {
        getResx(resxKey, resolve);
    });
}

getResxPromise("<%= friendlyName %>")
    .then(resx=>{
        app.provide("resx", resx);
        app.mount('#<%= friendlyName %>');
    })
    .catch(error => { console.log(error); });

 