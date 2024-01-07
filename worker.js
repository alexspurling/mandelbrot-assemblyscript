onmessage = ({ data }) => {
  const {
    memory,
    config: { x, y, d },
    id
  } = data;

  fetch("mandelbrot.wasm")
    .then(response => response.arrayBuffer())
    .then(bytes =>
      WebAssembly.instantiate(bytes, {
        env: {
          memory
        },
        mandelbrot: {
          consoleLog(n) {
            console.log(n);
          }
        }
      })
    )
    .then(({ instance }) => {
      console.log("starting", id);
      const startTime = performance.now();
      let count = instance.exports.run(x, y, d, id);
      const timeTaken = performance.now() - startTime;
      console.log("Thread", id, "processed", count, "pixels in", timeTaken, "ms");
      postMessage("done");
    });
};
