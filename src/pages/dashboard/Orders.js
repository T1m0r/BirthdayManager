import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { removeDocument } from "../../firebase/firebase.utils";
import { useHistory } from "react-router-dom";

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

const headCells = [
	{
		id: "name",
		numeric: false,
		disablePadding: true,
		label: "Name",
		align: "left",
	},
	{
		id: "nextBdayNum",
		numeric: true,
		disablePadding: false,
		label: "Birthday",
		align: "center",
	},
	{
		id: "age",
		numeric: true,
		disablePadding: false,
		label: "Age",
		align: "center",
	},
	{
		id: "isOver",
		numeric: false,
		disablePadding: false,
		label: "Happend",
		align: "center",
	},
];

function EnhancedTableHead(props) {
	const {
		classes,
		onSelectAllClick,
		order,
		orderBy,
		numSelected,
		rowCount,
		onRequestSort,
	} = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding='checkbox'>
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{ "aria-label": "select all desserts" }}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						// align={headCell.numeric ? "right" : "left"}
						align={headCell.align}
						padding={headCell.disablePadding ? "none" : "normal"}
						sortDirection={orderBy === headCell.id ? order : false}>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : "asc"}
							onClick={createSortHandler(headCell.id)}>
							{headCell.label}
							{orderBy === headCell.id ? (
								<span className={classes.visuallyHidden}>
									{order === "desc" ? "sorted descending" : "sorted ascending"}
								</span>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(["asc", "desc"]).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	highlight:
		theme.palette.type === "light"
			? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(theme.palette.secondary.light, 0.85),
			  }
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark,
			  },
	title: {
		flex: "1 1 100%",
	},
}));

const EnhancedTableToolbar = (props) => {
	const classes = useToolbarStyles();
	const { numSelected } = props;

	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected > 0,
			})}>
			{numSelected > 0 ? (
				<Typography
					className={classes.title}
					color='inherit'
					variant='subtitle1'
					component='div'>
					{numSelected} selected
				</Typography>
			) : (
				<Typography
					className={classes.title}
					variant='h6'
					id='tableTitle'
					component='div'>
					Birthdays
				</Typography>
			)}

			{numSelected > 0 ? (
				<Tooltip title='Delete'>
					<IconButton
						aria-label='delete'
						onClick={() => props.handleClickOpen()}>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title='Filter list'>
					<IconButton aria-label='filter list'>
						<FilterListIcon />
					</IconButton>
				</Tooltip>
			)}
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	paper: {
		width: "100%",
		marginBottom: theme.spacing(2),
	},
	table: {
		minWidth: 750,
	},
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1,
	},
}));

export default function EnhancedTable({ bdays, setBirthdays, user }) {
	const classes = useStyles();
	const history = useHistory();
	//var rows = bdays;
	const [rows, setRows] = useState(bdays);
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("calories");
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [dense, setDense] = React.useState(false);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	// Dialog Vars
	const [open, setOpen] = useState(false);

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = rows.map((n) => n);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, row) => {
		// const name = row.name;
		const selectedIndex = selected.indexOf(row);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, row);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangeDense = (event) => {
		setDense(event.target.checked);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	const handleClickOpen = (item) => {
		//setTarget(item);
		console.log(selected);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		//setTarget(null);
	};

	const handleDelete = async () => {
		selected.forEach(async (target) => {
			await removeDocument(user.id, "birthdays", target.id);
			//setRows(rows.filter((item) => item.id !== target.id));
		});
		setRows(rows.filter((row) => !selected.includes(row)));
		setBirthdays(rows);
		setSelected([]);
		handleClose();
	};

	return (
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<EnhancedTableToolbar
					handleClickOpen={handleClickOpen}
					numSelected={selected.length}
				/>
				<TableContainer>
					<Table
						className={classes.table}
						aria-labelledby='tableTitle'
						size={dense ? "small" : "medium"}
						aria-label='enhanced table'>
						<EnhancedTableHead
							classes={classes}
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
						/>
						<TableBody>
							{stableSort(rows, getComparator(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row, index) => {
									const isItemSelected = isSelected(row);
									const labelId = `enhanced-table-checkbox-${index}`;

									return (
										<TableRow
											hover
											onClick={(event) => handleClick(event, row)}
											role='checkbox'
											aria-checked={isItemSelected}
											tabIndex={-1}
											style={
												row.isOver
													? { backgroundColor: "rgba(60, 113, 45, 0.2)" }
													: {}
											}
											key={row.name}
											selected={isItemSelected}>
											<TableCell padding='checkbox'>
												<Checkbox
													checked={isItemSelected}
													inputProps={{ "aria-labelledby": labelId }}
												/>
											</TableCell>
											<TableCell
												component='th'
												id={labelId}
												scope='row'
												padding='none'>
												<Button
													onClick={() =>
														history.push(`birthday/countdown/${row.id}`)
													}>
													{row.name} <KeyboardArrowRightIcon />
												</Button>
											</TableCell>
											<TableCell align='center'>
												{row.nextBirthday.toLocaleDateString("de-DE", {
													weekday: "long",
													month: "long",
													day: "numeric",
												})}
											</TableCell>
											<TableCell align='center'>{row.age}</TableCell>
											<TableCell align='center'>
												{row.isOver ? "Yes" : "No"}
											</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby='alert-dialog-title'
					aria-describedby='alert-dialog-description'>
					<DialogTitle id='alert-dialog-title'>
						{selected
							? `Really delete remove ${selected
									.map((sel) => sel.name)
									.join(",")}?`
							: "Error"}
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
				<TablePagination
					rowsPerPageOptions={[10, 20, 42, 69, 100]}
					component='div'
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
			<FormControlLabel
				control={<Switch checked={dense} onChange={handleChangeDense} />}
				label='Dense padding'
			/>
		</div>
	);
}

// import React, { useState, useEffect } from "react";
// import Link from "@material-ui/core/Link";
// import { makeStyles } from "@material-ui/core/styles";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Title from "./Title";
// import { useSelector } from "react-redux";
// import { queryBirthdays } from "../../firebase/firebase.utils";

// // Generate Order Data
// function createData(id, date, name, shipTo, paymentMethod, amount) {
// 	return { id, date, name, shipTo, paymentMethod, amount };
// }
// //const days = ["Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday"];
// const days = [
// 	"Montag",
// 	"Dienstag",
// 	"Mittwoch",
// 	"Donnerstag",
// 	"Freitag",
// 	"Samstag",
// 	"Sonntag",
// ];

// function getAllDaysInMonth(year, month) {
// 	const date = new Date(year, month, 1);
// 	const dates = [];
// 	console.log(date, date.getDate(), date.getDay());
// 	if (date.getDay() !== 0) {
// 		for (let i = 0; i < date.getDay(); i++) {
// 			dates.push("");
// 		}
// 	}

// 	while (date.getMonth() === month) {
// 		dates.push(new Date(date));
// 		date.setDate(date.getDate() + 1);
// 	}

// 	return dates;
// }

// function preventDefault(event) {
// 	event.preventDefault();
// }

// function getBirthdaysInMonth(data, month) {
// 	console.log(data);
// 	var birthdays = [];
// 	for (var i = 0; i < data.length; i++) {
// 		console.log("bday", data[i].birthday.toDate(), month);
// 		if (data[i].birthday.toDate().getMonth() === month) {
// 			console.log(data[i]);
// 			birthdays.push(data[i]);
// 		}
// 	}
// 	return birthdays;
// 	// data.forEach((bday) => {
// 	// 	console.log("Bday", bday);
// 	// 	if (bday.birthday) {
// 	// 		birthdays.push(bday);
// 	// 	}
// 	// });
// 	// for (let i = 0; i < data.length; i++) {
// 	// 	data[i]["birthday"] = new Date(data[i]["birthday"]);
// 	// 	console.log(i, data[i]);
// 	// }
// 	// Object.keys(data).forEach((key) => {
// 	// });
// 	console.log("Data", data); //, data.keys());
// }

// const useStyles = makeStyles((theme) => ({
// 	seeMore: {
// 		marginTop: theme.spacing(3),
// 	},
// }));

// export default function Orders() {
// 	const classes = useStyles();
// 	const user = useSelector((state) => state.user).user;
// 	const [birthdays, setBirthdays] = useState(null);
// 	const now = new Date();
// 	//const daysInMonth = getAllDaysInMonth(now.getFullYear(), now.getMonth());

// 	let data = null;
// 	useEffect(() => {
// 		const setBirthdayData = async () => {
// 			data = await queryBirthdays(user.id, user.storedBirthdays);
// 			console.log("data", data);
// 			setBirthdays(getBirthdaysInMonth(data, now.getMonth()));
// 		};
// 		setBirthdayData();
// 	}, []);

// 	return (
// 		<React.Fragment>
// 			<Title>Recent Orders</Title>
// 			{data}
// 			{/* <Table size='small'>
// 				<TableHead>
// 					<TableRow>
// 						<TableCell>Mo</TableCell>
// 						<TableCell>Di</TableCell>
// 						<TableCell>Mi</TableCell>
// 						<TableCell>Do</TableCell>
// 						<TableCell>Fr</TableCell>
// 						<TableCell>Sa</TableCell>
// 						<TableCell>So</TableCell>
// 					</TableRow>
// 				</TableHead>
// 				<TableBody>
// 					{daysInMonth.map((row) => (
// 						<TableRow key={row.id}>
// 							<TableCell>{row.date}</TableCell>
// 							<TableCell>{row.name}</TableCell>
// 							<TableCell>{row.shipTo}</TableCell>
// 							<TableCell>{row.paymentMethod}</TableCell>
// 							<TableCell align='right'>{row.amount}</TableCell>
// 						</TableRow>
// 					))}
// 				</TableBody>
// 			</Table> */}
// 			{birthdays != null ? (
// 				<div>
// 					{birthdays.map((birthday) => (
// 						<div>
// 							<p>Name: {birthday.name}</p>
// 							<p>Birthday: {birthday.birthday.toDate().toDateString()}</p>
// 						</div>
// 					))}
// 				</div>
// 			) : (
// 				<React.Fragment />
// 			)}

// 			<div className={classes.seeMore}>
// 				<Link color='primary' href='#' onClick={preventDefault}>
// 					See more orders
// 				</Link>
// 			</div>
// 		</React.Fragment>
// 	);
// }
