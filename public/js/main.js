const socket = io("/");
const videoGrid = document.getElementById("videoGrid");
const myVideo = document.createElement("video");
myVideo.muted = true;

// peer.js script loaded on client side via cdn in room.ejs
var peer = new Peer();

// undefined - unique ID autocreated by peerjs library
const myPeer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: "443",
});

// peers object to store the calls - to conveniently .close() later on
const peers = {};

let myVideoStream;

// Access camera & microphones via browser
navigator.mediaDevices
    .getUserMedia({
        video: true,
        audio: true,
    })
    .then((stream) => {
        myVideoStream = stream;
        addVideoStream(myVideo, stream);

        // When a user has joined
        socket.on("user-connected", (userId) => {
            connectToNewUser(userId, stream);
            console.log(`Someone joined the video call - User: ${userId}`);
        });

        // When user calls
        peer.on("call", (call) => {
            call.answer(stream);
            const video = document.createElement("video");
            call.on("stream", (userVideoStream) => {
                addVideoStream(video, userVideoStream); // add video to my own client side website
            });
        });
    });

// When user disconnects
socket.on("user-disconnected", (userId) => {
    if (peers[userId]) peers[userId].close(); // stop call
});

// Once this peer is fully initialised, and able to return you ID
peer.on("open", (id) => {
    socket.emit("join-room", ROOM_ID, id);
});

// Function to connect to a new user
const connectToNewUser = (userId, stream) => {
    //Direct connection- Client A will connect to client B directly
    const call = peer.call(userId, stream);
    const video = document.createElement("video");

    // add to own video stream
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });

    // when call stops, remove video feed
    call.on("close", () => {
        video.remove();
    });

    peers[userId] = call;
};

// Function to add to own feed
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        // once stream is loaded fully, start showing and playing video
        video.play();
    });
    // add to website
    videoGrid.append(video);
};

// ----------------------------------------------------------------
// Optional additional functions

// Auto scroll to bottom of chat - disabled
const scrollToBottom = () => {
    var d = $(".mainChatWindow");
    d.scrollTop(d.prop("scrollHeight"));
};
// --------------------------
// for the mute/unmute button
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
};
const setMuteButton = () => {
    const html = `
	  <i class="fas fa-microphone"></i>
	  <span>Mute</span>
	`;
    document.querySelector(".mainMuteButton").innerHTML = html;
};

const setUnmuteButton = () => {
    const html = `
	  <i class="unmute fas fa-microphone-slash"></i>
	  <span>Unmute</span>
	`;
    document.querySelector(".mainMuteButton").innerHTML = html;
};

// -----------------------------------------------------------
// for the video play/stop button
const playStop = () => {
    console.log("object");
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    } else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
};

const setStopVideo = () => {
    const html = `
	  <i class="fas fa-video"></i>
	  <span>Stop Video</span>
	`;
    document.querySelector(".mainVideoButton").innerHTML = html;
};

const setPlayVideo = () => {
    const html = `
	<i class="stop fas fa-video-slash"></i>
	  <span>Play Video</span>
	`;
    document.querySelector(".mainVideoButton").innerHTML = html;
};

// for the video end button -- close window
const endMeeting = () => {
    window.open("", "_self").close();
};