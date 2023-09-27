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
    let offsetX = canvasOffset.left;
    let offsetY = canvasOffset.top;
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
        mouseX = (!is_touch_device() ? e.pageX : e.touches?.[0].pageX) - offsetX;
        mouseY = (!is_touch_device() ? e.pageY : e.touches?.[0].pageY) - offsetY;
    };
    const stopDrawing = (e) => {
        mouseX = (!is_touch_device() ? e.pageX : e.touches?.[0].pageX) - offsetX;
        mouseY = (!is_touch_device() ? e.pageY : e.touches?.[0].pageY) - offsetY;
        draw_bool = false;
        points.push({x:mouseX,y:mouseY,mode:"end"});
    };
    //User has started drawing
    const startDrawing = (e) => {
        mouseX = (!is_touch_device() ? e.pageX : e.touches?.[0].pageX) - offsetX;
        mouseY = (!is_touch_device() ? e.pageY : e.touches?.[0].pageY) - offsetY;
        draw_bool = true;
        getXY(e);
        // Put your mousedown stuff here
        context.beginPath();
        context.moveTo(mouseX,mouseY);
        points.push({x:mouseX,y:mouseY,mode:"begin"});
        lastX=mouseX;
        lastY=mouseY;
        isMouseDown=true;
      }
    //draw function
    const drawOnCanvas = (e) => {

        // calc where the mouse is on the canvas
        mouseX = (!is_touch_device() ? e.pageX : e.touches?.[0].pageX) - offsetX;
        mouseY = (!is_touch_device() ? e.pageY : e.touches?.[0].pageY) - offsetY;
    
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
    
            // Command pattern stuff: Save the mouse position and 
            // the size/color of the brush to the "undo" array
            points.push({
                x: mouseX,
                y: mouseY,
                mode: "draw"
            });
        }
    }
    function redrawAll(){

        if(points.length==0){return;}

        context.clearRect(0,0,canvas.width,canvas.height);

        for(let i=0;i<points.length;i++){

          let pt=points[i];

          let begin=false;

          if(context.lineWidth!=pt.size){
              context.lineWidth=pt.size;
              begin=true;
          }
          if(context.strokeStyle!=pt.color){
              context.strokeStyle=pt.color;
              begin=true;
          }
          if(pt.mode=="begin" || begin){
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

    const undoLastPoint = (e) => {

        // remove the last drawn point from the drawing array
        let lastPoint=points.pop();
    
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
        undoLastPoint();
    });
    //Clear
    clearButton.addEventListener("click", () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.backgroundColor = "#fff";
    });
});