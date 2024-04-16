<template>
  <section v-if="showData" class="app-container">
    <section class="img-container">
      <img src="../assets/05.png" alt="geralt de Rivia">
    </section>
    <section class="content-container-1">
      <div class="content-container">
        <div v-if="!showData" class="loading-container">
          <div class="loading-spinner"></div>
        </div>
        <div v-else class="login-container">
          <img src="../assets/gwent-icon.png" alt="" id="img-icon" />
          <div class="form-container">
            <div class="input-container">
              <label for="email" class="input-label">Email</label>
              <input 
                type="email"
                name="email"
                id="email" 
                v-model="email"
                class="input-field"
                placeholder="name@company.com"
              />
            </div>
            <div class="input-container">
              <label for="password" class="input-label">Senha</label>
              <input 
                type="password"
                name="password"
                id="password"
                v-model="password"
                @keydown.enter="handleLogin"
                class="input-field"
                placeholder="••••••"
              />
            </div>
            <div class="forgot-password-container">
              <button class="forgot-password-button"
              >Esqueceu a Senha?</button>
            </div>
            <button 
              type="button"
              @click="handleLogin"
              class="login-button"
            >
              {{ loading ? 'Verificando...' : 'Entrar'}}
            </button>
            <router-link to="/register" class="register-link">Não tem uma conta? <span class="register-link-bold">Cadastrar</span></router-link>
          </div>
        </div>
      </div>
      <ForgotPassword v-if="showForgotPassword" />
    </section>
  </section>
</template>

<script>
import { useRouter } from "vue-router";
import { authenticate, signIn } from "../firebase/authenticate";

export default {
  name: 'LoginUser',
  data() {
    return {
    email: '',
    password: '',
    loading: false,
    showData: false,
    }
  },
  async created() {
    const router = useRouter();
    const auth = await authenticate();
    if (auth) router.push("/");
    else this.showData = true;
  },
  methods: {
    async handleLogin() {
      const router = this.$router;
      this.loading = true;
      const validate = /\S+@\S+\.\S+/;
      const vEmail = !this.email || !validate.test(this.email) || this.email === '';
      if (vEmail) {
        window.alert('Necessário preencher um Email válido');
        this.loading = false;
      } else if (!this.password || this.password.length < 6) {
        window.alert('Necessário inserir uma Senha com pelo menos 6 dígitos');
        this.loading = false;
      } else {
        const log = await signIn(this.email, this.password);
        if (log) router.push("/");
        else window.alert('Não foi possível realizar o login. Por favor, verifique suas credenciais e tente novamente.');
        this.loading = false;
      }
    },

    handleKeyDown(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.handleLogin();
      }
    },
  },
};
</script>

<style scoped>
  .app-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .img-container {
    width: 50%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    min-height: 100vh;
    background: url('../assets/05.png');
    background-position: contain
  }

  .img-container img {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    object-position: center;
  }

  .content-container-1 {
    height: 100vh;
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .content-container {
    width: 60%;
  }

  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .loading-spinner {
    border: 6px solid #f3f3f3;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .login-container {
    border-radius: 10px;
    padding: 30px;
    margin-top: 20px;
  }

  #img-icon {
    width: 40%;
    margin-bottom: 30px;
  }

  .image-container {
    text-align: center;
  }

  .app-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .welcome-text {
    text-align: center;
    font-size: 1.5rem;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .form-container {
    display: flex;
    flex-direction: column;
  }

  .input-container {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .input-label {
    font-size: 0.875rem;
    color: white;
    width: 100%;
    text-align: left;
  }

  .input-field {
    width: 100%;
    padding: 10px;
    background-color: transparent;
    color: white;
    border: 2px solid #7E652D;
    border-radius: 5px;
    font-size: 1rem;
  }

  .forgot-password-container {
    text-align: right;
    margin-bottom: 15px;
  }

  .forgot-password-button {
    background-color: transparent;
    border: none;
    color: white;
    font-size: 0.875rem;
    cursor: pointer;
    text-decoration: underline;
  }

  .forgot-password-button:hover {
    color: #06eb84;
  }

  .login-button {
    background-color: #007C44;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 10px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-bottom: 10px;
    font-weight: 700;
  }

  .login-button:hover {
    background-color: #004928;
  }

  .register-link {
    text-align: center;
    font-size: 0.875rem;
    color: white;
    margin-top: 20px;
  }

  .register-link:hover {
    color: #06eb84;
  }

  .register-link-bold {
    font-weight: bold;
  }

  
  @media screen and (max-width: 900px) {
    .content-container {
      width: 90%;
    }
  }
  
  @media screen and (max-width: 649px) {
    .content-container-1 {
      width: 100%;
    }

    .img-container {
      display: none;
    }
  }
</style>
