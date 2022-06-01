require("dotenv").config();

import { ethers } from "ethers";
const fs = require("fs");
const { parse } = require('csv-parse/sync');

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL!);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const abi = [
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
];

const ownerAddress = "0xf967aEFFCD0162fD605ee30286A1a7D2dCA84A8c";

const main = async () => {
  const file = "./input.csv";
  let data = fs.readFileSync(file);
  const csvRows = parse(data);

  for (const csvRow of csvRows) {
    const contractAddress = csvRow[0];
    const tokenId = csvRow[1];
    const receiverAddress = csvRow[2];
    const memo = csvRow[3] || "";

    if (!contractAddress || !tokenId || !receiverAddress) {
      continue;
    }
    console.log({ contractAddress, tokenId, receiverAddress, memo });

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const tx = await contract.safeTransferFrom(ownerAddress, receiverAddress, tokenId, { gasPrice: ethers.utils.parseUnits('50', 'gwei') });
    console.log({ txHash: tx.hash });
    const receipt = await tx.wait();
    console.log({ receipt });
  }
};

main().then((res) => console);
