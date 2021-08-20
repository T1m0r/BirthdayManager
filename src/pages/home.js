import React from "react";
import logo from "../logo.svg";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
	const history = useHistory();
	const currentUser = useSelector((state) => state.user);

	return (
		<header className='App-header'>
			{currentUser.user ? (
				<div>
					<button onClick={() => history.push("/logout")}>SIGN OUT</button>
					<button onClick={() => history.push("/dashboard")}>Dashboard</button>
				</div>
			) : (
				<button onClick={() => history.push("/login")}>SIGN IN</button>
			)}
			<img src={logo} className='App-logo' alt='logo' />
			<p>
				Edit <code>src/App.js</code> and save to reload.
			</p>
			<a
				className='App-link'
				href='https://reactjs.org'
				target='_blank'
				rel='noopener noreferrer'>
				Learn React
			</a>
		</header>
	);
};

export default Home;
