import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Cards from './pages/Cards.vue';
import Deck from './pages/Deck.vue';
import Players from './pages/Players.vue';
import Matchs from './pages/Matchs.vue';
import MatchPage from './pages/Match.vue';
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/cards', component: Cards },
    { path: '/deck', component: Deck },
    { path: '/players', component: Players },
    { path: '/matchs', component: Matchs },
    { path: '/matchs/:id', name: 'matchs', component: MatchPage, props: true },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
  ]
});

export default router;