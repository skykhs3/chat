import socketIOClient from "socket.io-client";
//const socket= socketIOClient("http://whale.sparcs.org:45000")
const socket =socketIOClient("localhost:5000");
export default socket;