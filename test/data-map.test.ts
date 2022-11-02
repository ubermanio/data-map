import { DataMapper } from '../src';

const source = {
  my: {
    deep: {
      object: { name: 'john' },
      value: 'abc',
      array: [{ value: 1 }, { value: 2 }, { value: 3 }],
    },
    other: {
      array: [4, 5, 6],
    },
  },
};

describe('DataMapper', () => {
  it('maps data accordingly', async () => {
    const mapper = new DataMapper();

    mapper.map({
      from: '$.my.deep.object.name',
      to: '$.name',
    });

    mapper
      .map({
        from: '$.my.other.array[0]',
        to: '$.array[0]',
      })
      .map({
        from: '$.my.other.array[2]',
        to: '$.array[1]',
      });

    const result = await mapper.process(source);

    expect(result).toEqual({
      name: 'john',
      array: [4, 6],
    });
  });
});
