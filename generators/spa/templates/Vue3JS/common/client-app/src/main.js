import { createApp } from 'vue'
import App from './App.vue'
import { getResx } from "./assets/api";
import router from './router';
import store from './store/index';

const allAppElements = document.getElementsByClassName("appModule");
const app = createApp(App);
app.use(router)
app.use(store)

app.config.devtools = true;

function getResxPromise(dnnConfig, resxKey) {
    return new Promise((resolve) => {
        getResx(dnnConfig, resxKey, resolve);
    });
}

function setApp() {
    for (var i = 0; i < allAppElements.length; i++) {
        const thisAppElm = allAppElements[i];
        const dnnConfig = {
            tabId: Number(thisAppElm.getAttribute("data-tabid")),
            moduleId: Number(thisAppElm.getAttribute("data-moduleid")),
            editMode: thisAppElm.getAttribute("data-editmode").toLowerCase() === "true",
            apiBaseUrl: thisAppElm.getAttribute("data-apibaseurl"),
            rvt: window.$("input[name='__RequestVerificationToken']").val()
        };

        if (window.dtCallBacks === undefined) {
            window.dtCallBacks = [];
        }

        getResxPromise(dnnConfig, "View")
            .then(resx => {
                app.provide("dnnConfig", dnnConfig);
                app.provide("resx", resx);
                app.provide("window", window);
                app.provide("jQuery", window.$);
                app.mount(`#${thisAppElm.id}`);
            })
            .catch(error => { console.log(error); });
    }
}
setApp();