import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer } from 'http';

dotenv.config();

import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import friendRoutes from './routes/friends.routes.js';
import postRoutes from './routes/posts.routes.js';
import messageRoutes from './routes/messages.routes.js';
import { initSocket } from './socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CORS setup (allow client url + localhost dev)
app.use(cors({
    origin: [
        process.env.CLIENT_URL || "http://localhost:5173"
    ],
    credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form-data support
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Basic route
app.get('/', (req, res) => res.send('API OK'));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);

// Start server
const PORT = process.env.PORT || 5000;
await connectDB(process.env.MONGODB_URI);

const httpServer = createServer(app);

// ✅ init socket.io
initSocket(httpServer);

httpServer.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
