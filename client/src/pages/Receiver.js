import React, { useEffect, useState } from "react";
import { Peer } from "peerjs";
import { createSessionAPI } from "../api";
import { useParams } from "react-router-dom";
import {
  DAI_CONTRACT_ADDRESS,
  ConvertDAIPreciseToReadable,
  getWithExpiry,
} from "../utils/constants";

export default function Receiver() {
  const [peerId, setPeerId] = useState("");
  const [peerObject, setPeerObject] = useState({});
  const { id } = useParams();
  useEffect(() => {
    const sessionId = id;
    const sessionDetails = getWithExpiry(id);
    if(!sessionDetails) 
    return "Error"
    var peer = new Peer();
    peer.on("open", function (id) {
      console.log(id);
      setPeerId(id);
      // make API call to update PeerId and ethereum address to create a session
      const sessionId = createSessionAPI({
        toAddress,
        perHourCost,
        peerId,
      });
    });
  }, []);

  return <div>Receiver</div>;
}
