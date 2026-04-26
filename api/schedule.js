/**
 * Schedule API
 */
import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  const filePath = join(process.cwd(), 'api/program.json');
  const data = JSON.parse(readFileSync(filePath, 'utf8'));
  
  // Extract the schedule array from the object
  const schedule = data['program'] || [];
  
  res.status(200).json(schedule);
}
