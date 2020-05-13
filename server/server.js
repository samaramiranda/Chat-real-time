const Koa = require('koa');
const http = require('http');
const socket = require('socket.io');

const app = new Koa( ); //criando nova aplicação
//criando um novo servidor que vai lidar com a requisiçaõ KOA
const server = http.createServer(app.callback()); //app callback é função do koa que devolve uma função que sabe lidar com requisição
const io = socket(server); //integrando o socket com o nosso servidor de mensagem localhost

//definindo o endereço e a porta que serão utilizados
const SERVER_HOST = 'localhost';
const SERVER_PORT = 8080;

io.on('connection', socket => { //essa conexão tem um socket
  console.log('[IO] Connection => Server has a new connection')
  //recebendo uma mensagem do chat.message e emitindo de volta para o front
  socket.on('chat.message', data => { //quando socket for conectado irá disparar o evento chat.message (tenho que passar esse mesmo evento no backend). Recebendo a mensagem no data
    console.log('[SOCKET] Chat.message =>', data)
    io.emit('chat.message', data)//para emitir a mensagem do backend para o frontend pelo emit
  })
  socket.on('disconnect', () => { //quando o socket for desconectado
    console.log('[SOCKET] Disconnect => A connection was disconnect')
  })
});

//subindo o servidor
server.listen(SERVER_PORT, SERVER_HOST, () => { //quando o servidor for inicializado irá rodar essa função de callback com as mensagens
  console.log(`[HTTP] Listen => Server is running at http://${SERVER_HOST}:${SERVER_PORT}`);
  console.log('[HTTP] Listen => Press CTRL+C to stop it');
});