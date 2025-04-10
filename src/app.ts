import Hapi  from '@hapi/hapi'
import mongoose from 'mongoose'
import connectDB from './config/db'
import { userRoutes } from './routes/user'
const init=async()=>{
    const server=Hapi.server({
        port:3000,
        host:'localhost'
    })

    server.route({
        method: 'GET',
        path:'/',
        handler: (request, h) => {
          return 'Hello World!';
        }
    });
    await connectDB()
    server.route(userRoutes)
    await server.start()
    console.log('server running on port number 3000 ', server.info.uri)
}

init()