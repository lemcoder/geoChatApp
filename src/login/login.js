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
import CssBaseline from "@material-ui/core/CssBaseLine";
// create easy typography (headers,paragraphs etc..)
import Typography from "@material-ui/core/Typography";
// For submit
import Button from "@material-ui/core/Button";
// my styles
import styles from "./styles";


const firebase = require('firebase');




class LoginComponent extends react.Component {

    constructor(){
        super(); // calls the parents constructor
        this.state = {
            email: null,
            password: null,
            loginError: ''
        };
    }
    
    render(){
        const {classes} = this.props // get classes property from this.props and set it to a variable called calsses

        return(
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component='h1' variant='h5'>
                        Log In
                    </Typography>
                    <form className={classes.form} onSubmit={(e)=>this.submitLogIn(e)}>

                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='login-email-input'>Enter Your Email</InputLabel>
                            <Input autoComplete='email' id='login-email-input' onChange={(e)=>this.userTyping('email',e)}></Input>
                        </FormControl>

                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='login-password-input'>Enter Your Password</InputLabel>
                            <Input type='password' id='login-password-input' onChange={(e)=>this.userTyping('password',e)}></Input>
                        </FormControl>

                        <Button type="submit" fullWidth variant='contained' color='primary' className={classes.submit}>Log In</Button>

                    </form>

                    {
                        this.state.loginError ?
                        <Typography component='h5' variant='h6' className={classes.errorText}>
                            Incorrect Login Information
                        </Typography> :
                        null

                    }

                    <Typography component='h5' variant='h6' className={classes.noAccountHeader}>Don't Have Account?</Typography>
                    <Link className={classes.signUpLink} to='./signup'>Sign Up</Link>


                </Paper>
            </main>
        );

        
    }


    userTyping = (type, e)=>{
        switch(type) {
            case 'email':
                this.setState({email: e.target.value});
                break;
            case 'password':
                this.setState({password: e.target.value});
                break;
            default:
                this.setState({email: null,password: null});
                break;
        }
    }


    submitLogIn=(e)=>
    {
        e.preventDefault();
        firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email,this.state.password)
        .then(()=>{
            this.props.history.push("/dashboard")     
        },err=>{
            this.setState({loginError: 'Invalid username or password...'});
            console.log(err);
        })
    }


}

export default withStyles(styles)(LoginComponent);