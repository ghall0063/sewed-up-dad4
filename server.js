// 📦 Import Required Modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cors = require('cors');

// 🚀 Initialize Express App
const app = express();
const PORT = process.env.PORT || 3000; // Allow dynamic port selection

// 🛡️ Middleware
app.use(express.static('public')); // Serve static files from 'public'
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// ✅ MongoDB Connection (Local)
mongoose.connect('mongodb://127.0.0.1:27017/sewed-up-dad4')
    .then(() => console.log('✅ MongoDB (Local) Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// ✅ User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// ✅ Middleware to Verify JWT
function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided. Please log in to access this route.' });
    }

    try {
        const decoded = jwt.verify(token, 'your-jwt-secret');
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
}

// ✅ Route: User Registration
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
});

// ✅ Route: User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'your-jwt-secret', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
});

// ✅ Route: User Profile (Protected Route)
app.get('/profile', authenticate, async (req, res) => {
    const user = await User.findById(req.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
});

// ✅ Route: Save Design
app.post('/save-design', (req, res) => {
    const { design } = req.body;

    if (!design) {
        return res.status(400).json({ error: 'Design data is required' });
    }

    const filePath = path.join(__dirname, 'designs', `design-${Date.now()}.png`);
    const base64Data = design.replace(/^data:image\/png;base64,/, '');

    fs.mkdirSync(path.join(__dirname, 'designs'), { recursive: true });
    fs.writeFileSync(filePath, base64Data, 'base64');

    res.status(200).json({ message: 'Design saved successfully!' });
});

// ✅ Route: Place Order
app.post('/place-order', (req, res) => {
    const { design } = req.body;

    if (!design) {
        return res.status(400).json({ error: 'Design data is required for placing an order' });
    }

    const orderPath = path.join(__dirname, 'orders', `order-${Date.now()}.png`);
    const base64Data = design.replace(/^data:image\/png;base64,/, '');

    fs.mkdirSync(path.join(__dirname, 'orders'), { recursive: true });
    fs.writeFileSync(orderPath, base64Data, 'base64');

    res.status(200).json({ message: 'Order placed successfully!' });
});

// ✅ Route: Test Database Connection
app.get('/test-db', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.status(200).json({ collections });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Route: 404 Page
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
