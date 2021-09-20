import React, { useState, useEffect } from "react";

import { queryDocumentElement } from "../firebase/firebase.utils";
// import FlipDown from "flipdown/src/flipdown.js";
import FlipDown from "./flipdown/flipdown";
import Spinner from "./Spinner";
import { withRouter } from "react-router";
import { SettingsSystemDaydreamRounded } from "@material-ui/icons";
// import "%PUBLIC_URL%/flipdown.styles.css";
import "./flipdown/flipCountdown.styles.css";

const FlipCountdownTimer = (props) => {
	const [birthday, setBirthday] = useState(0);
	const [name, setName] = useState("");
	const [toggle, setToggle] = useState(false);

	useEffect(() => {
		const setBirthdayData = async () => {
			let data = await (
				await queryDocumentElement("birthdays", props.match.params.id)
			).data();
			await setBirthday(data.birthday.toDate());
			setName(data.name);
		};
		setBirthdayData();
	}, []);

	console.log("Birthday", birthday);

	useEffect(() => {
		if (birthday) {
			// document.addEventListener("DOMContentLoaded", () => {
			let year = new Date().getFullYear();
			let myBday = birthday.setYear(year);
			if (new Date().getTime() > myBday + 3600 * 24 * 1000) {
				year += 1;
				myBday = birthday.setYear(year);
			}
			// Unix timestamp (in seconds) to count down to
			var twoDaysFromNow = myBday / 1000;

			// Set up FlipDown
			var flipdown = new FlipDown(twoDaysFromNow)

				// Start the countdown
				.start()

				// Do something when the countdown ends
				.ifEnded(() => {
					document.getElementById("party").style.display = "inline";
					document.getElementById("birthdayCountdown").style.display = "none";
					// document.body.style.backgroundImage = "url('party.jpg')";
					console.log("The countdown has ended!");
				});

			// Toggle theme
			var interval = setInterval(() => {
				let body = document.body;
				setToggle((prevToggle) => !prevToggle);
				body.classList.toggle("light-theme");
				body
					.querySelector("#flipdown")
					.classList.toggle("flipdown__theme-dark");
				body
					.querySelector("#flipdown")
					.classList.toggle("flipdown__theme-light");
			}, 10000);
			// });
		}
	}, [birthday]);

	return birthday ? (
		<div className='rootWrap'>
			<div className='birthday party' id='party' style={{ display: "none" }}>
				<h1 style={{ fontWeight: "bold", fontSize: "6rem" }}>
					🎆 Happy Birthday 🎆
				</h1>
			</div>

			<div
				className='birthday'
				id='birthdayCountdown'
				style={{ display: "inline", width: "100%" }}>
				<h1
					id='countdownInfo'
					style={toggle ? { color: "white" } : { color: "black" }}>
					🎉 {name} Birthday 🎉 - ⏰ Countdown ⏰{" "}
				</h1>
				<div
					className='wrapCounter'
					style={{ display: "flex", justifyContent: "center" }}>
					<div
						id='flipdown'
						className='flipdown'
						style={{ width: "fit-content" }}></div>
				</div>
			</div>
		</div>
	) : (
		<Spinner />
	);
};

export default withRouter(FlipCountdownTimer);
