// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import { getMockSubgraph } from '../../../lib/mockData';

// Initialize database connection
async function openDb() {
  const dbPath = path.resolve(process.cwd(), '../../../data.sql');
  
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
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ message: 'Block ID is required' });
    }
    
    const db = await openDb();
    
    // Check if the block has a subgraph
    const subgraphInfo = await db.get(
      'SELECT * FROM Subgraphs WHERE parent_block_id = ?',
      [id]
    );
    
    if (!subgraphInfo) {
      // Check if we have a mock subgraph for this block
      const mockSubgraph = getMockSubgraph(id);
      if (mockSubgraph) {
        return res.status(200).json(mockSubgraph);
      }
      
      return res.status(404).json({ message: 'No subgraph found for this block' });
    }
    
    // Get all blocks from the subgraph
    const blocks = await db.all(
      `SELECT b.* 
       FROM Blocks b
       JOIN Connections c ON b.id = c.from_id OR b.id = c.to_id
       WHERE c.from_id IN (
         WITH RECURSIVE subgraph_blocks(id) AS (
           SELECT ?
           UNION
           SELECT c.to_id FROM Connections c, subgraph_blocks sb
           WHERE c.from_id = sb.id
         )
         SELECT id FROM subgraph_blocks
       )
       OR c.to_id IN (
         WITH RECURSIVE subgraph_blocks(id) AS (
           SELECT ?
           UNION
           SELECT c.to_id FROM Connections c, subgraph_blocks sb
           WHERE c.from_id = sb.id
         )
         SELECT id FROM subgraph_blocks
       )
       GROUP BY b.id`,
      [subgraphInfo.start_block_id, subgraphInfo.start_block_id]
    );
    
    // Get all connections within the subgraph
    const connections = await db.all(
      `SELECT * FROM Connections
       WHERE from_id IN (SELECT id FROM Blocks WHERE id IN (${blocks.map(() => '?').join(', ')}))
       AND to_id IN (SELECT id FROM Blocks WHERE id IN (${blocks.map(() => '?').join(', ')}))`,
      [...blocks.map(b => b.id), ...blocks.map(b => b.id)]
    );
    
    res.status(200).json({
      parent_block_id: id,
      start_block_id: subgraphInfo.start_block_id,
      end_block_id: subgraphInfo.end_block_id,
      blocks,
      connections
    });
  } catch (error) {
    console.error('Database error:', error);
    console.log('Checking for mock subgraph data');
    
    const { id } = req.query;
    
    // Return mock subgraph as fallback
    const mockSubgraph = getMockSubgraph(id);
    if (mockSubgraph) {
      return res.status(200).json(mockSubgraph);
    }
    
    res.status(404).json({ message: 'No subgraph found for this block' });
  }
} 