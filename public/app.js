const canvas = new fabric.Canvas('designCanvas');

// ✅ Add Text to Canvas
function addText() {
    const text = new fabric.Textbox('Your Text Here', {
        left: 50,
        top: 50,
        fontSize: 20,
        fill: '#000'
    });
    canvas.add(text);
}

// ✅ Add Image to Canvas
function addImage() {
    const url = prompt('Enter Image URL:');
    if (url) {
        fabric.Image.fromURL(url, (img) => {
            img.scale(0.5);
            canvas.add(img);
        });
    }
}

// ✅ Download Design
function downloadDesign() {
    if (!canvas || canvas.isEmpty()) {
        alert('Canvas is empty. Add something before downloading.');
        return;
    }
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = canvas.toDataURL({
        format: 'png',
        quality: 1.0
    });
    link.click();
}

// ✅ Save Design
async function saveDesign() {
    if (!canvas || canvas.isEmpty()) {
        alert('Canvas is empty. Add something before saving.');
        return;
    }

    const designData = canvas.toDataURL('image/png');
    try {
        const response = await fetch('/save-design', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ design: designData })
        });

        if (response.ok) {
            alert('Design saved successfully!');
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (err) {
        console.error('Error saving design:', err);
        alert('Failed to save design. Please try again.');
    }
}

// ✅ Place Order
async function placeOrder() {
    if (!canvas || canvas.isEmpty()) {
        alert('Canvas is empty. Add something before placing an order.');
        return;
    }

    const designData = canvas.toDataURL('image/png');
    try {
        const response = await fetch('/place-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ design: designData })
        });

        if (response.ok) {
            alert('Order placed successfully!');
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    } catch (err) {
        console.error('Error placing order:', err);
        alert('Failed to place order. Please try again.');
    }
}

// ✅ Clear Canvas
function clearCanvas() {
    canvas.clear();
    alert('Canvas cleared!');
}

// ✅ Reset Canvas
function resetCanvas() {
    canvas.clear();
    addText();
    alert('Canvas reset to default state!');
}
