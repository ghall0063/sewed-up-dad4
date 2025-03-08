// Initialize Fabric.js Canvas
const canvas = new fabric.Canvas('designCanvas');

// Function: Add Text to Canvas
function addText() {
    const text = new fabric.Textbox('Your Text Here', {
        left: 50,
        top: 50,
        fontSize: 20,
        fill: '#000',
        fontFamily: 'Arial',
        editable: true
    });
    canvas.add(text);
}

// Function: Upload Image to Canvas
function addImage() {
    const url = prompt('Enter Image URL:');
    fabric.Image.fromURL(url, (img) => {
        img.scaleToWidth(200);
        img.scaleToHeight(200);
        canvas.add(img);
    });
}

// Function: Change Background Color
function changeBackgroundColor() {
    const color = prompt('Enter Background Color (e.g., #FF0000):');
    canvas.backgroundColor = color;
    canvas.renderAll();
}

// Function: Save Design
function saveDesign() {
    const designData = canvas.toDataURL();
    fetch('/save-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ design: designData })
    })
    .then(response => response.json())
    .then(data => alert(data.message));
}

// Function: Download Design
function downloadDesign() {
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = canvas.toDataURL();
    link.click();
}
