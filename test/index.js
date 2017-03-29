import expect from 'expect';
import Giraffe from '../src';

describe('Giraffe', () => {
  it('should be a function', () => {
    expect(Giraffe).toBeA('function');
  });

  it('`create` returns node', () => {
    const expected = new Giraffe().create('Label');

    expect(expected.$type).toEqual('Node');
  });
});
