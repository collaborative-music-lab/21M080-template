//example of P5.js code in my mode
//https://youtu.be/Su792jEauZg
// import p5 from './p5';
//import "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.js"

let x_size, y_size;
let globalScale = 1;
let fullscreen = false;

const gui_sketch = function (my) {
  let globalScale = 1
  // constraining apsect ratio to 2:1 (w:h)
  //my.createCanvas(200, 200);
  // let divID = my.canvas.parentElement.id;
  // let myID = document.getElementById(my.canvas.parentElement.id);
  // my.resizeCanvas(myID.width, myID.height)

  //console.log(myID,myID.clientWidth,myID.clientHeight)

  // let x_size = document.getElementById(divID).offsetWidth// *.985;
  // let y_size = document.getElementById(divID).offsetHeight// *.985;

  let x_size = my.windowWidth
  let y_size = my.windowHeight
  let originalSize = y_size;

  // my.color VARS
    my.color1 = my.color(255, 40, 0); // main color
    my.color2 = my.color(170, 176, 180); // secondary color
    my.color3 = my.color(0, 229, 234); // background
    my.color4 = my.color(30); // text

  my.setup = function () {
    my.createCanvas(x_size, y_size);

    //slow down draw rate
    my.frameRate(30)

    // DEFAULT STYLING
    my.background(my.color3)
    my.noStroke();
    my.angleMode(my.DEGREES);
    my.textStyle(my.BOLD);
    my.textAlign(my.CENTER, my.CENTER);

    // INITIALIZE DRAWING
    //setNewDimensions();
    //my.clearGUI();
    //my.redrawGUI();
  }//setup

  // ******** INITIALIZE VARS ******** //

  // UI ELEMENTS DEFAULT VALUES
  let dragging = false;
  let currElement = 0;
  my.lines = [];
  let masterSensitivity = 1;
  let x0 = 10;
  let y0 = 50;
  // buttons
  let rBtn = 40; // button size
  // slider
  let sliderWidth = 10;
  let sliderLength = 100;
  let sliderSensitivity = .008 * masterSensitivity;
  // radio
  let radioBox = 30;
  let seqUpdateState = 'ON';
  let seqUpdateStarted = false;
  // knob
  let rKnob = 40; // knob size
  let ogY = 0;
  let ogX = 0;
  let sensitivityScale = 0.006 * masterSensitivity; // alters sensitivity of turning the knob
  let ogValue = 0;
  // keybaord
  let keypattern = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]; // blackk and white key pattern for an octave
  let keyOn = [false, null]; // state of any key being pressed and element index of keyboard that was pressed
  my.activeKeyboardIndex = null;
  my.keyMapping = ['49', '50', '51', '52', '53', '54', '55', '56', '57', '48', '189', '187'] // 1 thru 0 row of keys

  //******** my.draw() AND my.redrawGUI() ********//
  my.draw = function () { // only updates values of elements and if they change it calls redrawGUI()
    //console.log('draw')
    my.clearGUI()
    //let valuesChanged = didValuesChange();
    // ITERATE THRU ALL ELEMENTS and UPDATE THEM IF NEEDED
    for (let i = 0; i < my.elements.length; i++) {
      // UPDATE KNOB VALUE
      if (my.elements[i].type == 'knob' || my.elements[i].type == 'dial') {
        if (dragging && currElement == i) {
          //my.elements[i].prev = my.elements[i].value; // store prev val
          let curX = my.scaleX(my.elements[i].x)
          let curY = my.scaleY(my.elements[i].y)
          let dx = (curX * globalScale - my.mouseX - ogX) * -1; // mouse units
          let dy = curY * globalScale - my.mouseY - ogY; // mouse units
          let dxSum = dx ** 2 * Math.sign(dx) + dy ** 2 * Math.sign(dy)
          let dxAmplitude = Math.sqrt(Math.abs(dxSum)) * Math.sign(dxSum);
          let temp = dxAmplitude * sensitivityScale + ogValue
          //clip to 0-1
          my.elements[i].value = temp > 1 ? 1 : temp < 0 ? 0 : temp
        }
      }
      // UPDATE SLIDER VALUE
      else if (my.elements[i].type == 'slider' || my.elements[i].type == 'fader') {
        if (dragging && currElement == i) {
          //my.elements[i].prev = my.elements[i].value; // store prev val
          let curX = my.scaleX(my.elements[i].x)
          let curY = my.scaleY(my.elements[i].y)
          let dx = curX * globalScale - my.mouseX - ogX; // mouse units
          var dy = curY * globalScale - my.mouseY - ogY; // mouse units
          let dxScaled = -dx * (sliderSensitivity / my.elements[i].size); // mouse units + scaled for sensitivity
          let dyScaled = dy * (sliderSensitivity / my.elements[i].size); // mouse units + scaled for sensitivity

          my.elements[i].value = dxScaled + dyScaled - ogValue; // update value

          //clip to 0-1
          my.elements[i].value = my.elements[i].value > 1 ? 1 : my.elements[i].value < 0 ? 0 : my.elements[i].value
        }
      }

      // TOGGLE VALUE GETS UPDATED IN mousePressed()
      else if (my.elements[i].type == 'toggle') {
        //my.elements[i].prev = my.elements[i].value; // store prev val
      }

      // UPDATE MOMENTARY BUTTON VALUE
      else if (my.elements[i].type == 'momentary') {
        //my.elements[i].prev = my.elements[i].value; // store prev val
        if (currElement == i && dragging) {
          my.elements[i].value = 1;
        } else {
          my.elements[i].value = 0;
        }
      }
      // RADIO BUTTON VALUE GETS UPDATED IN mousePressed()
      else if (my.elements[i].type == 'radio') {
        //my.elements[i].prev = my.elements[i].value; // store prev val
      }
      // UPDATE KEYBOARD VALUES
      else if (my.elements[i].type == 'keyboard') {
        // if (my.elements[i].active == true){
        //   my.activeKeyboardIndex = i;
        //   my.turnOffOtherKeyboards();
        // }
      }
    }
    //if (valuesChanged == true) {my.redrawGUI();}
    my.redrawGUI()
  }// draw

  function didValuesChange() {
    for (let i = 0; i < my.elements.length; i++) {
      if (my.elements[i].prev != my.elements[i].value) {
        my.elements[i].prev = my.elements[i].value; // store prev val
        return true
      }
    }
    return false
  }

  my.clearGUI = function () {
    my.background(my.color3);
  }


  my.redrawGUI = function () { //can't name it redraw because p5 already has a custom function w that name
    my.clearGUI();

    my.scale(globalScale);

    for (let i = 0; i < my.elements.length; i++) {
      // SET CURRENT ELEMENT COLOR
      let currentColor;
      try {
        currentColor = my.elements[i].color;
      } catch (error) {
        currentColor = my.elements[i].color;
      }
      // DRAW KNOB
      //console.log(currentColor, my.elements[i].color.val, my.elements[i].color)
      my.fill(currentColor);
      if (my.elements[i].type == 'line') my.drawLine(i)
      else if (my.elements[i].type == 'knob' || my.elements[i].type == 'dial') {
        my.push();
        let curX = my.scaleX(my.elements[i].x)
        let curY = my.scaleY(my.elements[i].y)
        my.translate(curX, curY);
        let sz = my.elements[i].size;
        // background circle
        my.strokeWeight(6);
        my.fill(my.color3);
        my.stroke(my.color3);
        my.ellipse(0, 0, 1.2 * rKnob * sz);
        // full arc
        my.strokeCap(my.SQUARE);
        my.stroke(my.color2);
        my.noFill();
        my.arc(0, 0, 2 * rKnob * sz, 2 * rKnob * sz, 120, 60);
        // active arc
        my.stroke(currentColor);
        //keep value from 0-1 here
        let valueNorm = (my.elements[i].value - my.elements[i].min) / (my.elements[i].max - my.elements[i].min); // normalize between 0-1
        //console.log(valueNorm)
        //let valueInDegrees = valueNorm * 300 - 240; // range is -240 to 60 deg
        let valueInDegrees = my.elements[i].value * 300 - 240; // range is -240 to 60 deg
        let bipolarOffset = 0;
        let start = 120;
        let end = valueInDegrees + .01
        if (my.elements[i].bipolar == true) {
          start = 270;
          if (end < -90) {
            let startCopy = start;
            start = end;
            end = startCopy;
          }
        }
        my.arc(0, 0, 2 * rKnob * sz, 2 * rKnob * sz, start, end);

        // dial lines
        if (my.elements[i].bipolar == true) {
          my.push();
          my.fill(my.color3);
          my.noStroke();
          my.rect(-1.5, 0, 3, -rKnob * 1.1);
          my.pop();
        }
        my.strokeCap(my.ROUND);
        my.rotate(valueInDegrees);
        my.push();
        my.stroke(my.color3);
        my.strokeWeight(12);
        my.line(0, 0, rKnob * sz, 0);
        my.pop();
        my.line(0, 0, rKnob * sz, 0);
        my.pop();

        //calc current value
        let scaledValue = scaleOutput(my.elements[i].value, 0, 1, my.elements[i].min, my.elements[i].max, my.elements[i].curve)
        // LABEL
        my.push();
        my.fill(my.color4);
        my.noStroke();
        if (my.elements[i].showValue == true) {
          let roundto = 0;
          let curRange = my.elements[i].max - my.elements[i].min;
          if (curRange <= .01) {
            roundto = 6
          } else if (curRange <= .1) {
            roundto = 4
          } else if (curRange <= 1) {
            roundto = 3
          } else if (curRange <= 10) {
            roundto = 2
          }
          scaledValue = my.round(scaledValue, roundto)
          my.textSize(13);
          my.text(scaledValue, curX, curY + rKnob * sz - 2);
        }
        if (my.elements[i].showLabel == true) {
          my.text(my.elements[i].label, curX, curY + rKnob * sz + 13);
        }
        my.pop();

        // MAP TO CONTROLS
        if (my.elements[i].prev != my.elements[i].value) {
          mapToControls(my.elements[i].mapto, scaledValue, my.elements[i].callback);
        }
        my.elements[i].prev = my.elements[i].value
      }
      // END KNOB
      // DRAW SLIDER
      else if (my.elements[i].type == 'slider' || my.elements[i].type == 'fader') {
        my.push();
        let sz = my.elements[i].size;
        let curX = my.scaleX(my.elements[i].x)
        let curY = my.scaleY(my.elements[i].y)
        my.translate(curX, curY);
        if (my.elements[i].orientation == 'horizontal') {
          my.rotate(90);
        }
        my.rectMode(my.CENTER);
        // full slider line
        my.strokeCap(my.SQUARE);
        my.noStroke();
        // background box
        my.fill(my.color3);
        my.rect(0, 0, 15 * sz * 1.2, sliderLength * sz * 1.2);
        // full line
        my.fill(my.color2);
        my.rect(0, 0, sliderWidth * sz, sliderLength * sz);

        // active line
        my.strokeWeight(sliderWidth * sz);
        my.stroke(currentColor);
        let convertedVal = my.elements[i].value * sliderLength * sz
        let bipolarOffset = 0;

        if (my.elements[i].bipolar == true) {
          bipolarOffset = sliderLength * sz / 2;
        }
        my.line(0, sliderLength * sz / 2 - bipolarOffset, 0, sliderLength * sz / 2 - convertedVal);

        // middle line
        my.strokeWeight(2 * sz);
        my.stroke(my.color3);
        my.line(0, .9 * sliderLength * sz / 2, 0, -.9 * sliderLength * sz / 2);

        if (my.elements[i].bipolar == true) {
          my.push();
          my.fill(my.color3)
          my.noStroke();
          my.rect(0, 0, sliderWidth * 1 * sz, 2)
          my.pop();
        }
        // control point
        my.push();
        let sliderKnobSize = 8 * sz
        my.fill(currentColor);
        my.stroke(my.color3);
        my.rect(
          0,
          .95 * (sliderLength * sz / 2) - .95 * convertedVal,
          sliderWidth * 1.5 * sz,
          sliderKnobSize);
        my.pop();

        // LABEL
        my.fill(my.color4);
        my.noStroke();
        if (my.elements[i].orientation == 'horizontal') {
          my.rotate(-90)
        }
        if (my.elements[i].showLabel == true) {
          let txt = my.elements[i].label;
          my.textSize((2 + sz) * 4); // scales text based on num of char
          let labelX = 0;
          let labelY = sliderLength * sz / 2 + 10;
          if (my.elements[i].orientation == 'horizontal') {
            my.text(txt, 0, labelX - 15);
          } else {
            my.text(txt, labelX, labelY + 15);
          }
        }

        //calc current value
        let scaledValue = scaleOutput(my.elements[i].value, 0, 1, my.elements[i].min, my.elements[i].max, my.elements[i].curve)

        if (my.elements[i].showValue == true) {
          let roundto = 0;
          if (my.elements[i].max <= .1) {
            roundto = 4
          } else if (my.elements[i].max <= 1) {
            roundto = 3
          } else if (my.elements[i].max <= 10) {
            roundto = 2
          }
          scaledValue = my.round(scaledValue, roundto)

          my.textSize((5 + sz) * 2); // scales text based on num of char
          let labelX = 0;
          let labelY = sliderLength * sz / 2 + 10;
          if (my.elements[i].orientation == 'horizontal') {
            my.text(scaledValue, 0, labelX + 15);
          } else {
            my.text(scaledValue, labelX, labelY);
          }
        }
        my.pop();
        // MAP TO CONTROLS
        if (my.elements[i].prev != my.elements[i].value) {
          mapToControls(my.elements[i].mapto, scaledValue, my.elements[i].callback);
        }
        my.elements[i].prev = my.elements[i].value
      }
      // END SLIDER
      // DRAW TOGGLE BUTTON
      else if (my.elements[i].type == 'toggle') {
        my.push(); // ASSUME ON STATE
        let sz = my.elements[i].size;
        let curX = my.scaleX(my.elements[i].x)
        let curY = my.scaleY(my.elements[i].y)
        my.translate(curX, curY);
        // background circle
        my.fill(my.color3);
        my.ellipse(0, 0, 2.2 * rBtn * sz);
        // setting up color variables
        my.stroke(currentColor);
        my.strokeWeight(4);
        let textColor = currentColor;
        if (my.elements[i].value == 0) { // OFF STATE
          my.stroke(my.color2);
          my.strokeWeight(2);
          textColor = my.color2;
        }
        my.fill(my.color3);
        my.ellipse(0, 0, sz * rBtn * 2, sz * rBtn * 2);
        my.fill(textColor);
        my.noStroke();
        if (my.elements[i].showLabel == true) {
          let toggleText = my.elements[i].label;
          my.textSize(sz * 85 / toggleText.length); // scales text based on num of chars
          my.text(toggleText, 0, 1);
        }
        my.pop();
        // MAP TO CONTROLS
        if (my.elements[i].prev != my.elements[i].value) {
          mapToControls(my.elements[i].mapto, my.elements[i].value, my.elements[i].callback);
        }
        my.elements[i].prev = my.elements[i].value
      }
      // END TOGGLE
      // DRAW MOMENTARY BUTTON
      else if (my.elements[i].type == 'momentary') {
        my.push(); // ASSUME OFF STATE
        let sz = my.elements[i].size;
        let curX = my.scaleX(my.elements[i].x)
        let curY = my.scaleY(my.elements[i].y)
        my.translate(curX, curY);
        // background circle
        my.fill(my.color3);
        my.ellipse(0, 0, 2.2 * rBtn * sz);
        // setting up color variables
        my.fill(my.color3);
        my.stroke(my.color2);
        my.strokeWeight(2);
        let textColor = my.color2;
        if (my.elements[i].value == 1) { // ON STATE
          my.stroke(currentColor);
          textColor = currentColor;
          my.strokeWeight(4);
        }
        my.ellipse(0, 0, sz * rBtn * 2, sz * rBtn * 2);
        my.fill(textColor);
        my.noStroke();
        if (my.elements[i].showLabel == true) {
          let text = my.elements[i].label;
          my.textSize(sz * 85 / text.length); // scales text based on num of chars
          my.text(text, 0, 1);
        }
        my.pop();
        // MAP TO CONTROLS
        if (my.elements[i].value && my.elements[i].prev != my.elements[i].value) {
          mapToControls(my.elements[i].mapto, my.elements[i].value, my.elements[i].callback);
        }
        my.elements[i].prev = my.elements[i].value
      }
      // END MOMENTARY
      // DRAW RADIO BUTTON
      else if (my.elements[i].type == 'radio') {
        my.push();
        let sz = my.elements[i].size;
        let rBoxSz = radioBox * sz;
        let curX = my.scaleX(my.elements[i].x)
        let curY = my.scaleY(my.elements[i].y)
        my.translate(curX, curY);
        // boxes
        my.fill(my.color2);
        my.stroke(my.color3);
        my.strokeWeight(2);
        let numBoxes = my.elements[i].radioOptions.length
        let yBoxInit = - Math.floor(numBoxes / 2); // y scale for where to start drawing
        if (numBoxes % 2 != 0) {
          yBoxInit += -0.5 // extra offset if numBoxes is odd
        }
        // background rect
        my.push();
        my.rectMode(my.CENTER);
        my.fill(my.color3);
        my.noStroke();
        my.rect(0, 0, rBoxSz + 10 * sz, rBoxSz * numBoxes + 10 * sz);
        my.pop();
        // DRAW BOXES
        let yBox = yBoxInit;
        for (let j = 0; j < numBoxes; j++) {
          let x = -rBoxSz / 2;
          let y = yBox * rBoxSz;
          if (my.elements[i].orientation == 'horizontal') {
            x = y;
            y = -rBoxSz / 2;
          }
          my.rect(x, y, rBoxSz*2, rBoxSz);
          yBox = yBox + 1; // adjust y scale
        }
        // BOX LABELS
        my.textSize(8);
        my.noStroke();
        my.textAlign(my.LEFT)
        my.fill(my.color3);
        if (my.elements[i].showLabel == true) {
          yBox = yBoxInit + 0.5; // reset to original value, add offset to center text
          for (let j = 0; j < numBoxes; j++) {
            let x = -rBoxSz / 4;
            let y = yBox * rBoxSz;
            if (my.elements[i].orientation == 'horizontal') {
              x = y;
              y = 0;
            }
            my.text(my.elements[i].radioOptions[j], x, y);
            yBox = yBox + 1; // adjust y scale
          }
        }
        // FILL IN ACTIVE BUTTON
        let active = my.elements[i].value - 1; // adjust for 0-indexing
        yBox = yBoxInit + active;
        my.fill(currentColor);
        my.stroke(my.color3);
        my.strokeWeight(2);
        let x = -rBoxSz / 2;
        let y = yBox * rBoxSz;
        if (my.elements[i].orientation == 'horizontal') {
          x = y;
          y = -rBoxSz / 2;
        }
        my.rect(x, y, rBoxSz*2, rBoxSz);
        my.noStroke();
        my.fill(my.color3);
        if (my.elements[i].showLabel == true) {
          let txt = my.elements[i].radioOptions[active];
          let x = 0;
          let y = (yBox + .5) * rBoxSz;
          if (my.elements[i].orientation == 'horizontal') {
            x = y;
            y = 0;
          }
          my.text(txt, x, y);
        }
        my.pop();
        // MAP TO CONTROLS
        if (my.elements[i].prev != my.elements[i].value) {
          mapToControls(my.elements[i].mapto, my.elements[i].radioOptions[my.elements[i].value - 1], my.elements[i].callback);
        }
        my.elements[i].prev = my.elements[i].value
      }
      // END RADIO
     
      /******TEXT BLOCK *******/
      else if (my.elements[i].type == 'text') {
        my.push();
        let sz = my.elements[i].size;
        let curX = my.scaleX(my.elements[i].x)
        let curY = my.scaleY(my.elements[i].y)
        my.translate(curX, curY);
        
        // LABEL
        my.fill(my.color4);
        my.noStroke();
        if (my.elements[i].orientation == 'horizontal') {
          my.rotate(-90)
        }
        if (my.elements[i].showLabel == true) {
          let txt = my.elements[i].label;
          my.textSize((2 + sz) * 4); // scales text based on num of char
          let labelX = 0;
          let labelY = sliderLength * sz / 2 + 10;
          my.text(txt, 0, 0);
        }
        my.pop();
      }
      // END TEXT
    }
  } //redraw

  function mapToControls(mapto, value, cb) {
    //look for method to map to
    let defined = 0
    //console.log(mapto, value, cb)

    if (mapto === undefined) {
      defined = 1
    } else {
      try { mapto.rampTo(value)} 
      catch (e) { console.log('invalid mapto', e) }
    }

    if (cb === undefined) {
      defined = 2
    } else {
      try { cb(value) }
      catch (e) { console.log('invalid callback', e) }
    }

    if (defined == 0) { console.log('no mapto or callback defined') }

  }

  //******** MOUSE CLICKS AND KEY PRESSES ********//
  my.mousePressed = function () {
    Tone.start()
    currElement = "none";
    dragging = true; // start dragging
    for (let i = 0; i < my.elements.length; i++) {
      if (my.elements[i].type == "knob" || my.elements[i].type == 'dial') {
        let curX = my.scaleX(my.elements[i].x)
        let curY = my.scaleY(my.elements[i].y)
        if (my.dist(my.mouseX, my.mouseY, curX * globalScale, curY * globalScale) < rKnob * globalScale * my.elements[i].size) {
          ogX = curX * globalScale - my.mouseX;
          ogY = curY * globalScale - my.mouseY;
          ogValue = my.elements[i].value;
          currElement = i;
          //eval(my.elements[i].callback);
          break
        }
      }
      else if (my.elements[i].type == "slider" || my.elements[i].type == 'fader') {
        let orientationDim = sliderWidth * 2 * globalScale * my.elements[i].size / 2;
        let verticalDim = sliderLength * globalScale * my.elements[i].size / 2 + 10;
        if (my.elements[i].orientation == 'horizontal') {
          orientationDim = sliderLength * globalScale * my.elements[i].size / 2 + 10;
          verticalDim = sliderWidth * 2 * globalScale * my.elements[i].size / 2;
        }
        let curX = my.scaleX(my.elements[i].x)
        let curY = my.scaleY(my.elements[i].y)
        if (Math.abs(curX * globalScale - my.mouseX) <= (orientationDim)) {
          if (Math.abs(curY * globalScale - my.mouseY) <= (verticalDim)) {
            ogX = curX * globalScale - my.mouseX;
            ogY = curY * globalScale - my.mouseY;
            ogValue = -my.elements[i].value;
            currElement = i;
            //eval(my.elements[i].callback);
            break
          }
        }
      }
      else if (my.elements[i].type == "toggle") {
        let curX = my.scaleX(my.elements[i].x)
        let curY = my.scaleY(my.elements[i].y)
        if (my.dist(my.mouseX, my.mouseY, curX * globalScale, curY * globalScale) < rBtn * globalScale * my.elements[i].size) {
          my.elements[i].value = 1 - my.elements[i].value;
          currElement = i;
          //eval(my.elements[i].callback);
          break
        }
      }
      else if (my.elements[i].type == "momentary") {
        let curX = my.scaleX(my.elements[i].x)
        let curY = my.scaleY(my.elements[i].y)
        if (my.dist(my.mouseX, my.mouseY, curX * globalScale, curY * globalScale) < rBtn * globalScale * my.elements[i].size) {
          currElement = i;
          //eval(my.elements[i].callback);
          break
        }
      }
      else if (my.elements[i].type == "radio") {
        let scaling = globalScale * my.elements[i].size

        let numBoxes = my.elements[i].radioOptions.length;
        let boxID = 1;
        let curX = my.scaleX(my.elements[i].x)
        let curY = my.scaleY(my.elements[i].y)

        if (my.elements[i].orientation == 'horizontal') {

          if (Math.abs(curY * globalScale - my.mouseY) <= (radioBox * scaling / 2)) {
            let mousePosX = my.mouseX - curX * globalScale;
            let leftBound = -radioBox * scaling * (numBoxes / 2);
            let rightBound = leftBound + radioBox * scaling;
            for (let j = 0; j < numBoxes; j++) {
              if (leftBound <= mousePosX && mousePosX <= rightBound) {
                my.elements[i].value = boxID;
                //eval(my.elements[i].callback);
                break
              }
              boxID += 1;
              leftBound += radioBox * scaling;
              rightBound += radioBox * scaling ;
            }
          }
        }
        else {
          let curX = my.scaleX(my.elements[i].x)
          let curY = my.scaleY(my.elements[i].y)
          if (Math.abs(curX * globalScale - my.mouseX) <= (radioBox * scaling / 2)) {
            let mousePosY = my.mouseY - curY * globalScale;
            let lowerBound = -radioBox * scaling * (numBoxes / 2);
            let upperBound = lowerBound + radioBox * scaling;
            for (let j = 0; j < numBoxes; j++) {
              if (upperBound >= mousePosY && mousePosY >= lowerBound) {
                my.elements[i].value = boxID;
                //eval(my.elements[i].callback);
                break
              }
              boxID += 1;
              upperBound += radioBox * scaling;
              lowerBound += radioBox * scaling ;
            }
          }
        }
      }
      else if (my.elements[i].type == "keyboard") {
        let curX = my.scaleX(my.elements[i].x)
        let curY = my.scaleY(my.elements[i].y)
        if (my.mouseX >= (curX) && my.mouseX <= (my.elements[i].width + curX)) {
          if (my.mouseY >= (curY) && my.mouseY <= (my.elements[i].height + curY)) {
            // INSIDE KEYBOARD
            my.activeKeyboardIndex = i;
            my.elements[i].active = true;
            my.turnOffOtherKeyboards();
            keyboardOn(whichKeyIsClicked(my.activeKeyboardIndex), i);
            currElement = i;
            break
          }
        }
      }
    }
  }// mousePressed

  my.mouseReleased = function () {
    // Stop dragging
    dragging = false;
    // turn keyboard note off if its on
    if (keyOn[0] == true) {
      keyboardOff();
    }
  }
  window.addEventListener('keydown', keyPressed);

  function keyPressed(e) { // when computer key is pressed
    if (my.activeKeyboardIndex != null && keyOn[0] == false) {
      keyboardOn((e.keyCode).toString(), my.activeKeyboardIndex);
    }
  }
  my.keyReleased = function () { // when computer key is released
    if (keyOn[0] == true) {
      keyboardOff();
    }
  }

  //******** Element Custom Objects ********//
  my.elements = [];

  let UserElement = function (type, label, mapto, callback, x, y, min = 0, max = 1, curve = 1, value = .5, prev = value, size = 1, color = my.color1, showLabel = true, showValue = true, bipolar = false, radioOptions = "", orientation = 'vertical') {
    this.type = type; // str: type of element
    this.label = label; // str: name and unique ID

    this.mapto = mapto; // str: variable it is controlling

    if (typeof callback === "function") {
      this.callback = callback; // function
    } else {
      //this.callback = callback(x); // function
    }

    this.x = x; // #: pos
    this.y = y; // #: pos
    this.min = min; // #: units of what its mapped to
    this.max = max; // #; units of what its mapped to
    this.curve = curve; // #; units of what its mapped to
    this.value = value; // #: current value
    this.prev = -987654321; // #:cprevious value
    this.size = size; // #
    this.color = color; // p5 color() object
    this.showLabel = showLabel; // bool
    this.showValue = showValue; // bool
    if(this.color == undefined){
      console.log('no color')
      this.color = my.color1
      console.log(this.color, my.color1)
    }

    this.bipolar = bipolar; // bool
    this.radioOptions = radioOptions; // array
    this.orientation = orientation; // bool: for slider or radio buttons

    this.position = function (x, y) {
      this.x = (x);
      this.y = (y);
      //my.redrawGUI();
    }
  }

  my.addElement = function (type, label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation) {
    let update = false;

    if (label == undefined) {
      console.error("label parameter is undefined")
    } else {
      if (update == false) {
        if (x == undefined) { x = x0 + (my.elements.length % 5) * 20; }
        if (y == undefined) { y = y0; }
        my.elements.push(new UserElement(type, label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation));
      }
      //my.redrawGUI();
      //console.log('color', color)
      return my.elements[my.elements.length - 1];
    }
  }//addElement

  my.Knob = function ({ label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation }) {
    return my.addElement("knob", label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation);
  }
  my.Dial = function ({ label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation }) {
    return my.addElement("knob", label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation);
  }
  my.Slider = function ({ label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation }) {
    return my.addElement("slider", label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation);
  }
  my.Fader = function ({ label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation }) {
    return my.addElement("slider", label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation);
  }
  my.Toggle = function ({ label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation }) {
    if (value == undefined) { value = 0; }
    return my.addElement("toggle", label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation);
  }
  my.Momentary = function ({ label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation }) {
    if (value == undefined) { value = 0; }
    return my.addElement("momentary", label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation);
  }
  my.Button = function ({ label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation }) {
    if (value == undefined) { value = 0; }
    return my.addElement("momentary", label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation);
  }
  my.RadioButtons = function ({ label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation }) {
    if (value == undefined) { value = 1; }
    return my.addElement("radio", label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation);
  }
  my.RadioButton = function ({ label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation }) {
    if (value == undefined) { value = 1; }
    return my.addElement("radio", label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation);
  }
  my.Radio = function ({ label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation }) {
    if (value == undefined) { value = 1; }
    return my.addElement("radio", label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation);
  }
  my.Text = function ({ label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation }) {
    return my.addElement("text", label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation);
  }

  //******** Element Helper Functions ********//
  my.removeElement = function (label) {
    for (let i = 0; i < my.elements.length; i++) {
      if (my.elements[i].label == label) {
        my.elements.splice(i, 1);
      }
    }
    my.redrawGUI();
  }//removeElement

  my.removeElements = function () {
    my.elements = []
    my.redrawGUI();
  }//removeElements

  // NOT FULLY WORKING !!!
  my.elementGrid = function (type, xcount, ycount) {
    let x0 = 50;
    let y0 = 50;
    for (let i = 0; i < xcount; i++) {
      for (let j = 0; j < ycount; j++) {
        let label = "grid" + my.elements.length + "_" + (i * j + j);
        let value = Math.random() * 2
        my.addElement({ x: x0 + i * 24, y: y0 + j * 24, type: type, label: label, mapto: "fakevar", min: 0, max: 2, value: value, size: .3, showLabel: false, showValue: false })

      }
    }
    // eval(my.elements[i].mapto + '.rampTo(my.elements[i].value, 0.1)');
    // eval(my.elements[i].mapto + '.rampTo(my.elements[i].value, 0.1)');
  }
  my.scaleX = function (val) {
    val = Math.min((Math.max(0, val)), 100);
    return (val / 100) * x_size;
  }
  my.scaleY = function (val) {
    val = Math.min((Math.max(0, val)), 100);
    return (val / 100) * y_size;
  }

  //******** Preset Manager ********//
  my.storedPresets = {}
  my.savePreset = function(name){
    my.storedPresets[name] = my.elements.reduce((accumulator, currentElement, index) => {
      accumulator[currentElement.label] = {
        value: currentElement.value,
        index: index
      };
      return accumulator;
    }, {});
    console.log('stored preset ', name)
  }//createPreset

  my.recallPreset = function(name){
    if(my.storedPresets[name] == undefined) return;

    for (const [label, data] of Object.entries(my.storedPresets[name])) {
      my.elements[data.index].value = data.value ;
    } 
  }//recallPreset

  my.presetButtons = {}
  my.activePreset = 0

  my.presetButtons = function(num){
    let savePresetButton = my.Button({
      label:'S',
      size:.25, x:5, y:93,
      color: new guiColor(my.color(255, 255, 0)),
      callback: function(x){my.savePreset(my.activePreset)}
    })
    for(let i=0;i<num;i++){
      my.Button({
        label:i.toString(),
        size:.25, x:15+i*10, y:93,
        callback: function(x){
          my.recallPreset(i)
           my.activePreset = i
         }
      })
    }
  }

  //******** LINES ********//
  let lineNumber = 0
  my.line2 = function (x1, y1, x2, y2, stroke = 1, color, label = null) {
    x1 = (x1)
    x2 = (x2)
    y1 = (y1)
    y2 = (y2)
    //my.line(x1,y1,x2,y2)
    if (color == undefined) {
      color = my.color2;
    }
    //lines.push([x1,y1,x2,y2,stroke,color])

    let type = 'line'
    if (label == null) label = 'line' + lineNumber
    lineNumber += 1
    let mapto = 'mapto'
    let x = [x1, x2]
    let y = [y1, y2]
    let min = 0
    let max = 0
    let size = stroke

    my.elements.push(new UserElement(type, label, 'mapto', x, y, 0, 0, 0, 0, size, 0, 0, 0, 0, 0));
    my.redrawGUI()
    return my.elements[my.elements.length - 1];
  } //line2
  my.lineX = function (x, color) {
    x = (x)
    my.line(x, 0, x, y_size)
    if (color === undefined) {
      color = my.color2;
    }
    my.lines.push([x, 0, x, y_size, color])
    my.redrawGUI()
  }
  my.lineY = function (y, color) {
    y = (y)
    my.line(0, y, x_size, y)
    if (color == undefined) {
      color = my.color2;
    }
    my.lines.push([0, y, x_size, y, color])
    my.redrawGUI()
  }
  my.drawLine = function (i) {
    // SET COLOR
    let currentColor;
    try {
      currentColor = my.elements[i].color.val;
    } catch (error) {
      currentColor = my.elements[i].color;
    }
    my.stroke(currentColor)
    my.strokeWeight(my.elements[i].size)
    let curX = my.scaleX(my.elements[i].x)
    let curY = my.scaleY(my.elements[i].y)
    my.line(my.elements[i].x[0], my.elements[i].y[0], my.elements[i].x[1], my.elements[i].y[1])
  }

  //******** USER CUSTOMIZATION ********//
  my.sensitivity = function (masterSensitivity = 1) {
    // 1 is default, <1 makes it less sensitive, >1 more sensitive
    sliderSensitivity = .008 * masterSensitivity;
    sensitivityScale = .006 * masterSensitivity;
  }
  let guiColor = function (val) {
    // color Object so it can be referenced and then update on all elements
    this.val = val;
  }
  my.setColor1 = function (r, g, b, a) {
    if (g == undefined) {
      my.color1.val = my.color(r);
    }
    else if (a == undefined) {
      my.color1.val = my.color(r, g, b);
    } else {
      my.color1.val = my.color(r, g, b, a);
    }
    my.redrawGUI();
  }
  my.setColor2 = function (r, g, b, a) {
    if (g == undefined) {
      my.color2 = my.color(r);
    }
    else if (a == undefined) {
      my.color2 = my.color(r, g, b);
    } else {
      my.color2 = my.color(r, g, b, a);
    }
    my.redrawGUI();
  }
  my.setBackgroundColor = function (r, g, b, a) {
    if (g == undefined) {
      my.color3 = my.color(r);
    }
    else if (a == undefined) {
      my.color3 = my.color(r, g, b);
    } else {
      my.color3 = my.color(r, g, b, a);
    }
    my.redrawGUI();
  }
  my.setTextColor = function (r, g, b, a) {
    if (g == undefined) {
      my.color4 = my.color(r);
    }
    else if (a == undefined) {
      my.color4 = my.color(r, g, b);
    } else {
      my.color4 = my.color(r, g, b, a);
    }
    my.redrawGUI();
  }

  //******** OTHER ********//
  const scaleOutput = function (input, inLow, inHigh, outLow, outHigh, curve) {
    if (curve === undefined) curve = 1;
    let val = (input - inLow) * (1 / (inHigh - inLow));
    val = Math.pow(val, curve);
    return val * (outHigh - outLow) + outLow;
  }
} // END OF GUI p5 INSTANCE

window.gui = new p5(gui_sketch)