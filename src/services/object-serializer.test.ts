import { ObjectSerializer } from './object-serializer';

describe('ObjectSerializer', () => {
  describe('serialize', () => {
    it('should serialize the object correctly', () => {
      const obj = {
        id: 1,
        name: 'John',
        age: 30,
      };
      const serializer = new ObjectSerializer<typeof obj, any>(obj);
      serializer.attributes = ['id', 'name', 'age'];

      const serialized = serializer.serialize();

      expect(serialized).toStrictEqual(obj);
    });

    it('should handle attribute handlers correctly', () => {
      const obj = {
        id: 1,
        name: 'John',
        age: 30,
      };
      const serializer = new ObjectSerializer<typeof obj, any>(obj);
      serializer.attributes = ['id', 'name', 'age'];
      serializer.handlers = {
        name: () => 'TestName',
      };

      const serialized = serializer.serialize();

      expect(serialized).toStrictEqual({ id: 1, name: 'TestName', age: 30 });
    });

    it('should handle missing handlers correctly', () => {
      const obj = {
        id: 1,
        name: 'John',
        age: 30,
      };
      const serializer = new ObjectSerializer<typeof obj, any>(obj);
      serializer.attributes = ['id', 'name', 'age'];
      serializer.handlers = {
      };

      const serialized = serializer.serialize();

      expect(serialized).toStrictEqual(obj);
    });

    it('should handle missing attributes correctly', () => {
      const obj = {
        id: 1,
        name: 'John',
        age: 30,
      };
      const serializer = new ObjectSerializer<typeof obj, any>(obj);
      serializer.attributes = ['id', 'name']; // 'age' attribute is missing

      const serialized = serializer.serialize();

      expect(serialized).toStrictEqual({ id: 1, name: 'John' });
    });
  });
});
