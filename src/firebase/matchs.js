import { registerNotification } from "./notifications";
'use client'
import { initializeApp } from 'firebase/app';
import { collection, getFirestore, addDoc } from 'firebase/firestore';

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

export const invitePlayer = async (userLogged, userToInvite) => {
  const create = await createChat(userLogged, userToInvite);
  const messageToUserInvited = `Saudações! O jogador ${capitalizeWords(userLogged.firstName)} ${capitalizeWords(userLogged.lastName)} te convidou para uma partida de Gwent. Avante, guerreiro, rumo à vitória!`;
  const messageToUserLogged = `Você convidou o usuário ${capitalizeWords(userToInvite.firstName)} ${capitalizeWords(userToInvite.lastName)} para uma partida de Gwent. Avante, guerreiro, rumo à vitória!`;
  await registerNotification(messageToUserLogged, create, userLogged.email);
  await registerNotification(messageToUserInvited, create, userToInvite.email);
}

export async function createChat(userLogged, userToInvite) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const chatCollectionRef = collection(db, 'matchs');
    const newChatDocRef = await addDoc(
      chatCollectionRef,
      {
        users: [
          {
            user: userLogged,
            deck: [], //cartas do baralho
            hand: [], //cartas na mão
            leader: [], //carta do líder
            discart: [], //cartas no descarte
            field: [], //cartas em campo
            winners: 0, //número de vitórias
            play: false, //é a vez do jogador?
          },
          {
            user: userToInvite,
            deck: [], //cartas do baralho
            hand: [], //cartas na mão
            leader: [], //carta do líder
            discart: [], //cartas no descarte
            field: [], //cartas em campo
            winners: 0, //número de vitórias
            play: false, //é a vez do jogador?
          },
        ],
      },
    );
    return newChatDocRef.id;
  } catch (error) {
    window.alert('Erro ao criar interação entre empresa e desenvolvedor: (' + error.message + ')');
    return false;
  }
}

// export async function createMatch(id, title, message) {
//   try {
//     const firebaseApp = initializeApp(firebaseConfig);
//     const db = getFirestore(firebaseApp);
//     const chatDocRef = doc(db, 'matchs', id);
//     const chatDocSnapshot = await getDoc(chatDocRef);
//     if (chatDocSnapshot.exists()) {
//       const chatData = chatDocSnapshot.data();  [title];
//       const currentMessages = chatData.chat || [];
//       currentMessages.push(message);
//       await updateDoc(chatDocRef, { 
//         chat: currentMessages,
//       });
//       return true;
//     } else {
//       window.alert('O registro de chat não foi encontrado.');
//       return false;}
//   } catch (error) {
//     window.alert('Erro ao enviar mensagem: ' + error.message);
//     return false;
//   }
// }