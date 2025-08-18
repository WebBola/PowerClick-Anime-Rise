  <template>
    <div v-if="lvl">

      <div class="">
        <h1 class="count">{{ formattedCount }}</h1>
      </div>
      <div v-if="windowth" class="xpLine">
        <h1 class="lvl">Lvl: <span>{{ lvl }}</span></h1>
        <div class="xp-bar">
          <div class="xp-fill" :style="{ width: (xp / xpToLevelUp * 100) + '%' }"></div>
        </div>
        <h1 class="xpAndUp">{{ formattedXp }}/{{ formattedXpToLevelUp }}</h1>
      </div>
      <div v-if="windowthsmll" class="xpLine">
        <div class="xp-bar">
          <div class="xp-fill" :style="{ width: (xp / xpToLevelUp * 100) + '%' }"></div>
        </div>
        <div class="lvl-info">
          <h1 class="lvl">Lvl: <span>{{ lvl }}</span></h1>
          <h1 class="xpAndUp">{{ formattedXp }}/{{ formattedXpToLevelUp }}</h1>
        </div>
      </div>
      <div v-if="showLevelUpEffect" class="overlay">
        <div class="card">
          <h2>Tabriklaymiz!</h2>
          <p>Siz <span class="gold">{{ lvl }}-lvl</span> ga o‘tdingiz </p>
          <button class="btn" @click="closeCard">Davom etish</button>
        </div>
      </div>


      <button :style="buttonStyle" class="button-click" @mousedown="mouseEvent" @click="handleClick">
        <img :src="lvl ? imgUrl : '/image/default-avatar.jfif'" alt="" />
      </button>

      <h1 class="name">{{ PersonName }}</h1>
    </div>

  </template>

<script>
export default {
  name: 'Game',
  emits: ['handleClick',],
  props: {
    statusBtn: Array,
    xp: Number,
    PersonName: String,
    count: Number,
    imgUrl: String,
    xpToLevelUp: Number,
    showLevelUpEffect: Boolean,
    lvl: Number,
    formattedCount: String,
    formattedXpToLevelUp: String,
    formattedXp: String,
    tap_value: Number,
  },

  data() {
    return {
      xPos: 0,
      yPos: 0,
      windowth: window.innerWidth >= 500,
      windowthsmll: window.innerWidth <= 500,
    }
  },
  computed: {
    buttonStyle() {
      const color = this.statusBtn[this.lvl - 1]?.shadow || '#ffff8c'
      return {
        boxShadow: `0px 15px 50px 10px ${color}60`,
        transition: 'box-shadow 0.5s ease-in-out'
      }
    }
  },

  mounted() {
    window.addEventListener("resize", this.checkScreen)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreen)
  },

  methods: {

    checkScreen() {
      this.windowth = window.innerWidth > 500
      this.windowthsmll = window.innerWidth <= 500

    },

    closeCard() {
      this.$emit('closeCard')
    },

    handleClick() {
      this.$emit('handleClick')
    },
    mouseEvent(event) {
      const xPos = event.offsetX;
      const yPos = event.offsetY;

      const num_item = document.createElement('span');
      num_item.classList.add('num_item');
      num_item.innerHTML = `+${this.tap_value}`;

      event.currentTarget.append(num_item);

      num_item.style.position = 'absolute';
      num_item.style.left = `${xPos - num_item.clientWidth / 2}px`;
      num_item.style.top = `${yPos - num_item.clientHeight / 2}px`;
      num_item.style.color = '#fff';
      num_item.style.fontSize = '23px';
      if (window.innerWidth <= 500) {
        num_item.style.fontSize = '18px';

      }
      num_item.style.fontFamily = "'Press Start 2P', cursive";

      num_item.animate([
        { transform: 'translateY(0px)', opacity: 1 },
        { transform: 'translateY(-350px)', opacity: 0 }
      ], {
        duration: 2000,
        easing: 'ease-out',
        fill: 'forwards'
      });

      setTimeout(() => {
        num_item.remove();
      }, 2500);
    }



  }
}
</script>

<style scoped>
.lvl-info {
  display: flex;
  justify-content: space-between;
}

.button-click {
  position: relative;
  cursor: pointer;
  display: flex;
  margin: 0 auto;
  margin-top: 50px;
  max-width: 360px;
  width: 100%;
  height: 360px;
  border-radius: 50%;
  /* overflow: hidden; */
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  transition: 0.3s;
}

.button-click img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.button-click:active {
  transform: scale(0.99);
}

.count,
.name {
  text-align: center;
  color: whitesmoke;
  font-family: 'Orbitron', sans-serif;
}

.count {
  padding-top: 10px;
}

.name {
  margin-top: 20px;
}

.xp-bar {
  position: relative;
  max-width: 900px;
  width: 100%;
  height: 20px;
  background: #444;
  border-radius: 10px;
  margin: 0 auto 10px;
  overflow: hidden;
}

.xpLine {
  max-width: 700px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 10px;
}

.xpAndUp {
  text-align: left;
  width: 200px;
  height: 25px;
  font-size: 18px;
  color: whitesmoke;
  font-family: 'Orbitron', sans-serif;
  margin: 0 5px 10px;
}

.lvl {
  text-align: right;
  width: 200px;
  height: 25px;
  font-size: 18px;
  color: whitesmoke;
  font-family: 'Orbitron', sans-serif;
  margin: 0 5px 10px;
}

.lvl span {
  font-family: 'Press Start 2P', cursive;
  font-size: 15px;
}

.lvlupBox {
  display: block;
  height: 20px;
}

.xp-fill {
  position: absolute;
  height: 100%;
  background: linear-gradient(to right, #ff9800, #ffc107);
  transition: width 0.3s ease;
}



.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* Card */
.card {
  background: #111;
  color: #fff;
  border-radius: 16px;
  padding: 30px 40px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: pop 0.4s ease;
  font-family: sans-serif;
}

/* Gold matn */
.gold {
  color: gold;
  font-weight: bold;
}

/* Button */
.btn {
  margin-top: 20px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  background: linear-gradient(90deg, #ff9800, #ffc107);
  color: #111;
  font-weight: bold;
  transition: 0.3s;
}

.btn:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

@keyframes pop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.num_item {
  position: absolute;
  pointer-events: none;
  user-select: none;
  font-weight: bold;
}

@media (max-width: 1300px) {

  .count,
  .xpLine,
  .button-click,
  .name {
    transform: translateX(50px);
  }

  .button-click:active {
    transform: translateX(50px) scale(0.99);
  }
}

@media (max-width: 1200px) {

  .count,
  .xpLine,
  .button-click,
  .name {
    transform: translateX(50px);
  }

   .button-click:active {
    transform: translateX(50px) scale(0.99);
  }
}

@media (max-width: 1100px) {

  .count,
  .xpLine,
  .button-click,
  .name {
    transform: translateX(100px);
  }

   .button-click:active {
    transform: translateX(100px) scale(0.99);
  }
}

@media (max-width: 1000px) {

  .count,
  .xpLine,
  .button-click,
  .name {
    transform: translateX(0px);
  }

   .button-click:active {
    transform: translateX(0px) scale(0.99);
  }
}

@media (max-width: 800px) {
  .lvl {
    font-size: 17px;
  }

  /* .xpLine {
    width: 500px;
  } */

  .xp-bar {
    height: 15px;
    margin-top: -10px;
  }
}

@media (max-width: 768px) {
  .alert-box {
    font-size: 14px;
    padding: 12px 20px;
  }

  .count {
    margin-top: 22px;
  }

}

@media (max-width: 650px) {
  /* .xp-bar {
    width: 200px;
    height: 10px;
  } */

  .button-click {
    width: 280px;
    height: 280px;
  }

  .name {
    font-size: 22px;
  }
}

@media (max-width: 500px) {

  .lvl,
  .xpAndUp {
    font-size: 12px;
    padding: 0 5px 0;
  }

  .xpLine {
    display: flex;
    flex-direction: column;
  }

  .num_item {
    font-size: 12px;
  }

  .count {
    font-size: 28px;
    padding-bottom: 15px;
  }

  .xp-bar {
    margin-top: -10px;
    width: 95%;
  }

}

@media (max-width: 480px) {
  .alert-box {
    font-size: 13px;
    padding: 10px 16px;
    border-radius: 6px;
  }
}
</style>
