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

function Chat() {
  const [input, setInput] = useState("");
  const [roomName, setRoomName] = useState("");
  const { roomID } = useParams();

  useEffect(() => {
    if (roomID) {
      db.collection("rooms")
        .doc(roomID)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));
    }

    return () => {
      // cleanup
    };
  }, [roomID]);

  const sendMessage = (event) => {
    event.preventDefault();
    console.log(input);
    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/male/${roomID}.svg`} />
        <div className="chat__headerMiddle">
          <h3>{roomName}</h3>
          <p>load message</p>
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
        <p className="chat__bodyMessage">hello worldaxsxasxasxasxasx</p>
        <p
          className={`chat__bodyMessage ${true && "chat__bodyMessage__owner"}`}
        >
          hello world
        </p>
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
