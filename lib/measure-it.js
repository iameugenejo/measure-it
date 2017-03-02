class MeasureIt {
  constructor(name) {
    this.name = name;
    this.measurements = {};
  }

  _start_one(seg) {
    this.measurements[seg] = {
      started_at: Date.now(),
      ended_at: []
    };
  }

  start(section='') {
    this._start_one(section);
    for(let i = 1;i < arguments.length;i++) {
      this._start_one(arguments[i]);
    }

    return this;
  }

  _stop_one(seg) {
    let measurement = this.measurements[seg];
    if(measurement) {
      measurement.ended_at.push(Date.now());
    }
  }

  stop(section='') {
    this._stop_one(section);
    for(let i = 1;i < arguments.length;i++) {
      this._stop_one(arguments[i]);
    }

    return this;
  }

  get(section='', array=false) {
    let measurement = this.measurements[section];
    if(measurement) {
      if(measurement.ended_at.length) {
        let result = measurement.ended_at.map((ended_at) => {
          return ended_at - measurement.started_at;
        });

        return array ? result : (result.length > 1 ? result : result[0]);
      } else {
        let result = Date.now() - measurement.started_at;
        return array ? [result] : result;
      }
    } else {
      return array ? [] : undefined;
    }
  }

  exceeds(threshold) {
    let total = 0;
    for(let seg in this.measurements) {
      total += this.get(seg, true).reduce((a, b) => {
        return a > b ? a : b;
      });

      if(total > threshold) return true;
    }

    return false;
  }

  serialize() {
    let serialized = [];
    for(let seg in this.measurements) {
      let measurement = this.measurements[seg];
      let value = this.get(seg, true).join(', ');
      if(seg === '') {
        serialized.push(value);
      } else {
        serialized.push(`${seg}: ${value}`);
      }
    }

    return `<${this.name}> ${serialized.join(', ')}`;
  }
}

module.exports = function measureOf(name) {
  return new MeasureIt(name);
};
