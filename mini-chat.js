var net = require('net'); // Instância o módulo para protocolo TCP.  
var carrier = require('carrier'); // Instância o módulo Carrier.  
 
var connections = []; // Cria um array de conexões.  
 
server = net.createServer(function(conn){ 
  // Adiciona no array de conexões uma conexão de um usuário.
  connections.push(conn);   
  // Remove o usuário do array de conexões no evento 'close'.  
  conn.on('close', function(){ 
    var pos = connections.indexOf(conn);
    if(pos <= 0){
      connections.splice(pos, 1);
    }
  });
 
  //Imprime no cliente a mensagem de início no mini-chat.  
  conn.write("Node ChatnName: ");// Variável para identificar o nome do usuário conectado.  
  var username;
 
  // No evento carry é que o mini-chat acontece.  
  // A variável em parâmetro chamada <b>line</b> é responsável por carregar as mensagens do chat.  
  carrier.carry(conn, function(line){
    // Se a variável <b>username</b> estiver nula, é definido o valor da variável <b>line</b> para ela.  
    if(!username){
      username = line;
      conn.write("Hi "+username+"\n");
      return;
    }
 
    // Aqui comparo o valor de <b>line</b> com as palavras-chaves <b>end</b>,<b>quit</b> e <b>exit</b> que irão finalizar a conexão do cliente.  
    if(line == 'end' || line == 'quit' || line == 'exit'){
      conn.end();
      return;
    }
 
    // Se nenhuma das condições acontecer, então preparamos uma  mensagem de feedback.  
    var feedback = username+" >> "+line+"\n";
 
    //Aqui ocorre o loop de distribuição de mensageria.  
    connections.forEach(function(one_connection){
      one_connection.write(feedback); 
    });
   });
});

// Inicia o servidor mini-chat abrindo a porta 4000.  
server.listen(4000,function(){console.log("SERVER LISTENING")});

// Imprime mensagem alertando que o servidor está em execução.  
console.log("Servidor mini-chat em execução."); 