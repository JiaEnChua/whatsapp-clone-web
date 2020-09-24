import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined } from "@material-ui/icons";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MicIcon from "@material-ui/icons/Mic";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoodIcon from "@material-ui/icons/Mood";
import db from "./firebase";
import { useParams, useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import firebase from "firebase";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

function Chat() {
  const [input, setInput] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const { roomID } = useParams();
  const [{ user }, dispatch] = useStateValue();
  const [state, setState] = useState({
    isPaneOpen: false,
    isPaneOpenRight: false,
  });
  const history = useHistory();
  const isMountedRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    if (roomID) {
      console.log("ROOM >>", roomID);
      if (isMountedRef.current) {
        db.collection("rooms")
          .doc(roomID)
          .onSnapshot((snapshot) => setRoom(snapshot.data()));

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
    }

    return () => (isMountedRef.current = false);
  }, [roomID]);

  const sendMessage = (event) => {
    event.preventDefault();

    db.collection("rooms").doc(roomID).collection("messages").add({
      name: user.displayName,
      message: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
  };

  const deleteRoom = () => {
    if (user.uid === room.ownerID) {
      db.collection("rooms")
        .doc(roomID)
        .delete()
        .then(function () {
          console.log("Document successfully deleted!");
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
      history.push("/rooms");
    } else {
      alert("Sorry, only the room creator can delete it.");
    }
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/male/${roomID}.svg`} />
        <div className="chat__headerMiddle">
          <h3>{room.name}</h3>
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
          <IconButton onClick={() => setState({ isPaneOpen: true })}>
            <MoreVertIcon />
          </IconButton>
          <SlidingPane
            isOpen={state.isPaneOpen}
            width="200px"
            onRequestClose={() => {
              // triggered on "<" on left top click or on outside click
              setState({ isPaneOpen: false });
            }}
          >
            <p className="chat__deleteRoom" onClick={deleteRoom}>
              Delete Chat Room
            </p>
          </SlidingPane>
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
