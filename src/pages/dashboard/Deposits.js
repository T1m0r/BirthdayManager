import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
// Also ok
// import frLocale from 'date-fns/locale/fr';
import deLocale from "date-fns/locale/de";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import Title from "./Title";
import { useSelector } from "react-redux";
import { addBirthday } from "../../firebase/firebase.utils";

const useStyles = makeStyles({
	depositContext: {
		flex: 1,
	},
});

export default function Deposits({ data }) {
	const user = useSelector((state) => state.user).user;
	const [name, setName] = useState("");
	const [date, setDate] = useState(null);
	const classes = useStyles();

	function handleSubmit(event) {
		event.preventDefault();
		addBirthday(user.id, {
			owner: user.id,
			group: "family",
			name: name,
			birthday: date,
		});
		setName("");
		setDate(null);
		data = `${user.id}-${name}-${date}-${new Date().getTime()}`;
	}

	return (
		<React.Fragment>
			<Title>Add Birthday</Title>
			<TextField
				required
				id='name-birthday'
				label='Name'
				value={name}
				onChange={(e) => setName(e.target.value)}
				style={{ paddingBottom: "8px" }}
			/>
			<LocalizationProvider dateAdapter={AdapterDateFns} locale={deLocale}>
				<DatePicker
					views={["day", "month", "year"]}
					mask={"__.__.____"}
					label='Pick Birthday'
					value={date}
					onChange={(newValue) => {
						setDate(newValue);
					}}
					renderInput={(params) => <TextField {...params} />}
				/>
			</LocalizationProvider>
			<div style={{ paddingTop: "8px" }}>
				<Button color='primary' href='#' onClick={(e) => handleSubmit(e)}>
					Add Birthday
				</Button>
			</div>
		</React.Fragment>
	);
}
