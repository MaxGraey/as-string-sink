const fs = require('fs');
const path = require('path');
const {
  performance
} = require('perf_hooks');

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
    const {
      benchStringAccum,
      benchStringSinkAccum,
      benchStringSinkAccum2,
      benchStringSinkAccumSplit,
      benchStringSinkAccumUnsafe,
      benchStringSinkAccumUnsafe2
    } = result.instance.exports;

    const tests = [{
        func: benchStringAccumJS,
        info: `benchStringAccumJS: String += JS`
      },
      {
        func: benchStringAccum,
        info: `benchStringAccum: String += AS`
      },
      {
        func: benchStringSinkAccum,
        info: `benchStringSinkAccum: StringSink AS`
      },
      {
        func: benchStringSinkAccum2,
        info: `benchStringSinkAccum2: StringSink AS`
      },
      {
        func: benchStringSinkAccumSplit,
        info: `benchStringSinkAccumSplit: StringSink AS`
      },
      {
        func: benchStringSinkAccumUnsafe,
        info: `benchStringSinkAccumUnsafe: tringSink AS Unsafe`
      },
      {
        func: benchStringSinkAccumUnsafe2,
        info: `benchStringSinkAccumUnsafe2: tringSink AS Unsafe`
      },
    ]

    console.log('100 strings:');
    const sep = '---------------';
    console.log(sep);
    for (const test of tests) {
      runBench(test.func, 100, test.info);
    }

    console.log('\n50,000 strings:');
    console.log(sep);
    for (const test of tests) {
      runBench(test.func, 50000, test.info);
    }

    console.log('\n200,000 strings:');
    console.log(sep);
    for (const test of tests) {
      runBench(test.func, 200000, test.info);
    }
  })
  .catch(console.error);
