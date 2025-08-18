<template>
  <div class="guest-page">
    <!-- Logo -->
    <div class="logo animate-fade-in">
      PowerClick: Anime Rise
    </div>

    <!-- Subtitle -->
    <p class="subtitle animate-fade-in">Click, Upgrade & Dominate!</p>

    <!-- Stats -->
    <p class="stats animate-fade-in-delay"><img src="/icons/users-group.png" alt="" class="icon"> Foydalanuvchilar:
      <span class="count">{{ animatedCount }}</span>
    </p>

    <!-- Buttons -->
    <div class="buttons animate-fade-in-delay2">
      <router-link to="/login" class="btn btn-outline">Kirish</router-link>
      <router-link to="/register" class="btn btn-primary">Ro‘yxatdan o‘tish</router-link>
    </div>
  </div>

  <div v-if="loading" class="loader-overlay">
    <div class="loader"></div>
  </div>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default {
  data() {
    return {
      usersCount: 0,
      animatedCount: 0,
      loading: true,
    };
  },
  async created() {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      this.usersCount = snapshot.size;
      this.animateCount();
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    animateCount() {
      let start = 0;
      const end = this.usersCount;
      const step = Math.max(Math.floor(800 / end), 20);
      const timer = setInterval(() => {
        start++;
        this.animatedCount = start;
        if (start >= end) clearInterval(timer);
      }, step);
    }
  }
};
</script>

<style scoped>
.guest-page {
  background-color: #0d1117;
  color: #c9d1d9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: system-ui, sans-serif;
  text-align: center;
  padding: 20px;
  animation: fadeIn 1s ease-in-out;
}

/* Logo */
.logo {
  font-size: 28px;
  font-weight: bold;
  color: #f0f6fc;
  margin-bottom: 8px;
}

/* Subtitle */
.subtitle {
  font-size: 14px;
  color: #8b949e;
  margin-bottom: 15px;
}

/* Stats */
.stats {
  font-size: 16px;
  margin-bottom: 25px;
}

.stats span {
  color: #ffd700;
  font-weight: bold;
  animation: glow 1.5s infinite alternate;
}

/* Buttons */
.buttons {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

/* Outline button */
.btn-outline {
  color: #f0f6fc;
  border: 1px solid #30363d;
  background: transparent;
}

.btn-outline:hover {
  background-color: #21262d;
  transform: scale(1.05);
}

/* Primary button */
.btn-primary {
  background-color: #ffd700;
  color: #000;
  border: none;
}

.icon{
  transform: translateY(2px);
}

.btn-primary:hover {
  background-color: #ffea00;
  transform: scale(1.05);
}

/* Fade-in animations */
.animate-fade-in {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in-delay {
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: 0.3s;
  opacity: 0;
}

.animate-fade-in-delay2 {
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: 0.6s;
  opacity: 0;
}

/* Keyframes */
@keyframes fadeInUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes glow {
  from {
    text-shadow: 0 0 5px #ffd700, 0 0 10px #ffd700;
  }

  to {
    text-shadow: 0 0 15px #ffea00, 0 0 25px #ffea00;
  }
}

@media (max-width: 350px) {
  .logo{
    font-size: 23px;
  }
}
</style>
