// Fabric.js Canvas Initialization
const canvas = new fabric.Canvas('designCanvas');

// Add Text to Canvas
function addText() {
    const text = new fabric.Textbox('Your Text Here', {
        left: 50,
        top: 50,
        fontSize: 20,
        fill: '#000'
    });
    canvas.add(text);
}

// Add Image to Canvas
function addImage() {
    const url = prompt('Enter Image URL:');
    if (url) {
        fabric.Image.fromURL(url, (img) => {
            img.scale(0.5);
            canvas.add(img);
        });
    }
}

// Download the Design
function downloadDesign() {
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = canvas.toDataURL();
    link.click();
}

// Simulate Order Placement
async function placeOrder() {
    const designData = canvas.toDataURL();
    await fetch('/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ design: designData })
    });
    alert('Order Placed!');
}


