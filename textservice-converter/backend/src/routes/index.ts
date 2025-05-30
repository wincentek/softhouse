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

// GET /api/v1/proxy - Proxy external URLs to avoid CORS
router.get('/proxy', async (req: Request, res: Response) => {
  try {
    const url = req.query.url as string;
    
    if (!url) {
      return res.status(400).send('URL parameter is required');
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).send('Invalid URL format');
    }

    // Fetch the external URL
    const response = await fetch(url);
    
    if (!response.ok) {
      return res.status(response.status).send(`External server error: ${response.statusText}`);
    }

    const data = await response.text();
    
    // Return as plain text with CORS headers
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(data);
    
  } catch (error) {
    console.error('Error proxying URL:', error);
    res.status(500).send('Failed to fetch external URL');
  }
});

// GET /api/v1/healthcheck - Simple health check endpoint
router.get('/healthcheck', async (req: Request, res: Response) => {
  return res.status(200).send('Hello Softhouse. Allt bra eller? Här är det finfint :)');
});

export default router;