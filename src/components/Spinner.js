import React from "react";

import "./spinner.styles.css";

const Spinner = ({ customStyle }) => {
	// 	({ WrappedComponent, isLoading }) =>
	// (wrappedComponent, isLoading, ...otherProps) => {
	return (
		<div className='SpinnerOverlay' style={customStyle}>
			<div className='SpinnerContainer'></div>
		</div>
	);
	// ) : (
	// <wrappedComponent {...otherProps} />
	// );
};

export default Spinner;
