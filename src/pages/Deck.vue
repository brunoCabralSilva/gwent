<template>
  <Navigation />
  <div class="title-menu">
    <p>Todas as Cartas</p>
    <div class="factions">
      <button
        type="button"
        @click="previousFaction"
        class="next-previous-button"
      >
        <FontAwesomeIcon
          :icon="['fas', 'angle-left']"
          class="next-previous"
        />
      </button>
      <p>{{ faction.name }}</p>
      <button
        type="button"
        @click="nextFaction"
        class="next-previous-button"
      >
        <FontAwesomeIcon
          :icon="['fas', 'angle-right']"
          class="next-previous"
        />
      </button>
    </div>
    <p>Cartas no Baralho</p>
  </div>
  <p class="faction-effect">{{faction.effect}}</p>
  <div class="menu">
    <div class="list-cards">
      <div v-for="(card, index) in sortItems(allCards)" :key="index" class="card">
        <img
          :src="require(`../assets/cards/${card.image}.png`)"
          :alt="`Carta ${card.name}`"
          @click="addCard(card)"
        />
        <p class="quant">{{ card.quant }}</p>
      </div>
    </div>
    <div class="details">
      <p class="title-leader">Líder</p>
      <div class="leader-div">
        <button
          type="button"
          @click="previousLeader"
          class="next-previous-button"
        >
          <FontAwesomeIcon :icon="['fas', 'angle-left']" class="next-previous" />
        </button>
        <img v-if="leaders.length > 0" :src="require(`../assets/cards/${selectedLeader.image}.png`)" alt="Carta líder" id="leader" />
        <button
          type="button"
          @click="nextLeader"
          class="next-previous-button"
        >
          <FontAwesomeIcon :icon="['fas', 'angle-right']" class="next-previous" />
        </button>
      </div>
      <p class="title">Todas as cartas do baralho</p>
      <p :class="(numberOfCards < 22 ? ' text-red' : '')">
        {{ numberOfCards }}<span>{{ numberOfCards < 22 ? '/22' : '' }}</span>
      </p>
      <p class="title">Quant. de cartas de Unidades</p>
      <p>{{ unitCards }}</p>
      <p class="title">Cartas Especiais</p>
      <p :class="(this.effectCards === 10 ? ' text-green' : '')">{{ effectCards }}/10</p>
      <p class="title">Força total Carta de Unidade</p>
      <p>{{ sumPower }}</p>
      <p class="title">Cartas de Herói</p>
      <p>{{ heroCards }}</p>
      <button type="button" class="save" @click="saveDeck">Salvar</button>
    </div>
    <div class="list-cards-02">
      <div v-if="deckCards.length > 0" class="div-list-cards">
        <div v-for="(card, index) in deckCards" :key="index" class="card">
          <img
            :src="require(`../assets/cards/${card.image}.png`)"
            :alt="`Carta ${card.name}`"
            @click="removeCard(card)"
          />
          <p class="quant">{{ card.quant }}</p>
        </div>
      </div>
    </div>
  </div>
  <FooterElement/>
</template>

<script>
  import { useRouter } from "vue-router";
  import { authenticate } from "../firebase/authenticate";
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
  import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import FooterElement from '../components/Footer.vue';
  import Navigation from '../components/Navigation.vue';
  import listCards from '../cards';
  import { getUserByEmail, updateDeckUser } from "@/firebase/user";
  library.add(faAngleLeft);
  library.add(faAngleRight);

  export default {
    name: 'DeckByType',
    beforeCreate() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    data() {
      return {
        factions: [
          { faction: 'northern realms', name: 'Reinos do Norte', effect: 'Uma Carta de Unidade de Monstro escolhida aleatoriamente fica no campo de batalha depois de cada rodada.' },
          { faction: 'nilfgaard', name: 'Nilfgaard', effect: 'Vença sempre que houver um empate.' },
          { faction: 'monsters', name: 'Monstros', effect: 'Compre uma carta do seu baralho sempre que vencer uma rodada.' },
          { faction: 'scoiatael', name: "Scoia'tael", effect: 'Você decide quem começa no início de uma batalha.' },
          { faction: 'skellige', name: 'Skellige', effect: '' },
        ],
        allCards: [],
        deckCards: [],
        leaders: [],
        selectedLeader: {},
        unitCards: 0,
        effectCards: 0,
        numberOfCards: 0,
        sumPower: 0,
        heroCards: 0,
        user: {},
        faction: '',
      }
    },
    async created() {
      this.faction = this.factions[0];
      const router = useRouter();
      const auth = await authenticate();
      if (auth) {
        this.showData = true;
        await this.getUserAndSetCards();
      }
      else router.push("/login");
    },
    methods: {
      previousLeader() {
        if (this.selectedLeader.name === this.leaders[0].name) {
          this.selectedLeader = this.leaders[this.leaders.length - 1];
        } else {
          const currentIndex = this.leaders.findIndex(f => f.name === this.selectedLeader.name);
          const previousIndex = (currentIndex - 1) % this.leaders.length;
          this.selectedLeader = this.leaders[previousIndex];
        }
      },
      nextLeader() {
        if (this.selectedLeader.name === this.leaders[this.leaders.length - 1].name) {
          this.selectedLeader = this.leaders[0];
        } else {
          const currentIndex = this.leaders.findIndex(f => f.name === this.selectedLeader.name);
          const nextIndex = (currentIndex + 1) % this.leaders.length;
          this.selectedLeader = this.leaders[nextIndex];
        }
      },
      previousFaction() {
        if (this.faction.name === this.factions[0].name) {
          this.faction = this.factions[this.factions.length - 1];
        } else {
          const currentIndex = this.factions.findIndex(f => f.name === this.faction.name);
          const previousIndex = (currentIndex - 1) % this.factions.length;
          this.faction = this.factions[previousIndex];
        }
        this.getUserAndSetCards();
      },
      nextFaction() {
        if (this.faction.name === this.factions[this.factions.length - 1].name) {
          this.faction = this.factions[0];
        } else {
          const currentIndex = this.factions.findIndex(f => f.name === this.faction.name);
          const nextIndex = (currentIndex + 1) % this.factions.length;
          this.faction = this.factions[nextIndex];
        }
        this.getUserAndSetCards();
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
      getDataDeck() {
        this.numberOfCards = this.deckCards
          .reduce((total, card) => total + card.quant, 0);
        this.unitCards = this.deckCards
          .filter((card) => card.typeCard === 'siege' || card.typeCard === 'ranged' || card.typeCard === 'melee')
          .reduce((total, card) => total + card.quant, 0);
        this.effectCards = this.deckCards
          .filter((card) => card.typeCard !== 'siege' && card.typeCard !== 'ranged' && card.typeCard !== 'melee' && card.typeCard !== 'leader')
          .reduce((total, card) => total + card.quant, 0);
        this.sumPower = this.deckCards.reduce((total, carta) => total + (carta.power * carta.quant), 0);
        this.heroCards = this.deckCards.filter((card) => card.hero).length;
      },
      addToDeck(card) {
        const cardAdded = this.deckCards.find((card1) => card1.image === card.image);
        if (cardAdded) {
          cardAdded.quant += 1;
          const restOfCards = this.deckCards.filter((card1) => card1.image !== card.image);
          const upList = [...restOfCards, cardAdded];
          this.deckCards = this.sortItems(upList);
        } else {
          const upList = [...this.deckCards, { ...card, quant: 1 }];
          this.deckCards = this.sortItems(upList);
        }
      },
      addToList(card) {
        const cardAdded = this.allCards.find((card1) => card1.image === card.image);
        if (cardAdded) {
          cardAdded.quant += 1;
          const restOfCards = this.allCards.filter((card1) => card1.image !== card.image);
          const upList = [...restOfCards, cardAdded];
          this.allCards = this.sortItems(upList);
        } else {
          const upList = [...this.allCards, { ...card, quant: 1 }];
          this.allCards = this.sortItems(upList);
        }
      },
      addCard(card) {
        if (card.typeCard !== 'siege' && card.typeCard !== 'ranged' && card.typeCard !== 'melee' && card.typeCard !== 'leader') {
          if(this.effectCards <= 9) {
            if (card.quant === 1) {
              this.allCards = this.allCards.filter((card1) => card1.image !== card.image);
              this.addToDeck(card);
            } else {
              card.quant -= 1.
              this.allCards = this.allCards.filter((card1) => card1.image !== card.image);
              const updatedList = [...this.allCards, card];
              this.allCards = this.sortItems(updatedList);
              this.addToDeck(card);
            }
          }
        } else {
          if (card.quant === 1) {
            this.allCards = this.allCards.filter((card1) => card1.image !== card.image);
            this.addToDeck(card);
          } else {
            card.quant -= 1.
            this.allCards = this.allCards.filter((card1) => card1.image !== card.image);
            const updatedList = [...this.allCards, card];
            this.allCards = this.sortItems(updatedList);
            this.addToDeck(card);
          }
        }
        this.getDataDeck();
      },
      removeCard(card) {
        if (card.quant === 1) {
          this.deckCards = this.deckCards.filter((card1) => card1.image !== card.image);
          this.addToList(card);
        } else {
          card.quant -= 1.
          this.deckCards = this.deckCards.filter((card1) => card1.image !== card.image);
          const updatedList = [...this.deckCards, card];
          this.deckCards = this.sortItems(updatedList);
          this.addToList(card);
        }
        this.getDataDeck();
      },
      async getUserAndSetCards() {
        const router = this.$router;
        const auth = await authenticate();
        if (auth) {
          const user = await getUserByEmail(auth.email);
          const myCards = user.decks.find((card) => card.type === this.faction.faction);
          this.deckCards = this.sortItems(myCards.cards);
          const findList = listCards
            .filter((card) => (card.faction === this.faction.faction || card.faction === '') && card.typeCard !== 'leader')
            .filter((item) => {
              const findItem = myCards.cards.find((card) => item.image === card.image);
              if (findItem) {
                if (findItem.quant === item.quant) return false;
                return true;
              } return true;
            }).map((item) => {
              const findItem = myCards.cards.find((card) => item.image === card.image);
              if (findItem) {
                let quantItem = findItem.quant - item.quant;
                if (quantItem < 0) quantItem += -(quantItem * 2);
                return { ...item, quant: quantItem };
              } return item;
            });

          this.allCards = this.sortItems(findList);
          this.leaders = listCards.filter((card) => card.faction === this.faction.faction && card.typeCard === 'leader');
          if (myCards.leader) {
            this.selectedLeader = myCards.leader;
          } else this.selectedLeader = this.leaders[0];
          this.getDataDeck();
        } else router.push("/login");
      },
      async saveDeck() {
        const router = useRouter();
        if (this.numberOfCards < 22) {
          window.alert('Necessário inserir pelo menos 22 cartas para Registrar um baralho completo');
        } else {
          const auth = await authenticate();
          if (auth) {
            await updateDeckUser(auth.email, this.faction, this.deckCards, this.selectedLeader);
          }
          else router.push("/login");
        }
      }
    },
    components: {
      Navigation,
      FooterElement,
      FontAwesomeIcon,
    },
  }
</script>

<style scoped>
  .leader-div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .next-previous-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 0 20px;
  }
  .next-previous {
    font-size: 25px;
    color: white;
    font-weight: 800;
  }

  .save {
    padding: 5px 10px;
    margin-top: 10px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
  }

  .card {
    position: relative;
  }

  .card img {
    position: relative;
  }

  .factions {
    display: flex;
    gap: 20px;
  }

  .quant {
    width: 10px;
    height: 10px;
    color: black;
    position: absolute;
    top: 4px;
    right: 4px;
    border-radius: 25%;
    background-color: white;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
  }

  .title-leader {
    padding-bottom: 10px;
  }

  .title-menu {
    display: flex;
    justify-content: space-between;
    padding: 20px 20px 0 20px;
    width: 100%;
  }

  .faction-effect {
    padding: 20px;
    color: white;
  }

  .title-menu p {
    color: white;
    font-weight: 600;
  }

  .title-menu p:nth-child(02) {
    font-size: 20px;
  }

  .menu {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 80vh;
  }

  .main { 
    color: white;
    font-weight: 800;
    margin-top: 30px;
    font-size: 20px;
  }

  .list-cards {
    width: 39%;
    display: grid;
    grid-template-columns: 30% 30% 30%;
    gap: 20px;
    overflow-y: auto;
  }

  .list-cards-02 {
    width: 39%;
    overflow-y: auto;
  }

  .div-list-cards {
    display: grid;
    grid-template-columns: 30% 30% 30%;
    gap: 20px;
    overflow-y: auto;
  }

  .details {
    width: 20%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  
  .button-card {
    background: transparent;
    border: none;
    cursor: pointer;
  }
  
  p {
    padding-top: 5px;
    color: white;
    font-size: 0.85em;
    color: #a7a08f;
  }
  
  .title {
    padding-top: 15px;
  }

  .text-green {
    color: rgb(90, 207, 90);
  }

  .text-red {
    color: red;
  }

  img {
    width: 100%;
    border: 4px solid transparent;
    cursor:pointer;
  }

  #leader {
    width: 27%;
  }

  @media screen and (max-width: 540px) {

  }
</style>
