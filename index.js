import { ethers } from 'ethers';
import * as dotenv from 'dotenv'
dotenv.config();

const key = process.env.ALCHEMY_KEY
const provider = new AlchemyProvider("homestead", key);