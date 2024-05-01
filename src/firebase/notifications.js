import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDRSHgIyIgCLlgvMPHmoet_DU8UFRVYHeI",
  authDomain: "gwent-b5e5c.firebaseapp.com",
  projectId: "gwent-b5e5c",
  storageBucket: "gwent-b5e5c.appspot.com",
  messagingSenderId: "340071048057",
  appId: "1:340071048057:web:7eea38e2bd3955807dc5a8"
};

export const getHoraOficialBrasil = async () => {
  try {
    const response = await fetch('https://worldtimeapi.org/api/timezone/America/Sao_Paulo');
    const data = await response.json();
    const date = new Date(data.utc_datetime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${hours}:${minutes}:${seconds}, ${day}/${month}/${year}`;
    return formattedDate;
  } catch (error) {
    return null;
  }
}

export async function registerNotification(message, id, email) {
  const date = await getHoraOficialBrasil();
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const chatCollectionRef = collection(db, 'notifications');
    const newChatDocRef = await addDoc(
      chatCollectionRef,
      {
        message,
        email,
        idMatch: id,
        date,
      },
    );
    return newChatDocRef.id;
  } catch (error) {
    window.alert('Erro ao registrar Notificação: (' + error.message + ')');
    return false;
  }
}

export async function getNotificationsByEmail(email) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const notificationsCollectionRef = collection(db, 'notifications');
    const querySnapshot = await getDocs(query(notificationsCollectionRef, where('email', '==', email)));
    const notificationsList = [];
    querySnapshot.forEach(doc => {
      notificationsList.push({ id: doc.id, ...doc.data() });
    });
    return notificationsList;
  } catch (error) {
    window.alert('Erro ao obter Notificações: ' + error.message);
    return false;
  }
}

export async function getNotificationById(notificationId) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const notificationDocRef = doc(db, 'notifications', notificationId);
    const notificationDocSnapshot = await getDoc(notificationDocRef);
    
    if (notificationDocSnapshot.exists()) {
      return { id: notificationDocSnapshot.id, ...notificationDocSnapshot.data() };
    } else {
      return false;
    }
  } catch (error) {
    window.alert('Erro ao obter Notificação: ' + error.message);
    return false;
  }
}

export async function deleteNotificationById(id) {
  try {
    const notificationToDelete = await getNotificationById(id);
    if (notificationToDelete) {      
      const firebaseApp = initializeApp(firebaseConfig);
      const db = getFirestore(firebaseApp);
      const notificationDocRef = doc(db, "notifications", id);
      const notificationDocSnapshot = await getDoc(notificationDocRef);
      if (notificationDocSnapshot.exists()) await deleteDoc(notificationDocRef);
    }
  } catch (error) {
    window.alert('Ocorreu um erro na interação com a Notificação (' + error + ').');
  }
}

export async function deleteNotificationsByMatch(idMatch) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const querySnapshot = await getDocs(query(collection(db, 'notifications'), where('idMatch', '==', idMatch)));
    querySnapshot.forEach(async (doc) => {
     await deleteDoc(doc.ref);
    });
  } catch (error) {
    window.alert('Ocorreu um erro ao excluir as notificações desta Partida (' + error + ').');
  }
}