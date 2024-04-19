<template>
  <div class="match-list">
    <div class="data-players">
      <div class="div-card-leader">
        <div class="card-leader">
          <img class="image-background" src="../assets/field icons/field-cards-leader.png" alt="field cards empty">
          <img
            v-if="dataMatchUserInvited && dataMatchUserInvited.leader"
            class="card-leader-img"
            :src="require('../assets/cards/' + dataMatchUserInvited.leader.image + '.png')"
            :alt="dataMatchUserInvited.leader.name"
          >
        </div>
      </div>
      <div class="user-details">
        <div v-if="dataUserInvited.image" class="image-user">
          <img :src="dataUserInvited.image" alt="Image User">
        </div>
        <div>
          <div class="oponent-name-faction">
            <div v-if="dataUserInvited.firstName">{{ capitalizeWords(dataUserInvited.firstName) }}</div>
            <div>Reino</div>
          </div>
          <div class="victories-cards">
            <div class="cards-in-hand">
              <img class="card-icon-image" src="../assets/field icons/cards-white.png" alt="icon cards">
              <span>{{dataMatchUserInvited.hand.length}}</span>
            </div>
            <div>
              <img
                src="../assets/field icons/rubi-victory.png"
                alt="Rubi 1"
                class="rubi"
              >
              <img
                src="../assets/field icons/rubi-victory.png"
                alt="Rubi 1"
                class="rubi"
              >
            </div>
          </div>
        </div>
      </div>
      <div class="field-cards">
        <img class="image-background" src="../assets/field icons/field-cards.png" alt="field cards empty">
        <div class="div-card-field-img">
          <img
            v-for="(card, index) in fieldCards"
            :key="index"
            class="card-field-img-1"
            :src="require('../assets/cards/' + card + '.png')"
            alt="Carta de campo"
          >
        </div>
      </div>
      <div class="user-details">
        <div v-if="dataUserLogged.image" class="image-user">
          <img :src="dataUserLogged.image" alt="Image User">
        </div>
        <div>
          <div class="victories-cards">
            <div class="cards-in-hand">
              <img class="card-icon-image" src="../assets/field icons/cards-white.png" alt="icon cards">
              <span>{{dataMatchUserLogged.hand.length}}</span>
            </div>
            <div>
              <img
                src="../assets/field icons/rubi-victory.png"
                alt="Rubi 1"
                class="rubi"
              >
              <img
                src="../assets/field icons/rubi-victory.png"
                alt="Rubi 1"
                class="rubi"
              >
            </div>
          </div>
          <div class="name-faction">
            <div v-if="dataUserLogged.firstName">{{ capitalizeWords(dataUserLogged.firstName) }}</div>
            <div>Reino</div>
          </div>
        </div>
      </div>
      <div class="div-card-leader">
        <div class="card-leader">
          <img class="image-background" src="../assets/field icons/field-cards-leader.png" alt="field cards empty">
          <img
            v-if="dataMatchUserLogged.leader"
            class="card-leader-img"
            :src="require('../assets/cards/' + dataMatchUserLogged.leader.image + '.png')"
            :alt="dataMatchUserLogged.leader.name"
            @click="selectCard(dataMatchUserLogged.leader)"
          >
        </div>
      </div>
    </div>
    <div class="central-match">
      <div class="oponent-central-match">
        <div class="siege-field-oponent-cards">
          <div class="horn"></div>
          <div class="siege-cards">
            <div v-for="(card, index) in filteredCards(dataMatchUserInvited.field, 'siege')" :key="index">
              <img
                v-if="dataMatchUserLogged.leader"
                class="card-leader-img"
                :src="require('../assets/cards/' + card.image + '.png')"
                :alt="card.name"
              >
            </div>
          </div>
        </div>
        <div class="ranged-field-oponent-cards">
          <div class="horn"></div>
          <div class="ranged-cards">
            <div v-for="(card, index) in filteredCards(dataMatchUserInvited.field, 'ranged')" :key="index">
              <img
                v-if="dataMatchUserLogged.leader"
                class="card-leader-img"
                :src="require('../assets/cards/' + card.image + '.png')"
                :alt="card.name"
              >
            </div>
          </div>
        </div>
        <div class="melee-field-oponent-cards">
          <div class="horn"></div>
          <div class="melee-cards">
            <div v-for="(card, index) in filteredCards(dataMatchUserInvited.field, 'melee')" :key="index">
              <img
                v-if="dataMatchUserLogged.leader"
                class="card-leader-img"
                :src="require('../assets/cards/' + card.image + '.png')"
                :alt="card.name"
              >
            </div>
          </div>
        </div>
      </div>
      <div class="player-central-match">
        <div class="melee-field-cards">
          <div class="horn"></div>
          <div class="melee-cards">
            <img
              v-for="(card, index) in filteredCards(dataMatchUserLogged.field, 'melee')"
              :key="index"
              :src="require('../assets/cards/' + card.image + '.png')"
              :alt="card.name"
              class="card-field-img"
            >
          </div>
        </div>
        <div class="ranged-field-cards">
          <div class="horn"></div>
          <div class="ranged-cards">
            <img
              v-for="(card, index) in filteredCards(dataMatchUserLogged.field, 'ranged')"
              :key="index"
              :src="require('../assets/cards/' + card.image + '.png')"
              :alt="card.name"
              class="card-field-img"
            >
          </div>
        </div>
        <div class="siege-field-cards">
          <div class="horn"></div>
          <div class="siege-cards">
            <img
              v-for="(card, index) in filteredCards(dataMatchUserLogged.field, 'siege')"
              :key="index"
              :src="require('../assets/cards/' + card.image + '.png')"
              :alt="card.name"
              class="card-field-img"
            >
          </div>
        </div>
      </div>
      <div class="hand-cards">
        <img class="image-background" src="../assets/field icons/hand-field.png" alt="discard-background icon">
        <div class="div-card-field-img">
          <img
            v-for="(card, index) in dataMatchUserLogged.hand"
            :key="index"
            class="card-field-hand"
            @click="selectCard(card)"
            :src="require('../assets/cards/' + card.image + '.png')"
            alt="Carta de campo"
          >
        </div>
      </div>
    </div>
    <div class="data-decks">
      <div v-if="!selectedCard.image" class="oponent-deck-discard">
        <div class="discard-card">
          <img class="image-background" src="../assets/field icons/discard-background.png" alt="discard-background icon">
          <img
            v-if="dataMatchUserInvited.discart && dataMatchUserInvited.discart.length > 0"
            class="card-leader-img"
            :src="require('../assets/cards/' + dataMatchUserInvited.discart[dataMatchUserInvited.discart.length - 1].image + '.png')"
            alt="Carta de Líder"
          >
        </div>
        <div class="deck-card">
          <img
            class="image-background"
            v-if="dataMatchUserInvited.leader"
            :src="require(`../assets/field icons/${dataMatchUserInvited.leader.faction}.png`)" alt="discard-background icon"
          >
          <div class="div-quant-deck">
            <div class="quant-deck" v-if="dataMatchUserInvited.deck">
              {{dataMatchUserInvited.deck.length}}
            </div>
          </div>
        </div>
      </div>
      <div v-if="selectedCard.image" class="card-selected">
        <div class="div-close-card">
          <FontAwesomeIcon
            :icon="['fas', 'circle-xmark']"
            class="close-card"
            @click="cleanSelectedCard"
          />
        </div>
        <img
          class="card-selected-img"
          :src="require(`../assets/cards/${selectedCard.image}.png`)"
          alt=""
        >
        <div class="effect-selected-card">
          <p>{{ selectedCard.effect }}</p>
        </div>

        <button
          type="button"
          class="button-use-card"
          @click="playCard"
        >
          Jogar
        </button>
      </div>
      <div v-if="!selectedCard.image" class="deck-discard">
        <div class="discard-card">
          <img class="image-background" src="../assets/field icons/discard-background.png" alt="discard-background icon">
          <img
            v-if="dataMatchUserLogged.discart && dataMatchUserLogged.discart.length > 0"
            class="card-leader-img"
            :src="require('../assets/cards/' + dataMatchUserLogged.discart[dataMatchUserLogged.discart.length - 1].image + '.png')"
            alt="Carta de Líder"
          >
        </div>
        <div class="deck-card">
          <img
            class="image-background"
            v-if="dataMatchUserLogged.leader"
            :src="require(`../assets/field icons/${dataMatchUserLogged.leader.faction}.png`)" alt="discard-background icon"
          >
          <div class="div-quant-deck">
            <div class="quant-deck" v-if="dataMatchUserLogged.deck">
              {{dataMatchUserLogged.deck.length}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { authenticate } from "@/firebase/authenticate";
  import { useRouter } from 'vue-router';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { getUserByEmail } from "@/firebase/user";
  import { getMatchById, playInField } from "@/firebase/matchs";
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { fas } from '@fortawesome/free-solid-svg-icons';
  library.add(fas);

  export default {
    name: 'TheGaming',
    components: { FontAwesomeIcon },
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
        dataUserInvited: {},
        dataUserLogged: {},
        dataMatchUserInvited: {
          deck: [],
          field: [],
          discart: [],
          faction: { effect: "", faction: "", name: "" },
          hand: [],
          leader: { effect: "", faction: "gwent", image: "gwent" },
          matchId: '',
          play: false,
          user: '',
          victories: 0,
        },
        dataMatchUserLogged: {
          deck: [],
          field: [],
          discart: [],
          faction: { effect: "", faction: "", name: "" },
          hand: [],
          leader: { effect: "", faction: "gwent", image: "gwent" },
          matchId: '',
          play: false,
          user: '',
          victories: 0,
        },
        fieldCards: [],
      }
    },
    async beforeCreate() {
      const router = useRouter();
      const auth = await authenticate();
      if (auth) {
        const match = await getMatchById(this.matchId);
        const userInvitedEmail = match.playersEmail.find((email) => email !== auth.email);
        const userInvited = await getUserByEmail(userInvitedEmail); 
        const userLogged = await getUserByEmail(auth.email);
        this.dataUserInvited = userInvited;
        this.dataUserLogged = userLogged;
        const dataMatchUserLogged = match.users.find((user) => user.user === userLogged.id);
        this.dataMatchUserLogged = dataMatchUserLogged;
        const dataMatchUserInvited = match.users.find((user) => user.user !== userLogged.id);
        if (dataMatchUserInvited) this.dataMatchUserInvited = dataMatchUserInvited;
      } else router.push("/login");
    },
    methods: {
      capitalizeWords(str) {
        return str.replace(/\b\w/g, function(char) {
          return char.toUpperCase();
        });
      },
      selectCard(card) {
        this.selectedCard = card;
      },
      cleanSelectedCard() {
        this.selectedCard = {};
      },
      filteredCards (list, type) {
        return list
          .filter((cards) => cards.typeCard === type)
          .sort((a, b) => {
            if (a.power !== b.power) return b.power - a.power;
            return b.hero - a.hero;
          });
      },
      async playCard () {
        if (this.selectedCard.typeCard === "melee" || this.selectedCard.typeCard === "ranged" || this.selectedCard.typeCard === "siege") {
          await playInField(this.selectedCard, this.matchId, this.dataUserLogged.id);
          this.selectedCard = {};
        }
      }
    }
  }
</script>

<style scoped>
  .match-list {
    width: 90vw;
    height: 100vh;
    display: flex;
    color: #bea57c;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    background-image: url('../assets/field icons/wood-wallpaper.png');
    background-size: cover;
  }

  .data-players {
    width: 15%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0.5em;
  }

  .field-cards {
    width: 100%;
    height: 17vh;
    position: relative;
    display: flex;
  }

  .div-card-leader {
    display: flex;
    width: 100%;
    justify-content: flex-start;
  }

  .card-leader {
    display: flex;
    justify-content: flex-start;
    height: 22vh;
    width: 5.5vw;
    cursor: pointer;
    position: relative;
  }

  .image-background {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 2;
  }

  .div-card-field-img {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
    padding: 0.7em;
  }

  .card-field-img-1 {
    width: 30%;
    height: 100%;
    position: relative;
    object-fit: contain;
    z-index: 10;
    cursor: pointer;
  }

  .card-field-hand {
    height: 100%;
    position: relative;
    object-fit: contain;
    z-index: 10;
    cursor: pointer;
  }
  
  .card-leader-img {
    padding: 0.5em 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: relative;
    z-index: 10;
  }

  .card-field-img {
    width: 9vh;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }

  .card-selected {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .div-close-card {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 0.6em;
  }

  .close-card {
    font-size: 1.5em;
    cursor: pointer;
  }

  .card-selected-img {
    width: 100%;
    /* height: 100%; */
    object-fit: contain;
    position: relative;
    z-index: 10;
  }

  .effect-selected-card {
    padding: 1em 0;
    font-size: 0.9em;
    line-height: 1.2em;
    text-align: center;
  }

  .button-use-card {
    width: 100%;
    padding: 0.8em;
    font-weight: 800;
    cursor: pointer;
  }

  .player-data, .oponent-data {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .user-details {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 1em;
  }

  .image-user {
    width: 4em;
    height: 4em;
    border-radius: 100%;
  }

  .image-user img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 100%;
  }

  .victories-cards div {
    display: flex;
    align-items: center;
    font-weight: 800;
  }

  .card-icon-image {
    width: 1.2em;
    margin-right: 0.3em;
  }

  .victories-cards {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap:1em;
  }

  .rubi {
    width: 1.2em;
    margin-right: 0.2em;
  }

  .name-faction {
    margin-top: 0.5em;
    display: flex;
    flex-direction: column;
    align-items: start;
    font-size: 0.7em;
  }

  .oponent-name-faction {
    margin-bottom: 0.5em;
    display: flex;
    flex-direction: column;
    align-items: start;
    font-size: 0.7em;
  }

  .name-faction div:nth-child(1), .oponent-name-faction div:nth-child(1) {
    font-weight: 800;
  }

  .central-match {
    padding: 0.5em 1em;
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }

  .oponent-central-match, .player-central-match {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-bottom: none;
    width: 100%;
    height: 40vh;
  }

  .player-central-match {
    margin-top: 0.3em;
  }

  .hand-cards {
    margin-top: 0.2em;
    height: 20vh;
    width: 100%;
    position: relative;
    display: flex;
  }

  .melee-field-cards, .ranged-field-cards, .siege-field-cards, .melee-field-oponent-cards, .ranged-field-oponent-cards, .siege-field-oponent-cards {
    width: 100%;
    height: 12vh;
    display: flex;
    margin-top: 0.2em;
  }
  
  .horn {
    width: 15vh;
    background-image: url('../assets/field icons/horn.png');
    background-position: center;
    background-size: cover;
    margin-right: 0.2em;
    height: 100%;
  }

  .melee-cards, .ranged-cards, .siege-cards {
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.3em;
  }
  
  .melee-cards {
    background-image: url('../assets/field icons/melee-field.png');
  }

  .ranged-cards {
    background-image: url('../assets/field icons/ranged-field.png');
  }

  .siege-cards {
    background-image: url('../assets/field icons/siege-field.png');
  }

  .data-decks {
    width: 15%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 1em;
  }

  .deck-discard, .oponent-deck-discard {
    height: 17vh;
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 1em;
  }

  .deck-card, .discard-card {
    width: 50%;
    position: relative;
    display: flex;
  }

  .discard-card {
    cursor: pointer;
  }

  .div-quant-deck {
    width: 100%;
    position: absolute;
    z-index: 8;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .quant-deck {
    padding: 0.3em;
    background: white;
    color: black;
    border-radius: 100%;
    font-weight: 800;
    border: 2px solid black;
  }

  .discard-card img, .deck-card img {
    width: 100%;
    height: 100%
  }

  .deck-card img {
    object-fit: contain;
  }
</style>
