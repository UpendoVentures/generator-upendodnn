import { createRouter, createWebHistory } from 'vue-router';
import HomeItem from './components/HomeItem.vue';
import ItemDetails from './components/ItemDetails.vue';
import About from './components/AboutItem.vue';
import { resolveHomePath, resolvePath } from './assets/utils'

const url = new URL(window.location.href);
const basePath = url.pathname;

const routes = [
    { path: resolveHomePath(basePath), component: HomeItem },
    { path: resolvePath(basePath, '/details'), component: ItemDetails },
    { path: resolvePath(basePath, '/about'), component: About },
    { path: '/:pathMatch(.*)*', redirect: resolveHomePath(basePath) }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;