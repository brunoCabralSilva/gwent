import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Cards from './pages/Cards.vue';
import Deck from './pages/Deck.vue';
import Players from './pages/Players.vue';
import Matchs from './pages/Matchs.vue';
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import ChatPage from './pages/Chat.vue';
import DeckByType from './pages/DeckByType.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/cards', component: Cards },
    { path: '/deck', component: Deck },
    { path: '/players', component: Players },
    { path: '/matchs', component: Matchs },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/chats/:id', name: 'chat', component: ChatPage, props: true },
    { path: '/deck/:type', name: 'deck', component: DeckByType, props: true },
  ]
});

export default router;