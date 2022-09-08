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

const alchemy = new Alchemy(settings);
let contractName = '';

makeSpace(2);

const currentBlock = await oraPromise(alchemy.core.getBlockNumber(), {text: 'Getting block data...', successText: ' Block data OK!', failText: ':('});
let output = `(owners of ${address} at ${ ((height > 0) ? (height) : (currentBlock)) })`;

async function name() {
    let status = {
        text: 'Querying the blockchain...', 
        successText: ' Contract found!', 
        failText: ':('
    };
    
    let metadata = await oraPromise(alchemy.nft.getContractMetadata(address), status);
    console.log(`🌐 Reading contract ${colors.cyan.underline(metadata.name)}...`);
    contractName = metadata.name;
    makeSpace(1);
};

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
    // @WARN: Alchemy getOwnersForCollection incorrectly stores the token balance. Avoid using withTokenBalances option for now.
    // Get owner for collection, then store to be saved as csv.

    let status = {
        text: `Finding owners of ${contractName}...`, 
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

    
    console.log(`🔹 ${colors.white(result.length, 'wallets')} own at least one ${colors.cyan.underline(contractName)} at block ${ colors.green((height > 0) ? (height) : ('latest')) }.`);
    result.forEach(store);

    write(output);
};

async function snapshot() {
    // Get contract metadata, and then snapshot the owners.

    let status = {
        text: `Counting total supply of ${contractName}...`, 
        successText: ' Done counting.', 
        failText: ':('
    };

    let metadata = await oraPromise(alchemy.nft.getContractMetadata(address), status);
    let supply = metadata.totalSupply;
    console.log(`📈 Total supply is ${colors.white(supply)} units.`);
    makeSpace(1);

    await getOwners();
    makeSpace(2);
};

makeSpace(1);

await name();
snapshot();