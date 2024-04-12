<template>
  <div class="main">
    Cartas
  </div>
  <div className="list-cards">
    <div v-for="(card, index) in cards" :key="index" class="card">
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
</template>

<script>
  import listCards from '../cards';
  export default {
    name: 'CardsPage',
    data() {
      return {
        cards: listCards,
      };
    },
    beforeCreate() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
  }
</script>

<style scoped>
  .list-cards {
    width: 100%;
    display: grid;
    grid-template-columns: auto auto auto auto auto auto auto;
    gap: 20px;
    padding: 20px;
  }

  .card {
    cursor: pointer;
    width: 100%;
  }

  .card img {
    width: 12vw;
    object-fit: contain;
  }

  .main {
    color: white;
    font-weight: 800;
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 20px;
  }
  @media screen and (max-width: 540px) {

  }
</style>
