import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/home',
    meta: {
      title: '首页',
      renderMenu: false,
      icon: 'CreditCardOutlined',
    },
  },
  {
    path: '/front',
    name: '前端',
    meta: {
      renderMenu: false,
    },
    component: () => import('@/components/layout/FrontView.vue'),
    children: [
      {
        path: '/login',
        name: '登录',
        meta: {
          icon: 'LoginOutlined',
          view: 'blank',
          target: '_blank',
          cacheable: false,
        },
        component: () => import('@/pages/login'),
      },
      {
        path: '/home',
        name: '首页',
        meta: {
          view: 'blank',
        },
        component: () => import('@/pages/home'),
      },
    ],
  },
  {
    name: 'user',
    path: '/user',
    meta: {
      title: '用户管理',
      icon: 'UserOutlined',
      target: '_self',
      renderMenu: true,
    },
    component: () => import('@/pages/user')
  },
  {
    name: 'todo',
    path: '/todo',
    meta: {
      title: '小记管理',
      icon: 'BookOutlined',
      target: '_self',
      renderMenu: true,
    },
    component: () => import('@/pages/todo')
  },
  {
    name: 'tag',
    path: '/tag',
    meta: {
      title: '标签管理',
      icon: 'TagsOutlined',
      // target: '_blank',
      renderMenu: true,
    },
    children: [{
      name: 'todotag',
      path: '/todotag',
      meta: {
        title: '小记标签',
        renderMenu: true,
      },
      component: () => import("@/pages/tag/todo")
    },{
      name: 'dishtag',
      path: '/dishtag',
      meta: {
        title: '点评标签',
        renderMenu: true,
      },
      component: () => import("@/pages/tag/dish")
    }]
  },
  {
    name: 'announcement',
    path: '/announcement',
    meta: {
      title: '公告管理',
      icon: 'BookOutlined',
      target: '_self',
      renderMenu: true
    },
    component: () => import('@/pages/announcement')
  },
  {
    name: 'test',
    path: '/test',
    meta: {
      title: '测试页面',
      icon: 'BookOutlined',
      target: '_self',
      renderMenu: true,
    },
    component: () => import('@/pages/test')
  },
  {
    path: '/403',
    name: '403',
    props: true,
    meta: {
      renderMenu: false,
    },
    component: () => import('@/pages/Exp403.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    props: true,
    meta: {
      icon: 'CreditCardOutlined',
      renderMenu: false,
      cacheable: false,
      _is404Page: true,
    },
    component: () => import('@/pages/Exp404.vue'),
  },
];

export default routes;
