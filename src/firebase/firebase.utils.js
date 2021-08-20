import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Firebase Config
var firebaseConfig = {
	apiKey: "AIzaSyCiYfyzdFTtNsXl80hDk_HthkEkR1laY8Q",
	authDomain: "birthday-manager-62844.firebaseapp.com",
	projectId: "birthday-manager-62844",
	storageBucket: "birthday-manager-62844.appspot.com",
	messagingSenderId: "314601575458",
	appId: "1:314601575458:web:4715e0e018593eb4cca67b",
	measurementId: "G-49JQ89H07S",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const createUserProfileDocument = async (userAuth, additionalData) => {
	// IF User is not signed in
	if (!userAuth) return;

	// Query if auth-User is in DB
	const userRef = firestore.doc(`users/${userAuth.uid}`);
	const snapShot = await userRef.get();
	//console.log(snapShot);

	// If user does not exist create it
	if (!snapShot.exists) {
		// What data do we want to store
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			await userRef.set({ displayName, email, createdAt, ...additionalData });
		} catch (error) {
			console.log("Error creating User", error.message);
		}
	}
	return userRef;
};

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ promp: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default app;
