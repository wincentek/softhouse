import { Router, Request, Response } from 'express';
import { getAllTextServiceData } from '../database';
import { ApiResponse, TextServiceResponse } from '../types';

const router = Router();

// GET /api/textservice - Returns all TextService data concatenated
router.get('/textservice', async (req: Request, res: Response) => {
  try {
    const textDataArray = await getAllTextServiceData();
    const concatenatedData = textDataArray.join('\n');
    
    const response: ApiResponse<TextServiceResponse> = {
      success: true,
      data: {
        textData: concatenatedData
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching TextService data:', error);
    
    const response: ApiResponse<TextServiceResponse> = {
      success: false,
      error: 'Failed to fetch TextService data'
    };
    
    res.status(500).json(response);
  }
});

export default router;