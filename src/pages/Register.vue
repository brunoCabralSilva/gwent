<template>
  <section class="app-container">
    <section class="img-container">
      <img src="../assets/05.png" alt="geralt de Rivia">
    </section>
    <section class="content-container-1">
      <div class="content-container">
        <div class="login-container">
          <img src="../assets/gwent-icon.png" alt="" id="img-icon" />
          <div class="form-container">
            <div class="input-container">
              <label for="firstName" class="input-label">Nome</label>
              <input 
                type="text"
                name="firstName"
                id="firstName" 
                v-model="firstName"
                class="input-field"
                placeholder="Seu primeiro nome"
              />
            </div>
            <div class="input-container">
              <label for="firstName" class="input-label">Sobrenome</label>
              <input 
                type="text"
                name="firstName"
                id="firstName" 
                v-model="lastName"
                class="input-field"
                placeholder="Seu último nome"
              />
            </div>
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
              <label htmlFor="image" class="input-label">Escolha uma Imagem para seu perfil</label>
                <input 
                  id="image"
                  name="image"
                  type="file"
                  @change="handleImage"
                  class="input-field"
                />
            </div>
            <div class="input-container">
              <label for="password" class="input-label">Senha</label>
              <input 
                type="password"
                name="password"
                id="password"
                v-model="password"
                class="input-field"
                placeholder="••••••"
              />
            </div>
            <div class="input-container">
              <label for="password" class="input-label">Repita a Senha</label>
              <input 
                type="password"
                name="password"
                id="password"
                v-model="password2"
                @keydown.enter="handleRegister"
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
              @click="handleRegister"
              class="login-button"
            >
              {{ loading ? 'Verificando...' : 'Cadastrar'}}
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
import { registerUser } from '../firebase/user';
export default {
  name: 'LoginUser',
  data() {
    return {
      loading: false,
      email: '',
      firstName: '',
      lastName: '',
      image: '',
      password: '',
      password2: '',
    }
  },
  methods: {
    handleImage(e) {
      if (e.target.files[0]) {
        this.image = e.target.files[0];
      }
    },
    async handleRegister () {
      const router = this.$router;
      this.loading = true;
      const validate = /\S+@\S+\.\S+/;
      const vEmail = !this.email || !validate.test(this.email) || this.email === '';
      if (this.firstName.length < 2) {
        window.alert('Necessário preencher um Nome com mais de 2 caracteres');
      } else if (this.lastName.length < 2) {
        window.alert('Necessário preencher um Sobrenome com mais de 2 caracteres');
      } else if(vEmail) {
        window.alert('Necessário preencher um Email válido');
      } else if(this.image.length === 0 || this.image === '') {
        window.alert('Necessário escolher uma imagem de perfil');
      } else if (!this.password || this.password.length < 6) {
        window.alert('Necessário inserir uma Senha com pelo menos 6 dígitos');
      } else if (this.password !== this.password2) {
        window.alert('As senhas inseridas não conferem');
      } else {
        const reg = await registerUser(
          this.email,
          this.password,
          this.firstName,
          this.lastName,
          this.image,
        );
        if (reg) router.push('/');
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
        this.password2 = '';
      }
      this.loading = false;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
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
    overflow-y: auto;
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
  }

  .content-container {
    width: 80%;
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
