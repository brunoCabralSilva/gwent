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
      const deckToEspiao0 = findUser.deck[0];
      const deckToEspiao1 = findUser.deck[1];
      switch(effect) {
        case 'queimar':
          var maxPowerObj = findAnotherUser.field.reduce(function (prev, current) {
            return (prev.actualPower > current.actualPower) ? prev : current;
          });
          var maxPowerValue = maxPowerObj.actualPower;
          findAnotherUser.field = findAnotherUser.field.filter(function (item) {
              return !(item.hero === false && item.actualPower === maxPowerValue);
          });
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
          findUser.hand.push(deckToEspiao0);
          findUser.hand.push(deckToEspiao1);
          findUser.deck = findUser.deck.filter((cardDeck) => cardDeck.index !== deckToEspiao0.index && cardDeck.index !== deckToEspiao1.index);
          break;
        case 'horns':
          if(card.name === 'Dandelion') findUser.field.push(card);
          else findUser.horns = { ...findUser.horns, [card.typeHorn]: [JSON.parse(JSON.stringify(card))] }
          break;
        case 'same cards from deck':
          findUser.field = [...findUser.field, ...findUser.deck.filter((cardDeck) => cardDeck.name === card.name)];
          findUser.deck = findUser.deck.filter((cardDeck) => cardDeck.name !== card.name);
          break;
        case 'isca':
          findUser.hand.push(findUser.field.find((cardField) => cardField.index === card.cardIndex));
          findUser.field = findUser.field.filter((cardField) => cardField.index !== card.cardIndex);
          findUser.field.push(card);
          break;
        default:
          findUser.field.push(card);
          break;
      }
      findUser.hand = findUser.hand.filter((cardItem) => cardItem.index !== card.index);
      if (findAnotherUser.hand.length === 0 && findUser.hand.length === 0) await checkWinner(matchData, userRef, findUser, findAnotherUser);
      else {
        if (findAnotherUser.pass || findAnotherUser.hand.length === 0) findUser.play = true;
        else {
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