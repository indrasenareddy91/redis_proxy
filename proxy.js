import express from 'express';
import Redis from 'ioredis';

const app = express();
const PORT = 3000;

// Create Redis client with credentials
const redis = new Redis({
  host: 'redis-10235.c273.us-east-1-2.ec2.redns.redis-cloud.com',
  port: 10235,
  password: 'tTPRnmAItp6h51LZwAfGpQEl3IzrKKjc',
});

// Handle Redis errors
redis.on('error', (err) => console.error('Redis error:', err));
redis.on('connect', () => console.log('Connected to Redis'));

// Endpoint to fetch latest records
app.get('/latest', async (req, res) => {
  try {
    const results = await redis.zrevrange('recent_downloads', 0, 4);

    console.log('Latest record:', results);
    if (results.length > 0) {
      res.json({ results });
    } else {
      res.status(404).json({ message: 'No records found' });
    }
  } catch (err) {
    console.error('Error fetching from Redis:', err);
    res.status(500).json({ error: 'Error fetching from Redis' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
