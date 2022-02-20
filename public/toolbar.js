const getMousePosCanvas = (canvas, evt) => {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

const printMousePos = (canvas, evt) => {
    let pos = getMousePosCanvas(canvas, evt);
    console.log(`x: ${pos.x}, y: ${pos.y}`);
}

const helloWorld = () => {
    console.log('Hello World!');
}

module.exports = {
    getMousePosCanvas,
    printMousePos,
    helloWorld
}