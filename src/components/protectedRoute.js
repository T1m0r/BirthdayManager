import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import { Redirect, Route } from "react-router-dom";

const ProtectedRoute = ({ component: Component, title, ...rest }) => {
	const user = useSelector((state) => state.user).user;

	useEffect(() => {
		if (title) {
			document.title = `Birthday-Manager » ${title}`;
		} else {
			document.title = "Birthday-Manager";
		}
	}, []);

	return (
		<Route
			{...rest}
			render={(props) =>
				user !== null ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};

export default ProtectedRoute;
