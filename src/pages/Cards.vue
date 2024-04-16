<template>
  <Navigation />
  <div class="main">
    <img
      @click="showSearch"
      class="search"
      :src="require(`../assets/search.png`)"
      alt="Search"
    />
    <p>Cartas</p>
    <p></p>
  </div>
  <div v-if="showFilter" class="input-search">
    <input
      type="text"
      class="input-card"
    />
    <button
      type="button"
    >
      <img
        class="search"
        :src="require(`../assets/search.png`)"
        alt="Search"
      />
    </button>
  </div>
  <p class="title-cards">Cartas genéricas (Sem facção específica) </p>
  <div class="list-cards">
    <div v-for="(card, index) in filteredCards('')" :key="index" class="card">
      <img :src="require(`../assets/cards/${card.image}.png`)" :alt="`Carta ${card.name}`" />
    </div>
  </div>
  <p class="title-cards">Baralho da Facção de Monstros</p>
  <div class="list-leaders">
    <div v-for="(card, index) in bringLeaders('monsters')" :key="index" class="card-leader">
      <img :src="require(`../assets/cards/${card.image}.png`)" :alt="`Carta ${card.name}`" />
    </div>
  </div>
  <div class="list-cards">
    <div v-for="(card, index) in filteredCards('monsters')" :key="index" class="card">
      <img :src="require(`../assets/cards/${card.image}.png`)" :alt="`Carta ${card.name}`" />
      <!-- <div>
        <h2>Nome: {{ card.name }}</h2>
        <p>{{ card.faction !== '' ? `Facção: ${card.faction }` : '' }}</p>
        <p>Poder: {{ card.power }}</p>
        <p>Tipo: {{ card.typeCard }}</p>
        <p>{{ card.hero ? 'Esta é uma Carta de Herói' : 'Não' }}</p>
        <p>{{ card.effect !== '' && `Efeito: ${card.effect }` }}</p>
      </div> -->
    </div>
  </div>
  <p class="title-cards">Cartas da Facção de Nilfgaard </p>
  <div class="list-leaders">
    <div v-for="(card, index) in bringLeaders('nilfgaard')" :key="index" class="card-leader">
      <img :src="require(`../assets/cards/${card.image}.png`)" :alt="`Carta ${card.name}`" />
    </div>
  </div>
  <div class="list-cards">
    <div v-for="(card, index) in filteredCards('nilfgaard')" :key="index" class="card">
      <img :src="require(`../assets/cards/${card.image}.png`)" :alt="`Carta ${card.name}`" />
    </div>
  </div>
  <p class="title-cards">Cartas da Facção dos Reinos do Norte </p>
  <div class="list-leaders">
    <div v-for="(card, index) in bringLeaders('northern realms')" :key="index" class="card-leader">
      <img :src="require(`../assets/cards/${card.image}.png`)" :alt="`Carta ${card.name}`" />
    </div>
  </div>
  <div class="list-cards">
    <div v-for="(card, index) in filteredCards('northern realms')" :key="index" class="card-leader">
      <img :src="require(`../assets/cards/${card.image}.png`)" :alt="`Carta ${card.name}`" />
    </div>
  </div>
  <p class="title-cards">Cartas da Facção dos Scoia'tael </p>
  <div class="list-leaders">
    <div v-for="(card, index) in bringLeaders('scoiatael')" :key="index" class="card-leader">
      <img :src="require(`../assets/cards/${card.image}.png`)" :alt="`Carta ${card.name}`" />
    </div>
  </div>
  <div class="list-cards">
    <div v-for="(card, index) in filteredCards('scoiatael')" :key="index" class="card">
      <img :src="require(`../assets/cards/${card.image}.png`)" :alt="`Carta ${card.name}`" />
    </div>
  </div>
  <p class="title-cards">Cartas da Facção de Skellige </p>
  <div class="list-leaders">
    <div v-for="(card, index) in bringLeaders('skellige')" :key="index" class="card-leader">
      <img :src="require(`../assets/cards/${card.image}.png`)" :alt="`Carta ${card.name}`" />
    </div>
  </div>
  <div class="list-cards">
    <div v-for="(card, index) in filteredCards('skellige')" :key="index" class="card">
      <img :src="require(`../assets/cards/${card.image}.png`)" :alt="`Carta ${card.name}`" />
    </div>
  </div>
  <FooterElement/>
</template>

<script>
  import listCards from '../cards';
  import FooterElement from '../components/Footer.vue';
  import Navigation from '../components/Navigation.vue';

  export default {
    name: 'CardsPage',
    data() {
      return {
        cards: listCards,
        showFilter: false,
      };
    },
    methods: {
      showSearch () {
        this.showFilter = !this.showFilter;
      },

      filteredCards (type) {
        return listCards
          .filter((cards) => cards.faction === type && cards.typeCard !== 'leader')
          .sort((a, b) => {
            if (a.power !== b.power) return b.power - a.power;
            return b.hero - a.hero;
          });
      },
      bringLeaders (type) {
        return listCards.filter((cards) => cards.faction === type && cards.typeCard === 'leader');
      }
    },
    components: {
      Navigation,
      FooterElement,
    },
    beforeCreate() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  }
</script>

<style scoped>
  .input-search {
    display: flex;
    width: 100%;
    padding: 20px;
  }

  .search {
    width: 30px;
    cursor: pointer;
  }
  
  .input-card {
    width: 100%;
    padding: 10px;
    text-align: left;
    font-size: 15px;
    font-weight: 600;
    margin-right: 5px;
  }

  .list-cards {
    width: 100%;
    display: grid;
    grid-template-columns: 14vw 14vw 14vw 14vw 14vw 14vw;
    gap: 20px;
    padding: 20px;
  }

  .list-leaders {
    width: 100%;
    display: grid;
    grid-template-columns: 14vw 14vw 14vw 14vw 14vw 14vw;
    gap: 20px;
    padding: 20px 20px 0 20px;
  }

  .card-leader {
    cursor: pointer;
  }

  .card {
    cursor: pointer;
    width: 100%;
  }

  .card img, .card-leader img {
    object-fit: contain;
    width: 100%;
  }

  .main {
    color: white;
    font-weight: 800;
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }

  .title-cards {
    color: white;
    font-weight: 800;
    margin-top: 30px;
    font-size: 20px;
    padding: 0 20px;
    width: 100%;
    text-align: left;
  }

  @media screen and (max-width: 499px) {
    .list-cards {
      width: 100%;
      display: grid;
      grid-template-columns: auto auto;
      gap: 10px;
      padding: 10px;
    }

    .list-leaders {
      width: 100%;
      display: grid;
      grid-template-columns: auto auto;
      gap: 10px;
      padding: 15px;
    }

    .title-cards {
      color: white;
      text-align: center;
      font-weight: 800;
      font-size: 16px;
    }
  }

  @media screen and (min-width: 500px) and (max-width: 659px) {
    .list-cards {
      width: 100%;
      display: grid;
      grid-template-columns: auto auto auto;
      gap: 10px;
      padding: 10px;
    }

    .list-leaders {
      width: 100%;
      display: grid;
      grid-template-columns: auto auto auto;
      gap: 10px;
      padding: 15px;
    }
  }

  @media screen and (min-width: 660px) and (max-width: 900px) {
    .list-cards {
      width: 100%;
      display: grid;
      grid-template-columns: auto auto auto auto auto;
      gap: 10px;
      padding: 10px;
    }

    .list-leaders {
      width: 100%;
      display: grid;
      grid-template-columns: 18vw 18vw 18vw 18vw 18vw;
      gap: 10px;
      padding: 10px;
    }
  }
</style>
