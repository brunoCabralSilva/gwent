<template>
  <div class="main">
    Jogadores
  </div>
</template>

<script>
  export default {
    name: 'PlayersPage',
    beforeCreate() { window.scrollTo({ top: 0, behavior: 'smooth' }) },
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
