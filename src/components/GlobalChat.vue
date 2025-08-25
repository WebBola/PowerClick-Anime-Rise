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
              <span class="name">{{ m.displayName || 'Player' }}</span>
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
// Vue 2 + Firebase v9 modular
import { auth, db } from '@/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';

export default {
  name: 'GlobalChat',
  data() {
    return {
      messages: [],
      draft: '',
      sending: false,
      lastSentAt: 0,
      onlineCount: 0,
    };
  },
  computed: {
    currentUser() {
      return auth.currentUser || null;
    },
    currentUid() {
      return this.currentUser ? this.currentUser.uid : null;
    },
    canSend() {
      return this.draft.trim().length > 0 && !!this.currentUid;
    },
    onlineTitle() {
      return 'Approximate number of active users in the last 2 minutes';
    }
  },
  mounted() {
    const q = query(
      collection(db, 'globalMessages'),
      orderBy('createdAt', 'asc'),
      limit(200)
    );

    this.unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((doc) => {
        const d = doc.data();
        arr.push({
          id: doc.id,
          text: d.text,
          uid: d.uid,
          displayName: d.displayName,
          avatar: d.avatar || null,
          createdAt: d.createdAt && d.createdAt.toDate ? d.createdAt.toDate() : new Date()
        });
      });
      this.messages = arr;
      this.$nextTick(this.scrollToBottom);

      const twoMinAgo = Date.now() - 120000;
      const active = new Set(
        arr
          .filter(m => m.createdAt.getTime() >= twoMinAgo)
          .map(m => m.uid)
      );
      this.onlineCount = active.size;
    });
  },
  beforeDestroy() {
    if (this.unsub) this.unsub();
  },
  methods: {
    async send() {
      if (!this.canSend || this.sending) return;

      const nowMs = Date.now();
      if (nowMs - this.lastSentAt < 2000) return;

      const text = this.draft.trim().replace(/\s+/g, ' ').slice(0, 500);
      if (!text) return;

      const user = this.currentUser;
      if (!user) {
        alert('Please sign in to chat.');
        return;
      }

      this.sending = true;
      try {
        const msg = {
          text,
          uid: user.uid,
          displayName: user.displayName || 'Player',
          avatar: user.photoURL || null,
          createdAt: serverTimestamp()
        };

        // 1) global chatga yozish
        await addDoc(collection(db, 'globalMessages'), msg);

        // 2) userning shaxsiy messages kolleksiyasiga yozish
        await addDoc(collection(db, 'users', user.uid, 'messages'), msg);

        this.draft = '';
        this.lastSentAt = nowMs;
        this.$nextTick(this.scrollToBottom);
      } catch (e) {
        console.error('send error', e);
      } finally {
        this.sending = false;
      }
    },
    scrollToBottom() {
      const el = this.$refs.list;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    },
    formatTime(d) {
      try {
        const date = d instanceof Date ? d : new Date(d);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } catch {
        return '';
      }
    }
  }
};
</script>


<style scoped>
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
}

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

.messages {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
}

.df{
  display: flex;
}


.msg {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 8px;
  align-items: start;
}

.msg.mine {
  grid-template-columns: 1fr 36px;
}

.msg.mine .avatar {
  order: 2;
}

.msg.mine .bubble {
  order: 1;
  background: #1b2430;
  border: 1px dashed #8b5cf6;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #202636;
}

.bubble {
  background: #141823;
  border: 1px solid #202636;
  border-radius: 14px;
  padding: 8px 10px;
}

.meta {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: #aab2c5;
  margin-bottom: 2px;
}

.name {
  font-weight: 600;
  color: #e6e9f2;
}

.time {
  opacity: .8;
}

.text {
  white-space: pre-wrap;
  word-break: break-word;
  color: #e6eaf3;
  font-size: 14px;
}

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
}

.input-bar input:focus {
  border-color: #8b5cf6;
}

.input-bar button {
  padding: 10px 14px;
  background: #8b5cf6;
  color: #0e0f13;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.input-bar button[disabled] {
  opacity: .6;
  cursor: not-allowed;
}

.w250 {
  float: left;
  display: block;
  width: 330px;
}


@media (max-width: 1000px) {
  .w250{
    display: none;
  }

  .chat-wrap{
    padding-top: 50px;
  }

  .title{
    padding-left: 60px;
  }
}
</style>
