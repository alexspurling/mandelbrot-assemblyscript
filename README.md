# Multithreaded AssemblyScript Mandelbrot

An example of how to use WebWorkers and shared memory to render the mandelbrot fractal in AssemblyScript.

![screenshot](fractal.png)

View a live demo here: https://alexspurling.github.io/mandelbrot-assemblyscript/

To compile locally, run:

```
npm install -g assemblyscript
asc mandelbrot.ts --enable threads --importMemory --initialMemory 80 --maximumMemory 80 --sharedMemory -o mandelbrot.wasm
```

### Sources

This code is an adaptation of the single threaded AssemblyScript code and multithreaded WebAssembly by Colin Eberhardt:

https://github.com/ColinEberhardt/wasm-mandelbrot/tree/master/assemblyscript

https://blog.scottlogic.com/2019/07/15/multithreaded-webassembly.html

https://github.com/ColinEberhardt/mandelbrot-threaded-webassembly

I created this project as a reference for an AssemblyScript program that runs on multiple threads. I also used this as the basis for the Onyx version of the same program:

https://github.com/alexspurling/mandelbrot-onyx


### Note about Cross-Origin headers

Because this code relies on SharedArrayBuffers, certain headers must be set in order for your browser to allow them to be used.

When running locally, I use VSCode's Live Preview extension with the following custom config:

```
"livePreview.httpHeaders": {
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp"
},
```

When running on github.io, I use this hack: https://github.com/gzuidhof/coi-serviceworker

More info here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer#security_requirements

