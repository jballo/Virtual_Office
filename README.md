# Real-Time Virtual Office Application

This project is a real-time virtual office web application developed in collaboration with Open Avenues Foundation and Pixeland Technologies. The app enables multiple users to interact in a shared environment with real-time synchronization, video communication, and responsive controls.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Setup and Installation](#setup-and-installation)
5. [Usage](#usage)
6. [Technologies Used](#technologies-used)
7. [Challenges Faced](#challenges-faced)
8. [Future Enhancements](#future-enhancements)
9. [Contributing](#contributing)
10. [Demo](#demo)
11. [License](#license)
12. [Contact](#contact)

## Overview

The Real-Time Multiplayer Application is designed to allow users to interact in a shared virtual space with real-time updates. Users can see each other's movements, communicate through video calls, and perform various actions using keyboard inputs. This project is part of a joint initiative between Open Avenues Foundation and Pixeland Technologies to explore innovative real-time communication solutions.

## Features

- **Real-Time Character Movement**: Users can move their character in four directions using WASD keys. Movements are synchronized in real-time across all clients.
- **Firebase Integration**: Utilizes Firebase for real-time data synchronization and state management across all connected clients.
- **Video Call Functionality**: Supports one-to-one video calls with the ability to view both local and remote video streams during calls.
- **WebRTC Signaling**: Implements offer/answer signaling using WebRTC for establishing peer-to-peer connections between clients.

## Architecture

The application is built using a client-server model with Firebase serving as the backend for real-time data updates. The key components include:

### Client Side

- **React**: Frontend library used for building interactive user interfaces.
- **Redux**: State management for storing user data, positions, and video call states.
- **WebRTC**: Handles video call functionalities including signaling and peer-to-peer communication.

### Server Side

- **Firebase**: Real-time database for synchronizing user movements and states across all clients.
- **Signaling Server**: Handles offer and answer signals to establish WebRTC connections between clients.

### Overal Architecture

###

- Utilizes a client-server architecture with React and Redux on the client side for user interactions and state management, Firebase for real-time data synchronization, and WebRTC for peer-to-peer video calls, coordinated through a signaling server.

![Screenshot 2024-08-29 at 5.00.06 PM.png](https://eraser.imgix.net/workspaces/kkApVpyPTegXTy3FklBz/pq6CBsj5jVTO5seMDPW1K90K7122/lNRjpveEDNwqFGZDh1g52.png?ixlib=js-3.7.0 "Screenshot 2024-08-29 at 5.00.06 PM.png")

### Architecture with 2 Users

![Screenshot 2024-08-29 at 5.00.28 PM.png](https://eraser.imgix.net/workspaces/kkApVpyPTegXTy3FklBz/pq6CBsj5jVTO5seMDPW1K90K7122/GhkXh1ktdv7QSjNRYIFLu.png?ixlib=js-3.7.0 "Screenshot 2024-08-29 at 5.00.28 PM.png")

### Character Movement

- When a user presses the WASD keys, the client updates the character's position in Firebase, which then broadcasts the changes to all connected clients via real-time listeners, ensuring synchronized character movement across all users.

![Screenshot 2024-08-29 at 4.59.20 PM.png](https://eraser.imgix.net/workspaces/kkApVpyPTegXTy3FklBz/pq6CBsj5jVTO5seMDPW1K90K7122/MOkIizc7csMPWXzTiOEGY.png?ixlib=js-3.7.0 "Screenshot 2024-08-29 at 4.59.20 PM.png")

### Application’s Continuous Connection b/t Client & Server

- The Express server facilitates peer connections, transmitting video feeds via WebRTC for seamless interaction and real-time synchronization between users.

![Screenshot 2024-08-29 at 4.59.39 PM.png](https://eraser.imgix.net/workspaces/kkApVpyPTegXTy3FklBz/pq6CBsj5jVTO5seMDPW1K90K7122/woi8TBADs3PNkPEfEZfYX.png?ixlib=js-3.7.0 "Screenshot 2024-08-29 at 4.59.39 PM.png")

## Setup and Installation

To run the application locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/jballo/Virtual_Office.git
   cd /Virtual_Office
   ```

2. **Install client-side dependencies:**

   ```bash
   cd /client
   npm install
   ```

3. **Install server-side dependencies:**

   ```bash
   cd /server
   npm install
   ```

4. **Add Firebase Configuration:**

   - Create a `.env` file in the following directory: `/client/src/firebase`.

   - Add the following credentials from your Firebase Realtime Database:
     ```env
     REACT_APP_apiKey=someFirebaseAPIKey
     REACT_APP_authDomain=someFirebaseAuthDomain
     REACT_APP_projectId=someFirebaseProjectId
     REACT_APP_storageBucket=someFirebaseStorageBucket
     REACT_APP_messagingSenderId=someFirebaseMessagingSenderId
     REACT_APP_appId=someFirebaseAppId
     REACT_APP_measurementId=someFirebaseMeasurementId
     ```

5. **Run client-side and server to see full functionality:**

   - **Run the server for frontend:**

     ```bash
     cd /server/src
     node index.js
     ```

   - **Run the client-side:**
     ```bash
     cd /client
     # Build front-end code
     npm run-script build
     # Run the frontend server
     npx serve -s build
     ```

6. **Open the app in your browser:**
   Visit `http://localhost:3000` to see the application in action.

## Usage

1. **Character Movement**: Use the WASD keys to move your character around the virtual environment.
2. **Real-Time Updates**: All user movements are reflected in real-time on every connected client.
3. **Video Calls**: Initiate a video call with another user and see both your video and theirs in real-time.

## Technologies Used

- **React**: For building the user interface.
- **Redux**: For managing the application's state.
- **Firebase**: For real-time database and state synchronization.
- **WebRTC**: For implementing video calls and peer-to-peer communication.
- **JavaScript**: Core language for development.

## Challenges Faced

- **Real-Time Data Synchronization**: Ensuring smooth and accurate synchronization of character movements and states across all clients.
- **WebRTC Signaling**: Setting up WebRTC signaling to facilitate peer-to-peer connections between users for video calls.
- **State Management**: Efficiently managing application state with Redux to handle real-time updates.

## Future Enhancements

- **Group Video Calls**: Extend the current functionality to support group video calls.
- **Text Chat**: Add a real-time chat feature for text communication.
- **Screen Sharing**: Implement a screen-sharing feature to enhance collaboration.
- **Optimized Performance**: Refactor and optimize code to reduce latency and improve performance.

## Demo

Check out the demo of the application in action:

[![Real-Time Virtual Office Application Demo](https://eraser.imgix.net/workspaces/kkApVpyPTegXTy3FklBz/pq6CBsj5jVTO5seMDPW1K90K7122/jHlXzIhKjyCp0AeBbHppq.png?ixlib=js-3.7.0 "Screenshot 2024-08-29 at 11.26.47 PM.png")](https://youtu.be/3ncO2ksM3qY)

> Click on the image above to play the demo.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries:

- **Jonathan Ballona Sanchez**  
  Software Engineer  
  Open Avenues Foundation & Pixeland Technologies  
  [jballonasanchez@gmail.com]  
  [[LinkedIn Profile](https://www.linkedin.com/feed/)]
