# 📸 ERC721/ERC1155 Snapshot Tool
### ⚡ Snapshot an entire NFT collection owners (even in past blocks). 

---   

📤 Exports as CSV file with labels.

🔰 &nbsp;Use at your own risk, always verify, do your own research.  

🔼 Get your Alchemy API key on https://www.alchemy.com/  

---  

## Requirements  

- Node.js
- Alchemy API key  

*This tool was created with Node 18.1.0, and have not been tested with other versions of Node.* 


---  

## Usage  

- Clone or download this repo to your local machine. 
- Download dependencies with `npm install`
- Make a new `.env` file in the directory with your Alchemy API key like so:
> `ALCHEMY_KEY="<YOUR-ALCHEMY-KEY-GOES-HERE>"`  
- Configure the snapshot in `index.js` file. 
> - Set the **file output** name, 
> - **Ethereum Smart Contract address** to snapshot from,
> - and the **NFT token id** to snapshot from.  
- Run `node index` and let the tool do its thing.  

--- 

## Maintenance

Hit me up on Twitter [@vngnc](https://twitter.com/vngnc) for anything you have in mind about this code (or everything else). 🖤