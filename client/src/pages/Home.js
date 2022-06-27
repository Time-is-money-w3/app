import React, { useState } from "react";
import { CheckIfWalletIsConnected, Error } from "../components/index";
import uuid from "react-uuid";

export default function Home() {
  // Error state

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  // success toast
  //   const [showSuccessToast, setShowSuccessToast] = useState(false);
  //   const [successMessage, setSuccessMessage] = useState("");

  const showErrorFunc = (error, temp) => {
    setShowError(true);
    setErrorMessage(error);
    if (temp === true) {
      setTimeout(() => {
        setShowError(false);
      }, 7000);
    }
  };

  // Wallet connection states
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [myAddress, setMyAddress] = useState("");
  const [currentAccount, setCurrentAccount] = useState({});

  // States related to this client for this connection session
  const [perHourCost, setPerHourCost] = useState(0);

  const [daiBalance, setDaiBalance] = useState("");

  const [isSessionGettingCreated, setIsSessionGettingCreated] = useState(false);

  const createSession = async () => {
    if (+perHourCost > 100)
      return showErrorFunc("You can charge maximum of 100$", true);
    const sessionId = uuid();
    localStorage.setItem(
      sessionId,
      JSON.stringify({
        perHourCost,
        createdAt: Date.now(),
        toAddress: myAddress,
      })
    );
    setIsSessionGettingCreated(true);
  };

  return (
    <div className="container center">
      <CheckIfWalletIsConnected
        setConnectionStatus={setConnectionStatus}
        setMyAddress={setMyAddress}
        myAddress={myAddress}
        connectionStatus={connectionStatus}
        setCurrentAccount={setCurrentAccount}
        setDaiBalance={setDaiBalance}
      />
      <br />
      <div>
        {connectionStatus ? (
          <div>
            <span>
              <b> Your DAI balance</b> : {daiBalance.toFixed(2)} USD
            </span>
            <br />
            <br />
            <br />
            <br />
            <br />

            <label>
              How much do you wish to get paid for 1 hour of your time in USD?
            </label>
            <br />
            <br />
            <input
              type="number"
              placeholder="amount in USD"
              onChange={(e) => setPerHourCost(e.target.value)}
            />
            <br />
            <br />
            <button
              onClick={createSession}
              disabled={isSessionGettingCreated ? true : false}
            >
              {isSessionGettingCreated
                ? "Creating meeting..."
                : "Create an instant meeting"}
            </button>
          </div>
        ) : null}
      </div>
      <Error showError={showError} errorMessage={errorMessage} />{" "}
    </div>
  );
}
