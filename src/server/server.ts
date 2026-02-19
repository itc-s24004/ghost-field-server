import http from "http";
import express from "express";




import { Server as IO_Server} from "socket.io";



//!!! pnpmだと型推論でエラーが出るため明示的に型を指定する npmだと発生しない
export const app: express.Express = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, access_token'
    )

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200)
    } else {
        next()
    }
})


app
.use(express.urlencoded({ extended: true }))
.use(express.json());


export const server = http.createServer(app);
export const io = new IO_Server(
    {
        connectionStateRecovery: {// 切断からの復帰を有効化
            maxDisconnectionDuration: 60 * 1000
        },
        transports: ["websocket"]
    }
).listen(server);