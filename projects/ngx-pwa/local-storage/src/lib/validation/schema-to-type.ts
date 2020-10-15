import { JSONSchema } from './json-schema';

type SchemaToType<Schema extends JSONSchema> =
  Schema extends { type: 'string' } ? string :
  Schema extends { type: 'number' } ? number :
  Schema extends { type: 'integer' } ? number :
  Schema extends { type: 'boolean' } ? boolean :
  Schema extends { type: 'array', items: infer ArrayType } ? (ArrayType extends JSONSchema ? SchemaToType<ArrayType> : unknown)[] :
  Schema extends { type: 'object', properties: infer ObjectType } ?
    { [Key in keyof ObjectType]: ObjectType[Key] extends JSONSchema ? SchemaToType<ObjectType[Key]> : never  } :
  unknown;

function test<T extends JSONSchema>(schema: T): SchemaToType<T> | void {
  if (schema) {}
}

const int = { type: 'integer' } as const;
test(int);

const numb = { type: 'number' } as const;
test(numb);

const str = { type: 'string' } as const;
test(str);

const arr = { type: 'array', items: str } as const;
test(arr);

const arrinArr = { type: 'array', items: arr } as const;
test(arrinArr);

const obj = { type: 'object', properties: {
  hello: { type: 'string' },
  world: { type: 'number' },
  hey: { type: 'object', properties: {
    elmo: { type: 'boolean' },
  } },
} } as const;
const resultObj = test(obj);
