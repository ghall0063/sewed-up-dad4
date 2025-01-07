// 📦 Import Required Modules
const express = require('express');
const fs = require('fs');
const path = require('path');

// 🚀 Initialize Express App
const app = express();
const PORT = 3000;

// 🛡️ Middleware
app.use(express.static('public')); // Serve static files from the 'public' folder
app.use(express.json()); // Parse incoming JSON requests

// ------------------------------------------
// ✅ Route 1: Check Server Status
// ------------------------------------------
app.get('/status', (req, res) => {
    res.status(200).json({ 
        status: 'Server is up and running!',
        uptime: process.uptime()
    });
});

// ------------------------------------------
// ✅ Route 2: Save Design
// ------------------------------------------
app.post('/save-design', (req, res) => {
    const { design } = req.body;

    if (!design) {
        return res.status(400).json({ message: 'No design data provided!' });
    }

    const filePath = path.join(__dirname, 'designs', `design-${Date.now()}.png`);
    const base64Data = design.replace(/^data:image\/png;base64,/, '');

    // Ensure 'designs' folder exists
    fs.mkdirSync(path.join(__dirname, 'designs'), { recursive: true });

    // Save the design as a PNG file
    fs.writeFileSync(filePath, base64Data, 'base64');
    console.log(`✅ Design saved at ${filePath}`);

    res.status(200).json({ message: 'Design saved successfully!', filePath });
});

// ------------------------------------------
// ✅ Route 3: Place Order with Validation
// ------------------------------------------
app.post('/place-order', (req, res) => {
    const { design } = req.body;

    if (!design) {
        return res.status(400).json({ message: 'No design data provided!' });
    }

    console.log('✅ Order Received:', design);
    res.status(200).json({ message: 'Order placed successfully!' });
});

// ------------------------------------------
// ✅ Route 4: Custom 404 Page
// ------------------------------------------
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ------------------------------------------
// ✅ Start the Server
// ------------------------------------------
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});

