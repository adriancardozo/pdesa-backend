jest.doMock('bcrypt', () => ({ genSaltSync: jest.fn(), hash: jest.fn(), compareSync: jest.fn() }));
