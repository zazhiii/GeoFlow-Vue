import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    component: () => import('../views/main/MainView.vue'),
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: () => import('../views/home/HomeView.vue')
      },
      {
        path: "/geo-file",
        component: () => import('../views/geo-file/GeoFileListView.vue')
      },
      {
        path: "/preview/:id",
        component: () => import('@/views/geo-file/PreviewView.vue')
      },
      {
        path: "/upload",
        component: () => import('../views/upload/UploadView.vue')
      }
    ]
  },
  {
    path: "/login",
    component: () => import('../views/login/LoginView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
