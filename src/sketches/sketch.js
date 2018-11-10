export default function sketch(p) {
  let windowSize = 600;
  p.setup = function() {
    p.createCanvas(windowSize, windowSize);
  };

  p.customRedrawHandler = function(values) {};

  p.draw = function() {
    p.background(127);
  };
}
