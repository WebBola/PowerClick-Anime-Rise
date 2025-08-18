<template>
  <div v-if="visible" class="alert-box">
    {{ message }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: "",
      visible: false
    };
  },
  methods: {
    show(msg) {
      this.message = msg;
      this.visible = true;
      setTimeout(() => {
        this.visible = false;
      }, 3000);
    }
  }
};
</script>

<style scoped>
.alert-box {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #2f363d;
  color: #ffffff;
  padding: 14px 28px;
  border-radius: 8px;
  font-family: 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  animation: slideDown 0.4s ease;
  max-width: 90%;
  text-align: center;
}

/* Slide down animation */
@keyframes slideDown {
  from {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

/* RESPONSIVE MEDIA */
@media (max-width: 768px) {
  .alert-box {
    font-size: 14px;
    padding: 12px 20px;
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
