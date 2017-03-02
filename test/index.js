const chai = require('chai');
const expect = chai.expect;
const measureOf = require('../lib/measure-it');

describe('MeasureIt', () => {
	it('measures one', () => {
    let measure = measureOf('test').start();
    for(let i = 0;i < 100000;i++) {}
    measure.stop();
    expect(measure.serialize()).to.matches(/^<test> [0-9]+$/);
	});

  it('measures with section name', () => {
    let measure = measureOf('test').start('a');
    for(let i = 0;i < 1000000;i++) {}
    measure.stop('a');
    expect(measure.serialize()).to.matches(/^<test> a: [0-9]+$/);
	});

  it('measures multiple', () => {
    let measure = measureOf('test').start('a', 'b', 'c');
    for(let i = 0;i < 1000000;i++) {}
    measure.stop('a');
    for(let i = 0;i < 1000000;i++) {}
    measure.stop('b');
    for(let i = 0;i < 1000000;i++) {}
    measure.stop('c');
    expect(measure.serialize()).to.matches(/^<test> a: [0-9]+, b: [0-9]+, c: [0-9]+$/);
	});

  it('measures multiple within a same section', () => {
    let measure = measureOf('test');

    measure.start('a');
    
    measure.stop('a');
    for(let i = 0;i < 1000000;i++) {}
    measure.stop('a');

    measure.start('b');
    
    measure.stop('b');
    for(let i = 0;i < 1000000;i++) {}
    measure.stop('b');

    expect(measure.serialize()).to.matches(/^<test> a: [0-9]+, [0-9]+, b: [0-9]+, [0-9]+$/);
	});

  it('ignores not started', () => {
    let measure = measureOf('test');

    measure.stop('a');
    
    expect(measure.get('a')).to.be.undefined;
	});

  it('serializes without stopping', () => {
    let measure = measureOf('test').start('a');
    
    expect(measure.get('a')).to.not.be.undefined;
	});

	it('measures asynchronously', (done) => {
    let measure = measureOf('test').start();

    setTimeout(() => {
      measure.stop();
      expect(measure.serialize()).to.matches(/^<test> [0-9]+$/);
      done();
    });
	});

  it('checks threshold', (done) => {
    let measure = measureOf('test').start();
    
    expect(measure.exceeds(1)).to.be.false;

    setTimeout(() => {
      expect(measure.exceeds(1)).to.be.true;

      done();
    }, 2);
  });
});
