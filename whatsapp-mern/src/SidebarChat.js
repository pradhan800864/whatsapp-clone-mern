import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import db from './firebase';
import "./SidebarChat.css"
import {Link} from 'react-router-dom'
function SidebarChar({ id, name, addNewChat }) {
    
    const [seed, setSeed] = useState('');
    const [messages, setMessages] = useState("");

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    },[])

    useEffect(()=>{
        const returncall = async () => {
            if(id) {
               await db.collection('rooms').doc(id).collection('messages').orderBy('timestamp', 'desc').onSnapshot((snapshot) => 
                    setMessages(snapshot.docs.map((doc) => doc.data()
                    ))
                )
            }
        }
        returncall();
    },[id]) 

    const createChat = () => {
         const roomName= prompt("Please enter name for chat");
         if(roomName){
            db.collection('rooms').add({
                name: roomName,
            })
            
         } else{
             console.log(roomName)
         }
    }

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="sidebarChat__info">
                    <h2>{name}</h2>
                    <p>{messages[0]?.message}</p>
                </div>
            </div>
        </Link>
    ): (
        <div onClick={createChat} className="sidebarChat">
            <h2>Add New Chat</h2>
        </div>
    )
}

export default SidebarChar
