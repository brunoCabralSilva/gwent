<template>
  <Navigation />
  <div class="main">
    Jogadores
  </div>
  <FooterElement/>
</template>

<script>
  import { useRouter } from "vue-router";
  import { authenticate } from "../firebase/authenticate";
  import FooterElement from '../components/Footer.vue';
  import Navigation from '../components/Navigation.vue';
  
  export default {
    name: 'PlayersPage',
    beforeCreate() { window.scrollTo({ top: 0, behavior: 'smooth' }) },
    async created() {
      const router = useRouter();
      const auth = await authenticate();
      console.log(auth);
      if (auth) this.showData = true;
      else router.push("/login");
    },
    components: {
      Navigation,
      FooterElement,
    },
  }
</script>

<style scoped>
  .main {
    min-height: 50vh; 
    color: white;
    font-weight: 800;
    margin-top: 30px;
    font-size: 20px;
  }
  @media screen and (max-width: 540px) {

  }
</style>
