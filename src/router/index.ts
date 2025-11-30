import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentRole, isCustomer, isSuperAdmin } from '@/config/axios.config'
import { toast } from 'vue-sonner'
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
import UpdateBooking from '../views/booking/UpdateBooking.vue'
import ChartView from '../views/statistics/ChartView.vue'
import TopUpView from '../views/topup/TopUpView.vue'
import CreateTopUp from '../views/topup/CreateTopUp.vue'
import TopUpDetail from '../views/topup/TopUpDetail.vue'
import PaymentMethodView from '../views/paymentmethod/PaymentMethodView.vue'
import CreatePaymentMethod from '../views/paymentmethod/CreatePaymentMethod.vue'
import PropertyReviewsView from '../views/review/PropertyReviewsView.vue'
import CustomerReviewsView from '../views/review/CustomerReviewsView.vue'
import ReviewDetail from '../views/review/ReviewDetail.vue'
import CreateReview from '../views/review/CreateReview.vue'
import { getToken, redirectToLogin } from '@/lib/auth'

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
      path: '/booking/:id/edit',
      name: 'booking-update',
      component: UpdateBooking,
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
    },
    {
      path: '/statistic',
      name: 'statistic',
      component: ChartView,
    },
    {
      path: '/topup',
      name: 'topup',
      component: TopUpView,
    },
    {
      path: '/topup/create',
      name: 'create-topup',
      component: CreateTopUp,
      beforeEnter: (to, from, next) => {
        if (isSuperAdmin()) {
          toast.error('Access Denied', {
            description: 'Superadmin tidak dapat membuat top-up transaction'
          })
          next('/topup')
        } else {
          next()
        }
      }
    },
    {
      path: '/topup/:id',
      name: 'topup-detail',
      component: TopUpDetail,
    },
    {
      path: '/payment-method',
      name: 'payment-method',
      component: PaymentMethodView,
      beforeEnter: (to, from, next) => {
        if (isCustomer()) {
          toast.error('Access Denied', {
            description: 'Customer tidak memiliki akses ke halaman Payment Method'
          })
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/payment-method/create',
      name: 'create-payment-method',
      component: CreatePaymentMethod,
      beforeEnter: (to, from, next) => {
        if (isCustomer()) {
          toast.error('Access Denied', {
            description: 'Customer tidak memiliki akses ke halaman Payment Method'
          })
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/reviews/property/:propertyId',
      name: 'PropertyReviews',
      component: PropertyReviewsView,
    },
    {
      path: '/reviews/customer',
      name: 'CustomerReviews',
      component: CustomerReviewsView,
      beforeEnter: (to, from, next) => {
        if (!isCustomer()) {
          toast.error('Access Denied', {
            description: 'Only customers can access this page'
          })
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/reviews/:id',
      name: 'ReviewDetail',
      component: ReviewDetail,
    },
    {
      path: '/reviews/create/:bookingId',
      name: 'CreateReview',
      component: CreateReview,
      beforeEnter: (to, from, next) => {
        if (!isCustomer()) {
          toast.error('Access Denied', {
            description: 'Only customers can create reviews'
          })
          next('/')
        } else {
          next()
        }
      }
        },
        {
          path: '/login',
          name: 'login',
          component: () => import('../views/auth/LoginView.vue'),
          meta: { requiresGuest: true }
        },

    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})


router.beforeEach((to, from, next) => {
  const token = getToken();

  if (to.path.includes('/login') || to.path.includes('/register')) {
    return next();
  }
  
  if (!token) {
    return redirectToLogin();
  }
  next();
});
export default router