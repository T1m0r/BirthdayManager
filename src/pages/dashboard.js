import React from "react";
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
import Orders from "./dashboard/Orders";

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

export default function Dashboard() {
	const classes = useStyles();
	const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

	return (
		<AuthAppBar>
			<Grid container spacing={3}>
				{/* Chart */}
				<Grid item xs={12} md={8} lg={9}>
					<ListTable className={fixedHeightPaper} />
				</Grid>
				{/* Recent Deposits */}
				<Grid item xs={12} md={4} lg={3}>
					<Paper className={fixedHeightPaper}>
						<Deposits />
					</Paper>
				</Grid>
				{/* Recent Orders */}
				<Grid item xs={12}>
					<Paper className={classes.paper}>
						<Orders />
					</Paper>
				</Grid>
			</Grid>
			<Box pt={4}>
				<Copyright />
			</Box>
		</AuthAppBar>
	);
}
