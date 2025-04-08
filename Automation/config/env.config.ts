export const Env = {
    baseUrl: 'http://localhost:5080/web',
    user: {
      email: process.env.TEST_USER || 'admin@example.com',
      password: process.env.TEST_PASS || 'ComplexPass#123'
    }
  };
  