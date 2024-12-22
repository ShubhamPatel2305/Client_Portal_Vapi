import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email, subject, message } = req.body;

      // Validate the input
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const client = await clientPromise;
      const db = client.db('contact_form');
      
      // Insert the submission
      const result = await db.collection('submissions').insertOne({
        name,
        email,
        subject,
        message,
        timestamp: new Date()
      });

      return res.status(200).json({ 
        message: 'Submission saved successfully',
        id: result.insertedId 
      });
    } catch (error) {
      console.error('Error saving submission:', error);
      return res.status(500).json({ error: 'Failed to save submission' });
    }
  } else if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('contact_form');
      
      // Get all submissions, sorted by timestamp
      const submissions = await db.collection('submissions')
        .find({})
        .sort({ timestamp: -1 })
        .toArray();

      return res.status(200).json(submissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return res.status(500).json({ error: 'Failed to fetch submissions' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
