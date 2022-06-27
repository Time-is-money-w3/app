import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  LLAMA_TIME_CONTRACT_ADDRESS,
  ConvertDAIPreciseToReadable,
} from "../utils/constants";
import contractABI from "../utils/llama_pay_abi.json";

function Caller() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [onGoingStream, setOnGoingStream] = useState({
    toAddress: "",
    amountPerSec: 0,
    reason: "",
  });
  const [connectedAddress, setconnectedAddress] = useState("");
  const [payerBalance, setPayerBalance] = useState(0);
  const [amountOfDaiToDeposit, setAmountOfDaiTODeposit] = useState(0);
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      let accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
      } else {
        const provider = new ethers.providers.Web3Provider(ethereum);
        // Prompt user for account connections
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        accounts = await ethereum.request({ method: "eth_accounts" });

        console.log("Account:", await signer.getAddress());
        const account = accounts[0];
        setCurrentAccount(account);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const accounts = await ethereum.request({ method: "eth_accounts" });

      console.log("Account:", await signer.getAddress());
      const account = accounts[0];
      const streamContract = new ethers.Contract(
        LLAMA_TIME_CONTRACT_ADDRESS,
        contractABI,
        signer
      );
      const address = await signer.getAddress();
      const Balance = await streamContract.balances(address);
      setPayerBalance(ConvertDAIPreciseToReadable(Balance));
      setCurrentAccount(account);
      setWalletConnected(true);
    } else {
      alert("Install Metamask");
    }
  };

  const startStream = async () => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const streamContract = new ethers.Contract(
        LLAMA_TIME_CONTRACT_ADDRESS,
        contractABI,
        signer
      );
      const address = await signer.getAddress();
    } else {
      alert("Ethereum wallet is not connect");
    }
  };

  const cancelStream = () => {};
  const pauseStream = () => {};
  useEffect(() => {
    // parse WebRtc Token
    // parse the to Address
    checkIfWalletIsConnected();
  });
  return !walletConnected ? (
    <div>
      <span>Payer's balance remaining: {payerBalance} DAI</span>
      <button onClick={startStream}>Create Stream</button>
      <br />
      <button onClick={pauseStream}>Pause Stream</button>
      <br />
      <button onClick={cancelStream}>Cancel Stream</button>
      <br />
      <br />
      <input
        type="number"
        onChange={(e) => {
          setAmountOfDaiTODeposit(e.target.value);
        }}
        value={amountOfDaiToDeposit}
      ></input>
    </div>
  ) : (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
    </div>
  );
}

export default Caller;
