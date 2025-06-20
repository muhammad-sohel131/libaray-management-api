import dotenv from 'dotenv'
dotenv.config()

import { Server } from 'http'
import app from './app';
import mongoose from 'mongoose';

const uri = process.env.URI;
let server: Server;
const PORT = 5000

async function main() {
    try {
        await mongoose.connect(uri)
        server = app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`)
        })
    }catch(err){
        console.log(err)
    }
}

main()