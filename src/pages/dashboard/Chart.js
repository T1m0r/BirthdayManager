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
	// Return True if birthday already happend this year
	if (now.getMonth() > birthday.getMonth()) {
		return true;
	} else if (
		now.getMonth() == birthday.getMonth() &&
		now.getDay() > birthday.getDay()
	) {
		return true;
	} else {
		return false;
	}
}

export default function ListTable() {
	const user = useSelector((state) => state.user).user;
	const [birthdays, setBirthdays] = useState(null);
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

	let data = null;
	useEffect(() => {
		const setBirthdayData = async () => {
			data = await queryBirthdays(user.id, user.storedBirthdays);
			console.log("data", data);
			setBirthdays(data);
		};
		setBirthdayData();
	}, []);

	const handleDelete = async () => {
		await removeDocument(user.id, "birthdays", target.id);
		setBirthdays(birthdays.filter((item) => item.id !== target.id));
		handleClose();
	};

	return (
		<React.Fragment>
			{!!birthdays ? (
				<React.Fragment>
					<TableContainer component={Paper}>
						<Table sx={{ minWidth: 700 }} aria-label='customized table'>
							<TableHead>
								<TableRow>
									<StyledTableCell>Name</StyledTableCell>
									<StyledTableCell align='right'>Birthday</StyledTableCell>
									<StyledTableCell align='right'>Age</StyledTableCell>
									<StyledTableCell align='right'>Happened</StyledTableCell>
									<StyledTableCell align='right'>Action</StyledTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{birthdays.map((date) => (
									<StyledTableRow
										key={date.id}
										// onClick={() => history.push(`birthday/countdown/${date.id}`)}
									>
										<StyledTableCell component='th' scope='row'>
											<Link href={`birthday/countdown/${date.id}`}>
												{date.name}
											</Link>
										</StyledTableCell>
										<StyledTableCell align='right'>
											{date.birthday.toDate().toDateString()}
										</StyledTableCell>
										<StyledTableCell align='right'>
											{calculateAge(date.birthday.toDate())}
										</StyledTableCell>
										<StyledTableCell align='right'>
											{isOver(date.birthday.toDate()) ? "Yes" : "Not yet"}
										</StyledTableCell>
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
