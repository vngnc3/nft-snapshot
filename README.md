# 📸 NFT Collection Snapshot
## ⚡ Snapshot an entire NFT collection owners. 

---   

📤 Exports as CSV file with column labels.

🔰 &nbsp;Use at your own risk, always verify, do your own research.  

🔼 Get your Alchemy API key on https://www.alchemy.com/  

&nbsp;

## Requirements  

---

- Node.js
- Alchemy API key  

*This tool was created with Node 18.1.0, and have not been tested with other versions of Node.* 

&nbsp;

## Usage  

---

- Clone or download this repo to your local machine. 
- Install dependencies with `npm install`
- Make a new `.env` file in the directory with your Alchemy API key like so:
> `ALCHEMY_KEY="<YOUR-ALCHEMY-KEY-GOES-HERE>"`  

- Configure the snapshot in `config.json`: 
> - `address` target contract/collection address to be snapshotted,  
> - `block` target block to snapshot from (leave empty to the get latest block),  
> - `withBalances` set to true to snapshot owner and their balances,  
> - `tokenid` filter the tokenid to be snapshotted (for semi-fungible token standard). Leave it empty to omit filter.  
> - `targetNetwork` the network you want, i.e. for ethereum mainnet put "ETH_MAINNET", for optimism mainnet put "OPT_MAINNET".  

- Run `node index` to snapshot.  

&nbsp;

## Maintenance  

---

Hit me up on Twitter [@vngnc](https://twitter.com/vngnc) for anything you have in mind about this code (or everything else). 🖤