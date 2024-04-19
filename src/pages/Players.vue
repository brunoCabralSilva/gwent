<template>
  <Navigation />
  <div class="main">
    Jogadores
    <div class="players">
      <div
        v-for="(user, index) in users"
        :key="index"
        class="player"
      >
        <img
          :src="user.image"
          :alt="user.firstName"
        />
        <p>{{ user.firstName }} {{ user.lastName }}</p>
        <button
          type="button"
          @click="invite(user.email)"
        >
          Desafiar
        </button>
      </div>
    </div> 
  </div>
  <FooterElement/>
</template>

<script>
  import { useRouter } from "vue-router";
  import { authenticate } from "../firebase/authenticate";
  import {
    getPlayers,
    getUserByEmail
  } from "@/firebase/user";
  import FooterElement from '../components/Footer.vue';
  import Navigation from '../components/Navigation.vue';
  import { invitePlayer } from "@/firebase/matchs";
  
  export default {
    name: 'PlayersPage',
    data() {
      return {
        users: [],
      };
    },
    methods: {
      async invite(email) {
        const router = useRouter();
        const auth = await authenticate();
        if (auth) {
          const userToInvite = this.users.find((user) => user.email === email);
          const userLogged = await getUserByEmail(auth.email);
          await invitePlayer(userLogged, userToInvite);
          this.$emitter.emit('child2');
        } else router.push("/login");
      },
    },
    async beforeCreate() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    async created() {
      const router = useRouter();
      const auth = await authenticate();
      if (auth) this.showData = true;
      else router.push("/login");
      const users = await getPlayers();
      this.users = users.filter((user) => user.email !== auth.email);
    },
    components: {
      Navigation,
      FooterElement,
    },
  }
</script>

<style scoped>
  img {
    width: 100px;
    height: 100px;
    border-radius: 100%;
  }

  button {
    width: 100%;
    padding: 5px;
    margin-top: 15px;
    cursor: pointer;
    font-weight: 600;
  }

  p {
    text-transform: capitalize;
    margin-top: 12px;
  }

  .main {
    color: white;
    font-weight: 800;
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 20px;
    padding: 20px;
  }

  .players {
    width: 100%;
    display: grid;
    grid-template-columns: 14vw 14vw 14vw 14vw 14vw 14vw;
    gap: 20px;
    padding: 20px;
    font-size: 17px;
    font-weight: 600;
  }

  .player {
    border: solid 2px;
    padding: 20px;
    cursor: pointer;
  }

  @media screen and (max-width: 499px) {
    .players {
      width: 100%;
      display: grid;
      grid-template-columns: auto auto;
      gap: 10px;
      padding: 10px;
    }
  }

  @media screen and (min-width: 500px) and (max-width: 800px) {
    .players {
      width: 100%;
      display: grid;
      grid-template-columns: auto auto auto;
      gap: 10px;
      padding: 10px;
    }
  }

  @media screen and (min-width: 801px) and (max-width: 900px) {
    .players {
      width: 100%;
      display: grid;
      grid-template-columns: auto auto auto auto auto;
      gap: 10px;
      padding: 10px;
    }
  }
</style>
