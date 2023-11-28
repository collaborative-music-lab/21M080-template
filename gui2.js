import "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.js"

const gui_sketch = function (my) {

  let x_size = 400
  let y_size = 400

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



  my.setup = function () {
    my.createCanvas(my.windowWidth, my.windowHeight);
  }//setup

  //******** my.draw() AND my.redrawGUI() ********//
  my.draw = function () { // only updates values of elements and if they change it calls redrawGUI()
    console.log('draw')
    my.background(0)

  }// draw

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

    this.bipolar = bipolar; // bool
    this.radioOptions = radioOptions; // array
    this.orientation = orientation; // bool: for slider or radio buttons

    this.position = function (x, y) {
      this.x = (x);
      this.y = (y);
      //my.redrawGUI();
    }
  }

  my.onSuccess = function(){ console.log('foo')}

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
      my.onSuccess();
      //console.log('color', color)
      return my.elements[my.elements.length - 1];
    }
  }//addElement

  my.Knob = function ({ label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation }) {
    return my.addElement("knob", label, mapto, callback, x, y, min, max, curve, value, prev, size, color, showLabel, showValue, bipolar, radioOptions, orientation);
  }

} // END OF GUI p5 INSTANCE

export default gui_sketch;