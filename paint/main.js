let ongoingTouches = [];
let el = document.getElementById("canvas");
let ctx = el.getContext("2d");

window.onload = function startup() {
  layout();
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  el.addEventListener("touchmove", handleMove, false);
  log("初始化成功。");
}

window.onresize = layout;

function layout() {
  el.width = window.innerWidth - 20;
  el.height = window.innerHeight * 0.8;
}

function handleStart(evt) {
  evt.preventDefault();
  log("触摸操作开始。");
  let touches = evt.changedTouches;
        
  for (let i = 0; i < touches.length; i++) {
    log("开始第 " + i + " 个触摸 ...");
    ongoingTouches.push(copyTouch(touches[i]));
    let color = colorForTouch(touches[i]);
    ctx.beginPath();
    ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
    ctx.fillStyle = color;
    ctx.fill();
    log("第 " + i + " 个触摸已开始。");
  }
}

function handleMove(evt) {
  evt.preventDefault();
  let touches = evt.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    let color = colorForTouch(touches[i]);
    let idx = ongoingTouchIndexById(touches[i].identifier);
    if (idx >= 0) {
      log("继续第 " + idx + " 个触摸");
      ctx.beginPath();
      log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      ctx.stroke();
      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
      log(".");
    } else {
      log("无法继续执行触摸。");
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  log("触摸结束。");
  let touches = evt.changedTouches;
  for (let i = 0; i < touches.length; i++) {
    let color = colorForTouch(touches[i]);
    let idx = ongoingTouchIndexById(touches[i].identifier);
    if (idx >= 0) {
      ctx.lineWidth = 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    } else {
      log("无法明确哪结束哪个触摸。");
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  log("触摸取消。");
  let touches = evt.changedTouches;
  
  for (let i = 0; i < touches.length; i++) {
    let idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1);  // remove it; we're done
  }
}

function colorForTouch(touch) {
  let r = touch.identifier % 16;
  let g = Math.floor(touch.identifier / 3) % 16;
  let b = Math.floor(touch.identifier / 7) % 16;
  r = r.toString(16); // make it a hex digit
  g = g.toString(16); // make it a hex digit
  b = b.toString(16); // make it a hex digit
  let color = "#" + r + g + b;
  log("identifier " + touch.identifier + " 的颜色为：" + color);
  return color;
}

function copyTouch(touch) {
  return {
     identifier: touch.identifier,
     pageX: touch.pageX,
     pageY: touch.pageY
  };
}

function ongoingTouchIndexById(idToFind) {
  for (let i = 0; i < ongoingTouches.length; i++) {
    let id = ongoingTouches[i].identifier;
    
    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}

function log(msg) {
  let p = document.getElementById('log');
  p.innerHTML = 
    new Date().toString().substring(16, 24) + ' ' + msg + "\n" + p.innerHTML;
}