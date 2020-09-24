import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import db from "./firebase";
import { Link, useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";

function SidebarChat({ id, name, addNewChat, lastMessage }) {
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  const createChat = () => {
    const roomName = prompt("Please enter a room name");
    if (roomName) {
      db.collection("rooms")
        .add({
          name: roomName,
          ownerID: user.uid,
        })
        .then((result) => {
          history.push(`/rooms/${result.id}`);
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
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  );
}

export default SidebarChat;
