import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Spinner from "../../components/Spinner";
import { queryBirthdays, removeDocument } from "../../firebase/firebase.utils";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

function calculateAge(birthday) {
	// birthday is a date
	var ageDifMs = Date.now() - birthday;
	var ageDate = new Date(ageDifMs); // miliseconds from epoch
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function isOver(birthday) {
	// birthday is a date
	const now = new Date();
	var birthdayDate = new Date(birthday);
	birthdayDate = birthdayDate.setFullYear(now.getFullYear());
	birthdayDate = new Date(birthdayDate);

	return now > birthdayDate;
}

function applyIsOver(data) {
	return data.map((birthday) => {
		birthday.isOver = isOver(birthday.birthday.toDate());
		return birthday;
	});
	return data;
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

export default function ListTable({ bdays }) {
	const user = useSelector((state) => state.user).user;
	const [birthdays, setBirthdays] = useState(bdays);
	console.log(bdays, birthdays);
	const [open, setOpen] = useState(false);
	const [target, setTarget] = useState(null);
	const history = useHistory();

	const handleClickOpen = (item) => {
		setTarget(item);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setTarget(null);
	};

	const handleDelete = async () => {
		await removeDocument(user.id, "birthdays", target.id);
		setBirthdays(birthdays.filter((item) => item.id !== target.id));
		handleClose();
	};

	return (
		<React.Fragment>
			{!!bdays ? (
				<React.Fragment>
					<TableContainer component={Paper}>
						<Table sx={{ minWidth: 700 }} aria-label='customized table'>
							<TableHead>
								<TableRow>
									<StyledTableCell>Name</StyledTableCell>
									<StyledTableCell align='center'>Birthday</StyledTableCell>
									<StyledTableCell align='center'>Age</StyledTableCell>
									<StyledTableCell align='center'>Happened</StyledTableCell>
									<StyledTableCell align='center'>This Month</StyledTableCell>
									<StyledTableCell align='right'>Action</StyledTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{bdays.map((date) => (
									<StyledTableRow
										key={date.id}
										// onClick={() => history.push(`birthday/countdown/${date.id}`)}
									>
										<StyledTableCell component='th' scope='row'>
											<Link href={`birthday/countdown/${date.id}`}>
												{date.name}
											</Link>
										</StyledTableCell>
										<StyledTableCell align='center'>
											{date.birthday.toDate().toDateString()}
										</StyledTableCell>
										<StyledTableCell align='center'>
											{calculateAge(date.birthday.toDate())}
										</StyledTableCell>
										<StyledTableCell
											align='center'
											style={
												date.isOver
													? { margin: "10px", backgroundColor: "#c9ffd9" }
													: {}
											}>
											{date.isOver ? "Yes" : "Not yet"}
										</StyledTableCell>
										<StyledTableCell
											align='center'
											style={
												date.birthday.toDate().getMonth() ===
												new Date().getMonth()
													? {
															margin: "10px",
															backgroundColor: "#2266FD",
															width: "12px",
													  }
													: { width: "12px" }
											}></StyledTableCell>
										<StyledTableCell align='right'>
											<Button onClick={() => handleClickOpen(date)}>
												<DeleteIcon />
											</Button>
										</StyledTableCell>
									</StyledTableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<Dialog
						open={open}
						onClose={handleClose}
						aria-labelledby='alert-dialog-title'
						aria-describedby='alert-dialog-description'>
						<DialogTitle id='alert-dialog-title'>
							{target
								? `Really delete remove ${target.name}?`
								: "Really delete this User?"}
						</DialogTitle>
						<DialogContent>
							<DialogContentText id='alert-dialog-description'>
								Be careful this action can not be reveresed!
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleClose}>No, Keep</Button>
							<Button onClick={handleDelete} autoFocus>
								Yes, Delete
							</Button>
						</DialogActions>
					</Dialog>
				</React.Fragment>
			) : (
				<Spinner />
			)}
		</React.Fragment>
	);
}
