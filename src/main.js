import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'
import english from './langs/english'
import russian from './langs/russian'
import uzbek from './langs/uzbek'
import { auth } from "./firebase";



const app = createApp(App)
const i18n = createI18n({
    legacy: false,
    locale: 'uz-UZ',
    fallbackLocale: 'uz-UZ',
    messages: {
        'uz-UZ': uzbek.messages,
        'ru-RU': russian.messages,
        'en-EN': english.messages,
    }
})

auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount("#app");
  }

  if (user) {
    // Agar foydalanuvchi login bo'lgan bo'lsa, o'yinga yo'naltiramiz
    if (router.currentRoute.path === "/register" || router.currentRoute.path === "/login") {
      router.push("/game");
    }
  } else {
    // Agar login bo'lmagan bo'lsa, register sahifasiga yo'naltiramiz
    if (router.currentRoute.path !== "/register") {
      router.push("/");
    }
  }
});


app.use(i18n)
app.use(router)

app.mount('#app')