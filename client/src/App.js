import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Caller from "./pages/Caller";
import Receiver from "./pages/Receiver";
import { Toast } from "./components/index";
import { useStore } from "./global_stores";

function App() {
  const showToast = useStore((state) => state.showToast);
  const toastMessage = useStore((state) => state.toastMessage);
  // const TestSigner = async () => {
  //   try {
  //     const { ethereum } = window;

  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       console.log({ contractAddress, contractABI, signer });
  //       const streamContract = new ethers.Contract(
  //         contractAddress,
  //         contractABI,
  //         signer
  //       );

  //       /*
  //        * Execute the actual wave from your smart contract
  //        */
  //       const address = await signer.getAddress();
  //       console.log({ address, streamContract });
  //       const Balance = await streamContract.balances(address);
  //       console.log({
  //         Balance: +Balance.toString(),
  //         Dai: +Balance.toString() / 1000000000000000000,
  //       });
  //       setTimeout(async () => {
  //         const streamCreation = await streamContract.createStreamWithReason(
  //           "0x0cC2622aF5D1b22B7f57AC8944B4cBaa0D7b59F3",
  //           100000000000000000n,
  //           "Testing"
  //         );
  //         console.log("Mining...", streamCreation.hash);
  //         await streamCreation.wait();
  //         console.log("Mined -- ", streamCreation.hash);
  //         setInterval(async () => {
  //           const Balance = await streamContract.balances(address);
  //           console.log({
  //             Balance: +Balance.toString(),
  //             Dai: +Balance.toString() / 1000000000000000000,
  //           });
  //         }, 3000);
  //       }, 30000);
  //     } else {
  //       console.log("Ethereum object doesn't exist!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="App">
      <Routes>
        <Route path="/caller/:id" element={<Caller />} />
        <Route path="/receiver/:id" element={<Receiver />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Toast showToast={showToast} toastMessage={toastMessage} />{" "}
    </div>
  );
}

export default App;
