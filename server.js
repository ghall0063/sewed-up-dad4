const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/sewed-up-dad4', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

// Define Order Schema
const OrderSchema = new mongoose.Schema({
    designData: String,
    user: String,
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

// Save Design Endpoint
app.post('/save-design', (req, res) => {
    const { design } = req.body;
    if (!design) return res.status(400).json({ error: 'No design data' });

    const filePath = path.join(__dirname, 'designs', `design-${Date.now()}.png`);
    fs.mkdirSync(path.join(__dirname, 'designs'), { recursive: true });
    fs.writeFileSync(filePath, design.replace(/^data:image\/png;base64,/, ''), 'base64');

    res.json({ message: 'Design saved!' });
});

// Place Order Endpoint
app.post('/place-order', async (req, res) => {
    const { designData, user } = req.body;
    if (!designData || !user) return res.status(400).json({ error: 'Missing order data' });

    const order = new Order({ designData, user });
    await order.save();

    res.json({ message: 'Order placed successfully!' });
});

// Start Server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
