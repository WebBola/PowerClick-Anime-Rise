<template>
    <Alert ref="alert" />
    <div class="auth-page">
        <div class="auth-card">
            <h1 class="title">Ro‘yxatdan o‘tish</h1>

            <form @submit.prevent="registerUser">
                <label>Username</label>
                <input v-model="username" type="text" required @input="validateUsername" minlength="3" maxlength="20"
                    :class="{ 'input-error': usernameError }" />
                <small v-if="usernameError" class="error-msg">{{ usernameError }}</small>

                <label>Jins</label>
                <div class="gender-options">
                    <label>
                        <input type="radio" value="Erkak" v-model="gender" name="gender" required />
                        <span>Erkak</span>
                    </label>
                    <label>
                        <input type="radio" value="Ayol" v-model="gender" name="gender" required />
                        <span>Ayol</span>
                    </label>
                </div>

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

                <button type="submit" class="primary-btn">Ro‘yxatdan o‘tish</button>
            </form>

            <p class="link-text">
                Akkauntingiz bormi?
                <router-link to="/login">Kirish</router-link>
            </p>
        </div>
    </div>

    <div v-if="loading" class="loader-overlay">
        <div class="loader"></div>
    </div>
</template>

<script>
import Alert from "./alert.vue";
import {
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { db, auth } from "../firebase";
import {
    doc,
    setDoc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";

export default {
    components: { Alert },
    data() {
        return {
            username: "",
            usernameError: "",
            gender: "",
            email: "",
            password: "",
            loading: false,
            showPassword: false,
        };
    },
    methods: {
        async isUsernameTaken(username) {
            const q = query(collection(db, "users"), where("username", "==", username));
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        },

        isUsernameValid(username) {
            const regex = /^[a-zA-Z0-9_]{3,20}$/;
            return regex.test(username);
        },

        async validateUsername() {
            const name = this.username.trim().replace(/@/g, "");
            this.username = name.toLocaleLowerCase();

            if (!this.isUsernameValid(name)) {
                this.usernameError =
                    "Username 3–20ta harf, raqam yoki '_' dan iborat bo‘lishi kerak.";
                return;
            }

            const exists = await this.isUsernameTaken(name);
            if (exists) {
                this.usernameError = "Bu username band. Iltimos, boshqasini tanlang.";
            } else {
                this.usernameError = "";
            }
        },

        async registerUser() {
            if (this.loading) return;
            this.loading = true;

            try {
                const username = this.username.trim();

                if (!this.isUsernameValid(username)) {
                    this.$refs.alert.show(
                        "❌ Username noto‘g‘ri formatda!"
                    );
                    this.loading = false;
                    return;
                }

                const exists = await this.isUsernameTaken(username);
                if (exists) {
                    this.$refs.alert.show("❌ Bu username allaqachon olingan.");
                    this.loading = false;
                    return;
                }

                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    this.email,
                    this.password
                );
                const user = userCredential.user;

                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    email: this.email,
                    username: username,
                    gender: this.gender,
                    lvl: 1,
                    xp: 0,
                    clicks: 0,
                    tap_value: 1,
                    xpToLevelUp: 1000,
                    password: this.password,
                    createdAt: new Date(),
                });

                localStorage.setItem('user', JSON.stringify({
                    uid: user.uid,
                    email: this.email,
                    username: username,
                    gender: this.gender,
                    lvl: 1,
                    clicks: 0,
                    ranking: 0,
                    tap_value: 1,
                    createdAt: new Date(),
                }))

                this.$router.push("/profile");
            } catch (error) {
                this.handleAuthError(error);
            } finally {
                this.loading = false;
            }
        },

        handleAuthError(error) {
            if (error.code === "auth/email-already-in-use") {
                this.$refs.alert.show("Bu email allaqachon ro‘yxatdan o‘tgan!");
            } else if (error.code === "auth/invalid-email") {
                this.$refs.alert.show("Email formati noto‘g‘ri!");
            } else {
                this.$refs.alert.show(error.message);
            }
        },

    },
};
</script>

<style scoped>
/* Avvalgi styling qoladi */
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
    margin-bottom: 10px;
}

input:focus {
    outline: none;
    border-color: #FFD700;
}

.input-error {
    border-color: #ff4d4f !important;
}

.primary-btn {
    background-color: #FFD700;
    color: #000;
    border: none;
    padding: 7px;
    width: 100%;
    border-radius: 6px;
    cursor: pointer;
    margin-top: 10px;
}

.primary-btn:hover {
    background-color: #ffea00;
}

.google-btn {
    background-color: transparent;
    color: #FFD700;
    border: 1px solid #FFD700;
    padding: 7px;
    width: 100%;
    border-radius: 6px;
    cursor: pointer;
}

.google-btn:hover {
    background-color: #FFD700;
    color: #000;
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
    transform: translateY(-15px);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #FFD700;
}


.eye-icon {
    height: 20px;
}

.link-text a:hover {
    text-decoration: underline;
}

.gender-options {
    display: flex;
    gap: 20px;
    margin: 10px 0 20px 0;
}

.gender-options label {
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: #1f1f1f;
    padding: 8px 16px;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
    border: 1px solid #30363d;
}

.gender-options input[type="radio"] {
    accent-color: gold;
}

.gender-options label:hover {
    background-color: #292929;
    border-color: gold;
}

.gender-options input[type="radio"]:checked+span {
    color: gold;
    font-weight: bold;
}

.error-msg {
    color: #ff4d4f;
    font-size: 12px;
    margin-bottom: 0px;
}


@media (max-width:350px) {
    .auth-card {
        transform: scale(0.9);
    }
}
</style>
