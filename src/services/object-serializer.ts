export class ObjectSerializer<Payload, Result> {
  attributes: (keyof Result)[];
  handlers: any;
  obj: Payload;

  constructor(obj: Payload) {
    this.obj = obj;
  }

  public serialize(): Result {
    const serialized: any = {};

    this.attributes.forEach((property) => {
      serialized[property] =
        this.handlers[property]?.call(this) ??
        this.obj[property as unknown as keyof Payload];
    });

    return serialized as Result;
  }
}
