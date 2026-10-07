import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import Blog from '../models/blog.model';
import Comment from '../models/comment.model';

// Danh sách ảnh Unsplash đã kiểm định 200 OK
const IMAGES = {
  react19: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80&auto=format&fit=crop',
  typescript: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80&auto=format&fit=crop',
  codeWorkspace: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80&auto=format&fit=crop',
  darkCode: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&auto=format&fit=crop',
  docker: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&q=80&auto=format&fit=crop',
  backendArch: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80&auto=format&fit=crop',
  redisCache: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&q=80&auto=format&fit=crop',
  nodejs: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&q=80&auto=format&fit=crop',
  database: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&q=80&auto=format&fit=crop',
  aiBrain: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80&auto=format&fit=crop',
  aiNeural: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80&auto=format&fit=crop',
  robotHand: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80&auto=format&fit=crop',
  aiChip: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80&auto=format&fit=crop',
  futureTech: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80&auto=format&fit=crop',
  aiData: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop',
  cloudInfra: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1200&q=80&auto=format&fit=crop',
  cyberSecurity: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80&auto=format&fit=crop',
  quantum: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80&auto=format&fit=crop',
  modernDesk: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&q=80&auto=format&fit=crop',
  coffeeCoding: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=80&auto=format&fit=crop',
  booksMind: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80&auto=format&fit=crop',
  remoteWork: 'https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=1200&q=80&auto=format&fit=crop',
  minimalLife: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1200&q=80&auto=format&fit=crop',
  teamDiscussion: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop',
};

const SEED_USERS = [
  {
    username: 'admin_spiderum',
    email: 'admin@spiderum.dev',
    password: 'Admin@2026',
    role: 'admin',
  },
  {
    username: 'nam_tech',
    email: 'nam.tech@spiderum.dev',
    password: 'User@2026',
    role: 'user',
  },
  {
    username: 'linh_ai',
    email: 'linh.ai@spiderum.dev',
    password: 'User@2026',
    role: 'user',
  },
  {
    username: 'hoang_dev',
    email: 'hoang.dev@spiderum.dev',
    password: 'User@2026',
    role: 'user',
  },
  {
    username: 'mai.life',
    email: 'mai.life@spiderum.dev',
    password: 'User@2026',
    role: 'user',
  },
];

interface RawBlogPost {
  title: string;
  category: 'Lập trình' | 'Công nghệ' | 'AI' | 'Cuộc sống';
  authorEmail: string;
  thumbnail: string;
  views: number;
  likes: number;
  daysAgo: number;
  content: string;
}

const SEED_BLOGS: RawBlogPost[] = [
  // --- LẬP TRÌNH (6 bài) ---
  {
    title: 'React 19 Chính Thức Ra Mắt: Hướng Dẫn Toàn Diện Về Actions, use() Hook Và Server Components',
    category: 'Lập trình',
    authorEmail: 'nam.tech@spiderum.dev',
    thumbnail: IMAGES.react19,
    views: 1420,
    likes: 128,
    daysAgo: 2,
    content: `## 1. Mở đầu về kỷ nguyên React 19

React 19 đánh dấu bước ngoặt lớn nhất của hệ sinh thái React kể từ khi Hooks được giới thiệu vào phiên bản 16.8. Mục tiêu trọng tâm của phiên bản này là tối giản hóa việc xử lý trạng thái bất đồng bộ (Async State Management) và xóa bỏ gánh nặng ghi nhớ thủ công (\`useMemo\`, \`useCallback\`).

### Những tính năng đột phá nhất:
- **Actions & useActionState**: Quản lý pending state, form submission tự động mà không cần useState lặp lại.
- **use() Hook**: Đọc Promise và Context trực tiếp trong luồng render.
- **React Compiler**: Tối ưu re-render tự động ở cấp độ build time.

\`\`\`tsx
// Ví dụ sử dụng useActionState trong React 19
import { useActionState } from 'react';

async function updateProfile(prevState: any, formData: FormData) {
  const name = formData.get('name');
  const res = await api.updateUser({ name });
  return res.data;
}

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form action={formAction}>
      <input name="name" placeholder="Họ và tên..." required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Đang cập nhật...' : 'Lưu thay đổi'}
      </button>
    </form>
  );
}
\`\`\`

> **Lời khuyên thực chiến:** Hãy bắt đầu nâng cấp từ việc migrate các form đơn giản và kiểm tra khả năng tương thích của các thư viện UI bên thứ ba trước khi áp dụng trên toàn bộ codebase.`,
  },
  {
    title: 'Xây Dựng Clean Architecture Trong Dự Án Node.js & TypeScript Thực Tế',
    category: 'Lập trình',
    authorEmail: 'hoang.dev@spiderum.dev',
    thumbnail: IMAGES.backendArch,
    views: 980,
    likes: 85,
    daysAgo: 4,
    content: `## Tại sao chúng ta cần Clean Architecture?

Khi dự án vượt mốc 50 API endpoints và nhiều dev cùng tham gia, mô hình MVC cổ điển thường dẫn đến hiện tượng **Fat Controller** hoặc **Fat Model**. Clean Architecture giải quyết triệt để vấn đề này bằng cách phân tách hệ thống thành các layer độc lập:

1. **Domain Entities**: Chứa quy tắc nghiệp vụ cốt lõi (Core Business Rules).
2. **Use Cases**: Điều phối luồng dữ liệu nghiệp vụ (Application Rules).
3. **Interface Adapters**: Controllers, Repositories, Presenters.
4. **Frameworks & Drivers**: Express, Mongoose, PostgreSQL, Redis.

\`\`\`typescript
// src/core/usecases/CreateUserUseCase.ts
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
}

export class CreateUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(input: CreateUserInput): Promise<UserOutput> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new DomainError('Email đã được đăng ký');
    }
    const user = User.create(input);
    return await this.userRepo.save(user);
  }
}
\`\`\`

### Lợi ích cốt lõi thu được:
- Độc lập hoàn toàn với Framework: Có thể đổi Express sang Fastify hoặc NestJS mà không sửa 1 dòng code nghiệp vụ.
- Testability đạt 100%: Dễ dàng mock Repository để viết Unit Test cho UseCase chỉ trong vài mili-giây.`,
  },
  {
    title: 'Kỹ Thuật Tối Ưu Hiệu Năng TypeScript: Generic Types Nâng Cao Và Utility Types',
    category: 'Lập trình',
    authorEmail: 'nam.tech@spiderum.dev',
    thumbnail: IMAGES.typescript,
    views: 740,
    likes: 62,
    daysAgo: 8,
    content: `## Khám phá sức mạnh của Type System trong TypeScript

TypeScript không chỉ là việc gán nhãn \`string\` hay \`number\`. Khi làm việc với các hệ thống phức tạp, việc thiết kế Type an toàn (Type Safety) sẽ ngăn chặn đến 90% lỗi runtime xảy ra trên production.

### Conditional Types kết hợp Infer Keyword
\`\`\`typescript
// Trích xuất kiểu trả về của Promise bất kỳ
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// Utility Type biến các trường cụ thể thành Required
type SelectiveRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

interface ArticleDraft {
  id?: string;
  title?: string;
  content?: string;
  publishedAt?: Date;
}

type PublishedArticle = SelectiveRequired<ArticleDraft, 'id' | 'title' | 'content'>;
\`\`\`

> Hãy cẩn trọng khi lạm dụng đệ quy sâu trong generic types vì có thể khiến trình biên dịch TSC bị chậm lại đáng kể trong quá trình build dự án lớn.`,
  },
  {
    title: 'Docker & Docker Compose Cho Lập Trình Viên Fullstack: Từ Development Đến Production',
    category: 'Lập trình',
    authorEmail: 'hoang.dev@spiderum.dev',
    thumbnail: IMAGES.docker,
    views: 1120,
    likes: 95,
    daysAgo: 11,
    content: `## Xóa bỏ hoàn toàn câu nói: "It works on my machine!"

Containerization đã trở thành kỹ năng bắt buộc đối với mọi kỹ sư phần mềm. Bài viết này hướng dẫn cách cấu hình Dockerfile đa tầng (Multi-stage build) để tối ưu dung lượng image từ 1.2GB xuống dưới 90MB.

\`\`\`dockerfile
# Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 5000
CMD ["node", "dist/index.js"]
\`\`\`

### Cấu hình Docker Compose môi trường Dev
Sử dụng volume mounting để tận dụng Hot Reloading mà không cần cài đặt Node.js hay MongoDB trực tiếp lên máy cá nhân.`,
  },
  {
    title: 'Chiến Lược Caching Hiệu Quả Với Redis Trong Ứng Dụng Express & MongoDB',
    category: 'Lập trình',
    authorEmail: 'hoang.dev@spiderum.dev',
    thumbnail: IMAGES.redisCache,
    views: 860,
    likes: 74,
    daysAgo: 16,
    content: `## Cache-Aside Pattern: Giải pháp tăng tốc 10x cho hệ thống

Khi lượng truy vấn đọc (Read Operations) chiếm hơn 80% lưu lượng truy cập, việc query trực tiếp vào cơ sở dữ liệu chính sẽ gây nghẽn cổ chai (I/O Bottleneck).

\`\`\`typescript
async function getBlogWithCache(blogId: string) {
  const cacheKey = \`blog:\${blogId}\`;
  
  // 1. Kiểm tra cache
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Query Database nếu cache miss
  const blog = await Blog.findById(blogId).populate('author', 'username');
  if (blog) {
    // 3. Set cache với TTL 300 giây (5 phút)
    await redisClient.setEx(cacheKey, 300, JSON.stringify(blog));
  }
  return blog;
}
\`\`\`

### Các vấn đề cần lưu ý:
- **Cache Invalidation:** Nhớ xóa cache khi bài viết được cập nhật hoặc xóa.
- **Cache Penetration & Stampede:** Sử dụng mutex lock hoặc trả về giá trị rỗng có TTL ngắn cho các ID không tồn tại.`,
  },
  {
    title: 'Viết Unit Test & Integration Test Chất Lượng Cao Với Vitest Và Supertest',
    category: 'Lập trình',
    authorEmail: 'nam.tech@spiderum.dev',
    thumbnail: IMAGES.codeWorkspace,
    views: 630,
    likes: 51,
    daysAgo: 21,
    content: `## Vì sao Vitest nhanh gấp 5 lần Jest?

Nhờ tích hợp kiến trúc của Vite và ESM Native, Vitest loại bỏ hoàn toàn bước transpile cồng kềnh mà Jest phải chịu.

\`\`\`typescript
import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('GET /api/blogs', () => {
  it('trả về danh sách bài viết phân trang hợp lệ', async () => {
    const res = await request(app).get('/api/blogs?page=1&limit=5');
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toHaveProperty('totalPages');
  });
});
\`\`\`

Testing không làm chậm tốc độ code của bạn, nó trao cho bạn sự tự tin để refactor code vào lúc 5 giờ chiều thứ Sáu mà không lo hỏng production!`,
  },

  // --- CÔNG NGHỆ (6 bài) ---
  {
    title: 'Kiến Trúc Microservices vs Monolith Hiện Đại: Lựa Chọn Nào Cho Năm 2026?',
    category: 'Công nghệ',
    authorEmail: 'hoang.dev@spiderum.dev',
    thumbnail: IMAGES.cloudInfra,
    views: 1850,
    likes: 165,
    daysAgo: 1,
    content: `## Xu hướng Modular Monolith đang trỗi dậy mạnh mẽ

Trong nhiều năm qua, làn sóng Microservices đã càn quét qua ngành công nghệ. Tuy nhiên, nhiều công ty khởi nghiệp và quy mô vừa nhận ra rằng chi phí vận hành mạng, phân tán dữ liệu và distributed tracing quá đắt đỏ so với giá trị nhận lại.

### So sánh trực quan:
- **Monolith truyền thống:** Triển khai nhanh, kiểm thử dễ, nhưng khó mở rộng khi team vượt quá 50 kỹ sư.
- **Microservices:** Độc lập triển khai, tự do công nghệ, nhưng phức tạp ở network latency, eventual consistency và DevOps.
- **Modular Monolith (Lựa chọn vàng):** Giữ một code repo duy nhất nhưng phân tách các module nghiêm ngặt qua interface.

> Đừng chọn Microservices chỉ vì Netflix hay Uber làm như vậy. Hãy chọn công nghệ giải quyết đúng bài toán kinh doanh hiện tại của bạn.`,
  },
  {
    title: 'Bảo Mật API Hiện Đại: Phòng Chống Tấn Công OWASP Top 10 Cho Kỹ Sư Phần Mềm',
    category: 'Công nghệ',
    authorEmail: 'admin@spiderum.dev',
    thumbnail: IMAGES.cyberSecurity,
    views: 1240,
    likes: 110,
    daysAgo: 5,
    content: `## Những lỗ hổng chết người thường gặp trên REST API

Bảo mật không phải là tính năng bổ sung sau cùng mà phải là tôn chỉ thiết kế ngay từ dòng code đầu tiên.

### 3 Lỗ hổng phổ biến nhất:
1. **Broken Object Level Authorization (BOLA):** Cho phép User A sửa bài viết của User B chỉ bằng cách đổi ID trên URL.
2. **Mass Assignment:** Cho phép người dùng gửi kèm trường \`{ role: "admin" }\` khi đăng ký tài khoản.
3. **NoSQL Injection:** Sử dụng truy vấn MongoDB không bọc lọc dữ liệu đầu vào.

\`\`\`typescript
// Phòng chống Mass Assignment bằng DTO rõ ràng
const allowedUpdates = ['title', 'content', 'category', 'thumbnail'];
const sanitizedData = Object.keys(req.body)
  .filter(key => allowedUpdates.includes(key))
  .reduce((obj, key) => {
    obj[key] = req.body[key];
    return obj;
  }, {} as Record<string, any>);
\`\`\`

Hãy luôn áp dụng nguyên tắc **Least Privilege** và kiểm tra quyền hạn (Role-Based Access Control) ở mọi endpoint nhạy cảm.`,
  },
  {
    title: 'Điện Toán Lượng Tử (Quantum Computing): Tác Động Gì Đến Mật Mã Học Và Phát Triển Phần Mềm?',
    category: 'Công nghệ',
    authorEmail: 'linh.ai@spiderum.dev',
    thumbnail: IMAGES.quantum,
    views: 890,
    likes: 78,
    daysAgo: 9,
    content: `## Thuật toán Shor và mối đe dọa với RSA

Với sức mạnh của qubit và hiện tượng chồng chập lượng tử (superposition), máy tính lượng tử có khả năng giải bài toán phân tích thừa số nguyên lớn trong thời gian đa thức. Điều này đồng nghĩa với việc các thuật toán mã hóa khóa công khai hiện nay như RSA hay ECC sẽ trở nên dễ bị bẻ gãy.

### Chúng ta cần chuẩn bị gì?
- **Hậu mật mã lượng tử (Post-Quantum Cryptography - PQC):** NIST đã chuẩn hóa các thuật toán mã hóa dựa trên mạng tinh thể (lattice-based cryptography) như Kyber và Dilithium.
- **Crypto-Agility:** Thiết kế kiến trúc phần mềm sao cho việc hoán đổi thuật toán mã hóa diễn ra dễ dàng qua cấu hình.`,
  },
  {
    title: 'WebAssembly (Wasm): Tương Lai Của Ứng Dụng Web Hiệu Năng Cực Cao',
    category: 'Công nghệ',
    authorEmail: 'nam.tech@spiderum.dev',
    thumbnail: IMAGES.darkCode,
    views: 1050,
    likes: 92,
    daysAgo: 14,
    content: `## Mang Rust và C++ chạy mượt mà ngay trên trình duyệt

WebAssembly không sinh ra để thay thế JavaScript, mà để bổ trợ cho JavaScript tại những vị trí đòi hỏi sức mạnh tính toán khổng lồ: xử lý video, dựng hình 3D, game engine và chạy mô hình AI cục bộ (Client-side AI).

### Các case study thành công vang dội:
- **Figma:** Dựng toàn bộ engine vector rendering bằng C++ biên dịch sang WebAssembly.
- **Photoshop Web:** Chạy lõi xử lý ảnh phức tạp trực tiếp trên Chrome.
- **FFmpeg.wasm:** Chuyển đổi và nén video ngay trên máy khách mà không tốn tài nguyên server.`,
  },
  {
    title: 'Serverless Architecture 2026: Ưu Điểm, Nhược Điểm Và Chi Phí Thực Tế',
    category: 'Công nghệ',
    authorEmail: 'hoang.dev@spiderum.dev',
    thumbnail: IMAGES.futureTech,
    views: 790,
    likes: 67,
    daysAgo: 18,
    content: `## Cold Start đã được giải quyết như thế nào?

Với công nghệ MicroVM như Firecracker của AWS và V8 Isolates của Cloudflare Workers, thời gian Cold Start hiện nay đã giảm xuống dưới 10ms đối với runtime JavaScript/TypeScript.

### Khi nào nên dùng Serverless?
- Tải biến động mạnh, có những thời điểm lưu lượng truy cập bằng 0.
- Các tác vụ xử lý nền, webhooks, cron jobs.
- API Backend cho các dự án MVP cần launch thần tốc với chi phí hạ tầng ban đầu gần như bằng 0.`,
  },
  {
    title: 'Lộ Trình Trở Thành Software Architect Cho Senior Developer',
    category: 'Công nghệ',
    authorEmail: 'admin@spiderum.dev',
    thumbnail: IMAGES.teamDiscussion,
    views: 1680,
    likes: 145,
    daysAgo: 24,
    content: `## Chuyển dịch tư duy từ "Làm thế nào để code" sang "Đánh đổi điều gì"

Mọi quyết định kiến trúc đều là một sự đánh đổi (Trade-off). Không có kiến trúc hoàn hảo, chỉ có kiến trúc phù hợp nhất với nguồn lực, thời gian và mục tiêu kinh doanh.

### 4 Trụ cột cốt lõi của một Architect:
1. **System Design & Trade-offs:** Hiểu sâu CAP theorem, Consistency models, Latency vs Throughput.
2. **Business Alignment:** Hiểu rõ bài toán tài chính và chi phí vận hành của doanh nghiệp.
3. **Communication Skills:** Khả năng trình bày sơ đồ kiến trúc rõ ràng cho cả ban giám đốc và kỹ sư trẻ.
4. **Hands-on Mentorship:** Không xa rời thực tế, sẵn sàng code POC (Proof of Concept) cho các giải pháp mới.`,
  },

  // --- AI (6 bài) ---
  {
    title: 'Xây Dựng Hệ Thống RAG (Retrieval-Augmented Generation) Hoàn Chỉnh Với Vector Database',
    category: 'AI',
    authorEmail: 'linh.ai@spiderum.dev',
    thumbnail: IMAGES.aiBrain,
    views: 2150,
    likes: 189,
    daysAgo: 3,
    content: `## Giải quyết triệt để hiện tượng Hallucination của LLM

Các mô hình ngôn ngữ lớn (LLM) sở hữu khả năng suy luận phi thường nhưng thường xuyên "bịa chuyện" hoặc thiếu dữ liệu chuyên ngành nội bộ. RAG kết hợp sức mạnh tìm kiếm tương đồng ngữ nghĩa (Semantic Search) để cung cấp ngữ cảnh chính xác nhất cho mô hình.

\`\`\`python
# Quy trình cốt lõi của RAG Pipeline
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import create_retrieval_chain

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma(persist_directory="./db", embedding_function=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

llm = ChatOpenAI(model="gpt-4o", temperature=0.1)
# Hệ thống tự động truy xuất tài liệu liên quan và tổng hợp câu trả lời
\`\`\`

### Các mẹo tối ưu hóa RAG nâng cao:
- **Chunking Strategy:** Sử dụng Recursive Character Splitter với overlap hợp lý (15-20%).
- **Re-ranking:** Áp dụng mô hình Cross-Encoder để sắp xếp lại top 10 kết quả trước khi đưa vào Prompt.`,
  },
  {
    title: 'Fine-Tuning Mô Hình Ngôn Ngữ Nhỏ (SLM): Giải Pháp Tối Ưu Chi Phí Cho Doanh Nghiệp',
    category: 'AI',
    authorEmail: 'linh.ai@spiderum.dev',
    thumbnail: IMAGES.aiNeural,
    views: 1340,
    likes: 115,
    daysAgo: 7,
    content: `## Vì sao không phải lúc nào bạn cũng cần đến GPT-4?

Các mô hình Small Language Models (SLMs) như Llama-3-8B, Mistral-7B hay Phi-3 khi được Fine-tune đúng cách bằng kỹ thuật LoRA / QLoRA hoàn toàn có thể vượt trội các mô hình khổng lồ trong các tác vụ hẹp với chi phí vận hành rẻ hơn gấp 50 lần.

### Lợi ích khi chạy SLM tại chỗ (On-Premise):
- **Bảo mật tuyệt đối:** Dữ liệu khách hàng không bao giờ rời khỏi hệ thống mạng nội bộ.
- **Độ trễ thấp:** Không phụ thuộc vào kết nối mạng tới các nhà cung cấp bên thứ ba.
- **Kiểm soát phiên bản:** Không lo ngại việc nhà cung cấp thay đổi hành vi mô hình qua đêm.`,
  },
  {
    title: 'Prompt Engineering Chuyên Nghiệp: Từ Few-Shot Đến Chain-of-Thought Và ReAct',
    category: 'AI',
    authorEmail: 'nam.tech@spiderum.dev',
    thumbnail: IMAGES.aiChip,
    views: 1560,
    likes: 132,
    daysAgo: 10,
    content: `## Lập trình bằng ngôn ngữ tự nhiên: Kỹ năng mới của thế kỷ 21

Viết prompt không đơn thuần là đặt câu hỏi ngắn gọn. Để có được kết quả ổn định và cấu trúc JSON chuẩn xác, bạn cần nắm vững các kỹ thuật giao tiếp với mô hình.

### Các mô thức prompt thiết yếu:
1. **Chain-of-Thought (CoT):** Hướng dẫn mô hình "Hãy suy nghĩ từng bước một" trước khi đưa ra kết luận.
2. **Few-Shot Examples:** Cung cấp từ 2 đến 3 ví dụ mẫu về Input và Output mong muốn.
3. **Role & Constraint Definition:** Định hình rõ vai trò, đối tượng độc giả và các điều cấm kỵ (Negative Constraints).`,
  },
  {
    title: 'Ứng Dụng AI Agents Tự Động Hóa Quy Trình Phát Triển Phần Mềm',
    category: 'AI',
    authorEmail: 'linh.ai@spiderum.dev',
    thumbnail: IMAGES.robotHand,
    views: 1420,
    likes: 124,
    daysAgo: 15,
    content: `## AI không chỉ viết code, AI tự chạy test và sửa bug

Mô hình AI Agent (Tác tử thông minh) có khả năng tự động lên kế hoạch, tương tác với command line, đọc báo cáo lỗi và tự động gửi Pull Request khắc phục sự cố.

### Vòng lặp ReAct của một Agent:
- **Reasoning:** Phân tích yêu cầu và kế hoạch hành động.
- **Acting:** Thực thi công cụ (chạy terminal, đọc file, gọi API).
- **Observing:** Đọc output từ môi trường và điều chỉnh kế hoạch tiếp theo.`,
  },
  {
    title: 'Computer Vision Trong Kỷ Nguyên Mới: Từ YOLO Đến Vision-Language Models (VLM)',
    category: 'AI',
    authorEmail: 'linh.ai@spiderum.dev',
    thumbnail: IMAGES.aiData,
    views: 920,
    likes: 76,
    daysAgo: 20,
    content: `## Khi trí tuệ nhân tạo có thể hiểu và mô tả thế giới hình ảnh

Vision-Language Models cho phép chúng ta không chỉ phát hiện vật thể (Object Detection) mà còn trò chuyện tự nhiên về ngữ cảnh bức ảnh, đọc biểu đồ kỹ thuật và trích xuất dữ liệu hóa đơn dạng bảng cực kỳ chính xác.`,
  },
  {
    title: 'Đạo Đức AI Và Vấn Đề Bản Quyền Dữ Liệu: Thách Thức Lớn Của Ngành Công Nghệ',
    category: 'AI',
    authorEmail: 'admin@spiderum.dev',
    thumbnail: IMAGES.futureTech,
    views: 810,
    likes: 64,
    daysAgo: 26,
    content: `## AI sáng tạo và ranh giới sở hữu trí tuệ

Ai sở hữu bản quyền tác phẩm do AI tạo ra? Làm thế nào để đảm bảo dữ liệu huấn luyện không vi phạm quyền riêng tư của người dùng? Đây là những câu hỏi pháp lý và đạo đức cấp thiết đang được các quốc gia trên thế giới thảo luận sôi nổi.`,
  },

  // --- CUỘC SỐNG (6 bài) ---
  {
    title: 'Vượt Qua Burnout Khi Làm Lập Trình Viên: Những Bài Học Đắt Giá Sau 5 Năm Làm Nghề',
    category: 'Cuộc sống',
    authorEmail: 'mai.life@spiderum.dev',
    thumbnail: IMAGES.coffeeCoding,
    views: 2340,
    likes: 210,
    daysAgo: 2,
    content: `## Khi màn hình code trở thành nỗi sợ hãi mỗi sáng thức dậy

Hội chứng kiệt sức (Burnout) trong ngành IT xảy ra phổ biến hơn nhiều so với những gì chúng ta thừa nhận trên LinkedIn. Áp lực deadline, công nghệ thay đổi chóng mặt và việc liên tục ngồi một chỗ trước ánh sáng xanh có thể bào mòn sức khỏe thể chất và tinh thần của bất kỳ ai.

### Những tín hiệu cảnh báo bạn đang kiệt sức:
- Bạn cảm thấy hoài nghi về giá trị công việc mình đang làm.
- Mất cảm giác hưng phấn khi fix xong một lỗi phức tạp.
- Khó tập trung và thường xuyên trì hoãn.

### 4 Bước tự chữa lành thực tế:
1. **Thiết lập ranh giới số:** Tắt toàn bộ thông báo Slack sau 7 giờ tối.
2. **Tập thể dục tối thiểu 30 phút mỗi ngày:** Chạy bộ, bơi lội hoặc đạp xe để xả stress.
3. **Học cách nói "Không":** Không nhận thêm việc vượt quá khả năng xử lý trong tuần.
4. **Tìm một sở thích phi kỹ thuật số:** Trồng cây, nấu ăn, đọc sách giấy.`,
  },
  {
    title: 'Nghệ Thuật Quản Lý Thời Gian Cho Kỹ Sư Phần Mềm: Deep Work Và Time Blocking',
    category: 'Cuộc sống',
    authorEmail: 'mai.life@spiderum.dev',
    thumbnail: IMAGES.minimalLife,
    views: 1450,
    likes: 130,
    daysAgo: 6,
    content: `## Bảo vệ trạng thái tập trung cao độ (Flow State)

Một lập trình viên mất trung bình 23 phút để quay lại trạng thái tập trung sau khi bị gián đoạn bởi một tin nhắn chat ngẫu nhiên.

### Quy tắc Time-Blocking hiệu quả:
- **Buổi sáng (8h30 - 11h30):** Dành trọn vẹn cho Deep Work — giải quyết các thuật toán hóc búa, viết logic nghiệp vụ phức tạp nhất trong ngày.
- **Buổi chiều (14h00 - 16h00):** Dành cho Code Review, trả lời email, họp hành nhóm.
- **Cuối ngày (16h30 - 17h00):** Viết ghi chú công việc cho ngày hôm sau và đóng máy tính.`,
  },
  {
    title: 'Remote Work Toàn Diện: Làm Thế Nào Để Duy Trì Kỷ Luật Và Sự Gắn Kết Khi Làm Việc Tại Nhà?',
    category: 'Cuộc sống',
    authorEmail: 'mai.life@spiderum.dev',
    thumbnail: IMAGES.remoteWork,
    views: 1280,
    likes: 104,
    daysAgo: 12,
    content: `## Tự do đi kèm với trách nhiệm kỷ luật thép

Làm việc từ xa (Work from Home) cho phép bạn tiết kiệm 2 tiếng kẹt xe mỗi ngày, nhưng cũng dễ khiến ranh giới giữa cuộc sống và công việc bị xóa nhòa.

### Xây dựng không gian làm việc chuyên biệt:
Đừng bao giờ làm việc trên giường ngủ! Hãy setup một góc bàn làm việc đủ ánh sáng tự nhiên, ghế công thái học và giữ không gian luôn ngăn nắp để tạo tín hiệu tâm lý rõ ràng cho não bộ khi bắt đầu ca làm việc.`,
  },
  {
    title: 'Đọc Sách Trong Kỷ Nguyên Mạng Xã Hội: Cách Tôi Hoàn Thành 24 Cuốn Sách Mỗi Năm',
    category: 'Cuộc sống',
    authorEmail: 'mai.life@spiderum.dev',
    thumbnail: IMAGES.booksMind,
    views: 950,
    likes: 88,
    daysAgo: 17,
    content: `## Đọc sách không phải là cuộc đua về số lượng, mà là sự thay đổi về tư duy

Thay vì lướt TikTok 30 phút trước khi ngủ, hãy thay thế bằng việc đọc 20 trang sách. Sau một năm, bạn sẽ ngạc nhiên với khối lượng tri thức và chiều sâu suy nghĩ mà bạn tích lũy được.`,
  },
  {
    title: 'Giao Tiếp Hiệu Quả Cho Dân Kỹ Thuật: Biến Ý Tưởng Thành Hành Động',
    category: 'Cuộc sống',
    authorEmail: 'nam.tech@spiderum.dev',
    thumbnail: IMAGES.teamDiscussion,
    views: 1120,
    likes: 98,
    daysAgo: 22,
    content: `## Code giỏi đưa bạn vào nghề, giao tiếp tốt đưa bạn lên vị trí lãnh đạo

Kỹ năng giải thích một vấn đề kỹ thuật phức tạp bằng ngôn từ đơn giản, dễ hiểu cho Product Owner và khách hàng là một siêu năng lực giúp bạn nổi bật trong mọi tổ chức.`,
  },
  {
    title: 'Tối Giản Hóa Cuộc Sống (Minimalism): Tìm Lại Sự Bình Yên Trong Tâm Trí',
    category: 'Cuộc sống',
    authorEmail: 'mai.life@spiderum.dev',
    thumbnail: IMAGES.modernDesk,
    views: 1390,
    likes: 121,
    daysAgo: 27,
    content: `## Sở hữu ít hơn để sống nhiều hơn

Lối sống tối giản không phải là vứt bỏ mọi thứ, mà là loại bỏ những điều không cần thiết để nhường chỗ cho những điều thực sự quan trọng: sức khỏe, gia đình, sự sáng tạo và trải nghiệm cuộc sống.`,
  },
];

const SEED_COMMENTS = [
  {
    blogIndex: 0, // React 19
    authorEmail: 'hoang.dev@spiderum.dev',
    content: 'Bài viết rất kịp thời và chi tiết! Cho mình hỏi React Compiler khi kết hợp với dự án Vite hiện tại có cần thêm plugin babel nào đặc biệt không bạn?',
  },
  {
    blogIndex: 0, // React 19
    authorEmail: 'nam.tech@spiderum.dev',
    content: '@hoang_dev Hoàn toàn có bạn nhé, Vite có plugin chính thức là @vitejs/plugin-react kết hợp với babel-plugin-react-compiler, hoạt động rất mượt mà!',
  },
  {
    blogIndex: 0, // React 19
    authorEmail: 'linh.ai@spiderum.dev',
    content: 'useActionState giúp code form gọn hơn hẳn so với việc tự viết useState và try/catch lặp đi lặp lại. Cảm ơn Nam chia sẻ!',
  },
  {
    blogIndex: 1, // Clean Architecture
    authorEmail: 'nam.tech@spiderum.dev',
    content: 'Viết test cho UseCase khi tách riêng Repository mock sướng vô cùng! Vote 5 sao cho kiến trúc này.',
  },
  {
    blogIndex: 1, // Clean Architecture
    authorEmail: 'admin@spiderum.dev',
    content: 'Bài viết chuẩn mực của kỹ sư Backend có tâm. Khuyên các bạn dev mới nên lưu lại nghiền ngẫm.',
  },
  {
    blogIndex: 4, // Redis Caching
    authorEmail: 'hoang.dev@spiderum.dev',
    content: 'Mọi người nhớ chú ý việc cache stampede khi có bài viết hot lên triệu views trong vài phút nhé, cần thêm cơ chế lock hợp lý.',
  },
  {
    blogIndex: 6, // Microservices vs Monolith
    authorEmail: 'nam.tech@spiderum.dev',
    content: 'Đồng ý 100%! Rất nhiều công ty nhảy vào Microservices chỉ vì hype rồi sau đó chật vật với chi phí hạ tầng và việc phân mảnh dữ liệu.',
  },
  {
    blogIndex: 7, // Bảo mật API
    authorEmail: 'hoang.dev@spiderum.dev',
    content: 'BOLA (IDOR) đúng là lỗ hổng gặp nhiều nhất trong các đợt pentest. Kiểm tra quyền sở hữu bài viết ở middleware là bắt buộc.',
  },
  {
    blogIndex: 12, // RAG AI
    authorEmail: 'nam.tech@spiderum.dev',
    content: 'Linh ơi, cho mình hỏi với tài liệu tiếng Việt thì embedding model nào cho kết quả semantic search chuẩn xác nhất hiện nay?',
  },
  {
    blogIndex: 12, // RAG AI
    authorEmail: 'linh.ai@spiderum.dev',
    content: '@nam_tech Với tiếng Việt, text-embedding-3 của OpenAI hoặc các model bge-m3 / multilingual-e5 của BAAI đang cho kết quả rất ấn tượng bạn nhé!',
  },
  {
    blogIndex: 12, // RAG AI
    authorEmail: 'mai.life@spiderum.dev',
    content: 'Đọc bài này mới hiểu vì sao mấy con Chatbot trả lời câu hỏi tài liệu nội bộ chuẩn như vậy. Giải thích rất dễ hiểu!',
  },
  {
    blogIndex: 18, // Vượt qua Burnout
    authorEmail: 'nam.tech@spiderum.dev',
    content: 'Từng trải qua cảm giác này vào năm thứ 3 đi làm. Bài viết chạm đúng tâm lý của anh em dev luôn. Cảm ơn Mai rất nhiều!',
  },
  {
    blogIndex: 18, // Vượt qua Burnout
    authorEmail: 'linh.ai@spiderum.dev',
    content: 'Quy tắc tắt Slack sau 7h tối cứu vãn cuộc sống của mình rất nhiều. Sức khỏe tinh thần là vốn quý nhất.',
  },
  {
    blogIndex: 18, // Vượt qua Burnout
    authorEmail: 'admin@spiderum.dev',
    content: 'Spiderum luôn khuyến khích văn hóa cân bằng và lắng nghe. Các bài viết nhân văn thế này rất cần lan tỏa.',
  },
  {
    blogIndex: 19, // Deep Work
    authorEmail: 'hoang.dev@spiderum.dev',
    content: 'Thử áp dụng Time-blocking 3 tiếng buổi sáng và năng suất code tăng gấp đôi thật mọi người ạ!',
  },
  {
    blogIndex: 20, // Remote Work
    authorEmail: 'mai.life@spiderum.dev',
    content: 'Góc làm việc đủ ánh sáng và một chiếc ghế tốt là khoản đầu tư sinh lời lớn nhất cho sức khỏe khi làm remote.',
  },
];

async function seed() {
  const isForce = process.argv.includes('--force') || process.argv.includes('--reset');
  console.log('====================================================');
  console.log('🚀 BẮT ĐẦU QUÁ TRÌNH SEED DỮ LIỆU CHUẨN CHO SPIDERUM');
  console.log(`🔒 Chế độ an toàn: Chỉ thao tác trên tài khoản demo (@spiderum.dev)`);
  console.log('====================================================');

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ Lỗi: MONGO_URI chưa được thiết lập trong .env');
    process.exit(1);
  }

  const dbName = process.env.MONGO_DB_NAME || 'blogs';
  console.log(`📡 Đang kết nối tới MongoDB: ${dbName}...`);
  await mongoose.connect(mongoUri, { dbName });
  console.log('✅ Đã kết nối MongoDB thành công!');

  try {
    // 1. TÌM VÀ XÓA DỮ LIỆU DEMO CŨ NẾU CÓ
    const demoEmails = SEED_USERS.map((u) => u.email.toLowerCase());
    const existingDemoUsers = await User.find({ email: { $in: demoEmails } });
    const existingDemoUserIds = existingDemoUsers.map((u) => u._id);

    if (existingDemoUserIds.length > 0) {
      console.log(`🧹 Tìm thấy ${existingDemoUserIds.length} tài khoản demo cũ. Đang dọn dẹp an toàn...`);
      // Xóa bài viết của demo users
      const deletedBlogs = await Blog.deleteMany({ author: { $in: existingDemoUserIds } });
      console.log(`   - Đã xóa ${deletedBlogs.deletedCount} bài viết demo cũ.`);
      // Xóa bình luận liên quan
      const deletedComments = await Comment.deleteMany({
        $or: [{ userId: { $in: existingDemoUserIds } }, { username: { $in: SEED_USERS.map((u) => u.username) } }],
      });
      console.log(`   - Đã xóa ${deletedComments.deletedCount} bình luận demo cũ.`);
      // Xóa demo users
      await User.deleteMany({ _id: { $in: existingDemoUserIds } });
      console.log(`   - Đã xóa các tài khoản demo cũ.`);
    }

    // 2. TẠO 5 TÀI KHOẢN DEMO
    console.log('\n👤 Đang khởi tạo 5 tài khoản demo với mật khẩu đã mã hóa bcrypt...');
    const userMap = new Map<string, mongoose.Types.ObjectId>();

    for (const userData of SEED_USERS) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });
      userMap.set(userData.email, user._id as mongoose.Types.ObjectId);
      console.log(`   ✨ [${user.role.toUpperCase()}] ${user.username} (${user.email}) -> Created!`);
    }

    // 3. TẠO 24 BÀI VIẾT CHẤT LƯỢNG CAO
    console.log('\n📝 Đang khởi tạo 24 bài viết phong phú với hình ảnh Unsplash & Markdown chuyên nghiệp...');
    const createdBlogs: any[] = [];
    const now = new Date();

    for (let i = 0; i < SEED_BLOGS.length; i++) {
      const blogData = SEED_BLOGS[i];
      const authorId = userMap.get(blogData.authorEmail);
      if (!authorId) {
        throw new Error(`Không tìm thấy authorId cho email: ${blogData.authorEmail}`);
      }

      // Giả lập ngày đăng rải đều trong quá khứ
      const postDate = new Date(now.getTime() - blogData.daysAgo * 24 * 60 * 60 * 1000);

      const blog = (await Blog.create({
        title: blogData.title,
        content: blogData.content,
        category: blogData.category,
        thumbnail: blogData.thumbnail,
        author: authorId,
        views: blogData.views,
        likes: blogData.likes,
        isDeleted: false,
        createdAt: postDate,
        updatedAt: postDate,
      } as any)) as any;

      createdBlogs.push(blog);
      console.log(`   📄 [${blog.category}] ${blog.title.slice(0, 50)}... (${blog.views} views, ${blog.likes} likes)`);
    }

    // 4. TẠO CÁC BÌNH LUẬN TƯƠNG TÁC THỰC TẾ
    console.log('\n💬 Đang tạo các bình luận thảo luận kỹ thuật giữa các tài khoản demo...');
    let commentCount = 0;

    for (const commentData of SEED_COMMENTS) {
      const targetBlog = createdBlogs[commentData.blogIndex];
      if (!targetBlog) continue;

      const commenter = SEED_USERS.find((u) => u.email === commentData.authorEmail);
      const commenterId = userMap.get(commentData.authorEmail);

      await Comment.create({
        blogId: targetBlog._id,
        userId: commenterId,
        username: commenter ? commenter.username : 'SpiderumMember',
        content: commentData.content,
      });
      commentCount++;
    }
    console.log(`   ✅ Đã tạo thành công ${commentCount} bình luận sinh động!`);

    // 5. THỐNG KÊ TỔNG QUAN
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments({ isDeleted: false });
    const totalComments = await Comment.countDocuments();

    console.log('\n====================================================');
    console.log('🎉 SEED DỮ LIỆU HOÀN TẤT THÀNH CÔNG 100%!');
    console.log('====================================================');
    console.log(`📊 Tổng số người dùng trong DB: ${totalUsers}`);
    console.log(`📊 Tổng số bài viết đang hoạt động: ${totalBlogs}`);
    console.log(`📊 Tổng số bình luận tương tác: ${totalComments}`);
    console.log('\n🔑 THÔNG TIN ĐĂNG NHẬP TEST / DEMO PHỎNG VẤN:');
    console.log('1. Admin:    admin@spiderum.dev   | Pass: Admin@2026 (Role: admin)');
    console.log('2. Nam Tech: nam.tech@spiderum.dev   | Pass: User@2026  (Role: user)');
    console.log('3. Linh AI:  linh.ai@spiderum.dev    | Pass: User@2026  (Role: user)');
    console.log('4. Hoang Dev:hoang.dev@spiderum.dev  | Pass: User@2026  (Role: user)');
    console.log('5. Mai Life: mai.life@spiderum.dev   | Pass: User@2026  (Role: user)');
    console.log('====================================================\n');
  } catch (error) {
    console.error('❌ Lỗi trong quá trình seed dữ liệu:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Đã ngắt kết nối an toàn với MongoDB.');
  }
}

seed();
