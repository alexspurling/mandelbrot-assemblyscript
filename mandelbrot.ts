
export function run(cx: f64, cy: f64, diameter: f64, thread: i32): void {

  let loc: i32 = 0;

  // let maxIterations: u32 = u32(Math.floor(50 + Math.pow(Math.log10(2 / diameter), 4)));

  // 50+log10(((4/abs(diff(xlims)))))^5

  while (loc < (1200 * 800)) {
    loc = atomic.add<i32>(0, 1);

    let x = loc % 1200;
    let y = loc / 1200;

    let offset = offsetFromCoordinate(x, y);
    let numIterations = executeStep(cx, cy, x, y, diameter);

    // numIterations = thread; // uncomment to colour each pixel by the thread id

    if (numIterations == 1000) {
      store<i32>(offset, 0xFF000000);
    } else {
      store<u8>(offset + 0, colour(numIterations, 0,   4));
      store<u8>(offset + 1, colour(numIterations, 128, 4));
      store<u8>(offset + 2, colour(numIterations, 356, 4));
      store<u8>(offset + 3, 255);
    }
  }
}


@inline
function colour(iteration: u32, offset: i32, scale: i32): u8 {
  iteration = (iteration * scale + offset) & 1023;
  if (iteration < 256) {
    return iteration as u8;
  } else if (iteration < 512) {
    return 255 - ((iteration as u8) - 255);
  }
  return 0;
}

const WIDTH:  i32 = 1200;
const HEIGHT: i32 = 800;

@inline
function scale(domainStart: f64, domainLength: f64, screenLength: f64, step: f64): f64 {
  return domainStart + domainLength * ((step - screenLength) / screenLength);
}

function executeStep(cx: f64, cy: f64, x: i32, y: i32, diameter: f64): i32 {
  let verticalDiameter = diameter * HEIGHT / WIDTH;
  let rx = scale(cx, diameter, WIDTH, x);
  let ry = scale(cy, verticalDiameter, HEIGHT, y);
  return iterateEquation(rx, ry, 1000);
}

function offsetFromCoordinate(x: i32, y: i32): i32 {
  return 4 + 4800 * y + 4 * x;
}

function iterateEquation(x0: f64, y0: f64, maxiterations: u32): u32 {
  let a = 0.0, b = 0.0, rx = 0.0, ry = 0.0, ab: f64;
  let iterations: u32 = 0;
  while (iterations < maxiterations && (rx * rx + ry * ry <= 4)) {
    rx = a * a - b * b + x0;
    ab = a * b;
    ry = ab + ab + y0;
    a = rx;
    b = ry;
    iterations++;
  }
  return iterations;
}
