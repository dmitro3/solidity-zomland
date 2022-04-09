import React from "react";
import { CardBack } from "../../assets/styles/card";
import near_logo from "../../assets/images/near-logo.png";
import land_back from "../../assets/images/land_back.png";
import { formatId } from "../../near/utils";
import { Button } from "../basic/Button";
import { ShoppingCartIcon } from "@heroicons/react/outline";

export const BackCard = ({
  nft,
  size,
  sellItems,
  setSellItems,
  handleBuy,
  setSellPopupVisible,
  setTransferPopupVisible,
}) => {
  const sizeMapping = {
    xsm: "h-24",
    sm: "h-40",
    md: "h-80",
  };

  const BackImage = () => (
    <img
      className={`absolute ${sizeMapping[size || "md"]}`}
      src={land_back}
      alt={nft.token_id ? formatId(nft.token_id) : ""}
    />
  );

  const SellPriceSection = () => (
    <>
      {nft.sale_price && (
        <div className="flex text-4xl items-center font-semibold mb-5 mt-2">
          <img className="h-8 mr-2" src={near_logo} alt="near logo" />
          {nft.sale_price}
        </div>
      )}
    </>
  );

  const InfoSection = () => (
    <>
      <div className="font-semibold text-purple-600">
        {nft.card_rarity || nft.land_type}
      </div>
      <div className="text-4xl font-semibold text-purple-600">
        #{nft.token_id ? formatId(nft.token_id) : ""}
      </div>
    </>
  );

  const AdditionalInfoSection = () => (
    <>
      {nft.health && nft.attack && nft.brain && (
        <div className="mt-6">
          <p>Health: {nft.health}</p>
          <p>Attack: {nft.attack}</p>
          <p>Intellect: {nft.brain}</p>
        </div>
      )}
    </>
  );

  const CardActions = () => (
    <>
      {sellItems && setSellItems && (
        <div className="mt-5 flex flex-col h-24 justify-between">
          <Button
            onClick={() => setTransferPopupVisible(true)}
            dark
            title="Transfer"
          />
          <Button
            onClick={() => setSellPopupVisible(true)}
            icon={<ShoppingCartIcon className="h-5 ml-1" />}
            title="Sell"
          />
        </div>
      )}

      {handleBuy && (
        <div className="mt-5">
          <Button
            onClick={handleBuy}
            icon={<ShoppingCartIcon className="h-5 ml-1" />}
            title="Buy"
          />
        </div>
      )}
    </>
  );

  return (
    <CardBack type={nft.land_type ?? nft.card_rarity} className="relative">
      <BackImage />
      <div className="absolute flex flex-col h-full w-full justify-center items-center">
        <SellPriceSection />
        <InfoSection />
        <AdditionalInfoSection />
        <CardActions />
      </div>
    </CardBack>
  );
};
