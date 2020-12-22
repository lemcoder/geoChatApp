import react from "react";
// 
import { Link } from 'react-router-dom';
// Material ui component
import FormControl from "@material-ui/core/FormControl";
// For creating labels for inputs
import InputLabel from "@material-ui/core/InputLabel";
// Inputs only
import Input from "@material-ui/core/Input";
// Container that adds depth to visual aspect of it
import Paper from "@material-ui/core/Paper";
// Main styles :)
import withStyles from "@material-ui/core/styles/withStyles";
// Base line css
import CssBaseLine from "@material-ui/core/CssBaseLine";
// create easy typography (headers,paragraphs etc..)
import Typography from "@material-ui/core/Typography";
// For submit
import Button from "@material-ui/core/Button";
// my styles
import styles from "./styles";

const firebase = require("firebase");





class SignupComponent extends react.Component { 
    constructor(){
        super(); // calls the parents constructor
        this.state = {
            email: null,
            password: null,
            passwordConfirmation: null,
            signupError: ''
        };
    }
    render(){


        const { classes }=this.props;


        return(
        <main className={classes.main}>
            <CssBaseLine></CssBaseLine>
            <Paper className={classes.paper}>
                <Typography component='h1' variant='h5'>
                    Sign Up
                </Typography>
                
                <form onSubmit={(e)=>this.submitSignup(e)} className={classes.form}>

                    <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor='signup-email-input'>Enter Your Email</InputLabel>
                        <Input autoComplete='email' autoFocus id='signup-email-input' onChange={(e)=>this.userTyping('email',e)}></Input>
                    </FormControl>

                    <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor='signup-password-input'>Create A Password</InputLabel>
                        <Input type="password" id='signup-password-input' onChange={(e)=>this.userTyping('password',e)}></Input>
                    </FormControl>

                    <FormControl required fullWidth margin='normal'>
                        <InputLabel htmlFor='signup-password-confirmation-input'>Confirm Your Password</InputLabel>
                        <Input type="password" id='signup-password-confirmation-input' onChange={(e)=>this.userTyping('passwordConfirmation',e)}></Input>
                    </FormControl>

                    <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>Submit</Button>

                </form>
                {/* Put some javascript in this bad boy!!*/}

                {
                    this.state.signupError ?
                    <Typography className={classes.errorText} component='h5' variant='h6'>
                        {this.state.signupError}
                    </Typography> : 
                    null
                }

                <Typography component='h5' variant='h6' className={classes.hasAccountHeader}>Already have account?</Typography>
                <Link className={classes.logInLink} to='./login'>Log In</Link>
            </Paper>
        </main>
        );
    }

    submitSignup = (e) => {
        e.preventDefault(); //prevent from submitting on reloading a page

        // Check if form is valid, if no return
        if(!this.formIsValid()){
            this.setState({signupError:'Passwords do not match!'})
            return;
        }

        // if form valid, then add user to database: 
        firebase
        // create the user inside of auth in firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password) //firebase function to create user using email and password
        // if successful
        .then(authRes=>{ //authorization result
            const userObj = {
                email: authRes.user.email // create simple object with an user e mail in it
            };

            //then create user object in firestore in firebase database
        firebase
            .firestore()
            .collection('users') //open up 'users' in our database
            .doc(this.state.email)
            .set(userObj)
            // pass in history object is handled by the router component
            .then(()=>this.props.history.push('/dashboard'), dbError=>{
                console.log(dbError);
                this.setState({signupError: 'Failed to add user'});
            }) // redirect to the dashboard if registration complete
        }, authError=>{ //error catching 
            console.log(authError);
            this.setState({signupError: 'Failed to add user'});
        })

    }
    formIsValid=()=>this.state.password === this.state.passwordConfirmation //check if password and confirmation is the same, return true if so

    userTyping =(type,e)=>{
        switch(type){
            case 'email':
                // Passing the update of typing in to the 'email' in state object
                this.setState({ email: e.target.value })
                break;
            case 'password':
                // Passing the update of typing in to the 'password' in state object
                this.setState({ password: e.target.value })
                break;
            case 'passwordConfirmation':
                // Passing the update of typing in to the 'passwordConfrimation' in state object
                this.setState({ passwordConfirmation: e.target.value })
                break;
            default:
                this.setState({email: null, password: null,  passwordConfirmation: null })
                break;
            
        }
    }
}


export default withStyles(styles)(SignupComponent);