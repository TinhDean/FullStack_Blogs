import { vi } from 'vitest';

const Blog = {
  create: vi.fn(),
  find: vi.fn(),
  findOne: vi.fn(),
  findByIdAndUpdate: vi.fn(),
  findByIdAndDelete: vi.fn()
};

export default Blog;
