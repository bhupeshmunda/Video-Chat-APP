import {Server} from 'socket.io';

let connections = {};
let messages = {};
let timeOnline = {};

export const connectSocket = (server) => {
    const io = new Server(server,{
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on('connection',(socket)=>{

        console.log("someone connected");

        socket.on('join-call',(path)=>{

            if(connections[path] === undefined){
                connections[path] = [];
            }
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            connections[path].forEach(client => {
                io.to(client).emit("user-joined", socket.id, connections[path]);
            });

            if(messages[path] !== undefined){
                messages[path].forEach(msg => {
                    io.to(socket.id).emit("chat-message", msg['data'], msg['sender'], msg['socket-id-sender']);
                })
            }

        })

        socket.on('signal',(toId, message) => {
            io.to(toId).emit("signal", socket.id, message)
        })

        socket.on('chat-message',(data, sender)=>{

            const [matchingRoom, found] = Object.entries(connections).reduce(([room, isFound], [roomKey, roomValue])=>{
                if(!isFound && roomValue.includes(socket.id)){
                    return [roomKey, true];
                }
                return [room, isFound];
            }, ['', false]);

            if(found === true){
                if(messages[matchingRoom] === undefined){
                    messages[matchingRoom] = [];
                }

                messages[matchingRoom].push({'sender': sender, "data": data, "socket-id-sender": socket.id});
                console.log("message", matchingRoom, ":", data, sender, socket.id);

                connections[matchingRoom].forEach( client => {
                    io.to(client).emit("chat-message", data, sender, socket.id);
                })
            }

        })

        socket.on('disconnect', ()=>{
            
            let diffTime = Math.abs(timeOnline[socket.id] - new Date());

            var key;

            for(const [room, clients] of JSON.parse(JSON.stringify(Object.entries(connections)))){

                for(let a = 0 ; a < clients.length; ++a){
                    if(clients[a]===socket.id){
                        key = room;

                        for(let a = 0; a < connections[room].length; ++a){
                            io.to(connections[key][a]).emit('user-left', socket.id);
                        }

                        var index = connections[key].indexOf(socket.id);

                        connections[key].splice(index, 1);

                        if(connections[key].length === 0){
                            delete connections[key];
                            delete messages[key];
                        }
                    }
                }
            }

        })

    })

    return io;
}

