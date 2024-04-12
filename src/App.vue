<template>
  <div class="app-div">
    <Navigation />
    <router-view></router-view>
    <FooterElement/>
  </div>
</template>

<script>
  import FooterElement from './components/Footer.vue'
  import Navigation from './components/Navigation.vue'

  export default {
    name: 'App',
    components: {
      Navigation,
      FooterElement,
    }
  }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .app-div {
    background: linear-gradient(to bottom, #081F19, black);
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
