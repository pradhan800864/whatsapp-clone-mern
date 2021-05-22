import { useEffect, useState } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js';
import axios from './axios';
import Login from './Login';
import { useStateValue } from './StateProvider'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
function App() {
  const [{ user }, dispatch] = useStateValue();

  const[messages, setMessages] =  useState([])
  // const[user, setUser] = useState(null)

  useEffect(() =>{
    axios.get('/messages/sync').then(response => {
      setMessages(response.data);
    })
  },[])

  useEffect(() => {
    const pusher = new Pusher('fbf6f4ee964911f4ea6a', {
      cluster: 'ap2'
    });
  
    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage])
    });
    return() => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  },[messages])

 
  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">          
          <Router >
            <Sidebar/>
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat messages={messages}/>
              </Route>

              <Route path='/'>
                <Chat />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
