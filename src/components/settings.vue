<template>
  <div class="settings">
    <div class="title">
      <img class="ul__icon" src="/icons/settings.png" alt="">
      <h1><span>Sozlamalar</span></h1>
    </div>

    <div class="setting-item disabled">
      <div class="iconTitle "><img src="/icons/moon.png" alt=""><span>Qora rejim</span></div>
      <label class="switch">
        <input type="checkbox" v-model="darkMode" @change="saveSettings" />
        <span class="slider"></span>
      </label>
    </div>

    <div class="setting-item">
      <div class="iconTitle"><img src="/icons/volume.png" alt=""><span>Tovush</span></div>
      <label class="switch">
        <input type="checkbox" v-model="sound" @change="saveSettings" />
        <span class="slider"></span>
      </label>
    </div>

    <div class="setting-item disabled">
      <label for="language" class="label">🌐 Til:</label>
      <div class="custom-select-wrapper">
        <select id="language" v-model="selectedLanguage" @change="changeLanguage" class="custom-select">
          <option v-for="locale in availableLocales" :key="`locale-${locale}`" :value="locale">
            {{ locale }}
          </option>
        </select>
      </div>
    </div>

    <div class="setting-item logout">
      <div class="iconTitle"><img src="/icons/logout.png" alt=""><span>Chiqish</span></div>
      <button @click="logout = true">Log out</button>
    </div>
  </div>

  <!-- Logout Modal -->
  <div v-if="logout" id="logoutModal" class="modal">
    <div class="modal-content">
      <h3>Haqiqatan ham chiqmoqchimisiz?</h3>
      <div class="modal-buttons">
        <button @click="logoutUser" id="confirmLogout">Ha</button>
        <button @click="logout = false" id="cancelLogout">Yo'q</button>
      </div>
    </div>
  </div>

</template>

<script>
import { auth } from "../firebase";


export default {
  name: "Settings",
  data() {
    return {
      darkMode: true,
      sound: true,
      vibration: true,
      selectedLanguage: this.$i18n.locale,
      logout: false
    };
  },
  computed: {
    availableLocales() {
      return this.$i18n.availableLocales;
    }
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem("settings"));
    if (saved) {
      this.darkMode = saved.darkMode;
      this.sound = saved.sound;
      this.vibration = saved.vibration;
    }
  },
  methods: {
    saveSettings() {
      localStorage.setItem(
        "settings",
        JSON.stringify({
          darkMode: this.darkMode,
          sound: this.sound,
          vibration: this.vibration
        })
      );
    },
    async logoutUser() {
      try {
        await auth.signOut();
        localStorage.removeItem('user')
        this.$router.push("/");
      } catch (error) {
        alert(error.message);
      }
    },
    changeLanguage() {
      this.$i18n.locale = this.selectedLanguage;
      console.log("Til o'zgardi:", this.selectedLanguage);
    }
  }
};
</script>

<style scoped>
/* Siz yuborgan CSS o‘zgarishsiz qoldi */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.settings {
  font-family: 'Poppins', sans-serif;
  color: white;
  padding: 2rem;
  max-width: 500px;
  margin: auto;
}

.label {
  width: 100px;
}

.title {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 10px;
}

.iconTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.iconTitle img {
  height: 23px;
}

h1 {
  font-size: 2rem;
  color: #ffeb3b;
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-item {
  background: #1f1f1f;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.logout button {
  background: #f44336;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.logout button:hover {
  background: #d32f2f;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  background-color: #ccc;
  border-radius: 34px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.4s;
}

.slider::before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}

input:checked+.slider {
  background-color: #ffb300;
}

input:checked+.slider::before {
  transform: translateX(22px);
}

.ul__icon {
  height: 33px;
}

.label {
  font-size: 18px;
  margin-right: 15px;
}

.custom-select-wrapper {
  position: relative;
  width: 200px;
}

.custom-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  padding: 10px 40px 10px 15px;
  background-color: #1e1e2f;
  color: #fff;
  border: 1px solid #555;
  border-radius: 12px;
  font-size: 16px;
  font-family: 'Orbitron';
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 140'%3E%3Cpolygon fill='%23ffffff' points='70,90 20,40 120,40 '/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 15px;
  outline: none;
}

/* Orqa fon xiralashishi */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

/* Modal oyna */
.modal-content {
  background: #1e1e1e;
  padding: 25px 30px;
  border-radius: 12px;
  text-align: center;
  width: 320px;
  color: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  animation: scaleUp 0.25s ease;
}

/* Sarlavha */
.modal-content h3 {
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: sans-serif;
}

/* Tugma konteyneri */
.modal-buttons {
  display: flex;
  justify-content: space-around;
  gap: 15px;
}

/* Tugmalar */
.modal-buttons button {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s ease;
}

/* "Ha" tugmasi */
#confirmLogout {
  background: #e53935;
  color: white;
}

#confirmLogout:hover {
  background: #c62828;
}

/* "Yo‘q" tugmasi */
#cancelLogout {
  background: #444;
  color: white;
}

#cancelLogout:hover {
  background: #555;
}

/* Animatsiyalar */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes scaleUp {
  from {
    transform: scale(0.8);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
  filter: grayscale(50%);
}

@media (max-width: 1200px) {
  .settings {
    transform: translateX(100px);
  }
}

@media (max-width: 1000px) {
  .settings {
    transform: translateX(0px);
  }
}

@media (max-width: 600px) {
  .title {
    display: flex;
    margin: 30px 0px 20px 10%;
  }
}

@media (max-width: 380px) {
  .setting-item {
    padding: 15px;
    font-size: 15px;
  }

  h1 {
    font-size: 25px;
  }

  .ul__icon {
    height: 25px;
  }

  .iconTitle img {
    height: 20px;
  }

  .custom-select {
    width: 100px;
    float: right;

  }

  .switch {
    width: 40px;
    height: 23px;
  }

  .slider::before {
    height: 15px;
    width: 15px;
  }

  input:checked+.slider::before {
  transform: translateX(18px);
}
}
</style>
