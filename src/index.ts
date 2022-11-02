import jp from 'jsonpath';

type MaybePromise<T> = Promise<T> | T;

type MapOptions = {
  /**
   * A valid jsonpath string (see https://github.com/dchester/jsonpath#jsonpath-syntax for reference)
   */
  from: string;

  /**
   * A valid jsonpath string (see https://github.com/dchester/jsonpath#jsonpath-syntax for reference)
   */
  to: string;

  /**
   * An optional handler to run additional logic
   * @param value the value of `from`
   * @param source the full source object
   * @returns possibly a promise returning the value to set on `to`
   */
  handler?: (value: any, source?: object) => MaybePromise<any>;

  /**
   * An optional function
   * @returns `true` if value should be set or `false` if value shouldn't be set
   */
  if?: (value: any) => boolean;
};

export class DataMapper {
  private _mappers: MapOptions[] = [];

  public map(options: MapOptions | MapOptions[]): DataMapper {
    options = Array.isArray(options) ? options : [options];
    this._mappers.push(...options);
    return this;
  }

  public async process(source: object): Promise<object> {
    const result: object = {};

    for (const mapper of this._mappers) {
      let resolve = mapper.handler;

      if (!resolve) resolve = val => val;

      const input = jp.value(source, mapper.from);

      const value = await resolve(input, source);

      if (mapper.if) {
        if (!mapper.if(value)) continue;
      }

      jp.value(result, mapper.to, value);
    }

    return result;
  }
}
