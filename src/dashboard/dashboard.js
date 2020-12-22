import react from "react";

import ChatListComponent from '../chatList/chatList';
import ChatVievComponent from '../chatViev/chatViev';
import ChatTextBoxComponent from '../chatTextBox/chatTextBox';
import NewChatComponent from '../newChat/newChat';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import styles from './styles';

const firebase = require('firebase');

class DashboardComponent extends react.Component {

    constructor() {
        super();
        this.state = {
            selectedChat: null,
            newChatFormVisible: false,
            email: null,
            chats: []
        }
    }

    render(){

        const {classes} = this.props;

        return (
            <div>
            <ChatListComponent 
                history={this.props.history} //prop from react-dom
                newChatBtnFn = {this.newChatBtnClicked}
                selectChatFn = {this.selectChat}
                chats = {this.state.chats}
                userEmail = {this.state.email}
                selectedChatIndex = {this.state.selectedChat}>
                </ChatListComponent>
                {
                    this.state.newChatFormVisible ?
                    null :
                    <ChatVievComponent
                    user = {this.state.email}
                    chat = {this.state.chats[this.state.selectedChat]}></ChatVievComponent>
                }

                {/* Conditionally render chat box if the chat is clicked */}

                {
                    this.state.selectedChat !== null && !this.state.newChatFormVisible ?
                    <ChatTextBoxComponent submitMessageFn={this.submitMessage}> </ChatTextBoxComponent> :
                    null
                }

                {
                    this.state.newChatFormVisible ? 
                    <NewChatComponent
                    goToChatFn = {this.goToChat}
                    newChatSubmitFn = {this.newChatSubmit}></NewChatComponent>:
                    null
                }

                

            <Button 
            onClick={this.signOut}
            className={classes.signOutBtn}>
                Sing Out
            </Button>
            </div>)

        
    }

    goToChat = async(docKey,msg) =>{
        const usersInChat = docKey.split(':');
        const chat = this.state.chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)));
        this.setState({newChatFormVisible: false})
        await this.selectChat(this.state.chats.indexOf(chat));
        this.submitMessage(msg);
    }

    newChatSubmit = async(chatObj) => {
        const docKey = this.buildDocKey(chatObj.sendTo);
        await firebase.firestore()
        .collection('chats')
        .doc(docKey)
        .set({
            recieverHasRead: false,
            users: [this.state.email, chatObj.sendTo],
            messages: [{
                message: chatObj.message,
                sender: this.state.email
            }] 
        })
        this.setState({newChatFormVisible: false});
        this.selectChat(this.state.chats.length-1);
    }


    signOut = () => firebase.auth().signOut();

    // Whenever user selects a chat this will update the state and then call messageRead(), which
    selectChat = async(chatIndex) =>{
        // Make sure that this select chat thingy finish before call user read
        await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
        this.messageRead();
    }
    submitMessage = (message) =>{
        // get the user email from selected chat 
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_usr => _usr!==this.state.email)[0]);


        firebase
        .firestore()
        .collection('chats')
        .doc(docKey)
        .update({
            // add message to existing document in firebase 
            messages: firebase.firestore.FieldValue.arrayUnion({
                sender: this.state.email,
                message: message,
                timeStamp: Date.now(),
            }),
            recieverHasRead: false
        })

    }


    // user1:user2 in alphabetilac order
    buildDocKey = (friend) =>[this.state.email, friend].sort().join(':');





    newChatBtnClicked = () => this.setState({newChatFormVisible: true, selectedChat:null});

    // Updates a recieverHasRead inside of firestore
    messageRead = () =>{
        const chatIndex = this.state.selectedChat;
        // get the doc key to update the correct chatbox
        const docKey = this.buildDocKey(this.state.chats[chatIndex].users.filter(_usr => _usr !== this.state.email)[0]);
        if(this.clickedMessageWhereNotSender(chatIndex))
        {
            firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({recieverHasRead: true})
        }
    }

    clickedMessageWhereNotSender = (chatIndex) => this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length - 1].sender !== this.state.email;
    

    // Function that will get called automaticaly whenever the component mounted into the DOM
    // When mounted all inside function is called
    componentDidMount = () => 
    firebase
    .auth()
    // Whenever the state of auth change, redirect to login page
    .onAuthStateChanged(async _usr => {
        // Check if user is loged in
        if(!_usr)
        this.props.history.push('/login'); //if not loged in send him to /login page

        else{
            // go to the firestore database, grab the 'chats' doc and then return all the chats that current user is 'associated with'
            await firebase //called async before so dont have to use .then
                .firestore()
                .collection('chats')
                .where('users', 'array-contains', _usr.email)
                .onSnapshot(async res =>{ //async function with 'result' parameter called whenever database is updated

                    const chats = res.docs.map(_doc =>_doc.data()) //.docs is property of an 'result' got from database (its an array). When called _doc.data transforms the specific firebase obj into readable data that can be used in JS.
                    await this.setState({
                        email: _usr.email,
                        chats: chats
                    }); //set state is async in REACT. 


                })
        }
    }) // whenever something in database had changed (Log in log out etc..)

    }

    

export default withStyles(styles)(DashboardComponent);