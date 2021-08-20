import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/user/user.actions";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { auth, createUserProfileDocument } from "../firebase/firebase.utils";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	paper: {
		margin: theme.spacing(8, 10),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	alert: {
		margin: theme.spacing(2),
		marginBottom: theme.spacing(6),
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const SignUpForm = () => {
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();

	// Vars for the form fields
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [errorMsg, setErrorMsg] = useState("");

	// Add these variables to your component to track the state
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = () => setShowPassword(!showPassword);

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const { user } = await auth.createUserWithEmailAndPassword(
				email,
				password
			);
			const resp = await createUserProfileDocument(user, {
				firstname,
				lastname,
			});
			dispatch(setCurrentUser(resp));
		} catch (error) {
			console.log(error);
			if (error.code === "auth/email-already-in-use") {
				setErrorMsg("This email address is already in use.");
			} else {
				console.log(error);
				setErrorMsg("Internal Error please try again later");
			}
		}
	};

	return (
		<div className={classes.paper}>
			<Avatar className={classes.avatar}>
				<LockOutlinedIcon />
			</Avatar>
			<Typography component='h1' variant='h5'>
				Sign up
			</Typography>
			<form className={classes.form} onSubmit={handleSubmit}>
				<Collapse className={classes.alert} in={errorMsg !== "" ? true : false}>
					<Alert severity='error'>{errorMsg}</Alert>
				</Collapse>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<TextField
							autoComplete='fname'
							name='firstName'
							variant='outlined'
							error={!!errorMsg}
							required
							fullWidth
							id='firstName'
							label='First Name'
							onChange={(e) => setFirstname(e.target.value)}
							autoFocus
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							variant='outlined'
							error={!!errorMsg}
							required
							fullWidth
							id='lastName'
							label='Last Name'
							name='lastName'
							onChange={(e) => setLastname(e.target.value)}
							autoComplete='lname'
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant='outlined'
							error={!!errorMsg}
							required
							fullWidth
							id='email'
							type='email'
							label='Email Address'
							name='email'
							onChange={(e) => setEmail(e.target.value)}
							autoComplete='email'
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							variant='outlined'
							error={!!errorMsg}
							required
							fullWidth
							name='password'
							label='Password'
							type={showPassword ? "text" : "password"}
							id='password'
							onChange={(e) => setPassword(e.target.value)}
							autoComplete='current-password'
							InputProps={{
								// <-- This is where the toggle button is added.
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton
											aria-label='toggle password visibility'
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}>
											{showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<FormControlLabel
							control={<Checkbox value='allowExtraEmails' color='primary' />}
							label='I want to receive inspiration, marketing promotions and updates via email.'
						/>
					</Grid>
				</Grid>
				<Button
					type='submit'
					fullWidth
					variant='contained'
					color='primary'
					className={classes.submit}>
					Sign Up
				</Button>
				<Grid container justifyContent='flex-end'>
					<Grid item>
						<Link onClick={() => history.push("/login")} variant='body2'>
							Already have an account? Sign in
						</Link>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

export default SignUpForm;
