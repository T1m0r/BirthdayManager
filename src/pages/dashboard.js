import React, { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { queryBirthdays, removeDocument } from "../firebase/firebase.utils";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import AuthAppBar from "../components/AuthAppBar";
import ListTable from "./dashboard/Chart";
import Deposits from "./dashboard/Deposits";
import EnhancedTable from "./dashboard/Orders";
import { yearsToMonths } from "date-fns";

function Copyright() {
	return (
		<Typography variant='body2' color='textSecondary' align='center'>
			{"Copyright © "}
			<Link color='inherit' href='https://material-ui.com/'>
				Your Website
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
	},
	fixedHeight: {
		height: 240,
	},
}));

function calculateAge(birthday) {
	// birthday is a date
	var ageDifMs = Date.now() - birthday;
	var ageDate = new Date(ageDifMs); // miliseconds from epoch
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}
function getNextBirthday(birthday, isOver) {
	const now = new Date();
	var year = now.getFullYear();
	if (isOver) {
		year = year + 1;
	}
	var birthdayDate = new Date(birthday);
	birthdayDate = birthdayDate.setFullYear(year);
	birthdayDate = new Date(birthdayDate);
	return birthdayDate;
}

function isOver(birthday) {
	// birthday is a date
	const now = new Date();
	var birthdayDate = new Date(birthday);
	birthdayDate = birthdayDate.setFullYear(now.getFullYear());
	birthdayDate = new Date(birthdayDate);

	return now > birthdayDate;
}

function applyIsOverAge(data) {
	return data.map((birthday) => {
		birthday.isOver = isOver(birthday.birthday.toDate());
		birthday.age = calculateAge(birthday.birthday.toDate());
		birthday.nextBirthday = getNextBirthday(
			birthday.birthday.toDate(),
			birthday.isOver
		);
		birthday.nextBdayNum = birthday.nextBirthday.getTime();
		return birthday;
	});
}

function getBirthdaysInMonth(data, month) {
	console.log(data);
	var birthdays = [];
	for (var i = 0; i < data.length; i++) {
		console.log("bday", data[i].birthday.toDate(), month);
		if (data[i].birthday.toDate().getMonth() === month) {
			console.log(data[i]);
			birthdays.push(data[i]);
		}
	}
	return birthdays;
}

export default function Dashboard() {
	const classes = useStyles();
	const user = useSelector((state) => state.user).user;
	const [birthdays, setBirthdays] = useState(null);
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

	let data = null;
	useEffect(() => {
		const setBirthdayData = async () => {
			data = await queryBirthdays(user.id, user.storedBirthdays);
			console.log("data", data);
			setBirthdays(applyIsOverAge(data));
		};
		setBirthdayData();
	}, []);

	useEffect(() => {
		const setBirthdayData = async () => {
			data = await queryBirthdays(user.id, user.storedBirthdays);
			console.log("data", data);
			setBirthdays(applyIsOverAge(data));
		};
		setBirthdayData();
	}, [data]);
	//TODO - update Table when new Bday is added
	return (
		<AuthAppBar>
			<Grid container spacing={3}>
				{/* Chart */}
				{/* <Grid item xs={12} md={8} lg={9}>
					{birthdays ? (
						<ListTable bdays={birthdays} className={fixedHeightPaper} />
					) : (
						<Spinner />
					)}
				</Grid> */}

				{/* Recent Orders */}
				<Grid item xs={12} md={8} lg={9}>
					<Paper className={classes.paper}>
						{birthdays ? (
							<EnhancedTable
								bdays={birthdays}
								setBirthdays={setBirthdays}
								user={user}
							/>
						) : (
							<Spinner />
						)}
					</Paper>
				</Grid>
				{/* Recent Deposits */}
				<Grid item xs={12} md={4} lg={3}>
					<Paper className={fixedHeightPaper}>
						<Deposits data={data} />
					</Paper>
				</Grid>
			</Grid>
			<Box pt={4}>
				<Copyright />
			</Box>
		</AuthAppBar>
	);
}
