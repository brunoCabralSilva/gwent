<template>
  <div v-if="!playGameNow" class="load-start-game">
    <LoadingPage />
    <p>Estamos preparando tudo para sua partida começar.</p>
    <p>Assim que seu oponente estiver pronto e carregarmos tudo o que é necessário, iniciaremos a partida.</p>
  </div>
  <div v-else class="match-list">
    <div v-if="winner" class="div-message-winner-loose">
      <FontAwesomeIcon
        :icon="['fas', 'circle-xmark']"
        class="close-card absolute"
        @click="endMatch"
      />
      <img :src="require(`../assets/field icons/${dataMatchUserLogged.message.icon}.png`)" />
      <p>{{ dataMatchUserLogged.message.text }}</p>
    </div>
    <div v-if="(dataUserLogged.id !== '' && dataUserInvited.id !== '') && dataMatchUserLogged.message.text !== '' && !winner" class="div-message">
      <div v-if="dataMatchUserLogged.message.text !== ''" class="message">
        <FontAwesomeIcon
          :icon="['fas', 'circle-xmark']"
          class="close-card absolute"
          @click="cleanMessageForUser"
        />
        <img :src="require(`../assets/field icons/${dataMatchUserLogged.message.icon !== '' ? dataMatchUserLogged.message.icon : 'player'}.png`)" />
        <p>{{ dataMatchUserLogged.message.text }}</p>
      </div>
    </div>
    <div class="data-players">
      <div class="div-card-leader">
        <div class="card-leader">
          <img class="image-background" src="../assets/field icons/field-cards-leader.png" alt="field cards empty">
          <img
            v-if="dataMatchUserInvited && dataMatchUserInvited.leader"
            class="card-leader-img"
            :src="require('../assets/cards/' + dataMatchUserInvited.leader.image + '.png')"
            :alt="dataMatchUserInvited.leader.name"
            @click="selectCard({ ...dataMatchUserInvited.leader, card: 'field' })"
          >
        </div>
        <div
          v-if="dataMatchUserInvited.pass"
          type="button"
          class="text-turn"
        >
          Passou a vez
        </div>
        <p v-if="dataMatchUserInvited.play" class="text-turn">Vez do oponente!</p>
      </div>
      <div class="user-details">
        <div v-if="dataUserInvited.image" class="image-user">
          <img :src="dataUserInvited.image" alt="Image User">
        </div>
        <div>
          <div class="name-faction-power">
            <div class="oponent-name-faction">
              <div v-if="dataUserInvited.firstName">{{ capitalizeWords(dataUserInvited.firstName) }}</div>
              <div>{{dataMatchUserInvited.faction.name}}</div>
            </div>
            <div class="power-value">{{ invitedTotalPower.value }}</div>
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
          <div class="name-faction-power">
            <div class="name-faction">
              <div v-if="dataUserLogged.firstName">{{ capitalizeWords(dataUserLogged.firstName) }}</div>
              <div>{{dataMatchUserLogged.faction.name}}</div>
            </div>
            <div class="power-value">{{ loggedTotalPower.value }}</div>
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
            @click="selectCard({ ...dataMatchUserLogged.leader, card: 'leader' })"
          >
        </div>
        <div v-if="dataMatchUserLogged.play" class="div-button-logged">
          <p class="text-turn">É sua Vez!</p>
          <button
            type="button"
            class="pass-turn"
            @click="pass"
            :disabled="!dataMatchUserLogged.play"
          >Pular Rodada</button>
        </div>
        <p class="text-turn" v-if="dataMatchUserLogged.pass">Você passou</p>
      </div>
    </div>
    <div class="central-match">
      <div class="oponent-central-match">
        <div class="siege-field-oponent-cards">
          <div class="horn">
            <img
              v-if="this.dataMatchUserInvited.horns.siege.length > 0"
              :src="require('../assets/cards/' + this.dataMatchUserInvited.horns.siege[0].image + '.png')"
              :alt="this.dataMatchUserInvited.horns.siege[0].name"
              class="card-field-img"
            >
          </div>
          <div class="siege-cards">
            <div
              v-for="(card, index) in filteredCards(dataMatchUserInvited.field, 'siege')"
              :key="index"
              class="div-card-field-image"
              @click="selectCard({ ...card, card: 'field' })"
            >
              <div v-if="!card.hero" class="div-power-card">
                {{ card.actualPower }}
              </div>
              <div v-else class="div-power-card-hero">
                {{ card.actualPower }}
              </div>
              <img
                :src="require('../assets/cards/' + card.image + '.png')"
                :alt="card.name"
                class="card-field-img"
              >
            </div>
          </div>
        </div>
        <div class="ranged-field-oponent-cards">
          <div class="horn">
            <img
              v-if="this.dataMatchUserInvited.horns.ranged.length > 0"
              :src="require('../assets/cards/' + this.dataMatchUserInvited.horns.ranged[0].image + '.png')"
              :alt="this.dataMatchUserInvited.horns.ranged[0].name"
              class="card-field-img"
            >
          </div>
          <div class="ranged-cards">
            <div
              v-for="(card, index) in filteredCards(dataMatchUserInvited.field, 'ranged')"
              :key="index"
              class="div-card-field-image"
              @click="selectCard({ ...card, card: 'field' })"
            >
              <div v-if="!card.hero" class="div-power-card">
                {{ card.actualPower }}
              </div>
              <div v-else class="div-power-card-hero">
                {{ card.actualPower }}
              </div>
              <img
                :src="require('../assets/cards/' + card.image + '.png')"
                :alt="card.name"
                class="card-field-img"
              >
            </div>
          </div>
        </div>
        <div class="melee-field-oponent-cards">
          <div class="horn">
            <img
              v-if="this.dataMatchUserInvited.horns.melee.length > 0"
              :src="require('../assets/cards/' + this.dataMatchUserInvited.horns.melee[0].image + '.png')"
              :alt="this.dataMatchUserInvited.horns.melee[0].name"
              class="card-field-img"
            >
          </div>
          <div class="melee-cards">
            <div
              v-for="(card, index) in filteredCards(dataMatchUserInvited.field, 'melee')"
              :key="index"
              class="div-card-field-image"
              @click="selectCard({ ...card, card: 'field' })"
            >
              <div v-if="!card.hero" class="div-power-card">
                {{ card.actualPower }}
              </div>
              <div v-else class="div-power-card-hero">
                {{ card.actualPower }}
              </div>
              <img
                :src="require('../assets/cards/' + card.image + '.png')"
                :alt="card.name"
                class="card-field-img"
              >
            </div>
          </div>
        </div>
      </div>
      <div class="player-central-match">
        <div class="melee-field-cards">
          <div class="horn">
            <img
              v-if="this.dataMatchUserLogged.horns.melee.length > 0"
              :src="require('../assets/cards/' + this.dataMatchUserLogged.horns.melee[0].image + '.png')"
              :alt="this.dataMatchUserLogged.horns.melee[0].name"
              class="card-field-img"
            >
          </div>
          <div class="melee-cards">
            <div
              v-for="(card, index) in filteredCards(dataMatchUserLogged.field, 'melee')"
              :key="index"
              class="div-card-field-image"
              @click="selectCard({ ...card, card: 'field' })"
            >
              <div v-if="!card.hero" class="div-power-card">
                {{ card.actualPower }}
              </div>
              <div v-else class="div-power-card-hero">
                {{ card.actualPower }}
              </div>
              <img
                :src="require('../assets/cards/' + card.image + '.png')"
                :alt="card.name"
                class="card-field-img"
              >
            </div>
          </div>
        </div>
        <div class="ranged-field-cards">
          <div class="horn">
            <img
              v-if="this.dataMatchUserLogged.horns.ranged.length > 0"
              :src="require('../assets/cards/' + this.dataMatchUserLogged.horns.ranged[0].image + '.png')"
              :alt="this.dataMatchUserLogged.horns.ranged[0].name"
              class="card-field-img"
            >
          </div>
          <div class="ranged-cards">
            <div
              v-for="(card, index) in filteredCards(dataMatchUserLogged.field, 'ranged')"
              :key="index"
              class="div-card-field-image"
              @click="selectCard({ ...card, card: 'field' })"
            >
              <div v-if="!card.hero" class="div-power-card">
                {{ card.actualPower }}
              </div>
              <div v-else class="div-power-card-hero">
                {{ card.actualPower }}
              </div>
              <img
                :src="require('../assets/cards/' + card.image + '.png')"
                :alt="card.name"
                class="card-field-img"
              >
            </div>
          </div>
        </div>
        <div class="siege-field-cards">
          <div class="horn">
            <img
              v-if="this.dataMatchUserLogged.horns.siege.length > 0"
              :src="require('../assets/cards/' + this.dataMatchUserLogged.horns.siege[0].image + '.png')"
              :alt="this.dataMatchUserLogged.horns.siege[0].name"
              class="card-field-img"
            >
          </div>
          <div class="siege-cards">
            <div
              v-for="(card, index) in filteredCards(dataMatchUserLogged.field, 'siege')"
              :key="index"
              class="div-card-field-image"
              @click="selectCard({ ...card, card: 'field' })"
            >
              <div v-if="!card.hero" class="div-power-card">
                {{ card.actualPower }}
              </div>
              <div v-else class="div-power-card-hero">
                {{ card.actualPower }}
              </div>
              <img
                :src="require('../assets/cards/' + card.image + '.png')"
                :alt="card.name"
                class="card-field-img"
              >
            </div>
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
            @click="selectCard({ ...card, card: 'hand' })"
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

        <div v-if="selectedCard.effect==='Duplica a força de todas as cartas de unidades em uma fileira. Limite de 1 por fileira.'">
          Escolha a fileira
          <div
            v-if="dataMatchUserLogged.horns.melee.length === 0"
            class="melee-cards option-horn"
            @click="setValueOfHorn('melee')"
          >
          </div>
          <div
            v-if="dataMatchUserLogged.horns.ranged.length === 0"
            class="ranged-cards option-horn"
            @click="setValueOfHorn('ranged')"
          >
          </div>
          <div
            v-if="dataMatchUserLogged.horns.siege.length === 0"
            class="siege-cards option-horn"
            @click="setValueOfHorn('siege')"
          >
          </div>
        </div>

        <div v-if="selectedCard.effect === 'Troque uma carta no campo de batalha para colocá-la em sua mão novamente.'">
          Escolha a carta que irá retornar para sua mão
          <img
            v-for="(card, index) in filterCardsIntheField()"
            :key="index"
            class="card-field-hand"
            @click="setIndexValue(card.index)"
            :src="require('../assets/cards/' + card.image + '.png')"
            alt="Carta de campo"
          >
        </div>
        <button
          v-if="(selectedCard.card === 'hand' || selectedCard.card === 'leader') && this.dataMatchUserLogged.play"
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
  import LoadingPage from './LoadingPage.vue';
  import { authenticate } from "@/firebase/authenticate";
  import { useRouter } from 'vue-router';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { getUserByEmail } from "@/firebase/user";
  import { chooseInitPlayer, cleanMessage, getMatchById, passTurn, removeUserFromMatch } from "@/firebase/matchs";
  import { doc, getFirestore } from 'firebase/firestore';
  import { initializeApp } from 'firebase/app';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { fas } from '@fortawesome/free-solid-svg-icons';
  import { onSnapshot } from "firebase/firestore";
  import { onUnmounted, ref } from "vue";
  import router from '@/routes';
  import { playInField } from '@/firebase/effects';
  library.add(fas);
  export default {
    name: 'TheGaming',
    components: { FontAwesomeIcon, LoadingPage },
    data() {
      const router = useRouter();
      return {
        data: ref([]),
        sysId: '',
        verifyChanges: 0,
        dataChat: {},
        selectedCard: {},
        matchId: router.currentRoute.value.params.id,
        router: router,
        showSelectDeck: false,
        showSelectCards: false,
        showGame: false,
        winner: false,
        invitedTotalPower: {
          value: 0,
          siege: 0,
          ranged: 0,
          melee: 0,
        },
        loggedTotalPower: {
          value: 0,
          siege: 0,
          ranged: 0,
          melee: 0,
        },
        dataUserInvited: { image: '', firstName: '', id: ''},
        dataUserLogged: { image: '', firstName: '', id: ''},
        playGameNow: false,
        dataMatchUserInvited: {
          deck: [],
          field: [],
          discart: [],
          faction: { effect: "", faction: "", name: "" },
          hand: [],
          leader: { effect: "", faction: "gwent", image: "gwent" },
          horns: { melee: [], ranged: [], siege: [] },
          matchId: '',
          play: false,
          user: '',
          victories: 0,
          message: { text: '', icon: '' }
        },
        dataMatchUserLogged: {
          deck: [],
          field: [],
          discart: [],
          horns: { melee: [], ranged: [], siege: [] },
          faction: { effect: "", faction: "", name: "" },
          hand: [],
          leader: { effect: "", faction: "gwent", image: "gwent" },
          matchId: '',
          play: false,
          user: '',
          victories: 0,
          message: { text: '', icon: '' }
        },
        fieldCards: [],
      }
    },
    async mounted() {
      const firebaseConfig = {
        apiKey: "AIzaSyDRSHgIyIgCLlgvMPHmoet_DU8UFRVYHeI",
        authDomain: "gwent-b5e5c.firebaseapp.com",
        projectId: "gwent-b5e5c",
        storageBucket: "gwent-b5e5c.appspot.com",
        messagingSenderId: "340071048057",
        appId: "1:340071048057:web:7eea38e2bd3955807dc5a8"
      };
      const router = useRouter();
      const auth = await authenticate();
      if (auth) {
        const userLogged = await getUserByEmail(auth.email);
        const firebaseApp = initializeApp(firebaseConfig);
        const db = getFirestore(firebaseApp);
        const chatSnapShot = onSnapshot(
          doc(db, 'matchs', this.matchId),
          async (snapshot) => {
            this.winner = snapshot.data().winner;
            let dataMatchUserLogged = snapshot.data().users.find((user) => user.user === userLogged.id);
            this.climatics = snapshot.data().climatics;
            let dataMatchUserInvited = snapshot.data().users.find((user) => user.user !== userLogged.id);
            const meleeClimatics = snapshot.data().climatics.find((climCard) => climCard.name === 'Chuva Torrencial');
            const rangedClimatics = snapshot.data().climatics.find((climCard) => climCard.name === 'Névoa Impenetrável');
            const siegeClimatics = snapshot.data().climatics.find((climCard) => climCard.name === 'Frio Congelante');
            if (meleeClimatics) {
              dataMatchUserInvited = dataMatchUserInvited.field.map((cardUser) => {
                if (cardUser.typeCard === 'melee' && !cardUser.hero)
                return { ...cardUser, actualPower: 1 }
                return cardUser;
              });
              dataMatchUserLogged = dataMatchUserLogged.field.map((cardUser) => {
                if (cardUser.typeCard === 'melee' && !cardUser.hero)
                return { ...cardUser, actualPower: 1 }
                return cardUser;
              });
            }
            if (rangedClimatics) {
              dataMatchUserInvited = dataMatchUserInvited.field.map((cardUser) => {
                if (cardUser.typeCard === 'ranged' && !cardUser.hero)
                return { ...cardUser, actualPower: 1 }
                return cardUser;
              });
              dataMatchUserLogged = dataMatchUserLogged.field.map((cardUser) => {
                if (cardUser.typeCard === 'ranged' && !cardUser.hero)
                return { ...cardUser, actualPower: 1 }
                return cardUser;
              });
            }
            if (siegeClimatics) {
              dataMatchUserInvited = dataMatchUserInvited.field.map((cardUser) => {
                if (cardUser.typeCard === 'siege' && !cardUser.hero)
                return { ...cardUser, actualPower: 1 }
                return cardUser;
              });
              dataMatchUserLogged = dataMatchUserLogged.field.map((cardUser) => {
                if (cardUser.typeCard === 'siege' && !cardUser.hero)
                return { ...cardUser, actualPower: 1 }
                return cardUser;
              });
            }
            if (dataMatchUserLogged.horns.melee.length > 0) {
              dataMatchUserLogged.field = dataMatchUserLogged.field.map((cardUser) => {
                if (cardUser.typeCard === 'melee' && !cardUser.hero)
                return { ...cardUser, actualPower: cardUser.actualPower * 2 }
              return cardUser;
            });
            console.log(dataMatchUserLogged);
          }
            if (dataMatchUserLogged.horns.ranged.length > 0) {
              dataMatchUserLogged.field = dataMatchUserLogged.field.map((cardUser) => {
                if (cardUser.typeCard === 'ranged' && !cardUser.hero)
                return { ...cardUser, actualPower: cardUser.actualPower * 2 }
                return cardUser;
              });
            }
            if (dataMatchUserLogged.horns.siege.length > 0) {
              dataMatchUserLogged.field = dataMatchUserLogged.field.map((cardUser) => {
                if (cardUser.typeCard === 'siege' && !cardUser.hero)
                return { ...cardUser, actualPower: cardUser.actualPower * 2 }
                return cardUser;
              });
            }
            this.dataMatchUserLogged = dataMatchUserLogged;
            if (dataMatchUserInvited) {
              this.dataMatchUserInvited = dataMatchUserInvited;
              if (dataMatchUserLogged.deck.length > 0 && dataMatchUserInvited.deck.length > 0)   
                this.playGameNow = true;
                if (!dataMatchUserInvited.play && !dataMatchUserLogged.play) {
                  if (userLogged.id === dataMatchUserLogged.user) {
                    await chooseInitPlayer(dataMatchUserInvited, dataMatchUserLogged, this.matchId);
                  }
                }
            } else this.playGameNow = false;
            this.calculatePower(dataMatchUserLogged, dataMatchUserInvited);
          }
        );
        onUnmounted(chatSnapShot);
      } else router.push("/login");
    },
    async beforeCreate() {
      const auth = await authenticate();
      if (auth) {
        const match = await getMatchById(this.matchId);
        const userInvitedEmail = match.playersEmail.find((email) => email !== auth.email);
        const userInvited = await getUserByEmail(userInvitedEmail); 
        const userLogged = await getUserByEmail(auth.email);
        this.dataUserInvited = userInvited;
        this.dataUserLogged = userLogged;
      }
    },
    methods: {
      setIndexValue(index) {
        this.selectedCard.cardIndex = index;
      },
      filterCardsIntheField() {
        return this.dataMatchUserLogged.field.filter((card) => !card.hero);
      },
      capitalizeWords(str) {
        return str.replace(/\b\w/g, function(char) {
          return char.toUpperCase();
        });
      },
      setValueOfHorn(type) {
        this.selectedCard.typeHorn = type;
      },
      async endMatch() {
        router.push('/');
        await removeUserFromMatch(this.dataMatchUserLogged.user, this.matchId);
      },
      async pass() {
        await passTurn(this.dataMatchUserLogged.user, this.matchId);
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
        await this.calculatePower(this.dataMatchUserLogged, this.dataMatchUserInvited);
        if (this.selectedCard.effect === 'Duplica a força de todas as cartas de unidades em uma fileira. Limite de 1 por fileira.') {
          if (this.selectedCard.typeHorn === 'melee' || this.selectedCard.typeHorn === 'siege' || this.selectedCard.typeHorn === 'ranged') {
            await playInField(this.selectedCard, this.matchId, this.dataMatchUserLogged.user, 'horns');
          } else {
            if (this.dataMatchUserLogged.horns.siege.length > 0 && this.dataMatchUserLogged.horns.ranged.length > 0 && this.dataMatchUserLogged.horns.melee.length > 0) {
              window.alert("Não é possível lançar a Corneta do Comandante, pois todos os espaços reservados estão preenchidos");
            } else {
              window.alert("Necessário escolher uma das fileiras que você deseja inserir a Corneta do Comandante.");
            }
          }
        } else if(this.selectedCard.effect === 'Troque uma carta no campo de batalha para colocá-la em sua mão novamente.') {
          if (this.selectedCard.cardIndex) {
            await playInField(this.selectedCard, this.matchId, this.dataMatchUserLogged.user, 'isca');
          } else window.alert("Necessário escolher uma das cartas disponíveis em campo.");
        } else {
          switch(this.selectedCard.effect) {
            case 'Destrua a carta mais poderosa do oponente. O efeito se aplica a mais cartas se elas tiverem o mesmo valor.':
              await playInField(this.selectedCard, this.matchId, this.dataMatchUserLogged.user, 'queimar');
              break;
            case 'Define para 1 a força de todas as cartas de Combate Corporal para ambos os jogadores.':
              await playInField(this.selectedCard, this.matchId, this.dataMatchUserLogged.user, 'climatics');
              break;
            case 'Define para 1 a força de todas as cartas de Combate à Distância para ambos os jogadores.':
              await playInField(this.selectedCard, this.matchId, this.dataMatchUserLogged.user, 'climatics');
              break;
            case 'Define para 1 a força de todas as cartas de Cerco para ambos os jogadores.':
              await playInField(this.selectedCard, this.matchId, this.dataMatchUserLogged.user, 'climatics');
              break;
            case 'Remove os efeitos de todas as Cartas de Clima (Frio Congelante, Névoa Impenetrável e Chuva Torrencial).':
              await playInField(this.selectedCard, this.matchId, this.dataMatchUserLogged.user, 'tempo claro');
              break;
            case 'Coloque no campo de batalha do seu oponente (conta para o total do seu oponente) e compre duas cartas do seu baralho.':
              await playInField(this.selectedCard, this.matchId, this.dataMatchUserLogged.user, 'espião');
              break;
            case 'Encontra as cartas com o mesmo nome no seu baralho e joga-os no campo instantaneamente.':
              await playInField(this.selectedCard, this.matchId, this.dataMatchUserLogged.user, 'same cards from deck');
              break;
            case 'Adiciona +1 para todas as unidades na linha (exceto a si mesmo).':
              console.log('');
              break;
            case 'Coloque ao lado de uma carta com o mesmo nome para dobrar a força de ambas as cartas (ou triplicar, caso três cartas com o mesmo nome estejam em campo).':
              console.log('');
              break;
            case 'Pode ser colocado tanto na fileira de Combate Corpo a Corpo quanto na fileira de Combate à Distância. Não pode ser movido uma vez colocado.':
              console.log('');
              break;
            case 'Escolha uma carta da sua pilha de descarte e lance-a de volta ao jogo imediatamente (exceto heróis e cartas especiais).':
              console.log('');
              break;
            default:
              await playInField(this.selectedCard, this.matchId, this.dataMatchUserLogged.user, '');
              break;
          }
        }
        this.selectedCard = {};
      },
      async cleanMessageForUser() {
        await cleanMessage(this.dataMatchUserLogged.user, this.matchId);
      },
      async calculatePower(dataMatchUserLogged, dataMatchUserInvited) {
        let siegeLogged = 0;
        let rangedLogged = 0;
        let meleeLogged = 0;
        
        for (let i = 0; i < dataMatchUserLogged.field.length; i += 1) {
          const dataCard = dataMatchUserLogged.field[i];
          if (dataCard.typeCard === 'melee') meleeLogged += dataCard.actualPower;
          if (dataCard.typeCard === 'ranged') rangedLogged += dataCard.actualPower;
          if (dataCard.typeCard === 'siege') siegeLogged += dataCard.actualPower;
        }
        this.loggedTotalPower.siege = siegeLogged;
        this.loggedTotalPower.ranged = rangedLogged;
        this.loggedTotalPower.melee = meleeLogged;
        this.loggedTotalPower.value = siegeLogged + rangedLogged + meleeLogged;

        if (dataMatchUserInvited) {
          let siegeInvited = 0;
          let rangedInvited = 0;
          let meleeInvited = 0;
          for (let i = 0; i < dataMatchUserInvited.field.length; i += 1) {
            const dataCard = dataMatchUserInvited.field[i];
            if (dataCard.typeCard === 'siege') siegeInvited += dataCard.actualPower;
            if (dataCard.typeCard === 'ranged') rangedInvited += dataCard.actualPower;
            if (dataCard.typeCard === 'melee') meleeInvited += dataCard.actualPower;
          }
          this.invitedTotalPower.siege = siegeInvited;
          this.invitedTotalPower.ranged = rangedInvited;
          this.invitedTotalPower.melee = meleeInvited;
          this.invitedTotalPower.value = siegeInvited + rangedInvited + meleeInvited;
        }
      }
    }
  }
</script>

<style scoped>
  .absolute {
    position: absolute;
    top: 2vh;
    right: 1vw;
  }

  .div-message {
    display: flex;
    position: absolute;
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background: rgb(0, 0, 0, 0.6);
    z-index: 30;
  }

  .div-message-winner-loose {
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 100%;
    height: 100vh;
    font-weight: 800;
    justify-content: center;
    align-items: center;
    background: rgb(0, 0, 0, 0.9);
    z-index: 30;
  }

  .div-message-winner-loose p {
    margin-top: 2em;
  }

  .message {
    width: 100%;
    background: black;
    min-height: 20vh;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    font-weight: 800;
    padding: 1vw 10vw;
    gap: 1vw;
  }
  .load-start-game {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px;
    color: white;
  }

  .load-start-game p {
    margin-top: 1em;
  }

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
    align-items: flex-start;
  }

  .div-button-logged {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    height: 100%;
    padding-top: 0.5em;
  }

  .text-turn {
    font-weight: 800;
    font-size: 0.8em;
    text-align: left;
  }

  .pass-turn {
    border: 1px solid black;
    width: 100%;
    background: #bea57c;
    color: black;
    font-weight: 700;
    font-size: 0.7em;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-align: start;
    padding: 1em;
    cursor: pointer;
    border-radius: 0.5em;
  }

  .card-leader {
    display: flex;
    justify-content: flex-start;
    align-items: start;
    cursor: pointer;
    position: relative;
    margin-right: 0.5em;
    width: 5.5vw;
    height: 22vh;
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
    justify-content: flex-start;
    gap: 5px;
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
    width: 5.3vw;
    height: 100%;
    object-fit: contain;
    z-index: 10;
    cursor: pointer;
    object-fit: cover;
    object-position: top;
    position: relative;
  }
  
  .card-leader-img {
    padding: 0.5em 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    position: relative;
    z-index: 10;
  }

  .div-card-field-image {
    width: 4.8vw;
    height: 100%;
    position: relative;
  }

  .card-field-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    position: relative;
    z-index: 10;
    cursor: pointer;
  }

  .div-power-card {
    width: 1.5vw;
    height: 1.5vw;
    z-index: 20;
    background: white;
    border-radius: 100%;
    position: absolute;
    font-size: 1vw;
    color: black;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .div-power-card-hero {
    width: 1.5vw;
    height: 1.5vw;
    z-index: 20;
    background: black;
    border-radius: 100%;
    position: absolute;
    font-size: 1vw;
    color: white;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
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

  .name-faction-power {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .name-faction-power:nth-child(1) {
    margin-bottom: 0.5em;
  }

  .name-faction-power:nth-child(2) {
    margin-top: 0.5em;
  }

  .name-faction {
    display: flex;
    flex-direction: column;
    align-items: start;
    font-size: 0.7em;
    text-align: start;
  }

  .power-value {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: white;
    padding: 0.5em;
    width: 2em;
    height: 2em;
    border-radius: 100%;
    color: black;
    font-weight: 700;
  }

  .oponent-name-faction {
    display: flex;
    flex-direction: column;
    align-items: start;
    font-size: 0.7em;
    text-align: start;
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

  .option-horn {
    width: 100%;
    height: 10vh;
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
