// File: api/history.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Return empty array dulu (nanti bisa connect ke MongoDB)
  return res.status(200).json({ 
    success: true, 
    count: 0, 
    data: [] 
  });
}