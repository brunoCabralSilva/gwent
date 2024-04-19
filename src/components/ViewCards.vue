<template>
  <div v-if="loading">
    <LoadingPage />
  </div>
  <div v-else class="match-div">
    <div v-if="dataChat.hand" class="list-cards">
      <div
        v-for="(card, index) in sortItems(dataChat.hand)"
        :key="index"
        class="card"
        @click="verifyCard(card)"
        >
        <img
        :src="require(`../assets/cards/${card.image}.png`)"
        :alt="`Carta ${card.name}`"
        />
      </div>
    </div>
    <div class="selected-card">
      <div class="div-start-game-button">
        <button class="start-game-button" @click="startGame">Iniciar Jogo</button>
      </div>
      <p class="explanation-selected-card-1">Escolha uma carta para trocar {{ verifyChanges }}/2</p>
      <p v-if="selectedCard.name" class="explanation-selected-card-2">Clique na carta abaixo para trocá-la por outra do seu Baralho</p>
      <div
        v-if="selectedCard.name"
        :key="index"
        class=""
        >
          <img
            class="selected-card-img"
            :src="require(`../assets/cards/${selectedCard.image}.png`)"
            :alt="`Carta ${selectedCard.name}`"
            @click="changeCard()"
          />
        <div>
          <p class="name-card">{{ selectedCard.name }}</p>
        </div>
        <p class="explanation-selected-card-3">{{ selectedCard.effect }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { authenticate } from "@/firebase/authenticate";
  import { updateCardsOfPlayer, verifyChanges } from "@/firebase/matchs";
  import { initializeApp } from "firebase/app";
  import { getFirestore, getDocs, where, collection, query } from "firebase/firestore";
  import { useRouter } from 'vue-router';
  import { fas } from '@fortawesome/free-solid-svg-icons';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { getUserByEmail } from "@/firebase/user";
  import LoadingPage from './LoadingPage.vue';
  library.add(fas);

  export default {
    name: 'MatchPage',
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
        loading: true,
      }
    },
    async beforeCreate() {
      const router = useRouter();
      const auth = await authenticate();
      if (auth) {
        const verify = await verifyChanges(router.currentRoute.value.params.id, auth.email);
        this.verifyChanges = verify;
      } else router.push("/login");
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
      const usersCollectionRef = collection(db, 'users');
      const q = query(usersCollectionRef, where('email', '==', auth.email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return false;
      else {
        let user;
        querySnapshot.forEach((doc) => {
          user = doc.data();
          user.id = doc.id;
        });
        this.dataChat = user.matchs.find((match) => match.matchId = router.currentRoute.value.params.id);
        this.loading = false;
      }
    },
    components: { LoadingPage },
    methods: {
      verifyCard(card) {
        this.selectedCard = card;
      },
      sortItems(list) {
        return list.sort((a, b) => {
          const tiposEspeciais = ['siege', 'ranged', 'melee', 'melee and ranged'];
          const tipoA = tiposEspeciais.includes(a.typeCard);
          const tipoB = tiposEspeciais.includes(b.typeCard);
          if (tipoA && !tipoB) return 1;
          else if (!tipoA && tipoB) return -1;
          else {
            if (a.power !== b.power) return b.power - a.power;
            else return a.name.localeCompare(b.name);
          }
        });
      },
      async changeCard() {
        const router = useRouter();
        const auth = await authenticate();
        if (auth) {
          const user = await getUserByEmail(auth.email);
          const updatedHand = this.dataChat.hand.filter((card) => card.index !== this.selectedCard.index);
          updatedHand.push(this.dataChat.deck[0]);
          const updatedDeck = this.dataChat.deck.filter((card) => card.index !== this.dataChat.deck[0].index);
          updatedDeck.push(this.selectedCard);
          console.log('VerifyChanges ' + this.verifyChanges);
          const changes = this.verifyChanges + 1;
          console.log('Changes ' + changes);
          this.dataChat.hand = updatedHand;
          this.dataChat.deck = updatedDeck;
          this.verifyChanges = changes;
          this.selectedCard = {};
          await updateCardsOfPlayer({
            changes,
            hand: updatedHand,
            deck: updatedDeck,
            matchId: this.matchId,
            idUser: user.id,
          });
          this.$emit('start-game');
        } else router.push('/login');
      },
      async startGame() {
        const router = useRouter();
        const auth = await authenticate();
        if (auth) {
          const user = await getUserByEmail(auth.email);
          await updateCardsOfPlayer({
            changes: 2,
            hand: this.dataChat.hand,
            deck: this.dataChat.deck,
            matchId: this.matchId,
            idUser: user.id,
          });
          this.$emit('start-game');
        } else router.push('/login');
      },
    }
  }
</script>

<style scoped>
  .div-start-game-button {
    padding: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .start-game-button {
    width: 100%;
    padding: 0.5em;
    font-size: 0.8em;
    font-weight: 800;
    cursor: pointer;
  }

  .explanation-selected-card {
    color: white;
    margin-top: 1em;
    padding: 0 1em;
    font-size: 0.8em;
  }

  .explanation-selected-card-1 {
    color: white;
    margin-top: 1em;
    padding: 0 1em;
    font-size: 0.8em;
    padding-top: 1em;
  }

  .explanation-selected-card-2 {
    margin-bottom: 1em;
    font-size: 0.8em;
    color: white;
    margin-top: 1em;
    padding: 0 1em;
    padding-top: 0.5em;
  }

  .explanation-selected-card-3 {
    margin-bottom: 1em;
    font-size: 0.8em;
    color: white;
    padding: 0.5em 1em 1em 1em;
  }

  .name-card {
    color: white;
    padding: 1em;
  }

  .rotate {
    font-size: 20px;
  }

  .selected-card {
    height: 100%;
    background-color: black;
    width: 35%;
    border-left: 2px solid #007C44;
    overflow-y: auto;
  }

  .list-cards {
    width: 65%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: wrap;
    gap: 20px;
    height: 100%;
  }

  .card {
    width: 18%;
    height: 40vh;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border: 4px solid transparent;
    cursor:pointer;
  }

  .selected-card-img {
    height: 50vh;
  }

  .match-div {
    height: 100vh;
    display: flex;
    flex-direction: row;
  }

  .loader {
    font-size: 10px;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    position: relative;
    text-indent: -9999em;
    animation: mulShdSpin 1.1s infinite ease;
    transform: translateZ(0);
    z-index: 50;
  }

  @keyframes mulShdSpin {
    0%,
    100% {
      box-shadow: 0em -2.6em 0em 0em #ffffff, 1.8em -1.8em 0 0em rgba(255,255,255, 0.2), 2.5em 0em 0 0em rgba(255,255,255, 0.2), 1.75em 1.75em 0 0em rgba(255,255,255, 0.2), 0em 2.5em 0 0em rgba(255,255,255, 0.2), -1.8em 1.8em 0 0em rgba(255,255,255, 0.2), -2.6em 0em 0 0em rgba(255,255,255, 0.5), -1.8em -1.8em 0 0em rgba(255,255,255, 0.7);
    }
    12.5% {
      box-shadow: 0em -2.6em 0em 0em rgba(255,255,255, 0.7), 1.8em -1.8em 0 0em #ffffff, 2.5em 0em 0 0em rgba(255,255,255, 0.2), 1.75em 1.75em 0 0em rgba(255,255,255, 0.2), 0em 2.5em 0 0em rgba(255,255,255, 0.2), -1.8em 1.8em 0 0em rgba(255,255,255, 0.2), -2.6em 0em 0 0em rgba(255,255,255, 0.2), -1.8em -1.8em 0 0em rgba(255,255,255, 0.5);
    }
    25% {
      box-shadow: 0em -2.6em 0em 0em rgba(255,255,255, 0.5), 1.8em -1.8em 0 0em rgba(255,255,255, 0.7), 2.5em 0em 0 0em #ffffff, 1.75em 1.75em 0 0em rgba(255,255,255, 0.2), 0em 2.5em 0 0em rgba(255,255,255, 0.2), -1.8em 1.8em 0 0em rgba(255,255,255, 0.2), -2.6em 0em 0 0em rgba(255,255,255, 0.2), -1.8em -1.8em 0 0em rgba(255,255,255, 0.2);
    }
    37.5% {
      box-shadow: 0em -2.6em 0em 0em rgba(255,255,255, 0.2), 1.8em -1.8em 0 0em rgba(255,255,255, 0.5), 2.5em 0em 0 0em rgba(255,255,255, 0.7), 1.75em 1.75em 0 0em #ffffff, 0em 2.5em 0 0em rgba(255,255,255, 0.2), -1.8em 1.8em 0 0em rgba(255,255,255, 0.2), -2.6em 0em 0 0em rgba(255,255,255, 0.2), -1.8em -1.8em 0 0em rgba(255,255,255, 0.2);
    }
    50% {
      box-shadow: 0em -2.6em 0em 0em rgba(255,255,255, 0.2), 1.8em -1.8em 0 0em rgba(255,255,255, 0.2), 2.5em 0em 0 0em rgba(255,255,255, 0.5), 1.75em 1.75em 0 0em rgba(255,255,255, 0.7), 0em 2.5em 0 0em #ffffff, -1.8em 1.8em 0 0em rgba(255,255,255, 0.2), -2.6em 0em 0 0em rgba(255,255,255, 0.2), -1.8em -1.8em 0 0em rgba(255,255,255, 0.2);
    }
    62.5% {
      box-shadow: 0em -2.6em 0em 0em rgba(255,255,255, 0.2), 1.8em -1.8em 0 0em rgba(255,255,255, 0.2), 2.5em 0em 0 0em rgba(255,255,255, 0.2), 1.75em 1.75em 0 0em rgba(255,255,255, 0.5), 0em 2.5em 0 0em rgba(255,255,255, 0.7), -1.8em 1.8em 0 0em #ffffff, -2.6em 0em 0 0em rgba(255,255,255, 0.2), -1.8em -1.8em 0 0em rgba(255,255,255, 0.2);
    }
    75% {
      box-shadow: 0em -2.6em 0em 0em rgba(255,255,255, 0.2), 1.8em -1.8em 0 0em rgba(255,255,255, 0.2), 2.5em 0em 0 0em rgba(255,255,255, 0.2), 1.75em 1.75em 0 0em rgba(255,255,255, 0.2), 0em 2.5em 0 0em rgba(255,255,255, 0.5), -1.8em 1.8em 0 0em rgba(255,255,255, 0.7), -2.6em 0em 0 0em #ffffff, -1.8em -1.8em 0 0em rgba(255,255,255, 0.2);
    }
    87.5% {
      box-shadow: 0em -2.6em 0em 0em rgba(255,255,255, 0.2), 1.8em -1.8em 0 0em rgba(255,255,255, 0.2), 2.5em 0em 0 0em rgba(255,255,255, 0.2), 1.75em 1.75em 0 0em rgba(255,255,255, 0.2), 0em 2.5em 0 0em rgba(255,255,255, 0.2), -1.8em 1.8em 0 0em rgba(255,255,255, 0.5), -2.6em 0em 0 0em rgba(255,255,255, 0.7), -1.8em -1.8em 0 0em #ffffff;
    }
  }
</style>
