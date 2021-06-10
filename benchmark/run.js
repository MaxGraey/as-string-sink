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
  for (let i = 0; i < 150; i++) {
    fn(100);
  }

  let dt = 0;
  dt = performance.now();
  fn(len);
  dt = performance.now() - dt;
  console.log(`${name}: ${dt < 1 ? dt.toPrecision(2) : dt.toFixed(2)} ms`);
}

WebAssembly.instantiate(fs.readFileSync(path.join(__dirname, "build/bench.wasm")), {
  env: {
    abort(_msg, _file, line, column) {
      console.error("abort called at benchmark/index.ts:" + line + ":" + column);
    }
  },
})
.then(result => {
  const { benchStringAccum, benchStringSinkAccum,benchStringSinkAccumSplit, benchStringSinkAccumUnsafe, benchStringSinkAccumUnsafe2 } = result.instance.exports;

  const s0 = `benchStringAccum: String += JS`;
  const s1 = `benchStringAccum: String += AS`;
  const s2 = `benchStringSinkAccum: StringSink AS`;
  const s3 = `benchStringSinkAccumSplit: StringSink AS`;
  const s4 = `benchStringSinkAccumUnsafe: StringSink AS Unsafe`;
  const s5 = `benchStringSinkAccumUnsafe2: StringSink AS Unsafe`;

  console.log('100 strings:');
  console.log('------------');
  runBench(benchStringAccumJS, 100, s0);
  runBench(benchStringAccum, 100, s1);
  runBench(benchStringSinkAccum, 100, s2);
  runBench(benchStringSinkAccumSplit, 100, s3);
  runBench(benchStringSinkAccumUnsafe, 100, s4);
  runBench(benchStringSinkAccumUnsafe2, 100, s5);

  console.log('\n50,000 strings:');
  console.log('---------------');
  runBench(benchStringAccumJS, 50_000, s0);
  runBench(benchStringAccum, 50_000, s1);
  runBench(benchStringSinkAccum, 50_000, s2);
  runBench(benchStringSinkAccumSplit, 50_000, s3);
  runBench(benchStringSinkAccumUnsafe, 50_000, s4);
  runBench(benchStringSinkAccumUnsafe2, 50_000, s5);

  console.log('\n200,000 strings:');
  console.log('----------------');
  runBench(benchStringAccumJS, 200_000, s0);
  runBench(benchStringAccum, 200_000, s1);
  runBench(benchStringSinkAccum, 200_000, s2);
  runBench(benchStringSinkAccumSplit, 200_000, s3);
  runBench(benchStringSinkAccumUnsafe, 200_000, s4);
  runBench(benchStringSinkAccumUnsafe2, 200_000, s5);
})
.catch(console.error);
