function to_hex(number)
{return number.toString(16).toUpperCase();}
function append_text(parent,text)
{var text_node=document.createTextNode(text);parent.appendChild(text_node);}
function base36(coord)
{if(isNaN(coord)||coord<0||coord>=36*36){throw"bad coordinate "+coord;}
var str=coord.toString(36);if(str.length==1){str="0"+str;}
return str;}
function clear(o)
{while(o.firstChild)
o.removeChild(o.firstChild);}
function create_node(type,parent)
{var new_node=document.createElement(type);parent.appendChild(new_node);return new_node;}
function delete_cookie(name){document.cookie=name+'=; expires=Thu, 01-Jan-70 00:00:01 GMT;';}
function get_cookie(cookie_string)
{if(!document.cookie)
return;var c_start=document.cookie.indexOf(cookie_string);if(c_start==-1)
return;c_start+=cookie_string.length;var c_end=document.cookie.indexOf(";",c_start);if(c_end==-1)
c_end=document.cookie.length;var cookie=document.cookie.substring(c_start,c_end);if(cookie.charAt(0)=="="){cookie=cookie.substring(1)}
return cookie;}
function get_position(evt)
{evt=(evt)?evt:((event)?event:null);var left=0;var top=0;if(evt.pageX){left=evt.pageX;top=evt.pageY;}else if(typeof(document.documentElement.scrollLeft)!=undefined){left=evt.clientX+document.documentElement.scrollLeft;top=evt.clientY+document.documentElement.scrollTop;}else{left=evt.clientX+document.body.scrollLeft;top=evt.clientY+document.body.scrollTop;}
return{x:left,y:top};}
function getbyid(id)
{var element=document.getElementById(id);return element;}
function parse_json(json)
{var result;try{result=eval('('+json+')');}
catch(err){throw("JSON parse");}
return result;}
function random_colour()
{var colour=new String();for(var i=0;i<3;i++){colour=colour.concat(to_hex(Math.floor(Math.random()*13)));}
colour='#'+colour;return colour;}
function sendit(sendmessage,callback,cgi_override)
{var cgi;if(cgi_override){cgi=cgi_override;}else{cgi=cgiscript;}
if(!this.xmlhttp){this.xmlhttp=new XMLHttpRequest()}
if(this.xmlhttp.readyState==1||this.xmlhttp.readyState==2||this.xmlhttp.readyState==3){this.xmlhttp.abort();}
this.xmlhttp.open("POST",cgi,true);var self=this;this.xmlhttp.onreadystatechange=function(){if(self.xmlhttp.readyState==4){if(self.xmlhttp.status==200){callback(self.xmlhttp.responseText);}}}
this.xmlhttp.send(sendmessage);}
function supports_html5_storage(){try{return'localStorage'in window&&window['localStorage']!==null;}catch(e){return false;}}
var hwcgi='/goqhanzi/';var drawkanji;function message(text)
{var found_kanji=getbyid("found_kanji");clear(found_kanji)
error=create_node("span",found_kanji);error.classList.add("error");append_text(error,text);}
function drawkanji_onload()
{var load_input=true;drawkanji=new DrawKanji(load_input);}
function DrawKanji(load_input)
{this.canvas=new DrawCanvas();this.found_kanji=getbyid("found_kanji");this.adjust_canvas_offsets();this.canvas_size=300;var self=this;this.canvas.element.onmouseup=function(event){self.mouseup(event);}
this.canvas.element.onmousedown=function(event){self.mousedown(event);}
this.canvas.element.onmousemove=function(event){self.mousemove(event);}
this.canvas.element.ontouchstart=function(event){self.touch_start(event);}
this.canvas.element.ontouchmove=function(event){self.touch_move(event);}
this.canvas.element.ontouchend=function(event){self.touch_end(event);}
var clear_button=getbyid("drawkanji-clear-button");clear_button.onclick=function(event){self.clearAll();}
var back_button=getbyid("drawkanji-back-line-button");back_button.onclick=function(event){self.backLine();}
if(!iframe){var make_image_button=getbyid("drawkanji-make-image-button");make_image_button.onclick=function(event){self.make_image();}
var send_image=getbyid("drawkanji-send-image-button");send_image.onclick=function(event){self.send_image();}}
window.onresize=function(){self.adjust_canvas_offsets();}
this.show_numbers="never";this.multicoloured=get_multicoloured();this.save_my_input=get_save_my_input();this.colours=new Array();this.clearDrawing();this.has_local_storage=supports_html5_storage();if(load_input){this.load_input();}
this.sendStroke();}
DrawKanji.prototype.load_image_from_data=function(data)
{var lines=data.split("\n");for(var i=0;i<lines.length;i++){var line=lines[i];if(line.match(/^\s*$/)){break;}
if(i==0){line=line.replace(/^[A-Za-z]+ /,'');}
var points=line.length/4;for(var j=0;j<points;j++){var x36=line.substr(j*4,2);var y36=line.substr(j*4+2,2);var x=parseInt(x36,36);var y=parseInt(y36,36);this.addPoint(x,y,false);}
this.finishStroke();}
this.drawAll();}
DrawKanji.prototype.load_from_storage=function()
{var kanji=localStorage.kanji;if(!kanji){return;}
this.load_image_from_data(kanji);var error=localStorage.getItem("error");if(typeof error!=='undefined'){this.displayError(error);return;}
var reply=localStorage.reply;if(reply){localStorage.removeItem('error');this.reply=parse_json(reply);this.show_kanji_list();}
else{this.sendStroke();}}
DrawKanji.prototype.load_input=function()
{if(this.save_my_input){if(this.has_local_storage){this.load_from_storage();}
else{var input_id=get_cookie("server_input_id=");if(input_id&&input_id!="undefined"){this.request_previous_input(input_id);}}}}
DrawKanji.prototype.clearDrawing=function()
{this.clear();clear(this.found_kanji);this.reply=undefined;}
DrawKanji.prototype.clearAll=function()
{if(this.has_local_storage){localStorage.removeItem('kanji');localStorage.removeItem('reply');localStorage.removeItem('error');}
else{delete_save_cookie();}
this.clearDrawing();}
DrawKanji.prototype.backLine=function()
{if(this.stroke_num>0){this.sequence.pop();this.stroke_num--;}
if(this.stroke_num>0){this.canvas.clear();this.drawAll();if(this.stroke_num<50){this.sendStroke();}}
else{this.clearAll();}}
DrawKanji.prototype.clear=function()
{this.reset_brush();this.sequence=[];this.stroke_num=0;this.canvas.clear();}
DrawKanji.prototype.sendStroke=function()
{if(this.stroke_num==0){return;}
if(this.stroke_num==1){if(this.sequence[0].length==1){return;}
var points_all_same=true;var seq0=this.sequence[0];var x0=seq0[0].x;var y0=seq0[0].y;for(var i=1;i<seq0.length;i++){if(seq0[i].x!=x0||seq0[i].y!=y0){points_all_same=false;break;}
}
if(points_all_same){return;}
}
if(this.stroke_num>=53){message(ml.too_many_strokes);throw"Too many strokes";}
var key="H";if(this.ignore_stroke_order){key="h";}
var r=this.makeMessage(key);var self=this;sendit(r,function(result){self.result_callback(result)},hwcgi);if(this.has_local_storage){localStorage.kanji=r;}}
DrawKanji.prototype.finish_line=function()
{if(this.point_num>1){this.finishStroke();this.sendStroke();}
else{this.sequence[this.stroke_num].length=0;this.reset_brush();}}
DrawKanji.prototype.mouseup=function(event)
{if(this.active){this.mouse_trace(event);this.finish_line();}}
DrawKanji.prototype.mousemove=function(event)
{this.mouse_trace(event);}
DrawKanji.prototype.start_line=function()
{this.active=true;}
DrawKanji.prototype.mousedown=function(event)
{this.start_line();this.mouse_trace(event);if(event.preventDefault){event.preventDefault();}
else{event.returnValue=false;}
return false;}
DrawKanji.prototype.touch_end=function(event)
{if(this.active){this.touch_trace(event);this.finish_line();}
this.touching=false;}
DrawKanji.prototype.touch_move=function(event)
{this.touch_trace(event);}
DrawKanji.prototype.touch_start=function(event)
{this.start_line();this.touching=true;this.touch_trace(event);}
DrawKanji.prototype.reset_brush=function()
{this.active=false;this.point_num=0;}
DrawKanji.prototype.simplify=function(stroke_num)
{var nstroke=new Array();var ostroke=this.sequence[stroke_num];var i;var godown=false;var goright=false;var identical=false;diff=new Object();prev=new Object();first=true;last=false;marker=new Object();for(i=0;i<ostroke.length;i++){if(i==ostroke.length-1){point=new Object();point.x=ostroke[i].x;point.y=ostroke[i].y;nstroke.push(point);break;}
if(first){first=false;prev.x=ostroke[0].x;prev.y=ostroke[0].y;point=new Object();point.x=ostroke[i].x;point.y=ostroke[i].y;nstroke.push(point);continue;}
diff.x=ostroke[i].x-prev.x;diff.y=ostroke[i].y-prev.y;if(diff.x==0&&diff.y>0){if(godown){prev=marker;}
else{if(identical||goright){point=new Object();point.x=ostroke[i].x;point.y=ostroke[i].y;nstroke.push(point);identical=false;goright=false;}
godown=true;marker=prev;}}
else if(diff.y==0&&diff.x>0){if(goright){prev=marker;}
else{if(identical||godown){point=new Object();point.x=ostroke[i].x;point.y=ostroke[i].y;nstroke.push(point);identical=false;godown=false;}
goright=true;marker=prev;}}
else if(diff.x==0&&diff.y==0){if(identical){prev=marker;}
else{if(goright||godown){point=new Object();point.x=ostroke[i].x;point.y=ostroke[i].y;nstroke.push(point);goright=false;godown=false;}
identical=true;marker=prev;}}
else if(godown||goright||identical){point=new Object();point.x=ostroke[i-1].x;point.y=ostroke[i-1].y;nstroke.push(point);point=new Object();point.x=ostroke[i].x;point.y=ostroke[i].y;nstroke.push(point);godown=false;goright=false;identical=false;}
else{point=new Object();point.x=ostroke[i].x;point.y=ostroke[i].y;nstroke.push(point);prev.x=ostroke[i].x;prev.y=ostroke[i].y;}}
this.sequence[stroke_num]=nstroke;}
DrawKanji.prototype.finishStroke=function()
{this.annotate(this.stroke_num);this.stroke_num++;this.reset_brush();}
DrawKanji.prototype.drawAll=function()
{var sq=this.sequence;for(var s=0;s<this.stroke_num;s++){var st=sq[s];this.canvas.start_line(st[0].x,st[0].y,this.colours[s]);this.annotate(s);for(var p=1;p<st.length;p++){this.canvas.draw_line(st[p].x,st[p].y);}}}
let X_MIN=10
let Y_MIN=10
DrawKanji.prototype.annotate=function(stroke)
{if(this.show_numbers!="always"&&this.ignore_stroke_order){return;}
if(this.show_numbers=="never"){return;}
var offsetlength=15;var x;var y;var xoffset=offsetlength;var yoffset=offsetlength;var str=this.sequence[stroke];var gap=1;x=str[0].x;y=str[0].y;if(str.length>1){if(str.length>5){gap=5;}
var sine=str[gap].x-str[0].x;var cosine=str[gap].y-str[0].y;var length=Math.sqrt(sine*sine+cosine*cosine);if(length>0){sine/=length;cosine/=length;xoffset=-offsetlength*sine;yoffset=-offsetlength*cosine;}}
x+=xoffset;y+=yoffset;if(x<X_MIN){x=X_MIN;}
if(y<Y_MIN){y=Y_MIN;}
if(x>this.canvas_size-X_MIN){x=this.canvas_size-X_MIN;}
if(y>this.canvas_size-Y_MIN){y=this.canvas_size-Y_MIN;}
this.canvas.draw_text(x,y,stroke+1);}
DrawKanji.prototype.addPoint=function(x,y,draw)
{if(this.point_num==0){this.sequence[this.stroke_num]=new Array;var sq=this.sequence[this.stroke_num];sq[0]={x:x,y:y};this.point_num++;var colour
if(this.multicoloured){colour=random_colour();}
else{colour='#000';}
this.colours[this.stroke_num]=colour;if(draw){this.canvas.start_line(x,y,colour);}}
else{var sq=this.sequence[this.stroke_num];var n=this.point_num;var prev=this.point_num-1;if(x!=sq[prev].x||y!=sq[prev].y){sq[n]={x:x,y:y};this.point_num++;if(draw){this.canvas.draw_line(x,y);}}}}
DrawKanji.prototype.trace=function(pos)
{if(pos.x<2||pos.y<2||pos.x>this.canvas_size-4||pos.y>this.canvas_size-4){this.finish_line();}
else{this.addPoint(Math.round(pos.x),Math.round(pos.y),true);}
}
function get_pos_canvas(canvas,event)
{var rect=canvas.getBoundingClientRect();return{x:event.clientX-rect.left,y:event.clientY-rect.top};}
DrawKanji.prototype.mouse_trace=function(event)
{if(!this.active){return;}
if(this.touching){return;}
var pos;if(this.canvas.is_canvas){pos=get_pos_canvas(this.canvas.element,event);}
else{pos=this.canvas_adjust(get_position(event));}
this.trace(pos);}
function get_touch_position(event)
{var touchobj=event.changedTouches[0];var x=touchobj.pageX;var y=touchobj.pageY;return{"x":x,"y":y};}
DrawKanji.prototype.touch_trace=function(event)
{if(!this.active){return;}
var orig=get_touch_position(event);var pos=this.canvas_adjust(orig);this.trace(pos);event.preventDefault();}
DrawKanji.prototype.makeMessage=function(c)
{var r=c;r+=" ";for(var i=0;i<this.sequence.length;++i){for(var j=0;j<this.sequence[i].length;++j){r+=base36(this.sequence[i][j].x)
+""+base36(this.sequence[i][j].y);}
r+="\n";}
r+="\n\n";return r;}
DrawKanji.prototype.displayError=function(error)
{var errormsg=ml[error];message(errormsg);}
DrawKanji.prototype.result_callback=function(reply)
{this.reply=parse_json(reply);if(!this.reply){return;}
if(this.reply.error!==undefined){this.displayError(this.reply.error);if(this.has_local_storage){localStorage.removeItem('reply');localStorage.error=error;}
return;}
try{if(this.save_my_input){if(this.has_local_storage){localStorage.reply=reply;}}}
catch(err){}
this.show_kanji_list();}
DrawKanji.prototype.show_kanji_list=function()
{if(!this.reply||!this.reply.results){return;}
var window_preference=get_window_preference();clear(this.found_kanji);for(var k in this.reply.results){var kanji;kanji=this.reply.results[k];create_link(this.found_kanji,kanji,window_preference);append_text(this.found_kanji," ");}}
DrawKanji.prototype.show_image=function(reply,image_window)
{var parsed_reply=parse_json(reply);var id=parsed_reply.id;var location=ml.drawn_image_url;location+='?';location+='id='+id;image_window.location=location;}
DrawKanji.prototype.colour_string=function()
{var colour_string="";if(this.colours.length>0){for(colour in this.colours){colour_string+=this.colours[colour];}
colour_string=colour_string.replace(/#/g,"");colour_string="#"+colour_string+"\n";}
return colour_string;}
DrawKanji.prototype.image_data=function()
{if(this.stroke_num==0){message(ml.no_image);throw"No image data available";}
if(this.stroke_num>=50){message(ml.too_many_strokes);throw"Too many strokes";}
var msg="";msg+=this.colour_string();msg+=this.makeMessage("P");return msg;}
DrawKanji.prototype.make_image=function()
{var msg=this.image_data();var self=this;var image_window=window.open("","kanji_image");sendit(msg,function(reply){self.show_image(reply,image_window);},"make-image.cgi");}
DrawKanji.prototype.send_image=function()
{if(this.stroke_num==0){message(ml.no_image);throw"No image data available";}
if(this.stroke_num>=50){message(ml.too_many_strokes);throw"Too many strokes";}
var palette=this.colour_string();var image_data=this.makeMessage("");document.send_image.palette.value=palette;document.send_image.image_data.value=image_data;document.send_image.submit();}
function get_draw_preference(pref_id)
{var preference=get_cookie(draw_cookie(pref_id));return preference;}
function draw_cookie_set(pref_id)
{var control_cookie_value=get_draw_preference(pref_id);var control=getbyid(pref_id);if(control_cookie_value=="1"){control.checked=true;}
else if(control_cookie_value=="0"){control.checked=false;}}
function delete_save_cookie()
{delete_cookie("server_input_id");if(supports_html5_storage()){localStorage.removeItem('kanji');localStorage.removeItem('reply');}}
DrawKanji.prototype.adjust_canvas_offsets=function()
{var offset_left=0;var offset_top=0;for(var o=this.canvas.element;o;o=o.offsetParent){offset_left+=o.offsetLeft;offset_top+=o.offsetTop;}
this.canvas.offset_left=offset_left;this.canvas.offset_top=offset_top;this.canvas.clear();this.drawAll();}
DrawKanji.prototype.canvas_adjust=function(absolute)
{var relative=new Object();relative.x=absolute.x-this.canvas.offset_left;relative.y=absolute.y-this.canvas.offset_top;return relative;}

