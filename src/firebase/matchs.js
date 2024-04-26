import { registerNotification } from "./notifications";
'use client'
import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, doc, getDoc, updateDoc, collection, getDocs, query, where, runTransaction, deleteDoc } from 'firebase/firestore';
import { getUserByEmail } from "./user";

const firebaseConfig = {
  apiKey: "AIzaSyDRSHgIyIgCLlgvMPHmoet_DU8UFRVYHeI",
  authDomain: "gwent-b5e5c.firebaseapp.com",
  projectId: "gwent-b5e5c",
  storageBucket: "gwent-b5e5c.appspot.com",
  messagingSenderId: "340071048057",
  appId: "1:340071048057:web:7eea38e2bd3955807dc5a8"
};

function capitalizeWords(str) {
  return str.replace(/\b\w/g, function(char) {
    return char.toUpperCase();
  });
}

export async function getAllMatches() {
  try {
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getFirestore(firebaseApp);
      const matchsCollectionRef = collection(db, 'matchs');
      const querySnapshot = await getDocs(matchsCollectionRef);
      const matches = [];
      querySnapshot.forEach(doc => {
          const match = doc.data();
          match.id = doc.id;
          matches.push(match);
      });
      return matches;
  } catch (error) {
      window.alert('Erro ao obter todas as partidas: ', error);
      return null;
  }
}

export async function getMatchById(matchId) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);

    const matchsCollectionRef = collection(db, 'matchs');
    const matchDoc = await getDoc(doc(matchsCollectionRef, matchId));

    if (!matchDoc.exists()) {
      window.alert('Partida com o ID fornecido não encontrada. Por favor, atualize a página e tente novamente.');
      return null;
    } else {
      const match = matchDoc.data();
      if (match) {
        match.id = matchDoc.id;
        return match;
      } else {
        window.alert('Partida encontrado com ID inválido. Por favor, atualize a página e tente novamente.');
        return null;
      }
    }
  } catch (error) {
    window.alert('Erro ao obter partida por ID: ' + error);
    return null;
  }
}

export const invitePlayer = async (userLogged, userToInvite) => {
  const create = await createMatch(userLogged, userToInvite);
  let messageToUserInvited = '';
  let messageToUserLogged = '';
  if (create.type === 'existent') {
    messageToUserInvited = `Saudações! O jogador ${capitalizeWords(userLogged.firstName)} ${capitalizeWords(userLogged.lastName)} reiterou o desejo de jogar com você!`;
    messageToUserLogged = `A partida entre você e o usuário ${capitalizeWords(userToInvite.firstName)} ${capitalizeWords(userToInvite.lastName)} já existe`;
  } else {
    messageToUserInvited = `Saudações! O jogador ${capitalizeWords(userLogged.firstName)} ${capitalizeWords(userLogged.lastName)} te convidou para uma partida de Gwent. Avante, guerreiro, rumo à vitória!`;
    messageToUserLogged = `Você convidou o usuário ${capitalizeWords(userToInvite.firstName)} ${capitalizeWords(userToInvite.lastName)} para uma partida de Gwent. Avante, guerreiro, rumo à vitória!`;
  }
  await registerNotification(messageToUserLogged, create.matchId, userLogged.email);
  await registerNotification(messageToUserInvited, create.matchId, userToInvite.email);
}

export async function createMatch(userLogged, userToInvite) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const userLoggedRef = doc(db, 'users', userLogged.id);
    const userLoggedDocSnapshot = await getDoc(userLoggedRef);
    const userToInviteRef = doc(db, 'users', userToInvite.id);
    const userToInviteDocSnapshot = await getDoc(userToInviteRef);

    if (userLoggedDocSnapshot.exists() && userToInviteDocSnapshot.exists()) {
      const userLoggedData =  userLoggedDocSnapshot.data();
      const userToInviteData =  userToInviteDocSnapshot.data();
      const matchWithUserToInvite = userLoggedData.matchs.find((match) => match.userOponentId === userToInvite.id);
      const matchWithUserLogged = userToInviteData.matchs.find((match) => match.userOponentId === userLoggedData.id);
      if (matchWithUserLogged || matchWithUserToInvite) {
        if (matchWithUserLogged) return { type: "existent", matchId: matchWithUserToInvite.matchId };
        return { type: "existent", matchId: matchWithUserToInvite.matchId };
      } else {
        const matchCollectionRef = collection(db, 'matchs');
        const dataMatch = await addDoc(
          matchCollectionRef, { climatics: [], users: [], playersEmail: [userLogged.email, userToInvite.email] }
        );
        const matchId = dataMatch.id;
        await updateDoc(
          userLoggedRef,
          {
            ...userLoggedData,
            matchs: [
              {
                matchId,
                userOponentId: userToInvite.id,
                deck: [],
                faction: '',
                hand: [],
                leader: [],
                discart: [],
                field: [],
                changes: 0,
              },
              ...userLoggedData.matchs,
            ],
          },
        );
        await updateDoc(
          userToInviteRef,
          {
            ...userToInviteData,
            matchs: [
              {
                matchId,
                userOponentId: userLogged.id,
                deck: [],
                faction: '',
                hand: [],
                leader: [],
                discart: [],
                field: [],
                changes: 0,
              },
              ...userToInviteData.matchs,
            ],
          },
        );
        return { type: "new", matchId };
      }
    }
  } catch (error) {
    window.alert('Erro ao criar uma partida: (' + error.message + ')');
    return false;
  }
}

export async function startGameUser(objectUser) {
  const objectToAdd = JSON.parse(JSON.stringify(objectUser));
  const matchDeck = objectUser.deck.flatMap(card => {
    if (card.quant > 1) {
      return Array.from({ length: card.quant }, () => {
        const cardWithoutQuant = Object.keys(card).reduce((acc, key) => {
          if (key !== 'quant') acc[key] = card[key];
          return acc;
        }, {});
        return cardWithoutQuant;
      });
    } else {
      const cardWithoutQuant = Object.keys(card).reduce((acc, key) => {
        if (key !== 'quant') acc[key] = card[key];
        return acc;
      }, {});
      return cardWithoutQuant;
    }
  });

  for (let i = matchDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [matchDeck[i], matchDeck[j]] = [matchDeck[j], matchDeck[i]];
  }

  const matchDeckWithIndex = matchDeck.map((item, index) => {
    return { ...item, index: index, actualPower: item.power };
  });

  objectToAdd.hand = matchDeckWithIndex.slice(0, 10);
  objectToAdd.deck = matchDeckWithIndex.slice(10);
  await populateMatch(objectToAdd);
}

export async function populateMatch(objectToAdd) {
  const { matchId, hand, faction, user, deck, leader } = objectToAdd;
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const userRef = doc(db, 'users', user.id);
    const userDocSnapshot = await getDoc(userRef);
    if (userDocSnapshot.exists()) {
      const userData =  userDocSnapshot.data();
      const findAnotherMatchs = userData.matchs.find((match) => match.matchId !== matchId);
      const findMatch = userData.matchs.find((match) => match.matchId === matchId);
      if (findAnotherMatchs) {
        await updateDoc(userRef, {
          ...userData,
          matchs: [
            findAnotherMatchs,
            {
              ...findMatch,
              matchId,
              faction,
              hand,
              deck,
              leader,
              changes: 0,
              message: { text: '', icon: ''},
              pass: false,
              winner: false,
            },
          ],
        });
      } else {
        await updateDoc(userRef, {
          ...userData,
          matchs: [{
            ...findMatch,
            matchId,
            faction,
            hand,
            deck,
            leader,
            changes: 0,
            message: { text: '', icon: ''},
            pass: false,
            winner: false,
          }],
        });
      }
    }
  } catch (error) {
    window.alert('Ocorreu um erro ao atualizar os detalhes da partida (' + error + '). Por favor, atualize a página e tente novamente.');
  }
}

export async function verifyIfIsPopulated(matchId, emailUser) {
  const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where('email', '==', emailUser));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return false;
    else {
      let user;
      querySnapshot.forEach((doc) => {
        user = doc.data();
        user.id = doc.id;
      });
      const findUser = user.matchs.find((match) => match.matchId === matchId);
      if (findUser) {
        return (findUser.deck.length > 0 && findUser.hand.length > 0);
      } return false;
    }
}

export async function verifyIfItsInMatch(matchId, userEmail) {
  const user = await getUserByEmail(userEmail);
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const matchRef = doc(db, 'matchs', matchId);
  const matchDocSnapshot = await getDoc(matchRef);
  if (matchDocSnapshot.exists()) {
    const matchData =  matchDocSnapshot.data();
    const find = matchData.users.find((player) => player.user === user.id);
    if (find) return true;
    return false;
  } return false;
}

export async function verifyChanges(matchId, emailUser) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where('email', '==', emailUser));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return false;
    else {
      let user;
      querySnapshot.forEach((doc) => {
        user = doc.data();
        user.id = doc.id;
      });
      const findUser = user.matchs.find((match) => match.matchId === matchId);
      return findUser.changes;
    }
  } catch (error) {
    window.alert('Ocorreu um erro ao verificar a quantidade de cartas trocadas (' + error + '). Por favor, atualize a página e tente novamente.');
  }
}

export async function updateCardsOfPlayer(objectMatch) {
  const { changes, hand, deck, matchId, idUser } = objectMatch;
  const dataDeck = JSON.parse(JSON.stringify(deck));
  const dataHand = JSON.parse(JSON.stringify(hand));
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const userRef = doc(db, 'users', idUser);
    const userDocSnapshot = await getDoc(userRef);
    if (userDocSnapshot.exists()) {
      const userData =  userDocSnapshot.data();
      const findAnotherMatchs = userData.matchs.find((match) => match.matchId !== matchId);
      const findMatch = userData.matchs.find((match) => match.matchId === matchId);
      if (changes === 2) {
        await runTransaction(db, async (transaction) => {
          const matchRef = doc(db, 'matchs', matchId);
          const matchDoc = await getDoc(matchRef);
          const matchData = matchDoc.data();
          const obj = {
            user: idUser,
            matchId,
            deck: dataDeck,
            faction: findMatch.faction,
            hand: dataHand,
            leader: findMatch.leader,
            discart: [],
            field: [],
            changes: 0,
            victories: 0,
            play: false,
            message: { text: '', icon: '' },
            pass: false,
            winner: false,
            horns: { melee: [], ranged: [], siege: [] },
          };
          const updatedUsers = [...matchData.users, obj];
          transaction.update(matchRef, { users: updatedUsers });
        });
        if (findAnotherMatchs) {
          await updateDoc(userRef, { ...userData, matchs: [findAnotherMatchs] });
        } else await updateDoc(userRef, { ...userData,  matchs: [] });
      } else {
        if (findAnotherMatchs) {
          await updateDoc(userRef, {
            ...userData,
            matchs: [
              findAnotherMatchs,
              { ...findMatch, deck, hand, changes },
            ],
          });
        } else {
          await updateDoc(userRef, {
            ...userData,
            matchs: [{ ...findMatch, deck, hand, changes }],
          });
        }
      }
    }
  } catch (error) {
    window.alert('Ocorreu um erro ao atualizar os detalhes da partida (' + error + '). Por favor, atualize a página e tente novamente.');
  }
}

export async function emailInTheMatch(matchId, emailUser) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const matchDocRef = doc(db, 'matchs', matchId);
    const matchDocSnapshot = await getDoc(matchDocRef);
    if (matchDocSnapshot.exists()) {
      const matchData = matchDocSnapshot.data();
      return matchData.playersEmail.find((email) => email === emailUser);
    } else return false;
  } catch (error) {
    window.alert('Erro ao verificar email do usuário: ' + error.message);
    return false;
  }
}

export async function checkWinner(matchData, userRef, findUser, findAnotherUser) {
  let totalValueLogged = 0;
  let totalValueInvited = 0;
  let winner = false;
  
  for (let i = 0; i < findUser.field.length; i += 1) {
    const dataCard = findUser.field[i];
    totalValueLogged += dataCard.actualPower;
  }

  for (let i = 0; i < findAnotherUser.field.length; i += 1) {
    const dataCard = findAnotherUser.field[i];
    totalValueInvited += dataCard.actualPower;
  }

  if (totalValueLogged > totalValueInvited) {
    findUser.victories += 1;
    if (findUser.victories === 2) {
      winner = true;
      findUser.message.text = 'Você venceu a partida!';
      findUser.message.icon = 'winner';
      findAnotherUser.message.text = 'Seu oponente venceu a partida!';
      findAnotherUser.message.icon = 'loose';
    } else {
      findUser.message.text = 'Você venceu a rodada!';
      findUser.message.icon = 'player';
      findAnotherUser.message.text = 'Seu oponente venceu a rodada!';
      findAnotherUser.message.icon = 'oponent';
      findAnotherUser.play = false;
      findUser.play = true;
    }
  } else if (totalValueLogged < totalValueInvited) {
    findAnotherUser.victories += 1;
    if (findAnotherUser.victories === 2) {
      winner = true;
      findAnotherUser.message.text = 'Você venceu a partida!';
      findAnotherUser.message.icon = 'winner';
      findUser.message.text = 'Seu oponente venceu a partida!';
      findUser.message.icon = 'loose';
    } else {
      findAnotherUser.message.text = 'Você venceu a rodada!';
      findAnotherUser.message.icon = 'winner-round';
      findUser.message.text = 'Seu oponente venceu a rodada!';
      findUser.message.icon = 'looser-round';
      findAnotherUser.play = true;
      findUser.play = false;
    }
  } else {
    if (findAnotherUser.faction.faction === 'nilfgaard' && findUser.faction.faction !== 'nilfgaard') {
      findAnotherUser.victories += 1;
      if (findAnotherUser.victories === 2) {
        winner = true;
        findAnotherUser.message.text = 'Você venceu a partida pois a Facção de Nilfgaard vence em caso de empate!';
        findAnotherUser.message.icon = 'winner';
        findUser.message.text = 'Seu oponente venceu a partida, pois a Facção de Nilfgaard vence em caso de empate!';
        findUser.message.icon = 'loose';
      } else {
        findAnotherUser.message.text = 'Você venceu a rodada pois a Facção de Nilfgaard vence em caso de empate!';
        findAnotherUser.message.icon = 'player';
        findUser.message.text = 'Seu oponente venceu a rodada, pois a Facção de Nilfgaard vence em caso de empate!';
        findUser.message.icon = 'oponent';
        findAnotherUser.play = true;
        findUser.play = false;
        findAnotherUser.play = true;
        findUser.play = false;
      }
    } else if (findUser.faction.faction === 'nilfgaard' && findAnotherUser.faction.faction !== 'nilfgaard') {
      findUser.victories += 1;
      if (findUser.victories === 2) {
        winner = true;
        findUser.message.text = 'Você venceu a partida pois a Facção de Nilfgaard vence em caso de empate!';
        findUser.message.icon = 'winner';
        findAnotherUser.message.text = 'Seu oponente venceu a partida, pois a Facção de Nilfgaard vence em caso de empate!';
        findAnotherUser.message.icon = 'loose';
      } else {
        findUser.message.text = 'Você venceu a rodada pois a Facção de Nilfgaard vence em caso de empate!';
        findUser.message.icon = 'player';
        findAnotherUser.message.text = 'Seu oponente venceu a rodada, pois a Facção de Nilfgaard vence em caso de empate!';
        findAnotherUser.message.icon = 'oponent';
        findAnotherUser.play = false;
        findUser.play = true;
      }
    } else {
      findAnotherUser.victories += 1;
      findUser.victories += 1;
      if (findUser.victories === 2 && findAnotherUser.victories === 2) {
        winner = true;
        findUser.message.text = 'Fim da partida. Empate!';
        findUser.message.icon = 'winner';
        findAnotherUser.message.text = 'Fim da partida. Empate!';
        findAnotherUser.message.icon = 'loose';
      } else if (findUser.victories === 2 && findAnotherUser.victories !== 2) {
        winner = true;
        findUser.message.text = 'Você venceu a partida!';
        findUser.message.icon = 'winner';
        findAnotherUser.message.text = 'Seu oponente venceu a partida!';
        findAnotherUser.message.icon = 'loose';
      } else if (findUser.victories !== 2 && findAnotherUser.victories === 2) {
        winner = true;
        findAnotherUser.message.text = 'Você venceu a partida!';
        findAnotherUser.message.icon = 'winner';
        findUser.message.text = 'Seu oponente venceu a partida!';
        findUser.message.icon = 'loose';
      } else {
        findUser.message.text = 'Empate!';
        findUser.message.icon = 'player';
        findAnotherUser.message.text = 'Empate!';
        findAnotherUser.message.icon = 'oponent';
      }
    }
  }
  if (findUser.faction.name === "Reinos do Norte" && findUser.play) {
    findUser.hand.push(findUser.deck[0]);
    findUser.deck.filter((card) => card.index !== findUser.deck[0].index);
  }
  if (findUser.faction.name === "Monstros") {
    if (findUser.field.length === 0) {
      findUser.discart = [...findUser.field, ...matchData.climatics, ...findUser.horns.melee, ...findUser.horns.ranged, ...findUser.horns.siege];
      findUser.field = [];
      matchData.climatics = [];
      findUser.horns = { melee: [], ranged: [], siege: [] };
    } else {
      const position = Math.floor(Math.random() * findUser.field.length);
      const saveDeckInTheField = findUser.field[position];
      findUser.discart = [...findUser.field.filter((card) => card.index !== saveDeckInTheField.index), ...matchData.climatics, ...findUser.horns.melee, ...findUser.horns.ranged, ...findUser.horns.siege];
      findUser.field = [findUser.field.find((card) => card.index === saveDeckInTheField.index)];
      matchData.climatics = [];
      findUser.horns = { melee: [], ranged: [], siege: [] };
    }
  } else {
    findUser.discart = [...findUser.field, ...matchData.climatics, ...findUser.horns.melee, ...findUser.horns.ranged, ...findUser.horns.siege];
    findUser.field = [];
    matchData.climatics = [];
    findUser.horns = { melee: [], ranged: [], siege: [] };
  }
  if (findAnotherUser.faction.name === "Monstros") {
    if (findAnotherUser.field.length === 0) {
      findAnotherUser.discart = [...findAnotherUser.field, ...matchData.climatics, ...findAnotherUser.horns.melee, ...findAnotherUser.horns.ranged, ...findAnotherUser.horns.siege];
      findAnotherUser.field = [];
      matchData.climatics = [];
      findAnotherUser.horns = { melee: [], ranged: [], siege: [] };
    } else {
      const position = Math.floor(Math.random() * findAnotherUser.field.length);
      const saveDeckInTheField = findAnotherUser.field[position];
      findAnotherUser.discart = findAnotherUser.field.filter((card) => card.index !== saveDeckInTheField.index);
      findAnotherUser.field = [findAnotherUser.field.find((card) => card.index === saveDeckInTheField.index)];
    }
  } else {
    findAnotherUser.discart = [...findAnotherUser.field, ...matchData.climatics, ...findAnotherUser.horns.melee, ...findAnotherUser.horns.ranged, ...findAnotherUser.horns.siege];
    findAnotherUser.field = [];
    matchData.climatics = [];
    findAnotherUser.horns = { melee: [], ranged: [], siege: [] };
  }

  findAnotherUser.pass = false;
  findUser.pass = false;
  if (findAnotherUser.field.length === 0 && findUser.field.length === 0) {
    await updateDoc(userRef,{ ...matchData, winner: winner, users: [{ ...findAnotherUser, field: [] }, { ...findUser, field: [] }]});
  } else if (findAnotherUser.field.length === 0) {
    await updateDoc(userRef,{ ...matchData, winner: winner, users: [{ ...findAnotherUser, field: [] }, findUser ]});
  } else if (findUser.field.length === 0) {
    await updateDoc(userRef,{ ...matchData, winner: winner, users: [ findAnotherUser, { ...findUser, field: [] }]});
  } else {
    await updateDoc(userRef, { ...matchData, winner: winner, users: [ findAnotherUser, findUser]});
  }
}

export async function passTurn(idUser, matchId) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const userRef = doc(db, 'matchs', matchId);
    const userDocSnapshot = await getDoc(userRef);
    if (userDocSnapshot.exists()) {
      const matchData =  userDocSnapshot.data();
      const findAnotherUser = matchData.users.find((match) => match.user !== idUser);
      const findUser = matchData.users.find((match) =>  match.user === idUser);
      findUser.pass = true;
      findUser.play = false;
      findAnotherUser.play = true;
      findAnotherUser.message.icon = "player";
      findAnotherUser.message.text = "Seu oponente passou a vez!";
      findUser.message.icon = "pass-turn";
      findUser.message.text = "Passou a vez!";
      if (findAnotherUser.pass || findAnotherUser.hand.length === 0) await checkWinner(matchData, userRef, findUser, findAnotherUser);
      else await updateDoc(userRef, { ...matchData, users: [ findAnotherUser, findUser] });
    }
  } catch (error) {
    window.alert('Ocorreu um erro ao passar o turno (' + error + '). Por favor, atualize a página e tente novamente.');
  }
}

export async function chooseInitPlayer(dataMatchUserInvited, dataMatchUserLogged, matchId) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const userRef = doc(db, 'matchs', matchId);
    const userDocSnapshot = await getDoc(userRef);
    if (userDocSnapshot.exists()) {
      const matchData =  userDocSnapshot.data();
      const randomBoolean = Math.random() < 0.5;
      dataMatchUserInvited.play = randomBoolean;
      if (dataMatchUserInvited.play) {
        dataMatchUserInvited.play = true;
        dataMatchUserLogged.play = false;
        dataMatchUserInvited.message.text = "Você ganhou no cara ou coroa e começa a partida!";
        dataMatchUserInvited.message.icon = 'start-player';
        dataMatchUserLogged.message.text = "Seu adversário ganhou no cara ou coroa e começa a partida!";
        dataMatchUserLogged.message.icon = 'not-start-player';
      } else {
        dataMatchUserInvited.play = false;
        dataMatchUserLogged.play = true;
        dataMatchUserInvited.message.text = "Seu adversário ganhou no cara ou coroa e começa a partida!";
        dataMatchUserInvited.message.icon = 'not-start-player';
        dataMatchUserLogged.message.text = "Você ganhou no cara ou coroa e começa a partida!";
        dataMatchUserLogged.message.icon = 'start-player';
      }
      await updateDoc(userRef, { ...matchData, users: [ dataMatchUserInvited, dataMatchUserLogged] });
    }
  } catch (error) {
    window.alert('Ocorreu um erro ao Escolher o jogador que começa (' + error + '). Por favor, atualize a página e tente novamente.');
  }
}

export async function cleanMessage(idUser, matchId) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const userRef = doc(db, 'matchs', matchId);
    const userDocSnapshot = await getDoc(userRef);
    if (userDocSnapshot.exists()) {
      const matchData =  userDocSnapshot.data();
      const findAnotherUser = matchData.users.find((match) => match.user !== idUser);
      const findUser = matchData.users.find((match) =>  match.user === idUser);
      findUser.message = { text: '', icon: '' };
      if (findAnotherUser) {
        await updateDoc(userRef, { ...matchData, users: [ findAnotherUser, findUser] });
      } else {
        await updateDoc(userRef, { ...matchData, users: [ findUser ],
        });
      }
    }
  } catch (error) {
    window.alert('Ocorreu um erro ao excluir mensagem (' + error + '). Por favor, atualize a página e tente novamente.');
  }
}

export async function removeUserFromMatch(idUser, matchId) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const userRef = doc(db, 'matchs', matchId);
    const userDocSnapshot = await getDoc(userRef);
    if (userDocSnapshot.exists()) {
      const matchData =  userDocSnapshot.data();
      const findAnotherUser = matchData.users.find((match) => match.user !== idUser);
      const findUser = matchData.users.find((match) =>  match.user === idUser);
      findUser.leave = true;
      if (findAnotherUser.leave) await deleteDoc(userRef);
      else await updateDoc(userRef, { ...matchData, users: [ findAnotherUser, findUser] });
    }
  } catch (error) {
    window.alert('Ocorreu um erro ao encontrar Jogador (' + error + '). Por favor, atualize a página e tente novamente.');
  }
}