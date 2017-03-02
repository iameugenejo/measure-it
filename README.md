measure-it
==========
[![NPM version](https://badge.fury.io/js/measure-it.svg)](https://badge.fury.io/js/measure-it)
[![NPM downloads](https://img.shields.io/npm/dm/measure-it.svg?style=flat)](https://www.npmjs.org/package/measure-it)
[![Build Status](https://travis-ci.org/iameugenejo/measure-it.svg?branch=master)](https://travis-ci.org/iameugenejo/measure-it)

Measure performance of code blocks

### Install
``` bash
npm install measure-it --save
```

### Usage
#### Measure One

``` javascript
const measureOf = require('measure-it');

let measure = measureOf('Awesome Code').start();

awesomeCode();

console.log(measure.get());
// 10

console.log(measure.serialize());
// <Awesome Code> 10
```

#### Measure Multiple Groups
``` javascript
const measureOf = require('measure-it');

let measure = measureOf('Awesome Code');

measure.start('block 1');

awesomeCode();

measure.stop('block 1').start('block 2');

awesomeCode();

measure.stop('block 2');

console.log(measure.get('block 1'));
// 11
console.log(measure.get('block 2'));
// 12

console.log(measure.serialize());
// <Awesome Code> block 1: 11, block 2: 12
```


#### Measure Asynchronous Code Blocks
``` javascript
const measureOf = require('measure-it');

let measure = measureOf('Awesome Code');

measure.start('block 1');

setTimeout(() => {
  measure.stop('block 1').start('block 2');
  console.log(measure.get('block 1'));
  // 1000

  setTimeout(() => {
    measure.stop('block 2');
    console.log(measure.get('block 2'));
    // 1000

    console.log(measure.serialize());
    // <Awesome Code> block 1: 1000, block 2: 1000
  }, 1000);
}, 1000);
```

#### Start / Stop Multiple Groups At Once
``` javascript
const measureOf = require('measure-it');

let measure = measureOf('Awesome Code').start('block 1', 'block 2', 'block 3');

awesomeCode();

measure.stop('block 1');

awesomeCode();

measure.stop('block 2', 'block 3');

console.log(measure.get('block 1'));
// 10
console.log(measure.get('block 2'));
// 20
console.log(measure.get('block 3'));
// 20

console.log(measure.serialize());
// <Awesome Code> block 1: 10, block 2: 20, block 3: 20
```

#### Measure Progression
``` javascript
const measureOf = require('measure-it');

let measure = measureOf('Awesome Code').start();

awesomeCode();

measure.stop();

awesomeCode();

measure.stop();

console.log(measure.get());
// [10, 20]

console.log(measure.serialize());
// <Awesome Code> 10, 20
```
