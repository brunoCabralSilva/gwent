<template>
  <nav :class="type === 'match' ? 'nav-match' : 'nav'">
    <router-link @click="toggleMenu" to="/" >
      <img
        id="icon"
        src="../assets/logo-2.png"
        alt="Descrição da imagem"
      >
    </router-link>
    <div className="icons">
      <div class="div-notification" @click="toggleNotification">
        <FontAwesomeIcon
          :icon="['fas', 'bell']"
          class="notification"
        />
        <div v-if="this.listNotifications.length > 0" id="alert"></div>
      </div>
      <div class="div-icon-menu" @click="toggleMenu">
        <div :class="{ 'bar': !isOpen, 'bar1': isOpen }"></div>
        <div :class="{ 'bar': !isOpen, 'bar2': isOpen }"></div>
        <div :class="{ 'bar': !isOpen, 'bar3': isOpen }"></div>
      </div>
    </div>
  </nav>
  <img v-if="type !== 'match'" id="wallpaper" src="../assets/05.png" alt="Descrição da imagem">
  <div v-if="this.showNotification" class="div-options-notification">
    <div v-if="listNotifications.length === 0" class="notification-none">Você não possui notificações</div>
    <div v-for="(notification, index) in listNotifications" :key="index" class="notification-card">
      <div class="notification-date-close">
        <p class="notification-date">{{ notification.date }}</p>
        <FontAwesomeIcon
        :icon="['fas', 'circle-xmark']"
          class="notification"
          @click="deleteNotification(notification.id)"
        />
      </div>
      <p class="notification-message">{{ notification.message }}</p>
      <button
        type="button"
        class="notification-button"
        @click="redirectTo(notification.idMatch)"
      >
        Ingressar
      </button>
    </div>
  </div>
  <div v-if="isOpen" class="div-options">
    <img v-if="image !== ''" :src="image" alt="imagem de perfil do usuário">
    <router-link to="/" class="link" @click="toggleMenu">Home</router-link>
    <router-link to="/cards" class="link" @click="toggleMenu">Cartas</router-link>
    <router-link to="/players" class="link" @click="toggleMenu">Jogadores</router-link>
    <router-link to="/deck" class="link" @click="toggleMenu">Meu Baralho</router-link>
    <router-link to="/matchs" class="link" @click="toggleMenu">Partidas</router-link>
    <router-link
      v-if="!login"
      to="/login"
      class="link-login"
      @click="toggleMenu"
    >
      Login
    </router-link>
    <router-link
      v-if="login"
      @click="signOutFirebase"
      to="/"
      class="link-login"
    >
      Logout
    </router-link>
  </div>
</template>

<script>
  import router from "@/routes";
  import { authenticate, signOutFirebase } from "../firebase/authenticate";
  import { getUserByEmail } from "../firebase/user";
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { fas } from '@fortawesome/free-solid-svg-icons';
  import { deleteNotificationById, getNotificationsByEmail } from "@/firebase/notifications";
  library.add(fas);
  export default {
    name: "NavigationBar",
    props: ['type'],
    data() {
      return {
        isOpen: false,
        showNotification: false,
        listNotifications: [],
        login: false,
        image: '',
      };
    },
    async created() {
      const auth = await authenticate();
      this.$emitter.on('child2', async () => {
        console.log('aqui');
        this.listNotifications = await getNotificationsByEmail(auth.email);
        this.showNotification = true;
      });
      if (auth) {
        const userByEmail = await getUserByEmail(auth.email);
        this.listNotifications = await getNotificationsByEmail(auth.email);
        this.image = userByEmail.image;
        this.login = true;
      }
      else this.login = false;
    },
    methods: {
      async updateNotification() {
        const auth = await authenticate();
        if (auth) {
          this.showNotification = true;
          this.listNotifications = await getNotificationsByEmail(auth.email);
        }
      },
      toggleMenu() {
        this.isOpen = !this.isOpen;
        this.showNotification = false;
      },
      toggleNotification() {
        this.showNotification = !this.showNotification;
        this.isOpen = false;
      },
      redirectTo(id) {
        router.push(`/matchs/${id}`);
        this.showNotification = false;
      },
      async deleteNotification(id)  {
        this.listNotifications = this.listNotifications.filter((notif) => notif.id !== id);
        await deleteNotificationById(id);
      },
      async signOutFirebase() {
        await signOutFirebase();
        router.push('/');
        location.reload();
      }
    },
    components: {
      FontAwesomeIcon,
    }
  }
</script>
<style scoped>
  .notification-button {
    margin-top: 10px;
    padding: 7px;
    width: 100%;
    cursor: pointer;
    background-color: #012917;
    color: white;
    border: 2px solid transparent;
    font-weight: 700;
    font-size: 1em;
    border:none
  }

  .notification-button:hover {
    border: 2px solid white;
  }

  .notification-date-close {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .notification-message {
    padding-top: 10px;
    line-height: 1.5em;
  }

  .notification-date {
    padding-top: 10px;
    font-size: 12px;
    text-align: right;
  }

  .notification-card {
    margin-top: 10px;
    border: 1px solid #007C44;
    padding: 10px;
    color: white;
  }

  .notification-none {
    margin-top: 10vh;
    padding: 10px;
    color: white;
  }

  .notification-card:nth-child(1) {
    margin-top: 10vh;
  }

  .div-notification {
    position: relative;
    cursor: pointer;
    z-index: 50;
  }

  #alert {
    background: #D27F3C;
    width: 10px;
    height: 10px;
    border-radius: 100%;
    border: 1px solid black;
    position: absolute;
    top: 0;
    right: 0;
  }

  .icons {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .notification {
    color: #007C44;
    font-size: 1.5em;
    cursor: pointer;
  }

  p {
    color: white;
    font-weight: 700;
  }

  .nav {
    background-color: black;
    padding: 10px 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 50;
  }

  .nav-match {
    background-color: black;
    padding: 10px 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    z-index: 50;
  }

  #icon {
    width: 45px;
    cursor: pointer;
  }

  .div-options-notification {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    position: fixed;
    overflow-y: auto;
    top: 0;
    right: 0;
    background-color: black;
    height: 100vh;
    width: 25%;
    z-index: 40;
    border-left: 2px solid #007C44;
    transition: transform 0.3s ease-in-out;
  }

  .div-options {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    background-color: black;
    height: 100vh;
    width: 25%;
    z-index: 40;
    border-left: 2px solid #007C44;
    transition: transform 0.3s ease-in-out;
  }

  .div-options img {
    width: 70px;
    height: 70px;
    border-radius: 100%;
    border: 2px solid #007C44;
    margin-bottom: 30px;
  }

  .link {
    margin-top: 20px;
    color: #007C44;
    cursor: pointer;
    text-decoration: none;
    font-weight: bolder;
  }

  .link-login {
    margin-top: 100px;
    color: #007C44;
    cursor: pointer;
    text-decoration: none;
    font-weight: bolder;
  }

  .div-options > .link:hover, .link-login:hover {
    text-decoration: underline;
  }

  .div-none {
    position: fixed;
    top: 0;
    right: 0;
    background-color: black;
    height: 100vh;
    width: 0;
    border-left: 2px solid #007C44;
    transition: transform 0.3s ease-in-out;
  }

  #wallpaper {
    margin-top: 20px;
    width: 100%;
    height: 70vh;
    object-fit: cover;
    object-position: top;
    padding: 0 20px 20px 20px;
    background: black;
  }

  .div-icon-menu {
    z-index: 50;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    gap: 5px;
  }

  .menu-icon {
    width: 30px;
    height: 30px;
    position: relative;
    cursor: pointer;
  }

  .bar {
    width: 30px;
    height: 4px;
    background-color: #007C44;
  }

  .bar1 {
    width: 30px;
    height: 4px;
    background-color: #007C44;
    transform-origin: top left;
    transform: translateY(19px) rotate(-45deg);
  }

  .bar2 {
    width: 30px;
    height: 4px;
    background-color: #007C44;
    transform-origin: bottom left;
    transform: translateY(-12px) rotate(45deg);
  }

  .bar3 {
    width: 30px;
    height: 4px;
    background-color: #007C44;
    opacity: 0;
  }

  @media screen and (max-width: 900px) {
    .div-options {
      width: 50%;
    }
  }
  
  @media screen and (max-width: 649px) {
    .div-options {
      width: 100%;
      border: none;
    }
  }
</style>