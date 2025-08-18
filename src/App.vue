  <template>
    <div class="layout" @click="startMusict">
      <Navigation />
      <main class="main-content">
        <router-view @update-rank="rank = $event" @handleClick="handleClick" :statusBtn="statusBtn" :xp="xp"
          :count="count" :PersonName="PersonName" :imgUrl="imgUrl" :xpToLevelUp="xpToLevelUp"
          :showLevelUpEffect="showLevelUpEffect" @closeCard="closeCard" :tap_value="tap_value" :lvl="lvl"
          :formattedXp="formattedXp" :formattedXpToLevelUp="formattedXpToLevelUp" :formattedCount="formattedCount"
          :formatNumber="formatNumber" :ranking="rank" />
      </main>
    </div>
    <div v-if="loading" class="loader-overlay">
      <div class="loader"></div>
    </div>
  </template>
<script>
import ClickButton from './components/Game.vue';
import Navigation from './components/navigation.vue';
import Profile from './components/profile.vue';
import { useI18n } from 'vue-i18n';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: 'App',
  components: {
    ClickButton,
    Navigation,
    Profile,
  },
  data() {
    return {
      count: 0,
      tap_value: 1,
      lvl: null,
      xp: 0,
      xpToLevelUp: 1000,
      showLevelUpEffect: false,
      rank: null,
      userId: null,
      loading: true,
      saveTimeout: null,
      isOnline: navigator.onLine,
      bgMusic: null,
      statusBtn: [
        { name: 'Takemichi', img: '/image/takemichi.jpg', shadow: '#ffeb3b' },
        { name: 'Chifuyu', img: '/image/chifuyu.jpg', shadow: '#90caf9' },
        { name: 'Kazutora', img: '/image/kazutora.jpg', shadow: '#fdd835' },
        { name: 'Nobara', img: '/image/nobara.jpg', shadow: '#f48fb1' },
        { name: 'Sakura', img: '/image/sakura.jpg', shadow: '#ec407a' },
        { name: 'Baji', img: '/image/baji.jpg', shadow: '#fbc02d' },
        { name: 'Megumi', img: '/image/megumi.jpg', shadow: '#1e88e5' },
        { name: 'Inosuke', img: '/image/inosuke.jpg', shadow: '#4fc3f7' },
        { name: 'Draken', img: '/image/draken.jpg', shadow: '#ba68c8' },
        { name: 'Zenitsu', img: '/image/zenitsu.jpg', shadow: '#fff176' },
        { name: 'Mikey', img: '/image/mikey.jpg', shadow: '#ffd54f' },
        { name: 'Nezuko', img: '/image/nezuko.jpg', shadow: '#f06292' },
        { name: 'Tanjiro', img: '/image/tanjiro.jpg', shadow: '#81c784' },
        { name: 'Hanma', img: '/image/hanma.jpg', shadow: '#ff7043' },
        { name: 'Yuji', img: '/image/yuji.jpg', shadow: '#f8bbd0' },
        { name: 'Kakashi', img: '/image/kakashi.jpg', shadow: '#90a4ae' },
        { name: 'Taiju', img: '/image/taiju.jpg', shadow: '#b0bec5' },
        { name: 'Kakucho', img: '/image/kakucho.jpg', shadow: '#a1887f' },
        { name: 'Itachi', img: '/image/itachi.jpg', shadow: '#d32f2f' },
        { name: 'Giyu', img: '/image/giyu.jpg', shadow: '#1976d2' },
        { name: 'Izana', img: '/image/izana.jpg', shadow: '#ce93d8' },
        { name: 'Sasuke', img: '/image/sasuke.jpg', shadow: '#651fff' },
        { name: 'Gojo', img: '/image/gojo.jpg', shadow: '#80deea' },
        { name: 'Sukuna', img: '/image/sukuna.jpg', shadow: '#ef5350' },
        { name: 'Naruto', img: '/image/naruto.jpg', shadow: '#90caf9' }
      ]
    }
  },
  computed: {
    imgUrl() {
      return this.statusBtn[this.lvl - 1]?.img || ''
    },
    PersonName() {
      return this.statusBtn[this.lvl - 1]?.name || ''
    },
    buttonStyle() {
      const color = this.statusBtn[this.lvl - 1]?.shadow || '#ffff8c'
      return {
        boxShadow: `0px 15px 50px 10px ${color}60`,
        transition: 'box-shadow 0.5s ease-in-out'
      }
    },

    formattedCount() {
      return this.formatNumber(this.count);
    },

    formattedXp() {
      return this.formatNumber(this.xp);
    },

    formattedXpToLevelUp() {
      return this.formatNumber(this.xpToLevelUp);
    },


  },

  async mounted() {
    const localeUserData = localStorage.getItem("user");
    if (localeUserData) {
      this.$router.push("/game");
    }

    //this.bgMusic = new Audio("/bg-music.m4a");
    //this.bgMusic.loop = true;
    //this.bgMusic.volume = 0.5;

    // this.bgMusic.play().catch(() => {
    //   document.addEventListener("click", this.startMusic, { once: true });
    // });

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);

        // 🔥 Real-time listener
        onSnapshot(userRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            this.count = data.clicks || 0;
            this.xp = data.xp || 0;
            this.lvl = data.lvl || 0;
            this.xpToLevelUp = data.xpToLevelUp || 0;
            this.tap_value = data.tap_value || 0;
          }
          this.loading = false;
        });

        console.log("User ID:", user.uid);
      } else {
        console.log("User login qilmagan");
        this.loading = false
      }
    });

  },
  methods: {

    startMusic() {
      this.bgMusic.play();
    },

    closeCard() {
      this.showLevelUpEffect = false
    },

    formatNumber(num) {
      if (num >= 1e63) { // vigintillion
        return (num / 1e63).toFixed(1).replace(/\.0$/, '') + 'Vig';
      }
      if (num >= 1e60) { // novemdecillion
        return (num / 1e60).toFixed(1).replace(/\.0$/, '') + 'NoD';
      }
      if (num >= 1e57) { // octodecillion
        return (num / 1e57).toFixed(1).replace(/\.0$/, '') + 'OcD';
      }
      if (num >= 1e54) { // septendecillion
        return (num / 1e54).toFixed(1).replace(/\.0$/, '') + 'SeD';
      }
      if (num >= 1e51) { // sexdecillion
        return (num / 1e51).toFixed(1).replace(/\.0$/, '') + 'SxD';
      }
      if (num >= 1e48) { // quindecillion
        return (num / 1e48).toFixed(1).replace(/\.0$/, '') + 'QiD';
      }
      if (num >= 1e45) { // quattuordecillion
        return (num / 1e45).toFixed(1).replace(/\.0$/, '') + 'QtD';
      }
      if (num >= 1e42) { // tredecillion
        return (num / 1e42).toFixed(1).replace(/\.0$/, '') + 'TrD';
      }
      if (num >= 1e39) { // duodecillion
        return (num / 1e39).toFixed(1).replace(/\.0$/, '') + 'DuD';
      }
      if (num >= 1e36) { // undecillion
        return (num / 1e36).toFixed(1).replace(/\.0$/, '') + 'UnD';
      }
      if (num >= 1e33) { // decillion
        return (num / 1e33).toFixed(1).replace(/\.0$/, '') + 'DeD';
      }
      if (num >= 1e30) { // nonillion
        return (num / 1e30).toFixed(1).replace(/\.0$/, '') + 'No';
      }
      if (num >= 1e27) { // octillion
        return (num / 1e27).toFixed(1).replace(/\.0$/, '') + 'Oc';
      }
      if (num >= 1e24) { // septillion
        return (num / 1e24).toFixed(1).replace(/\.0$/, '') + 'Sp';
      }
      if (num >= 1e21) { // sextillion
        return (num / 1e21).toFixed(1).replace(/\.0$/, '') + 'Sx';
      }
      if (num >= 1e18) { // quintillion
        return (num / 1e18).toFixed(1).replace(/\.0$/, '') + 'Qi';
      }
      if (num >= 1e15) { // quadrillion
        return (num / 1e15).toFixed(1).replace(/\.0$/, '') + 'Q';
      }
      if (num >= 1e12) { // trillion
        return (num / 1e12).toFixed(1).replace(/\.0$/, '') + 'T';
      }
      if (num >= 1e9) { // billion
        return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
      }
      if (num >= 1e6) { // million
        return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
      }
      if (num >= 1e4) { // thousand (round no decimal)
        return (num / 1e3).toFixed(0) + 'k';
      }
      return num.toString();
    },



    async handleClick() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);


      // Lokal state
      this.count += this.tap_value;
      this.xp += this.tap_value;

      // Level Up
      if (this.xp >= this.xpToLevelUp && this.lvl < this.statusBtn.length) {
        this.lvl++;
        this.xp = 0;
        this.tap_value = this.tap_value * 2
        this.xpToLevelUp = Math.floor(this.xpToLevelUp * 3);

        this.showLevelUpEffect = true;
      }

      // await updateDoc(userRef, {
      //   clicks: this.count,
      //   lvl: this.lvl,
      //   xp: this.xp,
      //   xpToLevelUp: this.xpToLevelUp
      // });

      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }

      this.saveTimeout = setTimeout(async () => {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          clicks: this.count,
          lvl: this.lvl,
          xp: this.xp,
          xpToLevelUp: this.xpToLevelUp,
          tap_value: this.tap_value
        });
        console.log("Firebase’ga yozildi ✅");
      }, 2000);


    }


  },





}
</script>
<style>
* {
  padding: 0;
  margin: 0;
  text-decoration: none;
  box-sizing: border-box;
  list-style: none;
}

body {
  background: #0d0d0d;
  height: 100vh;
  scrollbar-width: none;
  overflow: hidden;
}

.offline-alert {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #ff4444;
  color: #fff;
  text-align: center;
  padding: 12px;
  font-weight: bold;
  z-index: 9999;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Slide-down animatsiya */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
}

.slide-down-enter {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-down-enter-to {
  transform: translateY(0);
  opacity: 1;
}

.slide-down-leave {
  transform: translateY(0);
  opacity: 1;
}

.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.content {
  margin-top: 60px;
  text-align: center;
}

::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}


button,
div,
.button-click {
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
}

/* .main-content{

} */

.loader-overlay {
  position: fixed;
  inset: 0;
  /* top, right, bottom, left = 0 */
  background-color: rgba(0, 0, 0, 0.4);
  /* qora yarim shaffof */
  backdrop-filter: blur(5px);
  /* orqa fon blur */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  /* hamma narsadan ustida */
}

.loader {
  width: 60px;
  height: 60px;
  border: 6px solid rgba(255, 215, 0, 0.3);
  /* sariq shaffof */
  border-top: 6px solid #FFD700;
  /* sariq qismi */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
