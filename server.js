const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 80;
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'idkthepassword',
    database: 'event',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const promisePool = pool.promise();
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static(__dirname));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "C:/Users/Tanubhav Juneja/Desktop/College/5th sem/CSC-501/Event Sponsor Portal/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});
const upload = multer({ storage: storage });
const IMAGE_UPLOAD_DIR = path.join(__dirname,"uploads"); 
app.get("/download_image/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(IMAGE_UPLOAD_DIR, filename);
    console.log(filename,filePath);
    res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Error sending the file:", err);
      if (!res.headersSent) {
        res.status(404).send("File not found");
      }
    }
  });
});
app.post("/upload_image", upload.single("file"), (req, res) => {
    console.log("Yesss");
    const filePath = `/download_image/${req.file.filename}`;
    res.json({ file_path: filePath });
  })
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'build', 'index.html'));
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("username:", username, "password:", password);
    try {
        const [rows] = await promisePool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = generateToken();
        await promisePool.query('UPDATE users SET token = ? WHERE id = ?', [token, user.id]);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/register', async (req, res) => {
    const { name, mobile, email, username, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const [rows] = await promisePool.query(
            'INSERT INTO users (name,  mobile, email, username, password) VALUES (?, ?, ?, ?, ?)',
            [name, mobile, email, username, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully', userId: rows.insertId });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/verify-login', async (req, res) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const [rows] = await promisePool.query('SELECT * FROM users WHERE token = ?', [token]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.json({ loggedIn: true });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/logout', async (req, res) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader); 
    if (!authHeader) {
        return res.status(400).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }
    try {
        await promisePool.query('UPDATE users SET token = NULL WHERE token = ?', [token]);
        console.log('Logout successful'); 
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/user', async (req, res) => {
    const authHeader = req.headers.authorization;
    console.log("user detail request:",authHeader);
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const [rows] = await promisePool.query('SELECT * FROM users WHERE token = ?', [token]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = rows[0];
        res.json({
            id: user.id,
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            username: user.username,
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/list_events', async (req, res) => {
    const { city, footfall, eventDate, cost } = req.query;
    console.log("/list events", city, footfall, eventDate, cost);
    try {
        let query = "SELECT * FROM events WHERE 1=1";
        const values = [];
        if (city) {
            query += " AND location = ?";
            values.push(city);
        }
        if (footfall) {
            const [minFootfall, maxFootfall] = footfall.split('-');
            if (minFootfall && maxFootfall) {
                query += " AND footfall BETWEEN ? AND ?";
                values.push(minFootfall, maxFootfall);
            }
        }
        if (eventDate) {
            if (eventDate) {
                console.log(eventDate);
                query += " AND date = ?";
                values.push(eventDate);
            }
        }
        if (cost) {
            const [minCost, maxCost] = cost.split('-');
            if (minCost && maxCost) {
                query += " AND budget BETWEEN ? AND ?";
                values.push(minCost, maxCost);
            }
        }
        const [events] = await promisePool.query(query, values);
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/event/:id', async (req, res) => {
    const eventId = req.params.id;
    try {
        const [eventRows] = await promisePool.query('SELECT * FROM events WHERE id = ?', [eventId]);
        if (eventRows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const event = eventRows[0];
        const [userRows] = await promisePool.query('SELECT mobile FROM users WHERE id = ?', [event.created_by]);
        const whatsappNumber = userRows.length > 0 ? userRows[0].mobile : '';
        res.json({
            ...event,
            whatsapp_number: whatsappNumber
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Failed to fetch event details' });
    }
});
app.get('/sponsor/:id', async (req, res) => {
    const sponsorId = req.params.id;
    try {
        const [sponsorRows] = await promisePool.query('SELECT * FROM sponsors WHERE id = ?', [sponsorId]);
        if (sponsorRows.length === 0) {
            return res.status(404).json({ message: 'Sponsor not found' });
        }
        const sponsor = sponsorRows[0];
        const [userRows] = await promisePool.query('SELECT mobile FROM users WHERE id = ?', [sponsor.created_by]);
        const whatsappNumber = userRows.length > 0 ? userRows[0].mobile : '';
        const [ratingRows] = await promisePool.query('SELECT AVG(rating) as averageRating FROM sponsor_ratings WHERE sponsor_id = ?', [sponsorId]);
        const averageRating = ratingRows[0].averageRating || 0;
        res.json({
            ...sponsor,
            whatsapp_number: whatsappNumber,
            average_rating: averageRating
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/list_sponsors', async (req, res) => {
    const { city, domain } = req.query;
    console.log("/list_sponsors", city, domain);
    try {
      let query = "SELECT * FROM sponsors WHERE 1=1";
      const values = [];
      if (city) {
        query += " AND location = ?";
        values.push(city);
      }
      if (domain) {
        query += " AND domain = ?";
        values.push(domain);
      }
      const [sponsors] = await promisePool.query(query, values);
      res.json(sponsors);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}); 
app.post('/add_event', async (req, res) => {
    const { formData } = req.body;
    if (!formData) {
        return res.status(400).json({ error: 'Form data is missing' });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try {
      const [userRows] = await promisePool.query('SELECT id,name FROM users WHERE token = ?', [token]);
      if (userRows.length === 0) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const userId = userRows[0].id;
      const name = userRows[0].name;
      const [ college_name, location, organization_name, event_name, date, time, budget, footfall, description, image ] = formData;
      await promisePool.query(
        'INSERT INTO events (college, location, organization_name, event_name, event_organizer,date, time, budget, footfall, description,image, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            college_name,location,organization_name,event_name,name,date,time,budget,footfall,description,image,userId
        ]
      );
      res.status(201).json({ message: 'Event added successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
app.post('/add_sponsor', async (req, res) => {
    const { formData } = req.body;
    if (!formData) {
        return res.status(400).json({ error: 'Form data is missing' });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try {
      const [userRows] = await promisePool.query('SELECT id,name FROM users WHERE token = ?', [token]);
      if (userRows.length === 0) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const userId = userRows[0].id;
      const [ company_name, location, contact, budget, domain, insta, twitter, other,description, logo ] = formData;
      await promisePool.query(
        'INSERT INTO sponsors (company_name, location, contact, domain, insta, twitter, other,description, logo, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            company_name, location, contact, budget, domain, insta, twitter, other,description, logo,userId
        ]
      );
      res.status(201).json({ message: 'Sponsor added successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
app.post('/rate_sponsor', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const [userRows] = await promisePool.query('SELECT id FROM users WHERE token = ?', [token]);
        if (userRows.length === 0) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userId = userRows[0].id;
        const { sponsor_id, rating } = req.body;
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating' });
        }
        await promisePool.query(
            'INSERT INTO ratings (sponsor_id, user_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?',
            [sponsor_id, userId, rating, rating]
        );
        res.status(201).json({ message: 'Rating submitted successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});