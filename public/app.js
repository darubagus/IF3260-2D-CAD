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

const toolbarButton = document.getElementsByClassName('toolbar-button');


const canvas = document.querySelector('#main-canvas');
canvas.addEventListener('click', (e) => {
    printMousePos(canvas, e);
});