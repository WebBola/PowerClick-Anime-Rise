<template>
    <div class="admin-contact">
        <h1 class="title"><img src="/icons/phone-chat.png" alt="" class="icon"> Contact Admin</h1>
        <p class="desc">
            Savollaringiz yoki takliflaringiz bo‘lsa, quyidagi usullar orqali bog‘lanishingiz mumkin. Biror xatolik yoki
            muammo yuzaga kelsa ham, men bilan aloqaga chiqing. Sizning fikringiz men uchun juda muhim!
        </p>

        <div class="contact-item" @click="openInstagram">
            <img src="/icons/instagram.png" alt="instagram icon" class="icon" />
            <span>{{ instagram }}</span>
        </div>

        <div class="contact-item" @click="callPhone">
            <img src="/icons/mobile.png" alt="phone icon" class="icon" />
            <span>{{ phone }}</span>
        </div>

        <div v-if="loading" class="loader-overlay">
            <div class="loader"></div>
        </div>
    </div>
</template>

<script>
// Firebase import
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
    name: "AdminContact",
    data() {
        return {
            instagram: "",
            phone: "",
            loading: true,
        };
    },
    async mounted() {
        try {
            const docRef = doc(db, "admin", "contact");
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                this.instagram = snap.data().instagram || "";
                this.phone = snap.data().phone || "";
            } else {
                console.warn("Admin contact ma'lumotlari topilmadi");
            }
        } catch (err) {
            console.error("Firebase o‘qishda xatolik:", err);
        } finally {
            this.loading = false;
        }
    },
    methods: {
        openInstagram() {
            if (this.instagram) {
                window.open(`https://instagram.com/${this.instagram.replace("@", "")}`, "_blank");
            }
        },
        callPhone() {
            if (this.phone) {
                window.location.href = `tel:${this.phone.replace(/\s/g, "")}`;
            }
        },
    },
};
</script>

<style scoped>
.admin-contact {
    background-color: #0d1117;
    color: #c9d1d9;
    padding: 2rem;
    border-radius: 10px;
    max-width: 400px;
    margin: 30px auto;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
    font-family: Arial, sans-serif;
    text-align: center;
}

.title {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
}

.desc {
    font-size: 0.9rem;
    color: #8b949e;
    margin-bottom: 1.5rem;
}

.title .icon {
    margin-right: 0;
}

.contact-item {
    background-color: #161b22;
    padding: 0.8rem 1rem;
    margin: 0.5rem 0;
    border-radius: 6px;
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: background 0.2s ease;
    font-weight: 500;
}

.contact-item:hover {
    background-color: #21262d;
}

.icon {
    height: 30px;
    margin-right: 0.8rem;
}

@media (max-width: 450px) {
    .admin-contact {
        max-width: 300px;
    }

    .title {
        font-size: 23px;
    }

    .desc {
        font-size: 13px;
    }

    .title .icon {
        height: 20px;
        margin-right: 0;
    }
}
</style>
