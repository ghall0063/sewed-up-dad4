const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Existing Route: Place Order (Modified)
app.post('/place-order', (req, res) => {
    const { design } = req.body;

    if (!design) {
        return res.status(400).json({ message: 'No design data provided!' });
    }

    console.log('Order Received:', design);
    res.status(200).json({ message: 'Order placed successfully!' });
});

// New Route: Save Design
app.post('/save-design', (req, res) => {
    const { design } = req.body;
    const filePath = path.join(__dirname, 'designs', `design-${Date.now()}.png`);
    
    const base64Data = design.replace(/^data:image\/png;base64,/, '');
    fs.mkdirSync(path.join(__dirname, 'designs'), { recursive: true });
    fs.writeFileSync(filePath, base64Data, 'base64');

    res.status(200).json({ message: 'Design saved successfully!', filePath });
});

// New Route: Check Server Status
app.get('/status', (req, res) => {
    res.status(200).json({ status: 'Server is up and running!', uptime: process.uptime() });
});

// 404 Page (Place at the End)
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
