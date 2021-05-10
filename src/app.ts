import express from 'express'
import cors from 'cors'

import { appRoutes } from './routes'

const app = express()

app.use(cors())
// app.use('/static', express.static(__dirname + '/../images'))
app.use(appRoutes)

export { app }
