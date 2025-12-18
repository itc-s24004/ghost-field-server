import { app, io, server } from "./server/server.js";
import { GhostFieldServer, GhostField_Element } from "ghost-field"

import type { GhostField_CardID } from "ghost-field";

const PORT = process.env.PORT || 5000;

server.listen(PORT);



GhostFieldServer.listen(app, io);


type custom = {
    image: string;
}


new GhostFieldServer<custom>(
    {
        "card": {
            data: [
                {
                    format: 0,
                    id: "test-card-001" as GhostField_CardID,
                    name: "",
                    description: "",
                    price: 0,
                    element: GhostField_Element.Normal,
                    canDrop: false,
                    tags: [],
                    custom: {
                        image: ""
                    }
                }
            ],
            table: {
                ["test-card-001" as GhostField_CardID]: 3
            }
        },
        ghost: {

        }
        
    }
);