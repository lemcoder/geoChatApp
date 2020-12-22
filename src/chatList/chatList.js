import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import styles from './styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';

class ChatListComponent extends React.Component {

    render(){

        const { classes } = this.props;


        // Check if there is content to be rendered (if array of chats exists)
        if(this.props.chats.length>0){
        return (
            <main className={classes.root}>
                <Button 
                        variant = 'contained'
                        fullWidth
                        color='primary'
                        className={classes.newChatBtn}
                        onClick={this.newChat}>
                    New Message   
                </Button>
                <List>
                    {
                        // accessing property from dashboard component
                        this.props.chats.map((_chat,_index)=>{
                            // 
                            return (<div key = {_index}> 
                            <ListItem 
                                onClick = {()=>this.selectChat(_index)}
                                className = {classes.listItem}
                                // if selected chat index is equal to chat that is clicked, then selected = true
                                selected = {this.props.selectedChatIndex === _index}
                                align-items = 'flex-start'>
    
                                         {/*little circle that can be avatar in the future*/}
                                    <ListItemAvatar>
                                        <Avatar alt='Remy Sharp'>{
                                                //returns an array of users that are not "me", so returns friend that user is texting to as an array. Then get the first letter with split(0)
                                                _chat.users.filter(_user => _user !== this.props.userEmail)[0].split('')[0]
                                            }
                                        </Avatar>
                                    </ListItemAvatar>
                                            {/* The text inside of the component */}
                                            
                                    <ListItemText 
                                    primary={_chat.users.filter(_user => _user !== this.props.userEmail)[0]}
    
                                    secondary={
                                       <React.Fragment>
                                           <Typography component='span' color='textPrimary'>
                                            {/* grab the last message from the messages in chat , and get the first 30 letters out of it */}
                                            <b>
                                            {
                                            _chat.recieverHasRead === false && !this.userIsSender(_chat)?
                                            _chat.messages[_chat.messages.length-1].message.substring(0,15):
                                            null
                                            }
                                            </b>
                                            {
                                            _chat.recieverHasRead === false && !this.userIsSender(_chat)?
                                            null:
                                            _chat.messages[_chat.messages.length-1].message.substring(0,30)
                                            }
                                           </Typography>
                                       </React.Fragment>
                                        }>
    
                                    </ListItemText>
                                    {
                                        _chat.recieverHasRead === false && !this.userIsSender(_chat) ?
                                        <ListItemIcon>
                                            <FiberManualRecordRoundedIcon
                                            className={classes.unreadMessage}></FiberManualRecordRoundedIcon>
                                        </ListItemIcon> : null
                                    }
                                </ListItem> 
                                <Divider></Divider>
                                </div>
                            )
                        })
                    }
                </List>
    
            </main>
            );
}

else{
    return (<main className={classes.root}>
        <Button 
                variant = 'contained'
                fullWidth
                color='primary'
                className={classes.newChatBtn}
                onClick={this.newChat}>  
            New Message   
        </Button>
        <List></List>
    </main>)
    }
}
    selectChat = (index) => this.props.selectChatFn(index);
    

    newChat = () =>this.props.newChatBtnFn();
    // if youre sender then dont display the icon of unread
    userIsSender = (chat) => chat.messages[chat.messages.length-1].sender === this.props.userEmail;
    



}
export default withStyles(styles)(ChatListComponent)