import { createRouter,createWebHistory } from 'vue-router'
import Login from '../views/Login/Login.vue'
import Logout from '../views/Login/Logout.vue'
import Home from '../views/Home/Home.vue'
import Cookies from "js-cookie";

const routes = [
    {
        path: '/',
        name: 'home',
        component:Home
    },
    {
        path: '/login',
        name: 'login',
        component:Login,
    },
    {
        path: '/logout',
        name: 'logout',
        component:Logout,
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes
})

router.beforeEach((to,from,next)=>{
    //no cookie, user has not logged in
    if(typeof Cookies.get('token') === 'undefined')
    {
        if(to.name !== 'login')
        {
            //redirect to login
            next({
                path:'/login',
                replace:true
            })            
        }
        else 
        {
            next();
        }
    }
    //cookie is found, user is logged in
    else
    {
        if(to.name == 'home' || to.name == 'logout')
        {
            {
                next();
            }         
        }
    }
})

export default router