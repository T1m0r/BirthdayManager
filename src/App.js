import React from "react";

import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import Home from "./pages/home.js";
import LogIn from "./pages/logIn.js";
import Logout from "./components/logout.js";
import ProtectedRoute from "./components/protectedRoute";
import Dashboard from "./pages/dashboard";
import AuthAppBar from "./components/AuthAppBar.js";
import BirthdayCountdown from "./pages/BirthdayCountdown.js";
import FlipCountdownTimer from "./components/FlipCountdownTimer";
import { auth, createUserProfileDocument } from "./firebase/firebase.utils";
import { connect } from "react-redux";
//import { createStructuredSelector } from "reselect";
import { setCurrentUser } from "./redux/user/user.actions";
import "./App.css";

//========//TODO\\=======\\
// - Add Action Buttons to Table in Dashboard (Edit)
// - Create Better Table (sortable) for Dashboard
// - Improve Dashboard (Table add column group) and improve add new user form
// - Create custom shareable dashboards for a list of people
// - Set birthdays to private or public
// - Create faster Countdowns
// - Create more Customization for Countdown - happy birthday screen custom imgs

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
					<ProtectedRoute
						path='/logout'
						component={Logout}
						user={currentUser}
					/>
					<Route path='/birthday/countdown/:id'>
						{currentUser.user ? (
							<AuthAppBar>
								<FlipCountdownTimer />
							</AuthAppBar>
						) : (
							<FlipCountdownTimer />
						)}
					</Route>
					<ProtectedRoute
						path='/dashboard'
						title='Home'
						component={Dashboard}
					/>
					<Route path='/' component={currentUser.user ? Dashboard : Home} />
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
