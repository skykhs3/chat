# React와 Express를 공부하는데 도움이 된 사이트 정리

"https://www.inflearn.com/course/%EB%94%B0%EB%9D%BC%ED%95%98%EB%A9%B0-%EB%B0%B0%EC%9A%B0%EB%8A%94-%EB%85%B8%EB%93%9C-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EA%B8%B0%EB%B3%B8/questions?page=6&limit=15"

"https://www.inflearn.com/course/react-%EA%B0%95%EC%A2%8C-velopert/dashboard"

# local 컴퓨터에서 whale를 이용하기 위해서는...
1. 
import socketIOClient from "socket.io-client";
const socket= socketIOClient("http://whale.sparcs.org:45000")
//const socket =socketIOClient("localhost:5000");
export default socket;