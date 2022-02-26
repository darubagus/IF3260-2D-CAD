var buttonClicked = {
    'btn-line' : false,
    'btn-square' : false,
    'btn-rectangle' : false,
    'btn-polygon' : false,
    'btn-mouse' : false,
    'btn-save' : false,
    'btn-load' : false,
    'btn-move' : false
};

// Get the coordinate of the mouse click in the canvas
const getMousePosCanvas = (canvas, evt) => {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// Convert the coordinate of the mouse click to the clipping coordinate
const convertMousePos = (canvas, evt) => {
    let pos = getMousePosCanvas(canvas, evt);
    let x = pos.x / canvas.width * 2 - 1;
    let y = -(pos.y / canvas.height * 2 - 1);
    return {
        x: x,
        y: y
    };
}

// Make all buttonClicked false
const resetButtonClicked = () => {
    buttonClicked['btn-line'] = false;
    buttonClicked['btn-square'] = false;
    buttonClicked['btn-rectangle'] = false;
    buttonClicked['btn-polygon'] = false;
    buttonClicked['btn-mouse'] = false;
    buttonClicked['btn-save'] = false;
    buttonClicked['btn-load'] = false;
    buttonClicked['btn-move'] = false;
};


const choseButton = (buttonId) => {
    resetButtonClicked();
    buttonClicked[buttonId] = true;
};

const getColor = () => {
    let colorValue = document.getElementById('color-picker').value;
    // Change hex color to r g b
    let hexColor = colorValue.replace('#', '');
    let r = parseInt(hexColor.substring(0, 2), 16);
    let g = parseInt(hexColor.substring(2, 4), 16);
    let b = parseInt(hexColor.substring(4, 6), 16);
    // Change color value to vec4
    return {
        r: r / 255,
        g: g / 255,
        b: b / 255,
    };
}

export {
    choseButton,
    buttonClicked,
    convertMousePos,
    getColor,
};
