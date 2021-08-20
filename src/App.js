import React from "react";

import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Home from "./pages/home.js";
import LogIn from "./pages/logIn.js";
import Logout from "./components/logout.js";
import ProtectedRoute from "./components/protectedRoute";
import Dashboard from "./pages/dashboard";
import { auth, createUserProfileDocument } from "./firebase/firebase.utils";
import { connect } from "react-redux";
//import { createStructuredSelector } from "reselect";
import { setCurrentUser } from "./redux/user/user.actions";
import "./App.css";

class App extends React.Component {
	unsubscribeFromAuth = null;

	componentDidMount() {
		console.log("Debugging");
		const { setCurrentUser } = this.props;
		this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
			console.log("userauth", userAuth);
			if (userAuth) {
				const userRef = await createUserProfileDocument(userAuth);
				userRef.onSnapshot((snapshot) => {
					setCurrentUser({
						id: snapshot.id,
						...snapshot.data(),
					});
				});
			} else {
				setCurrentUser(userAuth);
			}
		});
	}

	componentWillUnmount() {
		this.unsubscribeFromAuth();
	}

	render() {
		console.log(this.props);
		const { /*history,*/ currentUser } = this.props;
		return (
			<div className='App'>
				<Switch>
					<Route path={["/login", "/signup"]}>
						{!currentUser.user ? (
							<LogIn style={{ width: "100%" }} />
						) : (
							<Redirect to='/dashboard' />
						)}
					</Route>
					<ProtectedRoute path='/logout' component={Logout} />
					<ProtectedRoute
						path='/dashboard'
						title='Home'
						component={Dashboard}
					/>
					<Route path='/' component={Home} />
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	currentUser: state.user,
});

const mapDispatchToProps = (dispatch) => ({
	setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
