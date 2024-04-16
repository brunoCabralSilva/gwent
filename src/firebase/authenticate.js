import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updatePassword } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDRSHgIyIgCLlgvMPHmoet_DU8UFRVYHeI",
  authDomain: "gwent-b5e5c.firebaseapp.com",
  projectId: "gwent-b5e5c",
  storageBucket: "gwent-b5e5c.appspot.com",
  messagingSenderId: "340071048057",
  appId: "1:340071048057:web:7eea38e2bd3955807dc5a8"
};

export const signIn = async (email, password) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    return false;
  }
}

export const signOutFirebase = async () => {
  const firebaseApp = initializeApp(firebaseConfig);
  try {
    const auth = getAuth(firebaseApp);
    await signOut(auth);
    return true;
  } catch (error) {
    window.alert('Não foi possível deslogar o usuário. Por favor, atualize a página e Tente novamente ('+ error + ').' );
    return false;
  }
};

export const authenticate = () => {
  const firebaseApp = initializeApp(firebaseConfig);
  return new Promise(function(resolve) {
    var auth = getAuth(firebaseApp);
    var unsubscribe = onAuthStateChanged(auth, function(user) {
      if (user) {
        var displayName = user.displayName;
        var email = user.email;
        resolve({
          email: email,
          displayName: displayName,
        });
      } else resolve(null);
      unsubscribe();
    });
  });
};

export const changeUserPassword = async ( oldPassword, email, newPassword) => {
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  try {
    const credenciais = signInWithEmailAndPassword(auth, email, oldPassword);
    await credenciais;
    const user = auth.currentUser;
    await updatePassword(user, newPassword);
    window.alert('Senha alterada com sucesso!');
    return true
  } catch (error) {
    window.alert('Erro ao alterar a senha: (' + error + ')');
    return false;
  }
};

export const forgotPassword = async (email) => {
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    window.alert('Erro ao enviar e-mail de redefinição de senha: ' + error + ')');
    return false;
  }
};