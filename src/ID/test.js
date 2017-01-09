import expect from 'expect';
import guid from './';

describe('ID', () => {
  const regex = (/[0-9a-z]{8}-[0-9a-z]{4}-4[0-9a-z]{3}-[0-9a-z]{4}-[0-9a-z]{12}/);
  it('creates GUUIDs', () => {
    const id = guid();

    expect(id.length).toEqual(36);
    expect(id).toMatch(regex);
  });

  it('creates GUUIDs without collision', function test() {
    this.timeout(5000); //eslint-disable-line
    const ids = [];
    const length = (25e3);
    let count = 0;

    while (count < length) {
      const id = guid();

      if (ids.indexOf(id) !== -1) throw new Error(`id collision ${id} at index ${ids.indexOf(id)}`);

      ids.push(id);
      count++;
    }

    expect(ids.length).toEqual(length);
  });
});
