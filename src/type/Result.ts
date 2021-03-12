type Ok<T> = readonly T[] & { ok: true };
type Err<T> = readonly T[] & { ok: false };
const ok = <T>(it: T): Ok<T> => ({ ...[it], ok: true } as const);
const err = <T>(it: T): Err<T> => ({ ...[it], ok: false } as const);

type Self<O, E> = Ok<O> | Err<E>;
type Props<O, E> = {
  get: O | E;
  getOrNull: O | null;
  getOrElse: (or: O) => O;
  getOrThrow: () => O;
  use: <Return>(onOk: (it: O) => Return, onErr: (it: E) => Return) => Return;
};

const props = <O, E>(self: Self<O, E>): Props<O, E> => {
  const getOrNull = self.ok ? self[0] : null;
  return {
    get: self[0],
    getOrNull,
    getOrElse: (or: O) => getOrNull || or,
    getOrThrow: () => {
      if (self.ok) return self[0];
      throw new Error(`${self[0]}`);
    },
    use: (onOk, onErr) => (self.ok ? onOk(self[0]) : onErr(self[0])),
  };
};
const applyProps = <O, E>(result: Self<O, E>) => ({
  ...result,
  ...props(result),
});

type Result<O, E> = (Ok<O> | Err<E>) & Props<O, E>;
type ResultBuilder<O, E> = {
  ok: (it: O) => Result<O, E>;
  err: (it: E) => Result<O, E>;
};
const ResultBuilder = <O, E>(): ResultBuilder<O, E> => {
  return {
    ok: (it: O) => applyProps<O, E>(ok(it)),
    err: (it: E) => applyProps<O, E>(err(it)),
  };
};

const Result = ResultBuilder;
export default Result;
