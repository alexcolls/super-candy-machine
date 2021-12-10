/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useEffect, useState } from "react";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import useCandyMachine from "../hooks/useCandyMachine";
import useWalletBalance from "../hooks/useWalletBalance";
import { useWallet } from "@solana/wallet-adapter-react";

import { Toaster } from "react-hot-toast";
import Countdown from "react-countdown";
import useWalletNfts from "../hooks/useWalletNFTs";
import AnNFT from "../components/AnNFT/AnNFT";

import Gif from "../images/queensGF.gif";

export default function Home() {
  const [balance] = useWalletBalance();
  const {
    isSoldOut,
    mintStartDate,
    isMinting,
    startMint,
    startMintMultiple,
    nftsData,
  } = useCandyMachine();

  const [isLoading, nfts] = useWalletNfts();

  const { connected } = useWallet();

  const [isMintLive, setIsMintLive] = useState(false);

  useEffect(() => {
    if (new Date(mintStartDate).getTime() < Date.now()) {
      setIsMintLive(true);
    }
  }, []);

  const MintMany = () => {
    const [mintCount, setMintCount] = useState(5);

    return (
      <>
        <button
          onClick={() => startMintMultiple(mintCount)}
          disabled={isMinting}
          className="px-4 py-2 mx-auto font-bold text-white transition-opacity rounded-lg hover:opacity-70 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600"
        >
          {isMinting ? "loading" : `mint ${mintCount}`}
        </button>

        <input
          disabled={isMinting}
          type="number"
          min={2}
          max={10}
          className="px-2 mx-auto mt-5 font-bold text-white bg-gray-500"
          value={mintCount}
          onChange={(e) => setMintCount((e.target as any).value)}
        />
        <p className="mx-auto mt-2">min 2; max 10;</p>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>BubbleGirlsNFT Candy-Machine</title>
        <meta
          name="description"
          content="Simplified NextJs with typescript example app integrated with Metaplex's Candy Machine"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center min-h-screen mx-6">
        <Toaster />
        <div className="flex items-center justify-between w-full mt-3">
          <h1 className="text-2xl font-bold" style={{color: "#C813E8"}}>BubbleGirlsNFT Candy-Machine</h1>
          <div className="flex items-center">
            {connected && (
              <div className="flex items-end mr-2">
                <p className="text-xs text-gray-400">balance</p>
                <p className="mx-1 font-bold leading-none">
                  {balance.toFixed(2)}
                </p>
                <p
                  className="font-bold leading-none text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, #15E5CC, #15E5CC, #C813E8)`,
                  }}
                >
                  SOL
                </p>
              </div>
            )}
            <WalletMultiButton />
          </div>
        </div>
        {connected && (
          <p className="mr-auto text-sm">
            <span >YOU ARE READY TO MINT!</span>
          </p>
        )}
        <div className="flex items-start justify-center w-11/12 my-10">
          {connected ? (
            <>
              {new Date(mintStartDate).getTime() < Date.now() ? (
                <>
                  {isSoldOut ? (
                    <p style={{fontSize: '66px'}}>SOLD OUT!</p>
                  ) : (
                    <>
                      <div className="flex flex-col w-1/6" style={{color: '#C813E8'}}>
                        <h1 className="mb-10 text-2xl text-center">MINT ONE</h1>
                        <button 
                          onClick={startMint}
                          disabled={isMinting}
                          className="px-4 py-2 mx-auto font-bold text-white transition-opacity rounded-lg hover:opacity-70 bg-gradient-to-br from-green-300 via-blue-500 to-purple-600"
                        >
                          {isMinting ? "loading" : "mint 1"}
                        </button>
                      </div>
                      <div className="flex flex-col w-1/3" style={{color: '#15E5CC'}}>
                        <h1 className="mb-10 text-2xl text-center">MINT MANY</h1>
                        <MintMany />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Countdown 
                  date={mintStartDate}
                  onMount={({ completed }) => completed && setIsMintLive(true)}
                  onComplete={() => setIsMintLive(true)}
                  className='count-down'
                />
              )}
            </>
          ) : (
            <div><h2 style={{fontSize: "27px", textAlign: "center", paddingBottom: "22px"}}>CONNECT YOUR WALLET TO MINT</h2><img src="queensGF.png"  width="500px" style={{borderRadius: "7%"}}/></div>
          )}
        </div>
        <div className="flex flex-col w-full">
          <h2 className="text-2xl font-bold">My NFTs</h2>
          <div className="flex mt-3 gap-x-2 img">
            {(nfts as any).map((nft: any, i: number) => {
              return <AnNFT key={i} nft={nft} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}