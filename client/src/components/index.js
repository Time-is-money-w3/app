import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  DAI_CONTRACT_ADDRESS,
  ConvertDAIPreciseToReadable,
} from "../utils/constants";
import DAIAbi from "../utils/dai_abi.json";
import { useStore } from "../global_stores";

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
  const showToastFunc = useStore((state) => state.showToastFunc);

  const populateEthereumValues = async (ethereum) => {
    const chainId = await ethereum.request({ method: "eth_chainId" });
    const rinkebyTestChainId = 4;
    console.log("hex", ethers.utils.hexValue(rinkebyTestChainId));
    if (chainId !== rinkebyTestChainId) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: ethers.utils.hexValue(rinkebyTestChainId),
            },
          ],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          console.log(
            "This network is not available in your metamask, please add it"
          );
          return showToastFunc(
            "Please enable test-network on your metamask and try again"
          );
        }
        console.log("Failed to switch to the network");
      }
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const address = await signer.getAddress();
    console.log({ address });
    const daiAddress = DAI_CONTRACT_ADDRESS;
    const daiContract = new ethers.Contract(daiAddress, DAIAbi, provider);
    console.log({ daiContract });
    const balance = await daiContract.balanceOf(address);
    if (balance > 0) setDaiBalance(ConvertDAIPreciseToReadable(balance));
    else setDaiBalance(0);
    setMyAddress(address);
    setConnectionStatus(true);
  };

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
        await populateEthereumValues(ethereum);
        setCurrentAccount(account);
      }
      setIsCheckingConnectionStatus(true);
    } catch (error) {
      console.log(error);
      showToastFunc("Something went wrong!");
      setIsCheckingConnectionStatus(true);
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        // Prompt user for account connections
        await provider.send("eth_requestAccounts", []);
        await populateEthereumValues(ethereum);
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const account = accounts[0];
        setCurrentAccount(account);
      } else {
        alert("Install Metamask");
      }
      setIsConnecting(false);
    } catch (e) {
      console.log({ e });
      showToastFunc("Something went wrong!");
      setIsConnecting(false);
    }
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
              Connected to :
              <b>
                {" "}
                {`${myAddress.substring(0, 7)}...${myAddress.substring(
                  myAddress.length - 5,
                  myAddress.length
                )}`}{" "}
              </b>
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

export const Toast = ({ showToast, toastMessage }) => {
  return (
    <div
      className="snackbar"
      style={{ visibility: showToast ? "visible" : "hidden" }}
    >
      {toastMessage}
    </div>
  );
};

export const Video = ({ stream, muted }) => {
  const localVideo = React.createRef();

  // localVideo.current is null on first render
  // localVideo.current.srcObject = stream;

  useEffect(() => {
    // Let's update the srcObject only after the ref has been set
    // and then every time the stream prop updates
    if (localVideo.current) localVideo.current.srcObject = stream;
  }, [stream, localVideo]);

  return muted ? (
    <video
      muted={muted ? "muted" : false}
      className="flipped"
      style={{ width: "100%" }}
      ref={localVideo}
      autoPlay
    />
  ) : (
    <video
      className="flipped"
      style={{ width: "100%" }}
      ref={localVideo}
      autoPlay
    />
  );
};

export const Timer = () => {
  const [seconds, setSeconds] = useState(0);

  const setMinutes = useStore((state) => state.setMinutes);
  const minutes = useStore((state) => state.minutes);

  useEffect(() => {
    let _minutes = +(seconds + 1) / 60;
    setMinutes(_minutes);
  }, [seconds]);

  const increaseTimer = () => {
    setSeconds((seconds) => seconds + 1);
  };

  useEffect(() => {
    console.log("Executed!");
    let timer = setInterval(increaseTimer, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div className="container center">
      <span>{`${Math.floor(minutes / 60)}:${Math.floor(minutes)}:${Math.floor(
        seconds % 60
      )}`}</span>
    </div>
  );
};

export const StopCall = ({ endSession, minutes, setMinutes }) => {
  return (
    <div
      style={{
        width: "140px",
        marginLeft: "-70px",
        padding: "10px",
        position: "Fixed",
        bottom: "30px",
        left: "50%",
      }}
    >
      <div
        className="clickable"
        style={{
          width: "100px",
          padding: "20px",

          borderRadius: "20px",
          backgroundColor: "red",
          color: "#ffff",
        }}
        onClick={endSession}
      >
        End Call
      </div>
      <br />
      <Timer minutes={minutes} setMinutes={setMinutes} />
    </div>
  );
};
