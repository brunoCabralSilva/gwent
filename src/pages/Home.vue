<template>
  <Navigation />
  <div class="hello">
    <div class="grid">
      <div
        class="item-grid"
      >
        <img src="../assets/logo.png" alt="Descrição da imagem">
      </div>
      <router-link to="/cards" class="item-grid">
        <div class="background"></div>
        <p>Cartas</p>
      </router-link>
      <router-link to="/players" class="item-grid">
        <div class="background"></div>
        <p>Jogadores</p>
      </router-link>
      <router-link to="/matchs" class="item-grid">
        <div class="background"></div>
        <p>Partidas</p>
      </router-link>
      <router-link to="/deck" class="item-grid">
        <div class="background"></div>
        <p>Meu Baralho</p>
      </router-link>
    </div>
  </div>
  <FooterElement/>
</template>

<script>
  import FooterElement from '../components/Footer.vue';
  import Navigation from '../components/Navigation.vue';
  export default {
    name: 'HomePage',
    async beforeCreate() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    components: {
      Navigation,
      FooterElement,
    },
  }
</script>

<style scoped>
  img {
    height: 30vh;
    width: 100%;
    object-fit: contain;
  }

  .hello {
    width: 100%;
  }

  .grid {
    display: grid;
    grid-template-columns: auto auto auto auto auto;
    gap: 20px;
    padding: 20px;
    width: 100%;
  }

  .item-grid {
    border: 2px solid #007C44;
    background: black;
    cursor: pointer;
    position: relative;
    height: 100%;
    width: 100%;
  }

  .item-grid:nth-child(1) {
    background-image: url('../assets/005.jpg');
    background-size: cover;
    background-position: center;
    grid-column: span 3;
    cursor: auto;
    width: "100%";
  }

  .item-grid:nth-child(2) {
    background-image: url('../assets/009.png');
    background-size: cover;
    background-position: center;
    grid-row: span 3;
    grid-column: span 2;
    height: 100%;
    width: "100%";
  }

  .item-grid:nth-child(3) {
    background-image: url('../assets/010.png');
    background-size: cover;
    background-position: center;
    height: 100%;
    grid-row: span 2;
    width: "100%";
  }

  .item-grid:nth-child(4) {
    background-image: url('../assets/013.jpg');
    background-size: cover;
    background-position: top;
    height: 30vh;
    grid-column: span 2;
    width: "100%";
  }

  .item-grid:nth-child(5) {
    background-image: url('../assets/012.png');
    background-size: cover;
    background-position: center;
    grid-column: span 2;
    height: 30vh;
    width: "100%";
  }

  .background {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    background: linear-gradient(to top, black, rgb(0,0,0,0.8) , transparent);
  }

  p {
    position: absolute;
    bottom: 0;
    left: 0;
    font-weight: 700;
    font-size: 18px;
    color: white;
    padding: 15px;
  }

  @media screen and (max-width: 850px) {
    .img {
      width: 100%;
      height: 100%;
    }

    .grid {
        gap: 10px;
        display: grid;
        padding: 0 20px;
        grid-template-columns: auto auto;
      }

      .item-grid:nth-child(1) {
        background-image: url('../assets/005.jpg');
        background-size: cover;
        background-position: center;
        grid-column: span 2;
        cursor: auto;
      }

      .item-grid:nth-child(2) {
        background-image: url('../assets/010.png');
        background-size: cover;
        background-position: center;
        grid-row: span 2;
        grid-column: span 1;
        height: 30vh;
      }

      .item-grid:nth-child(3) {
        background-image: url('../assets/013.jpg');
        background-size: cover;
        background-position: center;
        grid-row: span 3;
        height: 100%;
      }

      .item-grid:nth-child(4) {
        background-image: url('../assets/009.png');
        background-size: cover;
        background-position: top;
        grid-column: span 1;
        height: 30vh;
      }

      .item-grid:nth-child(5) {
        background-image: url('../assets/012.png');
        background-size: cover;
        background-position: center;
        grid-column: span 2;
        height: 30vh;
      }
  }
</style>
