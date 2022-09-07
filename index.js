import { BigNumber, ethers } from 'ethers';
import colors from 'colors/safe.js';
import * as dotenv from 'dotenv';
import { stdout } from 'process';
import {oraPromise} from 'ora';
import fs from 'fs';
dotenv.config();

// Configure Alchemy key and chain.
const key = process.env.ALCHEMY_KEY;
const network = 'homestead';

// Configure smart contract to interact with
const address = '0x888F98EfcFfB7822e6EEbd249262853DB960deAD';   // Using plan-z contract/
const abi = JSON.parse(fs.readFileSync('abi.json'));            // Using plan-z ABI/
const height = 14927293; // Set block height                    // Using plan-z launch block/

const provider = new ethers.providers.AlchemyProvider( network, key );
const contract = new ethers.Contract(address, abi, provider);

let contractName = '';
let output = '( address, id )';

async function name() {
    let status = {
        text: 'Querying the blockchain...', 
        successText: ' Contract found!', 
        failText: ':('
    };
    
    let name = await oraPromise(contract.name(), status);
    console.log(`🌐 Interacting with contract ${colors.cyan.underline(name)}...`);
    contractName = name;
    makeSpace(1);
};

async function ownerOf(id) {
    let status = {
        text: `Finding owner of ${contractName} #${id}...`, 
        successText: ' OK.', 
        failText: `Not OK.`
    };

    let owner = await oraPromise(contract.ownerOf( id, { blockTag: height } ), status);
    console.log(`${colors.blue(owner)} owns #${colors.green(id)}`);

    let result = `\n${owner},${id}`;
    output += result;
};

async function snapshot() {
    let status = {
        text: `Counting total supply of ${contractName} at block ${height}...`, 
        successText: ' Done counting.', 
        failText: ':('
    };

    let supply = await oraPromise(contract.totalSupply( { blockTag: height } ), status)
    let nsupply = supply.toString();
    console.log(`📈 Total supply at block ${colors.green(height)} is ${colors.white(nsupply)} units.`);
    makeSpace(1);

    await ownerOf(1);
    makeSpace(3);

};

makeSpace(2);
await name();
snapshot();




// Cosmetic functions, ignore.

function makeSpace(n) {
    for (let i=0; i<n; i++) {
        console.log('');
    };
};

