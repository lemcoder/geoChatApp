import React from "react";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

class ChatVievComponent extends React.Component{

    componentDidUpdate = () =>{
        const container = document.getElementById('chatViev-container');
        if(container){
            container.scrollTo(0,container.scrollHeight);
        }
    }



    render(){
        const {classes,chat,user} = this.props;

        if(chat === undefined){
            return (<main className={classes.content} id='chatViev-container'></main>);
        }else{
            return(
            <div>
                <div className={classes.chatHeader}>
                    Your conversation with {chat.users.filter(_user => _user !== user)[0]}
                </div>
                <main className={classes.content} id='chatViev-container'>
                    {
                        chat.messages.map((_msg,_index) =>{
                            return(
                                <div 
                                key={_index}
                                className={_msg.sender !== user ? classes.userSent : classes.friendSent}>
                                    {_msg.message}
                                </div>
                            )
                        })
                    }
                </main>
            </div>
            );
        }
    }


}



export default withStyles(styles)(ChatVievComponent);
