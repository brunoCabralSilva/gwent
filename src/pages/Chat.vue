<template>
  <div>
    Olá mundo!
    <div v-for="(message, index) in messages" :key="index">
      {{ message.text }}
    </div>
    <input type="text" v-model="newMessage" @keydown.enter="sendMessage">
    <button @click="sendMessage">Enviar</button>
  </div>
</template>

<script>
  import { initializeApp } from "firebase/app";
  import { getFirestore, updateDoc, getDoc, doc } from "firebase/firestore";
  import { useRouter } from 'vue-router';

  const firebaseConfig = {
    apiKey: "AIzaSyDRSHgIyIgCLlgvMPHmoet_DU8UFRVYHeI",
    authDomain: "gwent-b5e5c.firebaseapp.com",
    projectId: "gwent-b5e5c",
    storageBucket: "gwent-b5e5c.appspot.com",
    messagingSenderId: "340071048057",
    appId: "1:340071048057:web:7eea38e2bd3955807dc5a8"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);

  export default {
    name: 'ChatPage',
    data() {
      return {
        messages: [],
        newMessage: '',
        sysId: '',
      }
    },
    async created() {
      const router = useRouter();
      this.chatId = router.currentRoute.value.params.id;

      if (!this.chatId) {
        console.error("ID do chat não fornecido!");
        return;
      }
      const chatDocRef = doc(db, 'chats', this.chatId);
      const chatDocSnapshot = await getDoc(chatDocRef);
      if (chatDocSnapshot.exists()) {
        const chatData = chatDocSnapshot.data();
        const messages = chatData;
        console.log(messages);
      }
    },
    methods: {
      async sendMessage() {
        if (this.newMessage.trim() === '') return;
        const chatDocRef = doc(db, 'chats', this.chatId);
        const chatDocSnapshot = await getDoc(chatDocRef);
        await updateDoc(chatDocRef, {
          messages: [
            ...(chatDocSnapshot.data().messages || []),
            { text: this.newMessage, timestamp: new Date() }
          ]
        });
        this.newMessage = '';
      }
    }
  }
</script>

<style scoped>
</style>
