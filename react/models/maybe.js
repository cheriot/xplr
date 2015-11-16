import _ from 'lodash';

export function maybe(obj, ...properties) {
  return _.reduce(properties, (val, property) => val ? val[property] : undefined, obj);
}
