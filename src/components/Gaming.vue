<template>
  <div class="match">
    Que comecem os jogos!
  </div>
</template>

<script>
  import { authenticate } from "@/firebase/authenticate";
  import { useRouter } from 'vue-router';
  import { fas } from '@fortawesome/free-solid-svg-icons';
  import { library } from '@fortawesome/fontawesome-svg-core';
  library.add(fas);

  // const firebaseConfig = {
  //   apiKey: "AIzaSyDRSHgIyIgCLlgvMPHmoet_DU8UFRVYHeI",
  //   authDomain: "gwent-b5e5c.firebaseapp.com",
  //   projectId: "gwent-b5e5c",
  //   storageBucket: "gwent-b5e5c.appspot.com",
  //   messagingSenderId: "340071048057",
  //   appId: "1:340071048057:web:7eea38e2bd3955807dc5a8"
  // };

  // const firebaseApp = initializeApp(firebaseConfig);
  // const db = getFirestore(firebaseApp);

  export default {
    name: 'TheGaming',
    data() {
      const router = useRouter();
      return {
        messages: [],
        newMessage: '',
        sysId: '',
        verifyChanges: 0,
        dataChat: {},
        selectedCard: {},
        matchId: router.currentRoute.value.params.id,
        router: router,
        showSelectDeck: false,
        showSelectCards: false,
        showGame: false,
      }
    },
    async beforeCreate() {
      const router = useRouter();
      const auth = await authenticate();
      if (auth) console.log(auth.email);
      else router.push("/login");
    },
    methods: {
    }
  }
</script>

<style scoped>
  .match {
    height: 100vh;
    display: flex;
    color: white;
    font-size: 20px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
