// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import { mockConnections } from '../../lib/mockData';

// Initialize database connection
async function openDb() {
  const dbPath = path.resolve(process.cwd(), '../../data.sql');
  
  // Check if the database file exists
  if (!fs.existsSync(dbPath)) {
    throw new Error('Database file not found');
  }
  
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const db = await openDb();
    
    // Get all connections from the database
    const connections = await db.all('SELECT * FROM Connections');
    
    res.status(200).json(connections);
  } catch (error) {
    console.error('Database error:', error);
    console.log('Falling back to mock data');
    
    // Return mock data as fallback
    res.status(200).json(mockConnections);
  }
} 