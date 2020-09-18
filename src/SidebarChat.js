import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import db from "./firebase";
import { Link } from "react-router-dom";

function SidebarChat({ id, name, addNewChat }) {
  const [seed, setSeed] = useState("");

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createChat = () => {
    const roomName = prompt("Please enter a room name");
    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
      });
    }
  };

  return addNewChat ? (
    <div className="sidebarChat" onClick={createChat}>
      <h2>Add new Chat</h2>
    </div>
  ) : (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/male/${id}.svg`} />
        <div className="sidebarChat__info">
          <h2>{name}</h2>
          <p>last message...</p>
        </div>
      </div>
    </Link>
  );
}

export default SidebarChat;
