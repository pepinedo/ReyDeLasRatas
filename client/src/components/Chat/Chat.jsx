import React, { useState } from 'react';

const Chat = ({ socket, nick, room_code, room_name }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  
  socket.on('send_message', (msg)=>{    
    setMessageList([...messageList, msg])
  })

  const sendMessage = (e) => {
    e.preventDefault()
    if (currentMessage) {

      const ahora = new Date();
      const messageData = {
        nick,
        room_code,
        msg: currentMessage,
        time: ahora.toLocaleTimeString()
      };

      try {
        socket.emit('send_message', messageData);        
        setCurrentMessage('');
      } 
      catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Chat de {room_name}:</p>
      </div>
      <div className="chat-body">
        {messageList?.map((elem, index) => (
          <div key={index}>
            <p>{elem?.time} - {elem?.nick}: {elem?.msg}</p>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <form>
          <input
            type="text"
            value={currentMessage}
            placeholder="Escribe un mensaje..."
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;