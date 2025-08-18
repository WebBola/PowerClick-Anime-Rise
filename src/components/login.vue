<template>
    <Alert ref="alert" />
    <div class="auth-page">
        <div class="auth-card">
            <h1 class="title">Kirish</h1>

            <form @submit.prevent="loginUser">
                <label>Email</label>
                <input v-model="email" type="email" required maxlength="60" />

                <label>Password</label>
                <div class="password-box">
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" required minlength="6"
                        maxlength="20" />
                    <button type="button" class="toggle-btn" @click="showPassword = !showPassword">
                        <img :src="showPassword ? '/icons/open-eye.png' : '/icons/close-eye.png'" alt=""
                            class="eye-icon">
                    </button>
                </div>

                <button type="submit" class="primary-btn">Kirish</button>
            </form>

            <p class="link-text">
                Akkauntingiz yo‘qmi?
                <router-link to="/register">Ro‘yxatdan o‘ting</router-link>
            </p>
        </div>
    </div>

    <div v-if="loading" class="loader-overlay">
        <div class="loader"></div>
    </div>
</template>

<script>
import Alert from "./alert.vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default {
    components: { Alert },
    data() {
        return {
            email: "",
            password: "",
            loading: false,
            showPassword: false
        };
    },
    methods: {
        async loginUser() {
            try {
                if (this.loading) return;
                this.loading = true;

                const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
                if (!userCredential.user) {
                    // Agar user bo'lmasa
                    this.$refs.alert.show("❌ Akkount topilmadi!");
                    return;
                }

                await setDoc(doc(db, "users", userCredential.user.uid), { lastLogin: new Date() }, { merge: true });
                localStorage.setItem("user", JSON.stringify({
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    username: userCredential.user.username,
                    gender: userCredential.user.gender,
                    lvl: userCredential.user.lvl,
                    clicks: userCredential.user.clicks,
                    ranking: userCredential.user.ranking,
                    createdAt: userCredential.user.createdAt
                }));

                this.$router.push("/profile");

            } catch (error) {
                this.handleAuthError(error);
            } finally {
                console.log(localStorage.getItem("user"));
                this.loading = false;
            }
        },


        // 📌 Xatolarni alert bilan ko‘rsatish
        handleAuthError(error) {
            if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
                this.$refs.alert.show("❌ Email yoki parol noto‘g‘ri!");
            } else if (error.code === "auth/user-not-found") {
                this.$refs.alert.show("❌ Bunday foydalanuvchi topilmadi!");
            } else if (error.code === "auth/invalid-email") {
                this.$refs.alert.show("❌ Email formati noto‘g‘ri!");
            } else {
                this.$refs.alert.show("❌ " + error.message);
            }
        }
    }
};
</script>

<style scoped>
/* Register.vue bilan bir xil style */
.auth-page {
    background-color: #0d0d0d;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.auth-card {
    background-color: #161b22;
    padding: 30px;
    border-radius: 8px;
    width: 320px;
    color: #c9d1d9;
    border: 1px solid #30363d;
}

.password-box {
    position: relative;
}

.password-box input {
    width: 100%;
    padding: 7px 35px 7px 7px;
    /* o‘ng tomonda tugma uchun joy */
}

.toggle-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-17px);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #FFD700;
}


.title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 20px;
    color: #FFD700;
}

label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
}

input {
    width: 100%;
    padding: 7px;
    background-color: #0d0d0d;
    border: 1px solid #30363d;
    border-radius: 6px;
    color: #c9d1d9;
    margin-bottom: 15px;
}

input:focus {
    outline: none;
    border-color: #FFD700;
}

.primary-btn {
    background-color: #FFD700;
    color: #000;
    border: none;
    padding: 7px;
    width: 100%;
    border-radius: 6px;
    cursor: pointer;
}

.primary-btn:hover {
    background-color: #ffea00;
}


.link-text {
    text-align: center;
    font-size: 13px;
    margin-top: 15px;
}

.link-text a {
    color: #FFD700;
    text-decoration: none;
}

.link-text a:hover {
    text-decoration: underline;
}

.eye-icon {
    height: 20px;
}

@media (max-width:350px) {
    .auth-card {
        transform: scale(0.9);
    }
}
</style>
