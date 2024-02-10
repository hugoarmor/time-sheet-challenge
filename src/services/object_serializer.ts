export class ObjectSerializer<T> {
  attributes: string[];
  obj: any;

  constructor(obj: any) {
    this.obj = obj;
  }

  public serialize(): T {
    const serialized: any = {};

    this.attributes.forEach((property) => {
      serialized[property] =
        this[property as keyof ObjectSerializer<T>]?.call() ??
        this.obj[property];
    });

    return serialized as T;
  }
}
