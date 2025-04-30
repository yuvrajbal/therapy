// server.ts
import express from 'express';
import { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from "body-parser";
import { webhookHandler } from './handlers/webhook';
import { getUserDataHandler } from './handlers/userApi';
// Initialize express app
const app = express();
const host = "localhost";
const port = 8080;
// Middleware
app.use(helmet()); // Security middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());



// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use("/webhook", webhookHandler);
app.get("/api/user/:userID", getUserDataHandler);
// startServer();
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

export default app;