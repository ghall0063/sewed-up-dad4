const canvas = new fabric.Canvas('designCanvas');

function addText() {
    const text = new fabric.Textbox('Your Text Here', {
        left: 50,
        top: 50,
        fontSize: 20,
        fill: '#000'
    });
    canvas.add(text);
}

function addImage() {
    const url = prompt('Enter Image URL:');
    fabric.Image.fromURL(url, (img) => {
        img.scale(0.5);
        canvas.add(img);
    });
}

function downloadDesign() {
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = canvas.toDataURL();
    link.click();
}

async function placeOrder() {
    const designData = canvas.toDataURL();
    await fetch('/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ design: designData })
    });
    alert('Order Placed!');
}

