const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");

const { v4: uuidv4 } = require("uuid");

const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use("/peerjs", peerServer); // Peer WebRTC server

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`); // e.g. 0a48077c-0878-4389-b7f6-cff074f658bb
});

app.get("/:roomID", (req, res) => {
    res.render("room", {
        roomId: req.params.roomID,
        port: 5000,
        host: process.env.host | "/",
    });
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
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));