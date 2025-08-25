<template>
  <div v-if="user">
    <!-- Faqat kichik ekranda ko‘rinadigan menyu tugmasi -->
    <button v-if="isMobile" ref="togglebtn" class="menu-btn blur-card" @click="toggleMenu">
      {{ isOpen ? '✖' : '☰' }}
    </button>

    <!-- Navigatsiya menyusi -->
    <aside :class="['sidebar', { open: isOpen || !isMobile }]">
      <img class="logo" src="/logo/logo1.png" alt="">
      <ul @click="toggleMenu">
        <router-link :to="{ name: 'Game' }">
          <li class="sidebar__link"><img class="ul__icon" src="/icons/game.png" alt=""> O'yin</li>
        </router-link>
        <router-link :to="{ name: 'Profile' }">
          <li class="sidebar__link"><img class="ul__icon" src="/icons/user.png" alt=""> Profil</li>
        </router-link>
        <router-link :to="{ name: 'Chat' }">
          <li class="sidebar__link"><img class="ul__icon" src="/icons/chat.png" alt=""> Global Chat</li>
        </router-link>
        <router-link :to="{ name: 'Ranking' }">
          <li class="sidebar__link"><img class="ul__icon" src="/icons/ranking.png" alt=""> Reyting</li>
        </router-link>
        <router-link :to="{ name: 'Shop' }">
          <li class="sidebar__link"><img class="ul__icon" src="/icons/shop.png" alt=""> Do'kon</li>
        </router-link>
        <router-link :to="{ name: 'Settings' }">
          <li class="sidebar__link"><img class="ul__icon" src="/icons/settings.png" alt=""> Sozlamalar</li>
        </router-link>
        <router-link :to="{ name: 'Contact' }">
          <li class="sidebar__link"><img class="ul__icon" src="/icons/phone-chat.png" alt=""> Contact</li>
        </router-link>
      </ul>
    </aside>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: 'Nav',
  data() {
    return {
      isOpen: false,
      isMobile: false,
      user: null
    }
  },
  mounted() {
    this.checkScreen();
    window.addEventListener('resize', this.checkScreen);

    // 🔹 Firebase Auth bilan foydalanuvchi tekshirish
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      this.user = user;
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreen);
  },
  methods: {
    toggleMenu() {
      if (this.isMobile) {

        this.isOpen = !this.isOpen;
        if (this.isOpen && this.$refs.togglebtn) {
          this.$refs.togglebtn.style = `margin-left: 170px;`
        } else {
          this.$refs.togglebtn.style = `margin-left: 0px;`
        }
      }
    },
    checkScreen() {
      this.isMobile = window.innerWidth <= 1000;
      if (!this.isMobile) {
        this.isOpen = false;
      }
    }
  }
}
</script>

<style scoped>
.logo {
  width: 150px;
  margin-left: 20px;
  margin-bottom: 10px;
}

.sidebar {
  position: fixed;
  top: 0;
  left: -250px;
  width: 250px;
  height: 100vh;
  background-color: #111;
  color: #fff;
  padding-top: 20px;
  transition: left 0.3s ease;
  z-index: 1000;
}

.sidebar.open {
  left: 0;
}

@media (min-width: 1001px) {
  .sidebar {
    left: 0 !important;
  }
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 15px 20px;
  cursor: pointer;
  font-family: 'Press Start 2P', sans-serif;
  font-weight: bold;
  font-size: 12px;
  color: white;
}

.sidebar li:hover {
  background-color: #222;
}

.ul__icon {
  height: 20px;
}

.menu-btn {
  position: fixed;
  top: 20px;
  left: 20px;
  font-size: 24px;
  background-color: #222;
  color: white;
  border: none;
  padding: 10px 12px;
  z-index: 1100;
  border-radius: 6px;
  transition: 0.3s ease;
}

.blur-card {
  background: rgba(255, 255, 255, 0.1);
  /* Shaffof oq fon */
  backdrop-filter: blur(10px);
  /* Blur effekti */
  -webkit-backdrop-filter: blur(10px);
  /* Safari uchun */
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

@media (max-width: 500px) {
  .menu-btn {
    top: 10px;
    left: 10px;
  }

}
</style>
