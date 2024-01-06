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
      let ret = instance.exports.run(x, y, d, id);
      postMessage("done");
    });
};
