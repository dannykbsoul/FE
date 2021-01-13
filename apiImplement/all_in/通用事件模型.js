var addEvent=function(element,eventType,handler) {
  if(element.addEventListener) {
    element.addEventListener(eventType,handler,false);
  }else if(element.attachEvent) {
    element.attachEvent('on'+eventType,handler)
  }else {
    element['on'+eventType]=handler;
  }
}

var removeEvent=function(element,eventType,handler) {
  if(element.removeEventListener) {
    element.removeEventListener(eventType,handler,false);
  }else if(element.detachEvent) {
    element.detachEvent('on'+eventType,handler)
  }else {
    element['on'+eventType]=null;
  }
}

var getEvent=function(event) {
  return event?event:window.event;
}

var getTarget=function(event) {
  return event.target || event.srcElement
}

var preventDefault = function(event) {
  if (event.preventDefault) {
    event.preventDefault();
  }else {
    event.returnValue = false;
  }
}

var stopPropagation = function(event) {
  if (event.stopPropation) {
    event.stopPropation();
  }else {
    event.cancelBubble = true;
  }
}