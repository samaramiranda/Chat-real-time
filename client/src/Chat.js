import React, { useEffect ,useState } from 'react';
import io from 'socket.io-client';
import uuid from 'uuid/v4';

const myId = uuid();
//criando um socket
const socket = io('http://localhost:8080'); //recebe URL para onde está o servidor socket
socket.on('connect', () => console.log('[IO] Connect => A new Connection has been established')); //quando o connect disparar aparece a mensagem no console.log


const Chat = ( ) => {
  //use state recebe o valor e retorna um array com 2 posições. A 1 será de fato o estado e a 2 uma função para atualizar o estado 
  const [message, updateMessage] = useState(''); //o que for digitando no campo será salvo em message
  const [messages, updateMessages] = useState([]); //para atualizar as mensagens
  
  useEffect(() => { //primeiro parametro é a função que quero executar e segundo parametro são propriedades que quero ouvir mudanças
    const handleNewMessage = newMessage => //vai receber uma nova mensagem e fazer a atualização
      updateMessages([...messages, newMessage]); //pego todas as mensagens atuais e concateno com a mensagem nova
    socket.on('chat.message', handleNewMessage); //quando o chat.message for disparado chamo a função
    return () => socket.off('chat.message', handleNewMessage);  
  }, [messages]); //se o array for fazio a função do useEffet vai ser disparada apenas uma vez

  //quando submeter o evento eu mando a mensagem para o backend pelo emit e o backend retorna também pelo emit
  const handleFormSubmit = event => {
    event.preventDefault(); 
    if (message.trim()) { //se tiver mensagem no campo
      socket.emit('chat.message', { //função onde o 1 parametro é o nome do evento que vamos emitir e o 2 são as informações passadas para o evento
        id: myId,
        message
      })
      updateMessage(''); //limpa o input para simular que a mensagem foi enviada
    }
  }

  const handleInputChange = event => //definindo função para o input
    updateMessage(event.target.value); //pegando o valor do input

  return (
    <main className="container">
      <ul className= "list">
        {messages.map((m, index) => (
          <li 
            className={`list__item list__item--${m.id === myId ? 'mine' : 'other'}`} //comparando o id da mensagem é igual ao myId declarado, se for a mensagem é minha senão é de outro
            key={index}> 
            <span 
              className={`message message--${m.id === myId ? 'mine' : 'other'}`}> 
                {m.message}
            </span>
          </li>
        ))}
      </ul>
      <form className="form" onSubmit={handleFormSubmit}>
        <input  //barra de enviar a mensagem
          className="form__field"
          onChange={handleInputChange}
          placeholder="Type a new message here"
          type="text"
          value={message}> 
          </input>
      </form>
    </main>
  );
};

export default Chat; 