const canvas = new fabric.Canvas('designCanvas');

function addText() {
    const text = new fabric.Textbox('Your Text Here', { left: 50, top: 50 });
    canvas.add(text);
}

function addImage() {
    const url = prompt('Enter Image URL:');
    fabric.Image.fromURL(url, (img) => canvas.add(img));
}

function downloadDesign() {
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = canvas.toDataURL();
    link.click();
}

async function showRegister() {
    const username = prompt('Enter Username:');
    const email = prompt('Enter Email:');
    const password = prompt('Enter Password:');
    await fetch('/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, email, password }) });
    alert('Registered!');
}

async function showLogin() {
    const email = prompt('Enter Email:');
    const password = prompt('Enter Password:');
    await fetch('/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    alert('Logged In!');
}
