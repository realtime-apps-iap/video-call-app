const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});
const { v4: uuidv4 } = require("uuid");

app.use("/peerjs", peerServer); // Peer WebRTC server
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`); // e.g. 0a48077c-0878-4389-b7f6-cff074f658bb
});

app.get("/:roomID", (req, res) => {
    res.render("room", { roomId: req.params.roomID });
});

io.on("connection", (socket) => {
    // Listeining join-room
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId); // join room
        socket.to(roomId).broadcast.emit("user-connected", userId);

        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit("user-disconnected", userId);
        });
    });
});

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

server.listen(PORT, HOST, () => console.log(`Listening on port ${PORT}`));