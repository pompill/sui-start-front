import { useState, ChangeEvent } from "react";
import { ConnectButton } from "@mysten/dapp-kit";
import { POLYGON_TOKENS, POLYGON_TOKENS_BY_SYMBOL } from "./lib/constants";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useConnect,
} from "wagmi";
import "./App.css";

function Account() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! });

  return (
    <div>
      {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
      {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
      <button onClick={() => disconnect()}>Disconnect</button>
    </div>
  );
}

function WalletOptions() {
  const { connectors, connect } = useConnect();

  return (
    <>
      {connectors.map((connector) => (
        <button key={connector.uid} onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      ))}
    </>
  );
}

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

function App() {
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [buyToken, setBuyToken] = useState("dai");
  const [sellToken, setSellToken] = useState("wmatic");
  const [tradeDirection, setTradeDirection] = useState("sell");

  const handleSellTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSellToken(e.target.value);
  };
  function handleBuyTokenChange(e: ChangeEvent<HTMLSelectElement>) {
    setBuyToken(e.target.value);
  }
  return (
    <form>
      <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-md mb-3">
        <p>
          <span>sui:&nbsp;</span>
          <ConnectButton />
        </p>
        <section className="mt-4 flex items-start justify-center">
          <label htmlFor="sell-select" className="sr-only"></label>
          <img
            alt={sellToken}
            className="h-9 w-9 mr-2 rounded-md"
            src={POLYGON_TOKENS_BY_SYMBOL[sellToken].logoURI}
          />
          <div className="h-14 sm:w-full sm:mr-2">
            <select
              value={sellToken}
              name="sell-token-select"
              id="sell-token-select"
              className="mr-2 w-50 sm:w-full h-9 rounded-md"
              onChange={handleSellTokenChange}
            >
              {/* <option value="">--Choose a token--</option> */}
              {POLYGON_TOKENS.map((token) => {
                return (
                  <option
                    key={token.address}
                    value={token.symbol.toLowerCase()}
                  >
                    {token.symbol}
                  </option>
                );
              })}
            </select>
          </div>
          <label htmlFor="sell-amount" className="sr-only"></label>
          <input
            id="sell-amount"
            value={sellAmount}
            className="h-9 rounded-md"
            style={{ border: "1px solid black" }}
            onChange={(e) => {
              setTradeDirection("sell");
              setSellAmount(e.target.value);
            }}
          />
        </section>
        <p>
          <span>eth:&nbsp;</span>
          <ConnectWallet />
        </p>
        <section className="flex mb-6 mt-4 items-start justify-center">
          <label htmlFor="buy-token" className="sr-only"></label>
          <img
            alt={buyToken}
            className="h-9 w-9 mr-2 rounded-md"
            src={POLYGON_TOKENS_BY_SYMBOL[buyToken].logoURI}
          />
          <select
            name="buy-token-select"
            id="buy-token-select"
            value={buyToken}
            className="mr-2 w-50 sm:w-full h-9 rounded-md"
            onChange={(e) => handleBuyTokenChange(e)}
          >
            {/* <option value="">--Choose a token--</option> */}
            {POLYGON_TOKENS.map((token) => {
              return (
                <option key={token.address} value={token.symbol.toLowerCase()}>
                  {token.symbol}
                </option>
              );
            })}
          </select>
          <label htmlFor="buy-amount" className="sr-only"></label>
          <input
            id="buy-amount"
            value={buyAmount}
            className="h-9 rounded-md bg-white cursor-not-allowed"
            style={{ border: "1px solid black" }}
            disabled
            onChange={(e) => {
              setTradeDirection("buy");
              setBuyAmount(e.target.value);
            }}
          />
        </section>
      </div>
    </form>
  );
}

export default App;
