<template>
  <Navigation />
  <div class="main">
    Baralhos
  </div>
  <div class="list-cards">
    <button
      type="button"
      @click="redirectToPage('nilfgaard')"
      class="button-card"
    >
      <img
        class="search"
        :src="require(`../assets/cards/nilfgaard.png`)"
        alt="Search"
      />
      <p>Nilfgaard</p>
    </button>
    <button
      type="button"
      @click="redirectToPage('monsters')"
      class="button-card"
    >
      <img
        class="search"
        :src="require(`../assets/cards/monsters.png`)"
        alt="Search"
      />
      <p>Monstros</p>
    </button>
    <button
      type="button"
      @click="redirectToPage('northern-realms')"
      class="button-card"
    >
      <img
        class="search"
        :src="require(`../assets/cards/northern realms.png`)"
        alt="Search"
      />
      <p>Reinos do Norte</p>
    </button>
    <button
      type="button"
      @click="redirectToPage('scoiatael')"
      class="button-card"
    >
      <img
        class="search"
        :src="require(`../assets/cards/scoiatael.png`)"
        alt="Search"
      />
      <p>Scoia'tael</p>
    </button>
  </div>
  <FooterElement/>
</template>

<script>
  import { useRouter } from "vue-router";
  import { authenticate } from "../firebase/authenticate";
  import FooterElement from '../components/Footer.vue';
  import Navigation from '../components/Navigation.vue';
  export default {
    name: 'DeckPage',
    beforeCreate() { window.scrollTo({ top: 0, behavior: 'smooth' }) },
    async created() {
      const router = useRouter();
      const auth = await authenticate();
      console.log(auth);
      if (auth) this.showData = true;
      else router.push("/login");
    },
    methods: {
      redirectToPage(page) {
        const router = this.$router;
        router.push(`/deck/${page}`);
      }
    },
    components: {
      Navigation,
      FooterElement,
    },
  }
</script>

<style scoped>
  .main { 
    color: white;
    font-weight: 800;
    margin-top: 30px;
    font-size: 20px;
  }

  .list-cards {
    margin: 20px 0;
    width: 100%;
    display: flex;
    flex-flow: wrap;
    justify-content: space-around;
    gap: 20px;
  }

  .button-card {
    background: transparent;
    border: none;
    cursor: pointer;
  }

  p {
    padding: 20px;
    font-size: 17px;
    font-weight: 600;
    color: white; 
  }

  img {
    height: 500px;
    border: 4px solid transparent;
  }

  img:hover {
    border: 4px solid white;
  }

  @media screen and (max-width: 540px) {

  }
</style>
