import VueRouter from 'vue-router'
import Home from "./views/home.vue";
import Login from "./views/login.vue";
import Register from "./views/register.vue";
import Tutorial from "./views/tutorial.vue";
import Start from "./views/start.vue";
import Battle from "./views/battle.vue";
import Single from "./views/single.vue";
import Duel from "./views/duel.vue";
import Error from "./views/error.vue";
import NotFount from "./views/notfound.vue";

import { getters } from "./stores/user";

const ifAuthenticated = (to, from, next) => {
    if (getters.authenticated()) {
      next()
      return
    }
    next('/login')
  }

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/tutorial', component: Tutorial, beforeEnter: ifAuthenticated },
    { path: '/start', component: Start, beforeEnter: ifAuthenticated },
    { path: '/battle', component: Battle, beforeEnter: ifAuthenticated },
    { path: '/single', component: Single, beforeEnter: ifAuthenticated },
    { path: '/duel', component: Duel, beforeEnter: ifAuthenticated },
    { path: "/error", name: 'error', component: Error, props: true },
    { path: "*", component: NotFount }
]

const router = new VueRouter({
    routes
})

export default router;