<template>
    <div v-if="false" class="shop-container">
        <div class="title">
            <img class="ul__icon" src="/icons/shop.png" alt="">
            <h1 class="shop-title">Do'kon</h1>
        </div>
        <div class="item-grid">
            <div v-for="(item, index) in items" :key="index" class="shop-item" :class="{ owned: item.owned }">
                <img :src="item.img" alt="item image" class="item-img" />
                <div class="subtitle">
                    <h3 class="item-name">{{ item.name }}</h3>
                    <div class="tooltip-container">
                        <button @mouseenter="item.show = true" @mouseleave="item.show = false"><img
                                src="/icons/info.png" class="info-icon"></button>
                        <div class="tooltip" v-if="item.show">{{ item.description }}</div>
                    </div>
                </div>
                <p class="item-price">💰 {{ formatNumber(item.price) }}</p>
                <button class="buy-btn" :disabled="item.owned || count < item.price" @click="buyItem(item)">
                    {{ item.owned ? "Sotib olingan" : "Sotib olish" }}
                </button>
            </div>
        </div>
    </div>

    <!-- Coming Soon -->
    <section class="coming-soon">
        <div class="cs-glow"></div>

        <div class="cs-card">
            <span class="cs-pill">🛍️ Do‘kon</span>

            <h1 class="cs-title">
                Tez orada…
                <span class="cs-dots" aria-hidden="true"></span>
            </h1>

            <p class="cs-sub">Yangi shop ustida ishlayapmiz. Takliflar bo'lsa aloqaga chiqing </p>

            <div class="cs-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="Ish jarayoni">
                <span></span>
            </div>

            <div class="cs-badges">
                <span>🎨 Skinlar</span>
                <span>⚡ Booster</span>
                <span>💎 Premium</span>
            </div>

            <router-link :to="{ name: 'Contact' }">
                <button class="cs-btn">Admin bilan bog'lanish</button>
            </router-link>
        </div>

        <ul class="cs-floating" aria-hidden="true">
            <li>⭐</li>
            <li>🪙</li>
            <li>✨</li>
            <li>🎯</li>
        </ul>
    </section>

</template>

<script>
export default {
    props: ['count'],
    data() {
        return {
            items: [
                {
                    name: "Speed x2",
                    price: 100,
                    img: "/image/takemichi.jpg",
                    description: "Bosish tezligini 2 barobarga oshiradi.",
                    owned: false,
                    show: false,
                },
                // {
                //     name: "Auto Clicker",
                //     price: 500,
                //     img: "/image/gojo.jpg",
                //     description: "Avtomatik bosishni yoqadi.",
                //     owned: false,
                //     show: false,
                // },
                // {
                //     name: "XP Booster",
                //     price: 1000,
                //     img: "/image/mikey.jpg",
                //     description: "XP ni ikki baravar tez yig‘asiz.",
                //     owned: false,
                //     show: false,
                // },
                // {
                //     name: "Legend Skin",
                //     price: 5000,
                //     img: "/image/itachi.jpg",
                //     description: "Afsonaviy teri, ko‘rinishingizni o‘zgartiradi.",
                //     owned: false,
                //     show: false,
                // }
            ]
        };
    },
    methods: {
        buyItem(item) {
            if (!item.owned && this.count >= item.price) {
                item.owned = true;
                this.$emit("update-count", this.count - item.price); // parentga xabar
            }
        },
        formatNumber(num) {
            if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
            if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
            return num.toString();
        }
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.shop-container {
    padding: 40px 20px;
    font-family: 'Poppins', sans-serif;
    background: #0d0d0d;
    min-height: 100vh;
    color: #fff;
}

.shop-title {
    text-align: center;
    font-size: 2rem;
    color: #ffd700;
}

.item-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
    max-width: 1000px;
    margin: 0 auto;
    margin-left: 300px;
}

.subtitle {
    display: flex;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.shop-item {
    position: relative;
    background: #1f1f1f;
    border-radius: 15px;
    padding: 15px;
    text-align: center;
    transition: 0.3s;
    border: 1px solid #333;
    z-index: 19;
}

.shop-item.owned {
    opacity: 0.6;
    border-color: #ffd700;
}

.item-img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 10px;
    margin-bottom: 10px;
}

.item-name {
    font-weight: 600;
    margin-bottom: 5px;
}

.item-price {
    color: #a5d6a7;
    font-weight: bold;
    margin-bottom: 10px;
}

.buy-btn {
    background: #ffd700;
    border: none;
    padding: 10px 15px;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
}

.buy-btn:disabled {
    background: #555;
    cursor: not-allowed;
}

.ul__icon {
    height: 33px;
}

.title {
    width: fit-content;
    margin: 0 auto;
    display: flex;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.tooltip-container {
    position: relative;
    display: inline-block;
}

.tooltip {
    position: absolute;
    top: -55px;
    left: -55px;
    width: 100px;
    background: #333;
    color: #fff;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 10px;
    line-height: 1;
    opacity: 0.95;
    white-space: wrap;
    z-index: 9999;
}

.info-icon {
    height: 15px;
    cursor: pointer;
}

.tooltip-container button {
    border: none;
    background: none;
}

@media (max-width: 1001px) {
    .item-grid {
        margin-left: 20px;
    }
}

/* Coming Soon — container */
.coming-soon {
    position: relative;
    height: 100vh;
    display: grid;
    place-items: center;
    padding: 40px 16px;
    overflow: hidden;
    font-family: sans-serif;
    margin-left: 200px;
}

/* Yumshoq neon nur */
.cs-glow {
    position: absolute;
    inset: auto -20% -30% -20%;
    height: 60%;
    background: radial-gradient(60% 60% at 50% 50%, rgba(255, 215, 0, 0.18), rgba(0, 188, 212, 0.12) 40%, transparent 70%);
    filter: blur(40px);
    z-index: 0;
    pointer-events: none;
}

/* Shisha karta */
.cs-card {
    position: relative;
    z-index: 1;
    width: min(640px, 92vw);
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 18px;
    padding: 28px 22px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    text-align: center;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
}

/* Kichik teg */
.cs-pill {
    display: inline-block;
    padding: 6px 12px;
    font-size: 12px;
    border-radius: 999px;
    background: rgba(255, 215, 0, 0.15);
    border: 1px solid rgba(255, 215, 0, 0.35);
    color: #ffd700;
    margin-bottom: 10px;
}

/* Sarlavha gradient + animated dots */
.cs-title {
    font-size: clamp(26px, 4.5vw, 38px);
    margin: 6px 0 8px;
    line-height: 1.15;
    font-weight: 800;
    background: linear-gradient(90deg, #ffd700, #00bcd4);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

.cs-dots::after {
    content: "…";
    display: inline-block;
    width: 1.5ch;
    text-align: left;
    animation: dots 1.4s steps(4, end) infinite;
    color: #ffd700;
}

@keyframes dots {
    0% {
        content: "";
    }

    25% {
        content: ".";
    }

    50% {
        content: "..";
    }

    75% {
        content: "...";
    }
}

/* Qisqa matn */
.cs-sub {
    color: #cfcfcf;
    font-size: clamp(14px, 2.2vw, 16px);
    margin: 0 0 14px;
}

/* Progress — shimmer bar */
.cs-progress {
    position: relative;
    height: 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    overflow: hidden;
    margin: 8px auto 16px;
    width: min(520px, 90%);
}

.cs-progress>span {
    position: absolute;
    inset: 0;
    width: 45%;
    border-radius: inherit;
    background: linear-gradient(90deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.45), rgba(255, 215, 0, 0.15));
    animation: shimmer 1.6s ease-in-out infinite;
}

@keyframes shimmer {
    0% {
        transform: translateX(-60%);
    }

    100% {
        transform: translateX(160%);
    }
}

/* Badge’lar */
.cs-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-bottom: 14px;
}

.cs-badges span {
    font-size: 12px;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(0, 188, 212, 0.12);
    border: 1px solid rgba(0, 188, 212, 0.35);
    color: #9be7f0;
}

/* Tugma (disable holatda ham chiroyli) */
.cs-btn {
    width: 100%;
    max-width: 320px;
    padding: 10px 14px;
    border-radius: 12px;
    border: 1px dashed rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.04);
    color: #e0e0e0;
    cursor: not-allowed;
}

/* Uzoqda suzib yuradigan emoji’lar */
.cs-floating {
    position: absolute;
    inset: 0;
    list-style: none;
    margin: 0;
    padding: 0;
    pointer-events: none;
}

.cs-floating li {
    position: absolute;
    font-size: clamp(16px, 4vw, 26px);
    opacity: 0.12;
    animation: float 7s ease-in-out infinite;
}

.cs-floating li:nth-child(1) {
    top: 10%;
    left: 12%;
    animation-delay: 0s;
}

.cs-floating li:nth-child(2) {
    top: 18%;
    right: 14%;
    animation-delay: .8s;
}

.cs-floating li:nth-child(3) {
    bottom: 12%;
    left: 18%;
    animation-delay: 1.4s;
}

.cs-floating li:nth-child(4) {
    bottom: 8%;
    right: 10%;
    animation-delay: 2s;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0) rotate(0deg);
    }

    50% {
        transform: translateY(-10px) rotate(6deg);
    }
}

/* Responsiv mayin tuzatishlar */
@media (max-width: 600px) {
    .cs-card {
        padding: 22px 16px;
    }

    .cs-badges {
        gap: 6px;
    }
}

@media (max-width: 1000px) {
    .coming-soon {
        margin-left: 0;
    }
}
</style>
