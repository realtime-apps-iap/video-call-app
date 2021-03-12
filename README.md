# Group Video Call Application 📸

![Demo Screenshot](assets/screenshot.jpg)

## About

An video call application (similar to Zoom) that allows users to join the same video call room, and share their webcam video feed and microphone audio feed.

This application uses the following technologies:

- [WebRTC](https://webrtc.org/) (using [PeerJS](https://peerjs.com/) library)
- [Socket.io](https://socket.io/) (websocket implementation)

## Features

- A room will be created for new users who don't have a room
- Application will request stream users' video and audio feed, which can be turned off.
- Users can join the same room by visiting the same generated room link
- Everyone is able to view one anothers' video and audio feed

## Deployment

A [Heroku](https://www.heroku.com) account and the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) is needed to deploy this application to Heroku.

**Basic Instructions for deploying application on heroku**

If you want to create a new Heroku app to deploy to, navigate to the app’s directory and create a Heroku app:

```console
$ heroku create
```

Alternatively, if there is already a Heroku app you want to add this to, add the remote to the repository:

```console
$ heroku git:remote -a your-app-name
```

Deploying application to heroku

```console
$ git push heroku master
```

---

For more information on using Heroku, please visit the link below.  
[IAP notes on deployment to Heroku](https://realtime-apps-iap.github.io/docs/introduction/deployment-to-heroku)
