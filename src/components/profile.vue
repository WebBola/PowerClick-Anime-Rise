<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="avatar-section">
        <img v-if="userData && userData.photo" :src="userData.photo" alt="Profile Image" class="profile-img" />
        <img v-else src="/image/default-avatar.jfif" alt="Default Avatar" class="profile-img" />
      </div>

      <div class="info-section">
        <h2 class="profile-name">{{ userData?.username || 'Check your Internet connection' }}</h2>
        <p class="profile-email">{{ userData?.email || 'Email@gmail.com' }}</p>
        <p class="profile-gender">Jinsi: {{ userData?.gender || '-' }}</p>

        <div class="stats">
          <div class="stat-box">
            <span class="stat-box-title">
              <img class="stat-box-icon" src="/icons/cursor.png" alt=""> Kliklar
            </span>
            <strong>{{ formatNumber(userData?.clicks || 0)  }}</strong>
          </div>
          <div class="stat-box">
            <span class="stat-box-title">
              <img class="stat-box-icon" src="/icons/star.png" alt=""> Level
            </span>
            <strong>{{ userData?.lvl || '0' }}</strong>
          </div>
          <div class="stat-box">
            <span class="stat-box-title">
              <img class="stat-box-icon" src="/icons/trophy.png" alt=""> Reyting
            </span>
            <strong>#{{ currentUserRank || '0' }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="loading" class="loader-overlay">
    <div class="loader"></div>
  </div>
</template>

<script>
import { db, auth } from "../firebase";
import { collection, onSnapshot, query, orderBy, doc } from "firebase/firestore";
import { onAuthStateChanged, getAuth, } from "firebase/auth";

export default {
  props: {
    formattedCount: Function,
    lvl: Number,
    formatNumber: Function,
  },
  emits: ["update-rank", "handle-click", "close-card"],
  data() {
    return {
      userData: null,
      loading: true,
      userId: null,
      users: [],
      currentUser: null,
    };
  },
  mounted() {
    const auth = getAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userId = user.uid;

        // 🔁 Real-time foydalanuvchi ma'lumotlari
        this.unsubscribeUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
          if (docSnap.exists()) {
            this.userData = docSnap.data();
            this.loading = false; // ⬅️ Faqat data kelsa loading tugaydi
          }
        });

        // 🔁 Real-time reyting
        const q = query(collection(db, "users"), orderBy("clicks", "desc"));
        this.unsubscribeRanking = onSnapshot(q, (querySnapshot) => {
          const allUsers = [];
          querySnapshot.forEach((doc) => {
            allUsers.push({ id: doc.id });
          });

          const index = allUsers.findIndex(u => u.id === this.userId);
          this.$emit("update:ranking", index + 1);
        });
      }

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


    // Realtime user list
    onSnapshot(collection(db, 'users'), snapshot => {
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      this.users = userList;
    });


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


  beforeDestroy() {
    if (this.unsubscribeUser) this.unsubscribeUser();
    if (this.unsubscribeRanking) this.unsubscribeRanking();
  }
};


</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Poppins:wght@400;600&display=swap');

.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #0d1117;
  font-family: 'Poppins', sans-serif;
  padding: 10px;
}

.profile-card {
  display: flex;
  align-items: center;
  background: #161b22;
  border-radius: 16px;
  padding: 30px;
  width: 700px;
  box-shadow: 0 0 20px rgba(0, 255, 200, 0.15);
  border: 1px solid #30363d;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}


.avatar-section {
  flex: 0 0 auto;
  margin-right: 30px;
}

.profile-img {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #00ffc8;
  box-shadow: 0 0 15px rgba(0, 255, 200, 0.5);
}

.info-section {
  flex: 1;
  color: #c9d1d9;
}

.profile-name {
  font-size: 28px;
  font-family: 'Orbitron', sans-serif;
  color: #00ffc8;
  margin-bottom: 8px;
}

.profile-email,
.profile-gender {
  font-size: 14px;
  color: #8b949e;
  margin-bottom: 8px;
}

.stats {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.stat-box {
  flex: 1;
  background: #21262d;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  color: #fff;
  border: 1px solid #30363d;
  transition: background 0.3s ease;
}

.stat-box:hover {
  background: #30363d;
}

.stat-box-icon {
  height: 16px;
}

.stat-box-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  color: #8b949e;
  margin-bottom: 6px;
}

.stat-box strong {
  font-size: 18px;
  color: #00ffc8;
}

/* Profil umumiy stil */
.profile {
  padding: 20px;
  max-width: 800px;
  margin: auto;
}

/* Kichik ekranlar uchun */
@media (max-width: 600px) {
  .profile {
    padding: 10px;
    font-size: 14px;
  }

  .profile img {
    width: 100px;
    height: 100px;
  }

  .profile .info {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 1300px) {
  .profile-card{
    transform: translateX(50px);
  }
}
@media (max-width: 1200px) {
  .profile-card{
    transform: translateX(100px);
  }
}
@media (max-width: 1101px) {
  .profile-card{
    flex-direction: column;
    width: 500px;
  }

  .profile-img{
    transform: translateX(14px);
  }

  .profile-name,
  .profile-email,
  .profile-gender{
    text-align: center;
  }

}
@media (max-width: 1001px) {
  .profile-card{
    transform: translateX(0px);
  }

}
@media (max-width: 650px) {
  .profile-card{
    transform: translateX(0px);
  }

  .profile-name{
    font-size: 25px;
  }

  .profile-img{
    width: 100px;
    height: 100px;
  }

}

@media (max-width: 420px) {
  .stat-box{
    padding: 10px;
  }

  .profile-card{
    transform: scale(0.85);
  }
}
</style>