function translate(){
    let info = document.getElementById('text-input').value;
    document.getElementById('output').value = info;
}
window.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");
    let b = document.getElementById('btnTranslate');
    b.addEventListener("click", translate);

    //Initial references
    let canvas = document.getElementById("drawkanji-canvas");
    let clearButton = document.getElementById("drawkanji-clean-button");
    let cancelLastStrokeButton = document.getElementById("drawkanji-back-line-button");
    let cancelLastStroke_bool = false;
    let draw_bool = false;
    //context for canvas
    let context = canvas.getContext("2d");
    //Initially mouse X and Y positions are 0
    let mouseX = 0;
    let mouseY = 0;
    //get left and top of canvas
    let rectLeft = canvas.getBoundingClientRect().left;
    let rectTop = canvas.getBoundingClientRect().top;
    const init = () => {
        context.strokeStyle = "black";
        context.lineWidth = 1;
        //Set canvas height to parent div height
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        canvas.style.backgroundColor = "#ffffff";
        penButton.value = context.strokeStyle;
    };
    //Detect touch device
    const is_touch_device = () => {
        try {
        //We try to create TouchEvent (it would fail for desktops and throw error)
        document.createEvent("TouchEvent");
        return true;
        } catch (e) {
        return false;
        }
    };
    //Exact x and y position of mouse/touch
    const getXY = (e) => {
        mouseX = (!is_touch_device() ? e.pageX : e.touches?.[0].pageX) - rectLeft;
        mouseY = (!is_touch_device() ? e.pageY : e.touches?.[0].pageY) - rectTop;
    };
    const stopDrawing = () => {
        context.beginPath();
        draw_bool = false;
    };
    //User has started drawing
    const startDrawing = (e) => {
        //drawing = true
        draw_bool = true;
        getXY(e);
        //Start Drawing
        context.beginPath();
        context.moveTo(mouseX, mouseY);
    };
    //draw function
    const drawOnCanvas = (e) => {
        if (!is_touch_device()) {
        e.preventDefault();
        }
        getXY(e);
        //if user is drawing
        if (draw_bool) {
        //create a line to x and y position of cursor
        context.lineTo(mouseX, mouseY);
        context.stroke();
        if (cancelLastStroke_bool) {
            //destination-out draws new shapes behind the existing canvas content
            context.globalCompositeOperation = "destination-out";
        } else {
            context.globalCompositeOperation = "source-over";
        }
        }
    };
    const undoLastPoint = (e) => {

        // remove the last drawn point from the drawing array
        var lastPoint=points.pop();
    
        // add the "undone" point to a separate redo array
        redoStack.unshift(lastPoint);
    
        // redraw all the remaining points
        redrawAll();
    }
    //Mouse down/touch start inside canvas
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("touchstart", startDrawing);

    //Start drawing when mouse.touch moves
    canvas.addEventListener("mousemove", drawOnCanvas);
    canvas.addEventListener("touchmove", drawOnCanvas);

    //when mouse click stops/touch stops stop drawing and begin a new path

    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("touchend", stopDrawing);

    //When mouse leaves the canvas
    canvas.addEventListener("mouseleave", stopDrawing);
    //Button for canceling mode
    cancelLastStrokeButton.addEventListener("click", () => {
        cancelLastStroke_bool = true;
        undoLastPoint
    });
    //Clear
    clearButton.addEventListener("click", () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.backgroundColor = "#fff";
    });
});