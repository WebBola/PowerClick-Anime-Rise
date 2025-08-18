<template>
  <div class="ranking-container">
    <div class="title">
      <img src="/icons/ranking.png" alt="icon" class="ul__icon" />
      <h1 class="ranking-title">Top Players</h1>
      <p class="user-count">👥 <span class="count">{{ users.length }}</span> total players</p>
    </div>

    <div class="ranking-list">
      <div v-for="(user, index) in sortedUsers" :key="user.id" class="ranking-item"
        :class="[index === 0 ? 'top-1' : index === 1 ? 'top-2' : index === 2 ? 'top-3' : '']">
        <span class="rank-number">
          <template v-if="index === 0">🥇</template>
          <template v-else-if="index === 1">🥈</template>
          <template v-else-if="index === 2">🥉</template>
          <template v-else>#{{ index + 1 }}</template>
        </span>
        <img :src="user.img || '/image/default-avatar.jfif'" class="avatar" />
        <span class="player-name">{{ user.username }}</span>
        <span class="player-level">Lv. {{ user.lvl }}</span>
        <span class="player-count"><img src="https://cdn-icons-png.flaticon.com/128/6791/6791291.png" alt="" class="icon"> {{ formatNumber(user.clicks) }}</span>
      </div>
    </div>

    <!-- Fixed current user info -->
    <div v-if="currentUser" class="fixed-bottom-user">
      <span class="label">#{{ currentUserRank }}</span>
      <img :src="currentUser.photo || '/image/default-avatar.jfif'" alt="Profile Image" class="avatar" />
      <span class="player-name">{{ currentUser.username }}</span>
      <span class="player-level">Lv. {{ currentUser.lvl }}</span>
      <span class="player-count"><img src="https://cdn-icons-png.flaticon.com/128/6791/6791291.png" alt="" class="icon"> {{ formatNumber(currentUser.clicks) }}</span>
    </div>


    <div v-if="loading" class="loader-overlay">
      <div class="loader"></div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'
import { collection, onSnapshot, doc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged, } from 'firebase/auth'

export default {
  emits: ['update-rank'],
  props: { formatNumber: String, },
  data() {
    return {
      users: [],
      currentUser: null,
      loading: true
    }
  },

  watch: {
    currentUserRank(newRank) {
      if (newRank !== null) {
        this.$emit('update-rank', newRank);
      }
    }
  },

  computed: {
    // 1. sorted list
    sortedUsers() {
      return [...this.users].sort((a, b) => b.clicks - a.clicks)
    },

    // 2. current user rank
    currentUserRank() {
      if (!this.currentUser) return null

      const index = this.sortedUsers.findIndex(
        user => user.id === this.currentUser.uid
      )

      return index !== -1 ? index + 1 : null
    }
  },
  mounted() {
    const auth = getAuth();

    // Realtime user list
    onSnapshot(collection(db, 'users'), snapshot => {
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      this.users = userList;
    });

    // Realtime current user
    onAuthStateChanged(auth, user => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        onSnapshot(userDocRef, (snap) => {
          if (snap.exists()) {
            this.currentUser = {
              uid: user.uid,
              ...snap.data()
            };
          }
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    });
  }

}


</script>



<style scoped>
.ranking-container {
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  color: #fff;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.ranking-title {
  font-size: 28px;
  font-weight: bold;
}

.user-count {
  font-size: 14px;
  color: #ccc;
}

.ul__icon {
  width: 32px;
  height: 32px;
  vertical-align: middle;
}

.ranking-list {
  max-width: 500px;
  height: 450px;
  overflow-y: scroll;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 50px 0;
  max-height: 80vh;
  margin-top: -15px;
  overflow-y: auto;

  /* fade effect */
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);
}

.ranking-item {
  background: #1e1e1e;
  padding: 12px 18px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: 0.3s ease;
  border: 1px solid #333;
}

.ranking-item:hover {
  background: #2a2a2a;
}

.rank-number {
  width: 40px;
  font-weight: bold;
  text-align: center;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.player-name {
  flex: 1;
  font-weight: 600;
}

.player-level {
  font-size: 14px;
  color: #ffc107;
}

.player-count {
  font-size: 14px;
  color: #00bcd4;
}

/* Top ranks bg effects */
.top-1 {
  background: linear-gradient(90deg, #ffd70033, #ffd7000a);
  border: 1px solid gold;
}

.top-2 {
  background: linear-gradient(90deg, #c0c0c033, #c0c0c00a);
  border: 1px solid silver;
}

.top-3 {
  background: linear-gradient(90deg, #cd7f3233, #cd7f320a);
  border: 1px solid #cd7f32;
}

/* Fixed current user */
.fixed-bottom-user {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #121212;
  border: 2px dashed #00bcd4;
  border-radius: 12px;
  padding: 12px 18px;
  width: 500px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 999;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 0 8px rgba(0, 188, 212, 0.4);
  margin: 0 auto;
}

.icon{
  height: 13px;
  transform: translateY(2px);
}

.fixed-bottom-user .label {
  color: #00bcd4;
  font-weight: 600;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .fixed-bottom-user {
    right: 10px;
    bottom: 10px;
    padding: 8px 12px;
    font-size: 12px;
  }

  .ranking-item {
    padding: 10px 12px;
  }

  .avatar {
    width: 30px;
    height: 30px;
  }
}

/* 1200px dan kichik (katta ekranlardan pastga) */
@media (max-width: 1200px) {
  .ranking-container {
    padding: 18px;
    margin-left: 200px;
  }

  .fixed-bottom-user{
    margin-left: 100px;
  }

 
}

/* 992px dan kichik (planshet landscape) */
@media (max-width: 992px) {
  .ranking-container {
    padding: 15px;
    margin: 0;
  }

  .ranking-title {
    font-size: 24px;
  }

  .ranking-list {
    max-width: 90%;
    height: 420px;
  }

  .fixed-bottom-user {
    width: 90%;
    padding: 10px 14px;
    font-size: 14px;
    margin: 0;
  }
}

/* 768px dan kichik (planshet portrait) */
@media (max-width: 768px) {
  .ranking-title {
    font-size: 22px;
  }

  .ranking-item {
    padding: 10px 12px;
    gap: 10px;
  }

  .avatar {
    width: 32px;
    height: 32px;
  }

  .player-name {
    font-size: 14px;
  }
}

/* 600px dan kichik (telefon katta) */
@media (max-width: 600px) {
  .ranking-list {
    max-width: 100%;
    height: 380px;
  }

  .ranking-item {
    padding: 8px 10px;
  }

  .rank-number {
    width: 28px;
    font-size: 13px;
  }

  .avatar {
    width: 28px;
    height: 28px;
  }

  .player-name {
    font-size: 13px;
  }

  .player-level,
  .player-count {
    font-size: 12px;
  }

  .fixed-bottom-user {
    left: 0;
    right: 0;
    bottom: 0;
    transform: none;
    width: 100%;
    border-radius: 0;
    padding: 8px 10px;
    font-size: 12px;
    justify-content: space-between;
  }
}

/* 400px dan kichik (telefon kichik) */
@media (max-width: 400px) {
  .ranking-title {
    font-size: 18px;
  }

  .player-name {
    font-size: 12px;
  }

  .fixed-bottom-user {
    font-size: 11px;
    padding: 6px 8px;
  }
}

/* 300px dan kichik (eng kichik ekranlar) */
@media (max-width: 300px) {
  .ranking-title {
    font-size: 16px;
  }

  .avatar {
    width: 24px;
    height: 24px;
  }

  .player-name,
  .player-level,
  .player-count {
    font-size: 10px;
  }

  .fixed-bottom-user {
    font-size: 10px;
    gap: 6px;
  }
}
</style>
