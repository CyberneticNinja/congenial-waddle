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

    if(to.name == 'login' && typeof Cookies.get('token') === 'undefined')
    {
        next();
    }
    else if(to.name == 'login' && typeof Cookies.get('token') !== 'undefined')
    {
        next({
            path:'/',
            replace:true
        })
    }
    //user is already logged out, need to login
    else if(to.name !== 'login' && typeof Cookies.get('token') === 'undefined')
    {
        console.log(to.name+' '+Cookies.get('token'))
        next({
            path:'/login',
            replace:true
        })
    }
    // else if(to.name == 'logout' && typeof Cookies.get('token') !== 'undefined')
    // {
    //     console.log(Cookies.get('token'))
    //     next({
    //         path:'/',
    //         replace:true
    //     })
    // }
    else
    {
        next();
    }

    // if(to.name !== 'login' && Cookies.get('token') == null)
    // {
    //     next({
    //         path:'login',
    //         replace:true
    //     })
    // }
    // else
    // {
    //     next();
    // }
})

export default router