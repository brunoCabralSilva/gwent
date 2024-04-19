<template>
  <Navigation type="match" />
  <div class="match">
    <div v-if="showSelectDeck">
      <ChooseDeck @start-game="verifyExibition" />
    </div>
    <div v-if="showSelectCards">
      <ViewCards @start-game="verifyExibition" />
    </div>
    <div v-if="showGame" class="gaming">
      <TheGaming />
    </div>
  </div>
</template>

<script>
  import Navigation from "@/components/Navigation.vue";
  import { authenticate } from "@/firebase/authenticate";
  import { verifyIfItsInMatch, verifyIfIsPopulated, verifyChanges } from "@/firebase/matchs";
  import { useRouter } from 'vue-router';
  import { fas } from '@fortawesome/free-solid-svg-icons';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import ChooseDeck from "@/components/ChooseDeck.vue";
  import ViewCards from "@/components/ViewCards.vue";
  import TheGaming from "@/components/Gaming.vue";
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
        router: router,
        showSelectDeck: false,
        showSelectCards: false,
        showGame: false,
      }
    },
    components: { Navigation, ChooseDeck, ViewCards, TheGaming },
    async beforeCreate() {
      const router = useRouter();
      const auth = await authenticate();
      if (auth) this.verifyExibition();
      else router.push("/login");
    },
    methods: {
      async verifyExibition() {
        const auth = await authenticate();
        if (auth) {
          const isPopulatedInTheMatch = await verifyIfItsInMatch(this.matchId, auth.email);
          const isPopulatedInTheUser = await verifyIfIsPopulated(this.matchId, auth.email);
          if (isPopulatedInTheMatch) {
            this.showGame = true;
            this.showSelectCards = false;
            this.showSelectDeck = false;
          } else if (!isPopulatedInTheMatch && isPopulatedInTheUser) {
            this.showGame = false;
            this.showSelectCards = true;
            this.showSelectDeck = false;
            await verifyChanges(this.matchId, auth.email);
          } else {
            this.showGame = false;
            this.showSelectCards = false;
            this.showSelectDeck = true;
          }
        } else this.router.push("/login");
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
    }
  }
</script>

<style scoped>
  .gaming {
    width: 100%;
  }

  .div-start-game-button {
    padding: 0 1em;
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

  .change-cards {
    display: flex;
  }

  .selected-card {
    padding-top: 10vh;
    height: 100vh;
    background-color: black;
    width: 35%;
    border-left: 2px solid #007C44;
    overflow-y: auto;
  }

  .list-cards {
    padding-top: 10vh;
    width: 100%;
    display: flex;
    flex-flow: wrap;
    gap: 20px;
    height: 100vh;
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

  .match {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
</style>
