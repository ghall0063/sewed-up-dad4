document.addEventListener("DOMContentLoaded", function () {
    if (typeof fabric === 'undefined') {
        console.error("❌ Fabric.js not loaded properly! Check index.html.");
        alert("Fabric.js is missing! Please check your network or refresh the page.");
        return;
    }

    console.log("✅ Fabric.js Loaded Successfully!");

    const canvas = new fabric.Canvas('designCanvas');

    function addEvent(id, func) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', func);
        } else {
            console.error(`❌ Button with ID '${id}' not found!`);
        }
    }

    addEvent('addText', () => {
        const text = new fabric.Textbox('Your Text Here', {
            left: 50,
            top: 50,
            fontSize: 20,
            fill: '#000',
            fontFamily: 'Arial',
            editable: true
        });
        canvas.add(text);
    });

    addEvent('addImage', () => {
        const url = prompt('Enter Image URL:');
        if (url) {
            fabric.Image.fromURL(url, function (img) {
                img.scaleToWidth(200);
                img.scaleToHeight(200);
                canvas.add(img);
            });
        }
    });

    addEvent('changeBg', () => {
        const color = prompt('Enter Background Color (e.g., #FF0000):');
        if (color) {
            canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
        }
    });

    addEvent('downloadDesign', () => {
        const link = document.createElement('a');
        link.download = 'design.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    addEvent('saveDesign', async () => {
        const designData = canvas.toDataURL();
        try {
            const response = await fetch('/save-design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ design: designData })
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            alert('❌ Error saving design');
        }
    });

    addEvent('placeOrder', async () => {
        const designData = canvas.toDataURL();
        const user = prompt("Enter your email for the order:");

        if (!user) {
            alert("❌ Please enter your email.");
            return;
        }

        try {
            const response = await fetch('/place-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ designData, user })
            });

            const result = await response.json();
            alert(result.message || "✅ Order placed successfully!");
        } catch (error) {
            alert("❌ Order failed!");
        }
    });
});