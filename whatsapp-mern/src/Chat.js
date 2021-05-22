import { Avatar,IconButton } from '@material-ui/core';
import React, { useState, useEffect } from 'react'
import './Chat.css';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import { InsertEmoticon, Mic } from '@material-ui/icons';
import axios from './axios'
import { useParams } from 'react-router';
import  db from './firebase'
import { useStateValue } from './StateProvider'
import firebase from 'firebase'

function Chat() {
    const [seed, setSeed] = useState('');
    const {roomId} = useParams();
    const [roomName, setRoomName] = useState('');
    const [messages, setMessages] = useState([]);
    const [{ user }, dispatch] = useStateValue();


    useEffect(() => {
        if(roomId) {
            db.collection('rooms').doc(roomId).onSnapshot(snapshot => (
                setRoomName(snapshot.data().name)
            ));
            db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp', 'asc').onSnapshot((snapshot) => (
                setMessages(snapshot.docs.map((doc) => doc.data()))
            ))
        }
    }, [roomId])

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000))
    },[roomId])

    const [input, setInput] = useState('')

    const sendMessage = async (e) => {
        e.preventDefault();
    //    await axios.post('/messages/new', {
    //         message: input,
    //         name: "DEMO APP",
    //         timestamp: "Just Now!",
    //         received: false
    //     })
       await db.collection('rooms').doc(roomId).collection('messages').add({
            message: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        setInput('');
    }

    return (
        <div className="chat">
            <div className="chat_header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen {" "}
                        {
                            new Date(messages[messages.length-1]?.timestamp?.toDate()).toUTCString()
                        }
                    </p>
                </div>

                <div className="chat__headerRight">
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">

                {
                    messages.map((message) => (
                        <p className={`chat__message ${message.name === user.displayName && "chat__receiver"}`}>
                            <span className="chat__name">{message.name}</span>
                            {message.message}
                            <span className="chat__timestamp">{new Date(message.timestamp?.toDate()).toUTCString()}</span>
                        </p>
                    ))
                }
{/* 
                {
                    messages.map((message) => (
                        <p className={`chat__message ${message.received && "chat__receiver"}`}>
                            <span className="chat__name">{message.name}</span>
                            {message.message}
                            <span className="chat__timestamp">{message.timestamp}</span>
                        </p>
                    ))
                } */}

            </div>
            <div className="chat__footer">
                <InsertEmoticon />
                <form>
                    <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message" type="text" />
                    <button onClick={sendMessage} type="submit">Send a message</button>

                </form>
                <Mic />
            </div>
        </div>
    )
}

export default Chat
