import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/restaurants',
                    component: resolve => require(['../components/page/Restaurants.vue'], resolve),
                    meta: { title: '餐馆列表'}
                },
                {
                    name: 'management',
                    path: '/restaurants/:restaurant_id',
                    component: resolve => require(['../components/page/Management.vue'], resolve),
                    meta: { title: '餐馆管理'}
                },
                {
                    path: '/orders/:restaurant_id',
                    component: resolve => require(['../components/page/Order.vue'], resolve),
                    meta: { title: '订单管理'}
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
