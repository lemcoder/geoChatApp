import React from 'react';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import styles from './styles';
import { withStyles } from '@material-ui/core/styles';


class ChatTextBoxComponent extends React.Component {

    constructor(){
        super();
        this.state={
            chatText: ''
        }
    }

    render(){
        
        const {classes} = this.props;

        return(<div className={classes.chatTextBoxContainer}>
            <TextField 
            autoComplete='off'
            placeholder='Type Your Message...' 
            onKeyUp={(e)=>this.userTyping(e)}
            id='chatTextBox'
            className={classes.chatTextBox}
            onFocus={this.userClickedInput}></TextField>
            <Send 
            onClick={this.submitMessage}
            className={classes.sendBtn}></Send>
        </div>)
       }
    //    Function to send message to the database
       submitMessage = ()=>{
        if(this.messageValid(this.state.chatText)){
            // call parent funcntion
            this.props.submitMessageFn(this.state.chatText);
            // clear the input after sending
            document.getElementById('chatTextBox').value = '';
        }
       }
    // if User  clicked input box
       userClickedInput = ()=>{
           console.log('clicked input');
       }
    //    event handler for typing
       userTyping = (e) =>{
           e.keyCode === 13 ?
           this.submitMessage() :
           this.setState({chatText: e.target.value})
       }
       messageValid = (text)=>text && text.replace(/\s/g,'').length
        //    Finds all space chars in global scope and replace with empty space
           
       
    }





export default withStyles(styles)(ChatTextBoxComponent);