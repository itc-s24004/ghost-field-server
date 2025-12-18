import http from "http";
import express from "express";




import { Server as IO_Server} from "socket.io";



//!!! pnpmだと型推論でエラーが出るため明示的に型を指定する npmだと発生しない
export const app: express.Express = express();
app
.use(express.urlencoded({ extended: true }))
.use(express.json());


export const server = http.createServer(app);
export const io = new IO_Server(
    {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    }
).listen(server);