import { createRouter, createWebHistory } from 'vue-router'
import { isCustomer, isSuperAdmin, isAccommodationOwner } from '@/config/axios.config'
import { redirectToLogin } from '@/lib/auth'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth/auth.store'
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
import UpdateTopUpStatus from '../views/topup/UpdateTopUpStatus.vue'
import PaymentMethodView from '../views/paymentmethod/PaymentMethodView.vue'
import CreatePaymentMethod from '../views/paymentmethod/CreatePaymentMethod.vue'
import PropertyReviewsView from '../views/review/PropertyReviewsView.vue'
import CustomerReviewsView from '../views/review/CustomerReviewsView.vue'
import ReviewDetail from '../views/review/ReviewDetail.vue'
import CreateReview from '../views/review/CreateReview.vue'
import BillView from '../views/bill/BillView.vue'
import BillDetail from '../views/bill/BillDetail.vue'

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
        const authStore = useAuthStore()
        if (isSuperAdmin(authStore.userRole || undefined)) {
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
      path: '/topup/:id/update-status',
      name: 'topup-update-status',
      component: UpdateTopUpStatus,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (!isSuperAdmin(authStore.userRole || undefined)) {
          toast.error('Access Denied', {
            description: 'Only Superadmin can update top-up status'
          })
          next('/topup')
        } else {
          next()
        }
      }
    },
    {
      path: '/bills',
      name: 'bills',
      component: BillView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        const role = authStore.userRole || undefined
        if (!isSuperAdmin(role) && !isCustomer(role) && !isAccommodationOwner(role)) {
          toast.error('Access Denied', {
            description: 'You do not have access to Bills'
          })
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/bills/:id',
      name: 'bill-detail',
      component: BillDetail,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        const role = authStore.userRole || undefined
        if (!isSuperAdmin(role) && !isCustomer(role) && !isAccommodationOwner(role)) {
          toast.error('Access Denied', {
            description: 'You do not have access to Bills'
          })
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/payment-method',
      name: 'payment-method',
      component: PaymentMethodView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (isCustomer(authStore.userRole || undefined)) {
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
        const authStore = useAuthStore()
        if (isCustomer(authStore.userRole || undefined)) {
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
      path: '/reviews/my',
      name: 'MyReviews',
      component: CustomerReviewsView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (!isCustomer(authStore.userRole || undefined)) {
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
      path: '/reviews/customer',
      name: 'CustomerReviews',
      component: CustomerReviewsView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (!isCustomer(authStore.userRole || undefined)) {
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
        const authStore = useAuthStore()
        if (!isCustomer(authStore.userRole || undefined)) {
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
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/profile/ProfileView.vue'),
    },
    {
      path: '/profile/edit',
      name: 'profile-edit',
      component: () => import('../views/profile/ProfileEditView.vue'),
    },
    {
      path: '/users',
      name: 'user-management',
      component: () => import('../views/user/UserManagementView.vue'),
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (!isSuperAdmin(authStore.userRole || undefined)) {
          toast.error('Access Denied', {
            description: 'Only Superadmin can access User Management'
          })
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/customers',
      name: 'customer-list',
      component: () => import('../views/user/CustomerListView.vue'),
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        const role = authStore.userRole || undefined
        if (!isSuperAdmin(role) && !isAccommodationOwner(role)) {
          toast.error('Access Denied', {
            description: 'Access restricted to Superadmin and Accommodation Owners'
          })
          next('/')
        } else {
          next()
        }
      }
    },
    {
      path: '/users/:id',
      name: 'user-detail',
      component: () => import('../views/user/UserDetailView.vue'),
    },
    {
      path: '/users/:id/edit',
      name: 'user-edit',
      component: () => import('../views/user/EditUserView.vue'),
    },
  ],
})


router.beforeEach(async (to, from, next) => {
  // Allow access to auth pages without checking authentication
  if (to.path.includes('/login') || to.path.includes('/register')) {
    return next();
  }
  
  // For all other pages, check if user is authenticated
  // The authentication is handled by cookies sent automatically
  // If the backend responds with 401, axios interceptor will redirect to login
  next();
});
export default router