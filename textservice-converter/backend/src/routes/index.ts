import { Router, Request, Response } from 'express';
import { getAllTextServiceData } from '../database';

const router = Router();

// GET /api/v1/textservice - Returns all TextService data as plain text
router.get('/textservice', async (req: Request, res: Response) => {
  try {
    const textDataArray = await getAllTextServiceData();
    const concatenatedData = textDataArray.join('\n');
    
    // Return as plain text
    res.setHeader('Content-Type', 'text/plain');
    res.send(concatenatedData);
  } catch (error) {
    console.error('Error fetching TextService data:', error);
    res.status(500).send('Error fetching TextService data');
  }
});

// GET /api/v1/healthcheck - Simple health check endpoint
router.get('/healthcheck', async (req: Request, res: Response) => {
  return res.status(200).send('Hello Softhouse. Allt bra eller? Här är det finfint :)');
});

export default router;