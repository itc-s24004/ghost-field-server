import { app, io, server } from "./server/server.js";
import { GhostField_Server, GhostFieldCore } from "ghost-field"

import cards from "../cards.json" with { type: "json" };

const PORT = process.env.PORT || 5000;

server.listen(PORT,() =>  {
    console.log(`Server is running on port ${PORT}`);
});




type RoomData = {
    id: string;
    server: GhostField_Server;
    isPublic: boolean;
}



const serverRooms: RoomData[] = [];


function createRoom(id: string | undefined, data: GhostFieldCore.GF_Initial_Game, devRoom: boolean = false) {
    let isPublic = devRoom;
    if (!id) {
        id = crypto.randomUUID();
        isPublic = true;
    }
    
    if (serverRooms.find(r => r.id === id)) {
        throw new Error("そのIDの部屋は既に存在しています");
    }
    if (!/^[a-zA-Z0-9-]{1,36}$/.test(id)) {
        throw new Error("部屋IDは英数字とハイフンのみの36文字以下である必要があります");
    }
    const socket = io.of(`/${id}`);
    
    const server = new GhostField_Server(socket, data, {
        autoClose: !devRoom,
        timeout: devRoom ? undefined : 1000 * 60, // 60秒
        onClose: () =>  {
            const index = serverRooms.findIndex(r => r.id === id);
            if (index !== -1) {
                serverRooms.splice(index, 1);
            }
            io._nsps.delete(`/${id}`);
            console.log(`ルーム ${id} が閉じられました`);
        }
    });
    console.log("ルームが作成されました: ", id);

    serverRooms.push({
        id,
        server,
        isPublic
    });

    return id;
}



type RoomList = {
    id: string;
    connection: number;
}

function getRoomList(): RoomList[] {
    return serverRooms.reduce((list, room) => {
        if (room.isPublic) {
            list.push({
                id: room.id,
                connection: room.server.socketCount
            });
        }
        return list;
    }, [] as RoomList[]);
}




type RoomInfo = GhostFieldCore.GF_Initial_Game

function getRoom(id: string): RoomInfo | null {
    const room = serverRooms.find(r => r.id === id);
    if (!room) return null;
    return room.server.game.initData;
}













app.get("/room", (req, res) => {
    console.log("get room list");
    res.json(getRoomList());

}).get("/room/:id", (req, res) => {
    const id = req.params.id;
    const room = getRoom(id);

    if (!room) return res.status(404).json({});;
    res.json(room);

}).post("/room", (req, res) => {
    const { id, data } = req.body;
    try {
        const roomId = createRoom(id, data);
        res.json({ id: roomId });

    } catch (e) {
        res.status(400).json({ error: e instanceof Error ? e.message : "不明なエラー" });

    }

});

createRoom("dev", {cards: cards as unknown as GhostFieldCore.GF_CardComponent[], meta: {}}, true);

