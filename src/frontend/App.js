import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Market,
  Monsters,
  Faq,
  Landing,
  Lands,
  Zombies,
  Terms,
  Privacy,
  Token,
  Collections,
  OneCollection,
} from "./pages";
import { Sidebar } from "./components/sidebar/Sidebar";
import {
  web3Handler,
  appendTransactionList,
  appendTransactionError,
  hideTransaction,
  updateUserBalance, isMetamaskInstalled,
} from "./web3/api";
import { TransactionList } from "./components/TransactionList";

export default function App() {
  const [currentUser, setCurrentUser] = React.useState({});
  const [ftContract, setFtContract] = React.useState(false);
  const [landContract, setLandContract] = React.useState(false);
  const [zombieContract, setZombieContract] = React.useState(false);
  const [monsterContract, setMonsterContract] = React.useState(false);
  const [collectionContract, setCollectionContract] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [transactionList, setTransactionList] = React.useState([]);
  const [sellList, setSellList] = React.useState({
    lands: [],
    zombies: [],
    monsters: [],
  });
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  window.web3Login = () => {
    web3Handler()
      .then(
        async ({
          account,
          signer,
          landContract,
          zombieContract,
          monsterContract,
          tokenContract,
          collectionContract,
        }) => {
          setLandContract(landContract);
          setZombieContract(zombieContract);
          setMonsterContract(monsterContract);
          setFtContract(tokenContract);
          setCollectionContract(collectionContract);

          await updateUserBalance(tokenContract, setCurrentUser, account);

          window.ethereum.on("chainChanged", (chainId) => {
            console.log("chainChanged", chainId);
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", async function (accounts) {
            console.log("accountsChanged", accounts);
            const balance = await tokenContract.balanceOf(account);
            setCurrentUser({
              accountId: accounts[0],
              tokenBalance: balance,
            });
          });

          setIsReady(true);
        }
      )
      .catch(() => {
        if (!isMetamaskInstalled()) {
          appendTransactionError(transactionList, setTransactionList, "Please install Metamask.");
        }

        let allowPathList = [
          "/",
          "/terms-conditions",
          "/privacy-policy",
          "/faq",
        ];
        if (allowPathList.indexOf(window.location.pathname) === -1) {
          window.location.href = "/";
        } else {
          setIsReady(true);
        }
      });
  };

  React.useEffect(() => {
    window.web3Login();
  }, []);

  React.useEffect(() => {
    setSidebarIsOpen(true);
  }, [sellList]);

  return (
    <BrowserRouter>

      <Routes>
        <Route
          exact
          path="/"
          element={
            <Landing currentUser={currentUser}/>
          }
        />

        {isReady && (
          <>
            <Route
              exact
              path="/lands"
              element={
                <Lands
                  currentUser={currentUser}
                  landContract={landContract}
                  sellList={sellList}
                  setSellList={setSellList}
                  appendTransactionList={(tx) =>
                    appendTransactionList(
                      transactionList,
                      setTransactionList,
                      tx
                    )
                  }
                  appendTransactionError={(tx) =>
                    appendTransactionError(
                      transactionList,
                      setTransactionList,
                      tx
                    )
                  }
                />
              }
            />
            <Route
              exact
              path="/zombies"
              element={
                <Zombies
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  zombieContract={zombieContract}
                  landContract={landContract}
                  tokenContract={ftContract}
                  sellList={sellList}
                  setSellList={setSellList}
                  appendTransactionList={(tx) =>
                    appendTransactionList(
                      transactionList,
                      setTransactionList,
                      tx
                    )
                  }
                  appendTransactionError={(tx) =>
                    appendTransactionError(
                      transactionList,
                      setTransactionList,
                      tx
                    )
                  }
                />
              }
            />
            <Route
              exact
              path="/collections"
              element={
                <Collections
                  currentUser={currentUser}
                  collectionContract={collectionContract}
                />
              }
            />
            <Route
              exact
              path="/collections/:collection_id"
              element={
                <OneCollection
                  currentUser={currentUser}
                  collectionContract={collectionContract}
                  zombieContract={zombieContract}
                />
              }
            />
            <Route
              exact
              path="/monsters"
              element={
                <Monsters
                  currentUser={currentUser}
                  monsterContract={monsterContract}
                  sellList={sellList}
                  setSellList={setSellList}
                />
              }
            />
            <Route
              exact
              path="/market"
              element={<Market currentUser={currentUser}/>}
            />
            <Route
              exact
              path="/token"
              element={
                <Token
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  ftContract={ftContract}
                  appendTransactionList={(tx) =>
                    appendTransactionList(
                      transactionList,
                      setTransactionList,
                      tx
                    )
                  }
                  appendTransactionError={(tx) =>
                    appendTransactionError(
                      transactionList,
                      setTransactionList,
                      tx
                    )
                  }
                />
              }
            />
          </>
        )}

        <Route
          exact
          path="/faq"
          element={<Faq currentUser={currentUser}/>}
        />
        <Route
          exact
          path="/terms-conditions"
          element={<Terms currentUser={currentUser}/>}
        />
        <Route
          exact
          path="/privacy-policy"
          element={<Privacy currentUser={currentUser}/>}
        />
      </Routes>

      <Sidebar
        currentUser={currentUser}
        sellList={sellList}
        setSellList={setSellList}
        isOpen={sidebarIsOpen}
        setIsOpen={setSidebarIsOpen}
      />
      <TransactionList
        txList={transactionList}
        hideTransaction={(index) =>
          hideTransaction(transactionList, setTransactionList, index)
        }
      />
    </BrowserRouter>
  );
}
