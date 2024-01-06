function offsetFromCoordinate(x: i32, y: i32): i32 {
  return 4 + 4800 * y + 4 * x;
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

// This was reverse engineered from the webassembly code shown in this blog post:anyref
// https://blog.scottlogic.com/2019/07/15/multithreaded-webassembly.html
// I am not sure exactly how it works
function colour(iters: i32): i32 {
  let b: i32 = iters << 2 & 1023;
  if (b >= 256 && b < 512) {
    b = 510 - b;
  } else if (b >= 512) {
    b = 0;
  }
  let c: i32 = b;
  b = (iters << 2) + 128 & 1023;
  if (b >= 256 && b < 512) {
    b = 510 - b;
  } else if (b >= 512) {
    b = 0;
  }
  b = b << 8 | c;
  let a = (iters << 2) + 356 & 1023;
  if (a >= 256 && a < 512) {
    a = 510 - a;
  } else if (a >= 512) {
    a = 0;
  }
  return (a << 16 | b) | -16777216;
}

export function run(cx: f64, cy: f64, diameter: f64, thread: i32): i32 {

  let loc: i32 = 0;

  while (loc < (1200 * 800)) {
    // loc = atomic.add<i32>(0, 1);
    loc += 1;

    let x = loc % 1200;
    let y = loc / 1200;

    let offset = offsetFromCoordinate(x, y);
    let numIterations = executeStep(cx, cy, x, y, diameter);
    
    // unchecked(data[idx + 0] = outside ? 0 : colour(iterations, 0,   4));
    // unchecked(data[idx + 1] = outside ? 0 : colour(iterations, 128, 4));
    // unchecked(data[idx + 2] = outside ? 0 : colour(iterations, 356, 4));
    // unchecked(data[idx + 3] = 255);

    // if (numIterations == 10000) {
    //   store<i32>(offset, 0xFF000000);
    // } else {
    store<i32>(offset, colour(numIterations));
    // }
  }

  return loc;
}
// @inline
// function colour(iteration: u32, offset: i32, scale: i32): u8 {
//   iteration = (iteration * scale + offset) & 1023;
//   if (iteration < 256) {
//     return iteration as u8;
//   } else if (iteration < 512) {
//     return 255 - ((iteration as u8) - 255);
//   }
//   return 0;
// }

// // This was reverse engineered from the webassembly code shown in this blog post:anyref
// // https://blog.scottlogic.com/2019/07/15/multithreaded-webassembly.html
// // I am not sure exactly how it works
// export function colour2(iters: i32): i32 {
//   let b: i32 = iters << 2 & 1023;
//   if (b >= 256 && b < 512) {
//     b = 510 - b;
//   } else if (b >= 512) {
//     b = 0;
//   }
//   let c: i32 = b;
//   b = (iters << 2) + 128 & 1023;
//   if (b >= 256 && b < 512) {
//     b = 510 - b;
//   } else if (b >= 512) {
//     b = 0;
//   }
//   b = b << 8 | c;
//   let a = (iters << 2) + 356 & 1023;
//   if (a >= 256 && a < 512) {
//     a = 510 - a;
//   } else if (a >= 512) {
//     a = 0;
//   }
//   return (a << 16 | b) | -16777216;
// }
