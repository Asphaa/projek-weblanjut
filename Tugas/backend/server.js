const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

let userIdCounter = 1; // Letakkan di bagian atas file

// Di bagian createUser, tambahkan prefix unik
const createUser = (prefix) => {
  const id = prefix * 100 + userIdCounter++;
  return {
    id,
    name: `User-${id}`,
    age: Math.floor(Math.random() * 50) + 18,
    email: `user${id}@example.com`
  };
};

// Paginated API (10 user/halaman)
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const users = Array.from({ length: 10 }, (_, i) => createUser(page)); // Prefix dengan nomor halaman
  res.json(users);
});

// Streaming API (15 user total)
app.get('/api/users-stream', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  Array.from({ length: 15 }, (_, i) => {
    const user = createUser(0); // Prefix 0 untuk streaming
    res.write(JSON.stringify(user) + '\n');
  });
  res.end();
});

// Streaming API
app.get('/api/users-stream', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  let count = 0;
  const streamInterval = setInterval(() => {
    if (count >= 50) {
      clearInterval(streamInterval);
      res.end();
      return;
    }
    
    try {
      const user = createUser();
      res.write(JSON.stringify(user) + '\n');
      count++;
    } catch (error) {
      clearInterval(streamInterval);
      res.status(500).end();
    }
  }, 100);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});