import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import Home from "./pages/home.js";
import LogIn from "./pages/logIn.js";
import Logout from "./components/logout.js";
import ProtectedRoute from "./components/protectedRoute";
import Dashboard from "./pages/dashboard";
import { auth, createUserProfileDocument } from "./firebase/firebase.utils";
import { setCurrentUser } from "./redux/user/user.actions";
import "./App.css";

function App() {
	var unsubscribeFromAuth = null;
	const dispatch = useDispatch();
	const history = useHistory();
	var currentUser = useSelector((state) => state.user);

	useEffect(() => {
		unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
			console.log("userauth", userAuth);
			if (userAuth) {
				const userRef = await createUserProfileDocument(userAuth);
				userRef.onSnapshot((snapshot) => {
					dispatch(
						setCurrentUser({
							id: snapshot.id,
							...snapshot.data(),
						})
					);
				});
			} else {
				dispatch(setCurrentUser(userAuth));
			}
		});

		return unsubscribeFromAuth();
	}, [dispatch]);

	console.log(!!currentUser.user, currentUser);
	return (
		<div className='App'>
			{currentUser.user ? (
				<button onClick={() => history.push("/logout")}>SIGN OUT</button>
			) : (
				<button onClick={() => history.push("/login")}>SIGN IN</button>
			)}
			<Switch>
				<Route path={["/login", "/signup"]}>
					{!currentUser.user ? (
						<LogIn style={{ width: "100%" }} />
					) : (
						<Redirect to='/dashboard' />
					)}
				</Route>
				<ProtectedRoute path='/logout' component={Logout} />
				<ProtectedRoute path='/dashboard' title='Home' component={Dashboard} />
				<Route path='/' component={Home} />
			</Switch>
		</div>
	);
}

export default App;
