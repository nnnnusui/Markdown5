type Some<T> = readonly T[] & { isDefined: true };
type None<T> = readonly T[] & { isDefined: false };
const some = <T>(it: T): Some<T> => ({ ...[it], isDefined: true } as const);
const none = <T>(): None<T> => ({ ...[], isDefined: false } as const);

type Self<T> = Some<T> | None<T>;
type Props<T> = {
  get: T;
  getOrNull: T | null;
  getOrElse: (or: T) => T;
};

const props = <T>(self: Self<T>): Props<T> => {
  const getOrNull = self.isDefined ? self[0] : null;
  return {
    get: self[0],
    getOrNull,
    getOrElse: (or: T) => getOrNull || or,
  };
};
const applyProps = <T>(result: Self<T>) => ({ ...result, ...props(result) });

type Option<T> = (Some<T> | None<T>) & Props<T>;
type OptionBuilder<T> = {
  some: (it: T) => Option<T>;
  none: Option<T>;
};
const OptionBuilder = <T>(): OptionBuilder<T> => {
  return {
    some: (it: T) => applyProps(some(it)),
    none: applyProps(none()),
  };
};

const Option = OptionBuilder;
export default Option;
