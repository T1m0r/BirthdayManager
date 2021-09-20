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

export const queryBirthdays = async (id, storedBirthdays) => {
	let res = [];
	await Promise.all(
		storedBirthdays.map(async (item) => {
			const data = await queryDocumentElement("birthdays", item, "get");
			res = [...res, { id: data.id, ...data.data() }];
		})
	);
	return res;
	// Get all birthdays
	// const res = firestore.collection("birthdays");
	// const data = await res.get();
	// let ret = [];
	// 		data.docs.forEach((item) => {
	// 		console.log(item.id);
	// 		ret = [...ret, { id: item.id, ...item.data() }];
	// 	})
	// );
	// return ret;
};
export const queryDocumentElement = async (
	document,
	elementID,
	stage = "data"
) => {
	const res = await firestore.collection(document).doc(elementID);
	if (stage === "request") {
		return res;
	} else {
		const data = await res.get();
		if (stage === "get") {
			return data;
		} else if (stage === "data") {
			return data.data();
		}
	}
	// console.log(data.data());
};

export const addDocument = async (document, element) => {
	return await firestore.collection(document).add(element);
};

export const updateUser = async (id, type, updateField, updateValue) => {
	var user = await firestore.collection("users").doc(id);
	console.log(user);
	if (type === "addArray") {
		// Atomically add a new region to the "regions" array field.
		const newUser = await user.update({
			[updateField]: firebase.firestore.FieldValue.arrayUnion(updateValue),
		});
		console.log("her", newUser);
	} else if (type === "removeArray") {
		// Atomically remove a region from the "regions" array field.
		await user.update({
			[updateField]: firebase.firestore.FieldValue.arrayRemove(updateValue),
		});
	}
};

export const addBirthday = async (id, element) => {
	const newDoc = await addDocument("birthdays", element);
	await updateUser(id, "addArray", "storedBirthdays", newDoc.id);
};

export const removeDocument = async (userId, document, docId) => {
	const item = await queryDocumentElement(document, docId, "request");
	item.delete();
	await updateUser(userId, "removeArray", "storedBirthdays", docId);
};
export default app;
