import { Network, Alchemy } from 'alchemy-sdk';
import colors from 'colors/safe.js';
import * as dotenv from 'dotenv';
import { oraPromise } from 'ora';
import fetch from 'node-fetch';
import fs from 'fs';
dotenv.config();

// Configure snapshot in config.json
const snapshotConfig = JSON.parse(fs.readFileSync('config.json'));

// Configure Alchemy key and chain.
const settings = {
    apiKey: process.env.ALCHEMY_KEY,
    network: Network.ETH_MAINNET,
};

const address = snapshotConfig.address;
const height = snapshotConfig.block; 
const withBalances = snapshotConfig.withBalances;
const idFilter = snapshotConfig.tokenid;

const alchemy = new Alchemy(settings);

makeSpace(2);
const currentBlock = await oraPromise(alchemy.core.getBlockNumber(), {text: 'Getting block data...', successText: ' Block data OK!', failText: ':('});

let status = {        
    text: `Fetching data for contract ${address}...`, 
    successText: ` Contract found!`, 
    failText: 'Contract not found :('
    };

let collectionName = '';
let supply = 0;

let metadata = await oraPromise(alchemy.nft.getContractMetadata(address), status);

if (metadata.tokenType == 'ERC721') { // if contract tokenType is ERC721
    status = {
        text: `Fetching data for collection ${collectionName}...`, 
        successText: ' OK.', 
        failText: ':('
    }
    collectionName = metadata.name;
    supply = metadata.totalSupply;
    console.log(`📈 Total supply of ${colors.cyan.underline(collectionName)} is ${colors.white(supply)} units.`);
    
} else { // if contract tokenType is ERC1155
    status = {
        text: `Fetching data for contract ${address}...`, 
        successText: ' OK.', 
        failText: ':('
    }
    collectionName = address;
    supply = null;
    console.log(`📈 Token standard is ERC1155, skipping supply count.`)

}

let output = `(owners of ${address} at ${ ((height > 0) ? (height) : (currentBlock)) })`;

function write(data) {
    // Saves the output as csv file.
    let path = `snapshot_${address.slice(0, 8)}_at_${((height > 0) ? (height) : (currentBlock))}.csv`;
    fs.writeFileSync(path, data);
    console.log(`🌈 Snapshot completed. Data saved as ${path} 🌈`);
    return;
};

function store(item) {
    // Stores to output variable. 
    let itemstr = `\n${item}`;
    output += itemstr;
};

function makeSpace(n) {
    for (let i=0; i<n; i++) {
        console.log('');
    };
};


async function getOwners() {
    // Get owners for collection, then store to be saved as csv.

    let status = {
        text: `Finding owners of ${collectionName}...`, 
        successText: ' Owners found.', 
        failText: `:(`
    };

    let result = [];
    let options = { method: 'GET', headers: {Accept: 'application/json'} };
    await oraPromise(
            fetch(`https://eth-mainnet.g.alchemy.com/nft/v2/${settings.apiKey}/getOwnersForCollection?contractAddress=${address}&withTokenBalances=false&block=${height}`, options)
            .then(response => response.json())
            .then(response => result = response.ownerAddresses)
            .catch(err => console.error(colors.red(err))),
        status);

    
    console.log(`🔹 ${colors.white(result.length, 'wallets')} own at least one ${colors.cyan.underline((metadata.tokenType == 'ERC721') ? collectionName : address)} at block ${ colors.green((height > 0) ? (height) : ('latest')) }.`);
    result.forEach(store);

    write(output);
};

async function getOwnersWithBalance() {
    // Get owners for collection with id and balance of each id, then store to be saved as csv.

    let status = {
        text: `Finding owners of ${collectionName}...`, 
        successText: ' Owners found.', 
        failText: `:(`
    };

    let result = [];
    let options = { method: 'GET', headers: {Accept: 'application/json'} };
    await oraPromise(
            fetch(`https://eth-mainnet.g.alchemy.com/nft/v2/${settings.apiKey}/getOwnersForCollection?contractAddress=${address}&withTokenBalances=true&block=${height}`, options)
            .then(response => response.json())
            .then(response => result = response.ownerAddresses)
            .catch(err => console.error(colors.red(err))),
        status);
    
    let processed = []; // An array of address, id, and balance as string.
    result.forEach(process); // Process every owner and every nft from the response.
    
    console.log(`🔹 ${colors.white(result.length, 'wallets')} own ${colors.cyan.underline(address)} token at block ${ colors.green((height > 0) ? (height) : ('latest')) }.`);

    processed.forEach(store);
    write(output);
    
    function process(item) {
        // Process each id and its balance to be a string, append ownerAddress in front.
        let owner = item.ownerAddress;
        let balanceArray = [];
        item.tokenBalances.forEach(processBalance); 
        balanceArray.forEach(appendOwner);

        function processBalance(item) {
            let result = '';
            let id = Number(item.tokenId);
            let balance = String(item.balance);
            result = `${id},${balance}`;
            
            // if idFilter is ommitted, push it regardless
            // if idFilter is defined, push only if it matches the id.
            if (idFilter == "") { 
                balanceArray.push(result)
            } else if (id == idFilter) {
                balanceArray.push(result)
            };
        };

        function appendOwner(item) {
            let result = `${owner},${item}`;
            processed.push(result);
        };
    };
    
};

async function snapshot() {
    // Trigger different functions depending on withBalance state.

    if (withBalances == false) {
        await getOwners();
    } else {
        await getOwnersWithBalance();
    }

    makeSpace(2);
};

makeSpace(1);
snapshot();