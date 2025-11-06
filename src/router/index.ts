import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PropertyView from '../views/property/PropertyView.vue'
import CreateProperty from '../views/property/CreateProperty.vue'
import DetailProperty from '../views/property/DetailProperty.vue'
import UpdateProperty from '../views/property/UpdateProperty.vue'
import AddRoomType from '@/views/property/AddRoomType.vue'
import BookingView from '../views/booking/BookingView.vue'
import BookingDetail from '@/views/booking/BookingDetail.vue'
import CreateBookingWithRoom from '@/views/booking/CreateBookingWithRoom.vue'
import CreateBookingWithoutRoom from '@/views/booking/CreateBookingWithoutRoom.vue'

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

    {
      path: '/property/:id/edit',
      name: 'property-update',
      component: UpdateProperty,
    },

    {
      path: '/property/updateroom/:id',
      name: 'property-add-room',
      component: AddRoomType,
    },
    {
      path: '/bookings',
      name: 'booking',
      component: BookingView,
    },

    {
      path: '/bookings/:id',
      name: 'booking-detail',
      component: BookingDetail,
    },
    {
      path: '/bookings/create/:idRoom',
      name: 'booking-create-with-room',
      component: CreateBookingWithRoom,
    },
    {
      path: '/bookings/create',
      name: 'booking-create',
      component: CreateBookingWithoutRoom,
    }
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