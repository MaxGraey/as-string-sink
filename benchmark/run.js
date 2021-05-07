const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

function benchStringAccumJS(len) {
  let res = '';
  for (let i = 0; i < len; i++) {
    res += i & 1 ? "foo|" : "|boo";
  }
  return res.length;
}

function runBench(fn, len, name) {
  // warmup
  for (let i = 0; i < 100; i++) {
    fn(100);
  }

  let dt = 0;
  dt = performance.now();
  fn(len);
  dt = performance.now() - dt;
  console.log(`${name}: ${dt < 1 ? dt.toPrecision(2) : dt.toFixed(2)} ms`);
}

WebAssembly.instantiate(fs.readFileSync(path.join(__dirname, "build/optimized.wasm")), {
  env: {
    abort(_msg, _file, line, column) {
      console.error("abort called at benchmark/index.ts:" + line + ":" + column);
    }
  },
})
.then(result => {
  const { benchStringAccum, benchStringSinkAccum } = result.instance.exports;

  console.log('100 strings:');
  console.log('------------');
  runBench(benchStringAccumJS, 100, "String += JS");
  runBench(benchStringAccum, 100, "String += AS");
  runBench(benchStringSinkAccum, 100, "StringSink AS");

  console.log('\n50,000 strings:');
  console.log('---------------');
  runBench(benchStringAccumJS, 50_000, "String += JS");
  runBench(benchStringAccum, 50_000, "String += AS");
  runBench(benchStringSinkAccum, 50_000, "StringSink AS");

  console.log('\n200,000 strings:');
  console.log('----------------');
  runBench(benchStringAccumJS, 200_000, "String += JS");
  runBench(benchStringAccum, 200_000, "String += AS");
  runBench(benchStringSinkAccum, 200_000, "StringSink AS");
})
.catch(console.error);
