import { createRouter, createWebHistory } from 'vue-router';
import HomeItem from './components/HomeItem.vue';

const url = new URL(window.location.href);
const basePath = url.pathname;

const routes = [
    { path: `${basePath}`, component: HomeItem },
    { path: '/:pathMatch(.*)*', redirect: `${basePath}` }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
