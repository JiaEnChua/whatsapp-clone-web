import React, { useState, useEffect } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MicIcon from "@material-ui/icons/Mic";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoodIcon from "@material-ui/icons/Mood";
import db from "./firebase";
import { useParams } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";

function Chat() {
  const [input, setInput] = useState("");
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const { roomID } = useParams();
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (roomID) {
      db.collection("rooms")
        .doc(roomID)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

      db.collection("rooms")
        .doc(roomID)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          )
        );
    }

    return () => {
      // cleanup
    };
  }, [roomID]);

  const sendMessage = (event) => {
    event.preventDefault();
    console.log(input);
    db.collection("rooms").doc(roomID).collection("messages").add({
      name: user.displayName,
      message: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/male/${roomID}.svg`} />
        <div className="chat__headerMiddle">
          <h3>{roomName}</h3>
          <p>
            {messages.length > 0
              ? "last seen " +
                new Date(
                  messages[messages.length - 1]?.data.timestamp?.toDate()
                ).toUTCString()
              : ""}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages.map((message) => (
          <div
            className={`chat__bodyMessage ${
              user.displayName === message.data.name &&
              "chat__bodyMessage__owner"
            }`}
            key={message.id}
          >
            <div className="chat__name">{message.data.name}</div>
            <p>
              <span className="chat__message">{message.data.message}</span>

              <span className="chat__timestamp">
                {new Date(message.data.timestamp?.toDate()).toUTCString()}
              </span>
            </p>
          </div>
        ))}
      </div>
      <div className="chat__footer">
        <div className="chat__footerLeft">
          <IconButton>
            <MoodIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
        </div>
        <div className="chat__footerMiddle">
          <form>
            <input
              type="text"
              value={input}
              placeholder="Type a message"
              onChange={(event) => {
                setInput(event.target.value);
              }}
            />
            <button onClick={sendMessage}>Enter</button>
          </form>
        </div>
        <div className="chat__footerRight">
          <MicIcon />
        </div>
      </div>
    </div>
  );
}

export default Chat;
