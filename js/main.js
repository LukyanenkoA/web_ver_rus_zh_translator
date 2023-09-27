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
    let points=[];
    //context for canvas
    let context = canvas.getContext("2d");
    let canvasOffset=$("#drawkanji-canvas").offset();
    console.log(canvasOffset)
    let lastX;
    let lastY;
    //Initially mouse X and Y positions are 0
    let mouseX = 0;
    let mouseY = 0;
    //get left and top of canvas
    let rectLeft = canvas.getBoundingClientRect().left;
    let rectTop = canvas.getBoundingClientRect().top;
    const init = () => {
        context.strokeStyle = "black";
        context.lineWidth = 1;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        canvas.style.backgroundColor = "#ffffff";
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
    const stopDrawing = (e) => {
        mouseX = (!is_touch_device() ? e.pageX : e.touches?.[0].pageX) - rectLeft;
        mouseY = (!is_touch_device() ? e.pageY : e.touches?.[0].pageY) - rectTop;
        draw_bool = false;
        context.beginPath();
        points.push({x:mouseX,y:mouseY,mode:"end"});
    };
    //User has started drawing
    const startDrawing = (e) => {
        mouseX = (!is_touch_device() ? e.pageX : e.touches?.[0].pageX) - rectLeft;
        mouseY = (!is_touch_device() ? e.pageY : e.touches?.[0].pageY) - rectTop;
        draw_bool = true;
        getXY(e);
        // Put your mousedown stuff here
        context.beginPath();
        context.moveTo(mouseX,mouseY);
        points.push({x:mouseX,y:mouseY,mode:"begin"});
        lastX=mouseX;
        lastY=mouseY;
      }
    //draw function
    const drawOnCanvas = (e) => {
        if (!is_touch_device()) {
            e.preventDefault();
          }
        getXY(e);
        // calc where the mouse is on the canvas
        mouseX = (!is_touch_device() ? e.pageX : e.touches?.[0].pageX) - rectLeft;
        mouseY = (!is_touch_device() ? e.pageY : e.touches?.[0].pageY) - rectTop;
        
        // if the mouse is being dragged (mouse button is down)
        // then keep drawing a polyline to this new mouse position
        if (draw_bool) {
    
            // extend the polyline
            context.lineTo(mouseX, mouseY);
            context.stroke();
    
            // save this x/y because we might be drawing from here
            // on the next mousemove
            lastX = mouseX;
            lastY = mouseY;
    
            // Command pattern stuff: Save the mouse position
            points.push({
                x: mouseX,
                y: mouseY,
                mode: "draw"
            });
        }
    }
    function redrawAll(){
        if(points.length==0){return;}

        context.clearRect(0, 0, canvas.width, canvas.height);

        for(let i=0;i<points.length;i++){

          let pt=points[i];

          if(pt.mode=="begin"){
              context.beginPath();
              context.moveTo(pt.x,pt.y);
          }
          context.lineTo(pt.x,pt.y);
          if(pt.mode=="end" || (i==points.length-1)){
              context.stroke();
          }
        }
        context.stroke();
    }

    const undoLastStroke = (e) => {
        console.log(points.length);
        // remove the last drawn point from the drawing array
        points.pop();
        console.log(points.length);
        // redraw all the remaining points
        redrawAll();
    }
    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
        x: touchEvent.touches[0].pageX - rectLeft,
        y: touchEvent.touches[0].clientY - rectTop
        };
    }
    //Mouse down/touch start inside canvas
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            pageX: touch.pageX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
        }, false);
    //Start drawing when mouse/touch moves
    canvas.addEventListener("mousemove", drawOnCanvas);
    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
          pageX: touch.pageX,
          clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
      }, false);

    //when mouse click stops/touch stops stop drawing and begin a new path

    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
      }, false);

    //When mouse leaves the canvas
    canvas.addEventListener("mouseleave", stopDrawing);
    //Button for canceling mode
    cancelLastStrokeButton.addEventListener("click", () => {
        cancelLastStroke_bool = true;
        undoLastStroke();
    });
    //Clear
    clearButton.addEventListener("click", () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.backgroundColor = "#fff";
        points=[];
    });
    window.onload = init();
});