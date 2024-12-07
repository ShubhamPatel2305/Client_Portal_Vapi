import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import { VAPISettings } from '../lib/vapiService';

const router = express.Router();
let io: Server;

// Store VAPI settings in memory (replace with database in production)
let vapiSettings: VAPISettings = {
  systemPrompt: 'You are a helpful AI assistant.',
  voiceModel: 'nova',
  temperature: 0.7,
  maxTokens: 150,
  apiKey: '',
};

// Initialize Socket.IO instance
export const initializeSocketIO = (socketIO: Server) => {
  io = socketIO;
};

// Get VAPI settings
router.get('/settings', (_req: Request, res: Response) => {
  try {
    res.json(vapiSettings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch VAPI settings' });
  }
});

// Update VAPI settings
router.put('/settings', (req: Request, res: Response) => {
  try {
    const newSettings: VAPISettings = req.body;
    vapiSettings = { ...vapiSettings, ...newSettings };
    
    // Emit settings update to all connected clients
    if (io) {
      io.emit('vapiSettingsUpdated', vapiSettings);
    }
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update VAPI settings' });
  }
});

export default router;
