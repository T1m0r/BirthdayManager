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
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { auth, signInWithGoogle } from "../firebase/firebase.utils";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	paper: {
		margin: theme.spacing(8, 10),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	loginGoogle: {
		margin: theme.spacing(2, 0, 4, 0),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const LoginForm = () => {
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [errorMsg, setErrorMsg] = useState("");

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const resp = await auth.signInWithEmailAndPassword(email, password);
			console.log(resp);
			await dispatch(setCurrentUser(resp));
			setEmail("");
			setPassword("");
			setErrorMsg("");
		} catch (error) {
			console.log(error);
			if (error.code === "auth/wrong-password") {
				setErrorMsg("Incorrect password or username");
			} else if (error.code === "auth/user-not-found") {
				setErrorMsg("There is no User with this email.");
			} else {
				setErrorMsg("Internal Error: Please try again later.");
			}
		}
	};

	return (
		<div className={classes.paper}>
			<Avatar className={classes.avatar}>
				<LockOutlinedIcon />
			</Avatar>
			<Typography component='h1' variant='h5'>
				Sign in
			</Typography>
			<form className={classes.form} onSubmit={handleSubmit}>
				<Collapse className={classes.alert} in={errorMsg !== "" ? true : false}>
					<Alert severity='error'>{errorMsg}</Alert>
				</Collapse>
				<TextField
					variant='outlined'
					margin='normal'
					error={!!errorMsg}
					required
					fullWidth
					id='email'
					type='email'
					label='Email Address'
					name='email'
					onChange={(e) => setEmail(e.target.value)}
					autoComplete='email'
					autoFocus
				/>
				<TextField
					variant='outlined'
					margin='normal'
					error={!!errorMsg}
					required
					fullWidth
					name='password'
					label='Password'
					type='password'
					id='password'
					onChange={(e) => setPassword(e.target.value)}
					autoComplete='current-password'
				/>
				<FormControlLabel
					control={<Checkbox value='remember' color='primary' />}
					label='Remember me'
				/>
				<Button
					type='submit'
					fullWidth
					variant='contained'
					color='primary'
					className={classes.submit}>
					Sign In
				</Button>
				<Button
					type='button'
					variant='contained'
					color='primary'
					onClick={signInWithGoogle}
					startIcon={
						<Avatar src={process.env.PUBLIC_URL + "/googleIcon.png"} />
					}
					className={classes.loginGoogle}>
					Sign In with Google
				</Button>
				<Grid container>
					<Grid item xs>
						<Link href='#' variant='body2'>
							Forgot password?
						</Link>
					</Grid>
					<Grid item>
						<Link onClick={() => history.push("/signup")} variant='body2'>
							{"Don't have an account? Sign Up"}
						</Link>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

export default LoginForm;
