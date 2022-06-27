import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  DAI_CONTRACT_ADDRESS,
  ConvertDAIPreciseToReadable,
} from "../utils/constants";
import DAIAbi from "../utils/dai_abi.json";

export const CheckIfWalletIsConnected = ({
  setConnectionStatus,
  setMyAddress,
  myAddress,
  connectionStatus,
  setCurrentAccount,
  setDaiBalance,
}) => {
  const [isCheckingConnectionStatus, setIsCheckingConnectionStatus] =
    useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Make sure you have metamask!");
        setIsCheckingConnectionStatus(true);
        return;
      }
      let accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
      }
      setIsCheckingConnectionStatus(true);
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const accounts = await ethereum.request({ method: "eth_accounts" });

      const account = accounts[0];
      const address = await signer.getAddress();

      const daiAddress = DAI_CONTRACT_ADDRESS;
      const daiContract = new ethers.Contract(daiAddress, DAIAbi, provider);
      const balance = await daiContract.balanceOf(address);

      if (balance > 0) setDaiBalance(ConvertDAIPreciseToReadable(balance));
      else setDaiBalance(0);

      setMyAddress(address);
      setCurrentAccount(account);
      setConnectionStatus(true);
    } else {
      alert("Install Metamask");
    }
    setIsConnecting(false);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div>
      {!isCheckingConnectionStatus ? (
        <span>checking connection status ..</span>
      ) : (
        <div>
          {connectionStatus === true ? (
            <div>
              <b> Connected to : </b>
              {`${myAddress.substring(0, 7)}...${myAddress.substring(
                myAddress.length - 5,
                myAddress.length
              )}`}
            </div>
          ) : (
            <button onClick={connectWallet} disabled={isConnecting}>
              {isConnecting ? "Connecting" : "Connect to Wallet"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export const Error = ({ showError, errorMessage }) => {
  return (
    <div id="snackbar" style={{ visibility: showError ? "visible" : "hidden" }}>
      {errorMessage}
    </div>
  );
};
