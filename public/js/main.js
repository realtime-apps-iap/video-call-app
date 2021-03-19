const socket = io("/");

const videoGrid = document.getElementById("videoGrid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(); // btw, peer.js script is loaded on client side via cdn in room.ejs

const myPeer = new Peer(undefined, {
    // undefined - peerjs will generate a unique ID
    path: "/peerjs",
    host: "/",
    port: "443",
});

const peers = {}; // peers object to store the calls - to conveniently .close() later on

let myVideoStream;

// Start exchanging video & audio feed amongst clients
navigator.mediaDevices
    .getUserMedia({
        // prompts user for permission on the browser
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

        // When a client calls me
        peer.on("call", (call) => {
            call.answer(stream); // send my video stream to the client who called
            const video = document.createElement("video");

            // Receive video stream from client
            call.on("stream", (userVideoStream) => {
                addVideoStream(video, userVideoStream); // add video to appear on my browser
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
    // Direct P2P connection- Client A will connect to client B directly
    const call = peer.call(userId, stream);
    const video = document.createElement("video");

    // add to own video stream
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });

    peers[userId] = call;

    // when call stops, remove video feed
    call.on("close", () => {
        video.remove();
    });
};

// Function to add to my own feed
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play(); // once stream is loaded fully, start showing and playing video
    });
    // add video to client website
    videoGrid.append(video);
};

// -----------------------------------------------------------------------------
// Optional additional functions
// -----------------------------------------------------------------------------

// ------------------------------------------------------
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

// ------------------------------------------------------
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

// ------------------------------------------------------
// for the video end button -- close window
const endMeeting = () => {
    window.open("", "_self").close();
};