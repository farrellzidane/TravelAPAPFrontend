import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PropertyView from '../views/property/PropertyView.vue'
import CreateProperty from '../views/property/CreateProperty.vue'
import DetailProperty from '../views/property/DetailProperty.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/property',
      name: 'property',
      component: PropertyView,
    },
    {
      path: '/property/create',
      name: 'property-create',
      component: CreateProperty,
    },
    {
      path: '/property/:id',
      name: 'property-detail',
      component: DetailProperty,
    },
    // {
    //   path: '/booking',
    //   name: 'booking',
    //   component: () => import('../views/BookingView.vue'),
    // },
    // {
    //   path: '/statistic',
    //   name: 'statistic',
    //   component: () => import('../views/StatisticView.vue'),
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router