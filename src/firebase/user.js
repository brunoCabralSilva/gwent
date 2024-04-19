'use client'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDRSHgIyIgCLlgvMPHmoet_DU8UFRVYHeI",
  authDomain: "gwent-b5e5c.firebaseapp.com",
  projectId: "gwent-b5e5c",
  storageBucket: "gwent-b5e5c.appspot.com",
  messagingSenderId: "340071048057",
  appId: "1:340071048057:web:7eea38e2bd3955807dc5a8"
};

export async function getPlayers() {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(query(usersCollection));
    const developers = [];
    querySnapshot.forEach(doc => {
      developers.push({ id: doc.id, ...doc.data() });
    });
    return developers;
  } catch (error) {
    window.alert('Erro ao obter Desenvolvedores. Por favor, atualize a página e tente novamente (' + error + ')');
  }
}

export async function registerUser(
  email,
  password,
  firstName,
  lastName,
  image,
  ) {
    try {
    const firebaseApp = initializeApp(firebaseConfig);
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const imageURL = await createProfileImage(user.uid, image);
    await setDoc(doc(db, 'users', user.uid), {
      email: email.toLowerCase(),
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      image: imageURL,
      matchs: [],
      decks: [
        { type: 'monsters', cards: [] },
        { type: 'nilfgaard', cards: [] },
        { type: 'northern realms', cards: [] },
        { type: 'scoiatael', cards: [] },
        { type: 'skellige', cards: [] }
      ],
    });
    window.alert('Usuário registrado com sucesso!');
    return true;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert('Erro ao registrar:' + errorCode + ' - ' + errorMessage);
    return false;
  }
}

export async function getUserByEmail(email) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      window.alert('Usuário com o email fornecido não encontrado.');
    } else {
      let user;
      querySnapshot.forEach((doc) => {
        user = doc.data();
        user.id = doc.id;
      });
      return user;
    }
  } catch (error) {
    window.alert('Erro ao obter usuário por email: ' + error);
    return false;
  }
}

export async function getUserById(userId) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);

    const usersCollectionRef = collection(db, 'users');
    const userDoc = await getDoc(doc(usersCollectionRef, userId));

    if (!userDoc.exists()) {
      window.alert('Usuário com o ID fornecido não encontrado.');
      return null;
    } else {
      const user = userDoc.data();
      if (user) {
        user.id = userDoc.id;
        return user;
      } else {
        window.alert('Usuário encontrado com ID inválido.');
        return null;
      }
    }
  } catch (error) {
    window.alert('Erro ao obter usuário por ID: ' + error);
    return null;
  }
}

export async function updateUserById(userData) {
  try {
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const userDocRef = doc(db, 'users', userData.id);
    const userDocSnapshot = await getDoc(userDocRef);
    if (!userDocSnapshot.exists()) {
      window.alert('Usuário / Empresa não encontrad(a)');
    } else {
      await updateDoc(userDocRef, userData);
      window.alert('Dados atualizados com sucesso!');
      return true;
    }
  } catch (error) {
    window.alert('Erro ao atualizar dados: ' + error);
    return false;
  }
}

export async function updateDeckUser(email, faction, deckCards, leader) {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      window.alert('Usuário com o email fornecido não encontrado.');
      return false;
    }
    const deckIndex = user.decks.findIndex(deck => deck.type === faction.faction);
    if (deckIndex === -1) {
      window.alert('Deck para a facção especificada não encontrado.');
      return false;
    }
    user.decks[deckIndex].cards = deckCards;
    user.decks[deckIndex].leader = leader;
    const firebaseApp = initializeApp(firebaseConfig);
    const db = getFirestore(firebaseApp);
    const userDocRef = doc(db, 'users', user.id);
    await updateDoc(userDocRef, user);
    return true;
  } catch (error) {
    window.alert('Erro ao salvar o baralho do usuário para a Facção ' + faction.name + ': ' + error);
    return false;
  }
}

export async function createProfileImage (id, img){
  try {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const storageRef = ref(storage, `images/users/${id}/${img.name}`);
    await uploadBytes(storageRef, img);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    window.alert("Erro ao fazer upload da midia imagem: " + error.message);
    return false;
  }
}