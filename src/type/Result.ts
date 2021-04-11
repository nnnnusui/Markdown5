type Result<Err, Ok> = { ok: false; get: Err } | { ok: true; get: Ok };
export const ok = <Err, Ok>(value: Ok): Result<Err, Ok> => ({
  ok: true,
  get: value,
});
export const err = <Err, Ok>(value: Err): Result<Err, Ok> => ({
  ok: false,
  get: value,
});

// eslint-disable-next-line @typescript-eslint/naming-convention
const Result = {
  ok,
  err,
};
export default Result;
