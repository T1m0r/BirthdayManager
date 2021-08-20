import React, { useEffect } from "react";
import { auth } from "../firebase/firebase.utils.js";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/user/user.actions";

const Logout = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		const logoutFunc = async () => {
			auth.signOut();
			await dispatch(setCurrentUser(null));
		};
		logoutFunc();
		console.log("Signout");
	});

	return <Redirect to='/' />;
};

export default Logout;
