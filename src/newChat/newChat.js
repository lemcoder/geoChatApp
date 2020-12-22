import React from 'react';
import { FormControl, InputLabel, Input, Button, Paper, withStyles, CssBaseline, Typography } from '@material-ui/core';
import styles from './styles';
const firebase = require("firebase");

class NewChatComponent extends React.Component {

    constructor(){
        super();
        this.state={
            username: null,
            message: null
        }
    }


    render(){

        const {classes} = this.props;


        return(
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper
                className={classes.paper}>
                    <Typography component='h1' variant='h5'>
                        Send A Message
                    </Typography>
                    <form className={classes.form} onSubmit={(e)=>this.submitNewChat(e)}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor='new-chat-username'>
                                Enter Your Friend's Email
                            </InputLabel>
                            <Input 
                            required className={classes.Input}
                            autoFocus
                            onChange={(e)=>this.userTyping('username',e)}
                            id='new-chat-username'>
                            </Input>
                        </FormControl>
                        <FormControl
                        fullWidth>
                            <InputLabel
                            htmlFor='new-chat-messagee'>Enter Your Message</InputLabel>
                            <Input
                            autoComplete='off'
                            required
                            className={classes.input}
                            onChange={(e)=>this.userTyping('message',e)}>
                            </Input>
                        </FormControl>
                        <Button type='submit' fullWidth className={classes.submit} variant='contained' color='primary'>Send Messagee</Button>
                    </form>
                </Paper>

           </main>
        )
    }

    // set state depending on type of input
    userTyping=(type,e)=>{
        switch (type){
            case 'username':
                this.setState({username: e.target.value})
                break;
            case 'message':
                this.setState({message: e.target.value})
                break;

            default:
            break;
        }
    }

    submitNewChat = async (e) =>{
        e.preventDefault();
         const userExist = await this.userExist();
         if(userExist){
             const chatExists = await this.chatExists();
             chatExists ? this.goToChat() : this.createChat();
         }
    }

    buildDocKey = () => [firebase.auth().currentUser.email, this.state.username].sort().join(':');

    // check if user exist 
    userExist = async ()=>{
        // get the users collection from firebase
        const usersSnapshot = await firebase
        .firestore()
        .collection('users')
        .get();
        //check if user exists in database
        const exists = usersSnapshot.docs
        .map(_doc => _doc.data().email)
        .includes(this.state.username)
        this.setState({serverError: !exists})
        return exists;
    }
    chatExists = async () =>{
        // build a document key
        const docKey = this.buildDocKey();
        // 
        const chat = await firebase
        .firestore()
        .collection('chats')
        .doc(docKey)
        .get();
        console.log(chat.exists);
        return chat.exists;
    }

    goToChat = () => this.props.goToChatFn(this.buildDocKey(), this.state.message);
    

    createChat = () =>{
        this.props.newChatSubmitFn({
            sendTo: this.state.username,
            message: this.state.message
        })
    }



}

export default withStyles(styles)(NewChatComponent);