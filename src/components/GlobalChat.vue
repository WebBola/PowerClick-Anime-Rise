  <template>
    <div class="df">
      <div class="w250"></div>
      <div class="chat-wrap">
        <div class="chat-header">
          <div class="title">Global Chat</div>
          <div class="online" :title="onlineTitle">
            <span class="dot"></span> {{ onlineCount }} online
          </div>
        </div>

        <div class="messages" ref="list">
          <div v-for="m in messages" :key="m.id" class="msg" :class="{ mine: m.uid === currentUid }">
            <img v-if="m.avatar" :src="m.avatar" class="avatar" alt="" />
            <div class="bubble">
              <div class="meta">
                <span class="name">{{ m.username || 'Player' }}</span>
                <span class="time">{{ formatTime(m.createdAt) }}</span>
              </div>
              <div class="text">{{ m.text }}</div>
            </div>
          </div>
        </div>

        <form class="input-bar" @submit.prevent="send">
          <input v-model="draft" type="text" placeholder="Type a message..." maxlength="500"
            @keydown.enter.exact.prevent="send" />
          <button type="submit" :disabled="sending || !canSend">Send</button>
        </form>
      </div>
    </div>
  </template>

  <script>
  import { auth, db } from '@/firebase'
  import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    limit,
    serverTimestamp,
    doc,
    getDoc
  } from 'firebase/firestore'

  export default {
    name: 'GlobalChat',
    data() {
      return {
        messages: [],
        draft: '',
        sending: false,
        lastSentAt: 0,
        onlineCount: 0,
        userProfile: null, // user info saqlash
      }
    },
    computed: {
      currentUser() {
        return auth.currentUser || null
      },
      currentUid() {
        return this.currentUser ? this.currentUser.uid : null
      },
      canSend() {
        return this.draft.trim().length > 0 && !!this.currentUid
      },
      onlineTitle() {
        return 'Approximate number of active users in the last 2 minutes'
      }
    },
    async mounted() {
      // 🔥 user profile-ni olish (username db dan)
      if (this.currentUid) {
        const userDoc = await getDoc(doc(db, 'users', this.currentUid))
        if (userDoc.exists()) {
          this.userProfile = userDoc.data()
        }
      }

      const q = query(
        collection(db, 'globalMessages'),
        orderBy('createdAt', 'asc'),
        limit(200)
      )

      this.unsub = onSnapshot(q, (snap) => {
        const arr = []
        snap.forEach((docu) => {
          const d = docu.data()
          arr.push({
            id: docu.id,
            text: d.text,
            uid: d.uid,
            username: d.username || 'Player',  // ✅ endi boshqa odamlarning ham username'i chiqadi
            avatar: d.avatar || null,
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : new Date()
          })
        })
        this.messages = arr
        this.$nextTick(this.scrollToBottom)

        // Online hisoblash
        const twoMinAgo = Date.now() - 120000
        const active = new Set(
          arr.filter(m => m.createdAt.getTime() >= twoMinAgo).map(m => m.uid)
        )
        this.onlineCount = active.size
      })

    },
    beforeDestroy() {
      if (this.unsub) this.unsub()
    },
    methods: {
      async send() {
        if (!this.canSend || this.sending) return

        const nowMs = Date.now()
        if (nowMs - this.lastSentAt < 2000) return

        const text = this.draft.trim().replace(/\s+/g, ' ').slice(0, 500)
        if (!text) return

        const user = this.currentUser
        if (!user) {
          alert('Please sign in to chat.')
          return
        }

        this.sending = true
        try {
          const msg = {
            text,
            uid: user.uid,
            username: this.userProfile?.username || user.displayName || 'Player', // ✅ username saqlanadi
            avatar: user.photoURL || null,
            createdAt: serverTimestamp()
          }

          // 🔥 Global chat
          await addDoc(collection(db, 'globalMessages'), msg)

          // 🔥 Foydalanuvchining shaxsiy xabarlari
          await addDoc(collection(db, 'users', user.uid, 'messages'), msg)

          this.draft = ''
          this.lastSentAt = nowMs
          this.$nextTick(this.scrollToBottom)
        } catch (e) {
          console.error('send error', e)
        } finally {
          this.sending = false
        }
      },

      scrollToBottom() {
        const el = this.$refs.list
        if (!el) return
        el.scrollTop = el.scrollHeight
      },
      formatTime(d) {
        try {
          const date = d instanceof Date ? d : new Date(d)
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } catch {
          return ''
        }
      }
    }
  }
  </script>
  <style scoped>
  /* 🔥 Chat umumiy */
.chat-wrap {
  max-width: 1250px;
  width: 100%;
  margin: 0 auto;
  float: right;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 12px;
  height: 100vh;
  background: #0e0f13;
  border: 1px solid #1f2430;
  border-radius: 16px;
  padding: 12px;
  overflow: auto;
  font-family: 'Inter', 'Poppins', sans-serif;
}

/* Header */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-weight: 700;
  font-size: 16px;
  color: #eaeef7;
}

.online {
  font-size: 12px;
  color: #aab2c5;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #21c55d;
}

/* Messages */
.messages {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 6px;
}

/* Message wrappers */
.df {
  display: flex;
}

.msg {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 75%;
  animation: fadeInUp 0.25s ease; /* 🔥 animatsiya */
}

.msg.mine {
  margin-left: auto;
  flex-direction: row-reverse;
}

.msg.mine .avatar {
  order: 2;
}

/* Sizniki (mine) bubble – YUMSHOQ violet gradient */
.msg.mine .bubble {
  background: linear-gradient(135deg, #7c3aed, #6d28d9); /* avvalgisiga yaqin, lekin yumshoqroq */
  border: none;
  color: #fff;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 18px;
  border-top-left-radius: 18px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); /* yumshoqroq soyani qildim */
}

/* Boshqalar (not mine) bubble */
.msg:not(.mine) .bubble {
  background: #1a1f2b;
  border: 1px solid #252b39;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 18px;
  border-top-right-radius: 18px;
  color: #e6eaf3;
}

/* Avatar */
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #202636;
  flex-shrink: 0;
}

/* Bubble umumiy */
.bubble {
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  word-break: break-word;
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  animation: bubblePop 0.25s ease forwards; /* 🔥 yozilganda chiqish animatsiyasi */
}

/* Meta */
.meta {
  display: flex;
  gap: 8px;
  font-size: 11px;
  opacity: 0.8;
}

.name {
  font-weight: 600;
  color: #e6e9f2;
}

.time {
  opacity: 0.8;
}

.text {
  white-space: pre-wrap;
  word-break: break-word;
  color: #e6eaf3;
  font-size: 14px;
}

/* Input bar */
.input-bar {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.input-bar input {
  background: #0c0f16;
  color: #e6eaf3;
  border: 1px solid #1f2430;
  border-radius: 12px;
  padding: 10px 12px;
  outline: none;
  font-family: 'Inter', 'Poppins', sans-serif;
}

.input-bar input:focus {
  border-color: #6366f1;
}

/* Send button */
.input-bar button {
  padding: 10px 14px;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
  font-family: 'Inter', 'Poppins', sans-serif;
}

.input-bar button:hover {
  background: #6366f1;
  transform: scale(1.05); /* 🔥 hover animatsiya */
}

.input-bar button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
.w250 {
  float: left;
  display: block;
  width: 330px;
}

@media (max-width: 1000px) {
  .w250 {
    display: none;
  }

  .chat-wrap {
    padding-top: 50px;
  }

  .title {
    padding-left: 60px;
  }
}

/* 🔥 Animatsiyalar */
@keyframes fadeInUp {
  from {opacity: 0; transform: translateY(10px);}
  to {opacity: 1; transform: translateY(0);}
}

@keyframes bubblePop {
  0% {opacity: 0; transform: scale(0.9);}
  100% {opacity: 1; transform: scale(1);}
}

  </style>