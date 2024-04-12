<template>
  <footer>
    <img src="../assets/gwent-icon.png" alt="Descrição da imagem">
    <div class="data-footer">
      <p class="">© 2024 Bruno Cabral. Todos os direitos reservados.</p>
      <p class="cursor-pointer" @click="top">
        Retornar ao Topo
      </p>
    </div>
  </footer>
</template>

<script>
  export default {
    name: "FooterElement",
    components: {
    },
    methods: {
      top() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
</script>

<style scoped>
  img {
    width: 40px;
    height: 40px;
  }

  footer {
    color: white;
    position: relative;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    z-index: 10;
    background-color: black;
  }

  #div-footer {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    margin: 0 10px 0 10px; 
    gap: 10px;
  }

  .cursor-pointer {
    cursor: pointer;
    text-decoration: underline;
    font-weight: 700;
  }

  .data-footer {
    display: flex;
    flex-direction: column;
    justify-content: "";
    align-items: flex-end;
  }

  @media screen and (max-width: 540px) {
    footer {
      flex-direction: column;
    }

    .data-footer {
      display: flex;
      flex-direction: column;
      justify-content: "";
      align-items: center;
      gap: 15px;
      padding: 20px 0 10px 0;
    }

  }
</style>
