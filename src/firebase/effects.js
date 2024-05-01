import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { checkWinner } from "./matchs";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDRSHgIyIgCLlgvMPHmoet_DU8UFRVYHeI",
  authDomain: "gwent-b5e5c.firebaseapp.com",
  projectId: "gwent-b5e5c",
  storageBucket: "gwent-b5e5c.appspot.com",
  messagingSenderId: "340071048057",
  appId: "1:340071048057:web:7eea38e2bd3955807dc5a8"
};

export async function playInField(card, matchId, idUser, effect) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const userRef = doc(db, 'matchs', matchId);
    const userDocSnapshot = await getDoc(userRef);
    if (userDocSnapshot.exists()) {
      const matchData =  userDocSnapshot.data();
      const findAnotherUser = matchData.users.find((match) => match.user !== idUser);
      const findUser = matchData.users.find((match) =>  match.user === idUser);
      switch(effect) {
        case 'queimar':
          var maxPower = 0;
          for (let i = 0; i < findAnotherUser.field.length; i += 1) {
            if (!findAnotherUser.field[i].hero && findAnotherUser.field[i].actualPower > maxPower) maxPower = findAnotherUser.field[i].actualPower;
          }
          findAnotherUser.discart = [...findAnotherUser.discart, ...findAnotherUser.field.filter((item) => !item.hero && item.actualPower === maxPower)];
          findAnotherUser.field = findAnotherUser.field.filter((item) => item.hero || item.actualPower !== maxPower);
          if (card.name === "Villentretenmerth") findUser.field.push(card);
          else findUser.discart.push(card);
          break;
        case 'climatics':
          if (!matchData.climatics.find((cardClim) => cardClim.name === card.name)) matchData.climatics.push(card);
          break;
        case 'tempo claro':
          matchData.climatics = [];
          findUser.discart.push(card);
          break;
        case 'espião':
          findAnotherUser.field.push(card);
          if (findUser.deck.length >= 2) {
            findUser.hand.push(findUser.deck[0]);
            findUser.hand.push(findUser.deck[1]);
            findUser.deck = findUser.deck.filter((cardDeck) => cardDeck.index !== findUser.deck[0].index && cardDeck.index !== findUser.deck[1].index);
          } 
          if (findUser.deck.length === 1) {
            findUser.hand.push(findUser.deck[0]);
            findUser.deck = findUser.deck.filter((cardDeck) => cardDeck.index !== findUser.deck[0].index);
          }
          break;
        case 'horns':
          if(card.name === 'Dandelion') findUser.field.push(card);
          else findUser.horns = { ...findUser.horns, [card.typeHorn]: [JSON.parse(JSON.stringify(card))] }
          break;
        case 'same cards from deck':
          findUser.field = [card, ...findUser.field, ...findUser.deck.filter((cardDeck) => cardDeck.name === card.name)];
          findUser.deck = findUser.deck.filter((cardDeck) => cardDeck.name !== card.name);
          break;
        case 'isca':
          if (!card.cardIndex) {
            findUser.discart.push(card);
          } else {
            var findCardIndex = findUser.field.find((cardField) => cardField.index === card.cardIndex);
            findUser.hand.push(findCardIndex);
            findUser.field = findUser.field.filter((cardField) => cardField.index !== card.cardIndex);
            findUser.field.push({ ...card, typeCard: findCardIndex.typeCard });
          }
          break;
        case 'ress':
          if (card.cardIndex) {
            const cardToField = findUser.discart.find((cardField) => cardField.index === card.cardIndex);
            findUser.field = [...findUser.field, card, cardToField];
            findUser.discart = findUser.discart.filter((cardField) => cardField.index !== card.cardIndex);

            if (cardToField.effect === 'Coloque no campo de batalha do seu oponente (conta para o total do seu oponente) e compre duas cartas do seu baralho.') {
              await playInField(this.selectedCard, this.matchId, this.dataMatchUserLogged.user, 'espião');
            } else if (cardToField.effect === 'Destrua a carta mais poderosa do oponente. O efeito se aplica a mais cartas se elas tiverem o mesmo valor.') {
              await playInField(this.selectedCard, this.matchId, this.dataMatchUserLogged.user, 'queimar');
            } 
            // else if (cardToField.effect === 'Pode ser colocado tanto na fileira de Combate Corpo a Corpo quanto na fileira de Combate à Distância. Não pode ser movido uma vez colocado.') {

            // }
          } else findUser.field.push(card);
          break;
          case 'both':
            findUser.field.push({...card, typeCard: card.typeHorn });
            break;
        default:
          findUser.field.push(card);
          break;
      }
      findUser.hand = findUser.hand.filter((cardItem) => cardItem.index !== card.index);
      if (findAnotherUser.hand.length === 0 && findUser.hand.length === 0) await checkWinner(matchData, userRef, findUser, findAnotherUser);
      else {
        if (findAnotherUser.pass || findAnotherUser.hand.length === 0) {
          findUser.play = true;
          findUser.message.icon = '';
          findUser.message.text = '';
          findAnotherUser.message.icon = '';
          findAnotherUser.message.text = '';
        } else {
          findUser.message.icon = "oponent";
          findUser.message.text = "Vez do oponente";
          findAnotherUser.message.icon = "player";
          findAnotherUser.message.text = "Sua vez!";
          findUser.play = false;
          findAnotherUser.play = true;
        }
        await updateDoc(userRef, { ...matchData, users: [ findAnotherUser, findUser] });
      }
    }
  } catch (error) {
    window.alert('Ocorreu um erro ao alançar a carta em jogo (' + error + '). Por favor, atualize a página e tente novamente.');
  }
}