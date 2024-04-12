<template>
  <nav>
    <router-link to="/" >
      <img
        id="icon"
        src="../assets/logo-2.png"
        alt="Descrição da imagem"
      >
    </router-link>
    <div class="div-icon-menu" @click="toggleMenu">
      <div :class="{ 'bar': !isOpen, 'bar1': isOpen }"></div>
      <div :class="{ 'bar': !isOpen, 'bar2': isOpen }"></div>
      <div :class="{ 'bar': !isOpen, 'bar3': isOpen }"></div>
    </div>
  </nav>
  <img id="wallpaper" src="../assets/05.png" alt="Descrição da imagem">
  <div v-if="isOpen" class="div-options">
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
      v-else
      to="/logout"
      class="link-login"
      @click="toggleMenu"
    >
      Logout
    </router-link>
  </div>
</template>

<script>
  export default {
    name: "NavigationBar",
    data() {
      return {
        isOpen: false,
        login: false,
      };
    },
    components: {
    },
    methods: {
      toggleMenu() {
        this.isOpen = !this.isOpen;
      }
    }
  }
</script>
<style scoped>
  p {
    color: white;
    font-weight: 700;
  }

  nav {
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

  #icon {
    width: 80px;
    cursor: pointer;
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
</style>