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
        path: "/metadata/:id",
        component: () => import('@/views/geo-file/MetadataView.vue')
      },
      {
        path: "/upload",
        component: () => import('../views/upload/UploadView.vue')
      },
      {
        path: "/historgram/:id",
        component: () => import('@/views/geo-file/HistogramView.vue')
      },
      {
        path: "data-analyze",  
        component: () => import('@/views/data-analyze/index.vue'),
        children: [
          {
            path: "color-composite",
            component: () => import('@/views/data-analyze/ColorCompositeView.vue')
          }
        ]
      },
      {
        path: "/open-file",
        component: () => import('@/views/data-analyze/openFileView.vue')
      },
      
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
