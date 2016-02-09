import {first, rest, reduce} from 'lodash';

export function promiseInSequence(array, func) {
  const head = first(array);
  const remaining = rest(array);
  const promise = Promise.resolve(null).then(() => func(head));

  return reduce(
    remaining,
    (p, element) => p.then(() => func(element)),
    promise
  );
}
