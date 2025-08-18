import Game from '@/components/Game.vue'
import Login from '@/components/login.vue'
import { auth } from '@/firebase'
import Profile from '@/components/profile.vue'
import Ranking from '@/components/Ranking.vue'
import Register from '@/components/register.vue'
import Settings from '@/components/settings.vue'
import Shop from '@/components/shop.vue'
import { createRouter, createWebHistory } from 'vue-router'
import GuestPage from '@/components/GuestPage.vue'
import Contact from '@/components/contact.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Guest',
      component: GuestPage,
    },
    {
      path: '/game',
      name: 'Game',
      component: Game,
      meta: { currentUser: true } // faqat login uchun
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: true } // faqat login uchun
    },
    {
      path: '/ranking',
      name: 'Ranking',
      component: Ranking
    },
    {
      path: '/shop',
      name: 'Shop',
      component: Shop,
      meta: { requiresAuth: true } // faqat login uchun
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: { requiresAuth: true } // faqat login uchun
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
      
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
      meta: { requiresAuth: true } // faqat login uchun
    },
    
  ],
})

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) {
    next("/");
  } else {
    next();
  }
});


export default router
