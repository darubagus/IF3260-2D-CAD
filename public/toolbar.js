var buttonClicked = {
    'btn-line' : false,
    'btn-square' : false,
    'btn-rectangle' : false,
    'btn-polygon' : false,
    'btn-mouse' : false
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
};


const choseButton = (buttonId) => {
    resetButtonClicked();
    buttonClicked[buttonId] = true;
};

export {
    choseButton,
    buttonClicked,
    convertMousePos
};
