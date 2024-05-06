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

const effectMoreOne = 'Adiciona +1 para todas as unidades na linha (exceto a si mesmo).';
const effectSameCards = 'Coloque ao lado de uma carta com o mesmo nome para dobrar a força de ambas as cartas (ou triplicar, caso três cartas com o mesmo nome estejam em campo).';
// const effectHorn = 'Duplica a força de todas as cartas de unidades em uma fileira. Limite de 1 por fileira.';

function updateThrownCardValue(card, climatics, dataUser) {
  card.actualPower = card.power;
  const fieldMelee = climatics.find((item) => item.name === 'Frio Congelante');
  const fieldRanged = climatics.find((item) => item.name === 'Névoa Impenetrável');
  const fieldSiege = climatics.find((item) => item.name === 'Chuva Torrencial');
  //Verifica se existe alguma carta de clima no campo e se coincide com o tipo
  if (fieldMelee && card.typeCard === 'melee' && !card.hero && card.name !== "Isca")
    card.actualPower = 1;
  if (fieldRanged && card.typeCard === 'ranged' && !card.hero && card.name !== "Isca")
    card.actualPower = 1;
  if (fieldSiege && card.typeCard === 'siege' && !card.hero && card.name !== "Isca")
    card.actualPower = 1;
  //Procura por cartas do tipo da lançada que ofereçam + 1 para todos
  const findMoreOne = dataUser.field.filter((cardItem) => cardItem.effect === effectMoreOne && cardItem.index !== card.index && cardItem.typeCard === card.typeCard && !card.hero);
  //Soma mais um para carta encontrada do tipo citado
  card.actualPower = card.actualPower + findMoreOne.length;
  //Verifica se existem cartas de corneta que coincidem com o tipo da carta lançada
  if ((dataUser.horns.melee.length > 0 || dataUser.field.find((cardItem) => cardItem.name === 'Dandelion')) && card.typeCard === 'melee' && !card.hero && card.name !== "Isca")
    card.actualPower = card.actualPower * 2;
  if (dataUser.horns.ranged.length > 0 && card.typeCard === 'ranged' && !card.hero && card.name !== "Isca")
    card.actualPower = card.actualPower * 2;
  if (dataUser.horns.siege.length > 0 && card.typeCard === 'siege' && !card.hero && card.name !== "Isca")
    card.actualPower = card.actualPower * 2;
  //Procura por cartas iguais a ela que tem o efeito de duplicar (ou triplicar) valores
  if(card.effect === effectSameCards) {
    const listEquals = dataUser.field.filter((cardItem) => cardItem.name === card.name && cardItem.index !== card.index);
    if (listEquals.length > 0) card.actualPower = card.actualPower * (listEquals.length + 1);
  }
  return card;
}

function throwHorn(card, dataUser) {
  if (dataUser.horns.siege.length > 0 && dataUser.horns.ranged.length > 0 && dataUser.horns.melee.length > 0 && card.name !== 'Dandelion') {
    delete card.typeHorn;
    dataUser.discart.push(card);
  } else  {
    if (card.typeHorn === 'melee' || card.name === 'Dandelion') {
      dataUser.field = dataUser.field.map((cardItem) => {
        if (cardItem.typeCard === 'melee' && !cardItem.hero && card.name !== "Isca") {
          cardItem.actualPower = cardItem.actualPower * 2;
          return cardItem;
        } else return cardItem;
      });
    } else if (card.typeHorn === 'ranged') {
      dataUser.field = dataUser.field.map((cardItem) => {
        if (cardItem.typeCard === 'ranged' && !cardItem.hero && card.name !== "Isca") {
          cardItem.actualPower = cardItem.actualPower * 2;
          return cardItem;
        } else return cardItem;
      });
    } else if (card.typeHorn === 'siege') {
      dataUser.field = dataUser.field.map((cardItem) => {
        if (cardItem.typeCard === 'siege' && !cardItem.hero && card.name !== "Isca") {
          cardItem.actualPower = cardItem.actualPower * 2;
          return cardItem;
        } else return cardItem;
      });
    }
    if(card.name === 'Dandelion') dataUser.field.push(card);
    else dataUser.horns = { ...dataUser.horns, [card.typeHorn]: [JSON.parse(JSON.stringify(card))] }
  }
  return dataUser;
}

function throwBurn(card, dataUser, dataOponent, climatics) {
  var maxPower = 0;
  for (let i = 0; i < dataOponent.field.length; i += 1) {
    if (!dataOponent.field[i].hero && dataOponent.name !== "Isca" && dataOponent.field[i].actualPower > maxPower)
    maxPower = dataOponent.field[i].actualPower;
  }
  dataOponent.discart = [
    ...dataOponent.discart,
    ...dataOponent.field
      .filter((item) => !item.hero && item.actualPower === maxPower && item.name !== "Isca")
      .map((cardItem) => {
        cardItem.actualPower = cardItem.power;
        return cardItem;
      }),
  ];
  dataOponent.field = dataOponent.field
    .filter((item) => !item.hero || item.actualPower !== maxPower || item.name !== "Isca")
    .map((cardItem) => {
      return updateThrownCardValue(cardItem, climatics, dataUser);
    })
  if (card.name === "Villentretenmerth") {
    card = updateThrownCardValue(card, climatics, dataUser)
    dataUser.field.push(card);
  } else dataUser.discart.push(card);
  return { dataUser, dataOponent };
}

function throwClimatics(card, matchData, dataUser, dataOponent) {
  if (matchData.climatics.find((cardClim) => cardClim.name === card.name)) {
    dataUser.discart.push(card);
  } else {
    matchData.climatics.push(card);
    dataUser.field = dataUser.field.map((cardItem) => {
      return updateThrownCardValue(cardItem, matchData.climatics, dataUser);
    });
    dataOponent.field = dataOponent.field.map((cardItem) => {
      return updateThrownCardValue(cardItem, matchData.climatics, dataOponent);
    });
  }
  return { dataUser, dataOponent };  
}

function throwClearWeather(dataUser, dataOponent) {
  dataUser.field = dataUser.field.map((cardItem) => {
    return updateThrownCardValue(cardItem, [], dataUser);
  });
  dataOponent.field = dataOponent.field.map((cardItem) => {
    return updateThrownCardValue(cardItem, [], dataOponent);
  });
  return { dataUser, dataOponent };  
}

function throwSpy(card, dataUser, dataOponent, climatics) {
  const updatedCard = updateThrownCardValue(card, climatics, dataOponent);
  dataOponent.field.push(updatedCard);
  if (dataUser.deck.length >= 2) {
    dataUser.hand.push(dataUser.deck[0]);
    dataUser.hand.push(dataUser.deck[1]);
    dataUser.deck = dataUser.deck.filter((cardDeck) => cardDeck.index !== dataUser.deck[0].index && cardDeck.index !== dataUser.deck[1].index);
  } else if (dataUser.deck.length === 1) {
    dataUser.hand.push(dataUser.deck[0]);
    dataUser.deck = dataUser.deck.filter((cardDeck) => cardDeck.index !== dataUser.deck[0].index);
    dataUser.deck = [];
  }
  return { dataUser, dataOponent };  
}

function throwSameCards(card, dataUser, climatics) {
  const sameCardsList = dataUser.deck
    .filter((cardDeck) => cardDeck.name === card.name)
    .map((cardItem) => {
      return updateThrownCardValue(cardItem, climatics, dataUser);
    });
  dataUser.field = [card, ...dataUser.field, ...sameCardsList];
  dataUser.deck = dataUser.deck.filter((cardDeck) => cardDeck.name !== card.name);
  return dataUser;
}

function throwBait(card, dataUser) {
  if (!card.cardIndex) {
    dataUser.field.push(card);
  } else {
    var findCardIndex = dataUser.field.find((cardField) => cardField.index === card.cardIndex);
    dataUser.hand.push({ ...findCardIndex, actualPower: findCardIndex.power });
    dataUser.field = dataUser.field.filter((cardField) => cardField.index !== card.cardIndex);
    dataUser.field.push({ ...card, typeCard: findCardIndex.typeCard });
  }
  return dataUser;
}

function throwBothFields(card, dataUser, climatics) {
  const newCard = { ...card, typeCard: card.typeHorn };
  delete newCard.typeHorn;
  dataUser.field.push(updateThrownCardValue(card, climatics, dataUser));
  return dataUser;
}

function throwRess(card, dataUser, dataOponent, climatics, matchData) {
  var cardToField = dataUser.discart.find((cardField) => cardField.index === card.cardIndex);
  dataUser.discart = dataUser.discart.filter((cardField) => cardField.index !== cardToField.index);
  dataUser.field = [...dataUser.field, card, cardToField];
  switch(cardToField.effect) {
    case 'horns':
      dataUser = throwHorn(card, dataUser);
      break;
    case 'queimar':
      var updatedBurnPlayers = throwBurn(card, dataUser, dataOponent, matchData.climatics);
      dataUser = updatedBurnPlayers.dataUser;
      dataOponent = updatedBurnPlayers.dataOponent;
      break;
    case 'climatics':
      var updateClimaticCards = throwClimatics(card, matchData, dataUser, dataOponent);
      dataUser = updateClimaticCards.dataUser;
      dataOponent = updateClimaticCards.dataOponent;
      break;
    case 'tempo claro':
      matchData.climatics = [];
      var updateClearWeather = throwClearWeather(dataUser, dataOponent);
      dataUser = updateClearWeather.dataUser;
      dataOponent = updateClearWeather.dataOponent;
      break;
    case 'espião':
      var updateSpy = throwSpy(card, dataUser, dataOponent, matchData.climatics);
      dataUser = updateSpy.dataUser;
      dataOponent = updateSpy.dataOponent;
      break;
    case 'same cards from deck':
      dataUser = throwSameCards(card, dataUser, matchData.climatics);
      break;
    case 'isca':
      dataUser = throwBait(card, dataUser);
      break;
    // case 'both':
    //   dataUser = throwBothFields(card, dataUser, matchData.climatics);
    //   break;
    // case 'ress':
    //   dataUser = throwRess(card, dataUser, matchData.climatics);
    //   break;
    case 'more 1':
      dataUser = throwMultiplyandMoreOne(card, dataUser, matchData.climatics);
      break;
    case 'multiply':
      dataUser = throwMultiplyandMoreOne(card, dataUser, matchData.climatics);
      break;
    default:
      dataUser.field.push(updateThrownCardValue(card, matchData.climatics, dataUser));
      break;
  }
  dataUser.field.push(updateThrownCardValue(card, climatics, dataUser));
  return dataUser;
}

function throwMultiplyandMoreOne(card, dataUser, climatics) {
  dataUser.field.push(card);
  dataUser.field = dataUser.field.map((cartItem) => {
    return updateThrownCardValue(cartItem, climatics, dataUser);
  });
  return dataUser;
}

export async function playInField(card, matchId, idUser, effect) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const userRef = doc(db, 'matchs', matchId);
    const userDocSnapshot = await getDoc(userRef);
    if (userDocSnapshot.exists()) {
      const matchData =  userDocSnapshot.data();
      let findAnotherUser = matchData.users.find((match) => match.user !== idUser);
      let findUser = matchData.users.find((match) =>  match.user === idUser);
      switch(effect) {
        case 'horns':
          findUser = throwHorn(card, findUser);
          break;
        case 'queimar':
          var updatedBurnPlayers = throwBurn(card, findUser, findAnotherUser, matchData.climatics);
          findUser = updatedBurnPlayers.dataUser;
          findAnotherUser = updatedBurnPlayers.dataOponent;
          break;
        case 'climatics':
          var updateClimaticCards = throwClimatics(card, matchData, findUser, findAnotherUser);
          findUser = updateClimaticCards.dataUser;
          findAnotherUser = updateClimaticCards.dataOponent;
          break;
        case 'tempo claro':
          matchData.climatics = [];
          var updateClearWeather = throwClearWeather(findUser, findAnotherUser);
          findUser = updateClearWeather.dataUser;
          findAnotherUser = updateClearWeather.dataOponent;
          break;
        case 'espião':
          var updateSpy = throwSpy(card, findUser, findAnotherUser, matchData.climatics);
          findUser = updateSpy.dataUser;
          findAnotherUser = updateSpy.dataOponent;
          break;
        case 'same cards from deck':
          findUser = throwSameCards(card, findUser, matchData.climatics);
          break;
        case 'isca':
          findUser = throwBait(card, findUser);
          break;
        case 'both':
          findUser = throwBothFields(card, findUser, matchData.climatics);
          break;
        case 'ress':
          var updateRess = throwRess(card, findUser, findAnotherUser, matchData.climatics, matchData);
          findUser = updateRess.dataUser;
          findAnotherUser = updateRess.dataOponent;
          break;
        case 'multiply or sum one':
          findUser = throwMultiplyandMoreOne(card, findUser, matchData.climatics);
          break;
        default:
          findUser.field.push(updateThrownCardValue(card, matchData.climatics, findUser));
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
    window.alert('Ocorreu um erro ao lançar a carta em jogo (' + error + '). Por favor, atualize a página e tente novamente.');
  }
}