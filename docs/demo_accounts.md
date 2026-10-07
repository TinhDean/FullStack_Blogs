# Tài Liệu Tài Khoản Demo & Hướng Dẫn Kịch Bản Phỏng Vấn (FullStack Blogs)

Tài liệu này cung cấp danh sách các tài khoản kiểm thử đã được khởi tạo sẵn trong cơ sở dữ liệu MongoDB Atlas cùng kịch bản demo 4 luồng nghiệp vụ chính để phỏng vấn viên hoặc người đánh giá trải nghiệm hệ thống một cách trực quan nhất.

---

## 1. Danh Sách Tài Khoản Demo (Pre-seeded Accounts)

Hệ thống đã được nạp sẵn dữ liệu thông qua lệnh an toàn `npm run seed` tại thư mục \`backend\`. Toàn bộ mật khẩu người dùng đã được mã hóa theo chuẩn **bcrypt (10 rounds)**.

| STT | Vai trò (Role) | Tên hiển thị (Username) | Email đăng nhập | Mật khẩu | Đặc điểm dữ liệu liên kết |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | **ADMIN** | `admin_spiderum` | `admin@spiderum.dev` | `Admin@2026` | Quyền quản trị tối cao: Được phép chỉnh sửa/xóa bất kỳ bài viết hoặc bình luận nào trên toàn sàn. |
| **2** | **USER** (Lead) | `nam_tech` | `nam.tech@spiderum.dev` | `User@2026` | Tác giả nhiều bài viết kỹ thuật hàng đầu (*React 19*, *TypeScript Generics*, *Vitest Testing*), sở hữu nhiều lượt like và bình luận. |
| **3** | **USER** (AI Eng) | `linh_ai` | `linh.ai@spiderum.dev` | `User@2026` | Chuyên gia AI & Data Science: Tác giả các bài viết chuyên sâu về *RAG Pipeline*, *Small Language Models (SLM)*, *Computer Vision*. |
| **4** | **USER** (DevOps) | `hoang_dev` | `hoang.dev@spiderum.dev` | `User@2026` | Kỹ sư hạ tầng & Backend: Tác giả bài viết về *Clean Architecture*, *Docker Multi-stage*, *Redis Cache-Aside*. |
| **5** | **USER** (Writer) | `mai.life` | `mai.life@spiderum.dev` | `User@2026` | Cây bút phong cách sống: Tác giả các bài viết truyền cảm hứng về *Vượt qua Burnout*, *Deep Work*, *Remote Work*. |

> 💡 **Tiện ích trên giao diện Login:** Tại trang đăng nhập (`/login`), giao diện đã tích hợp sẵn 2 nút bấm nhanh **"⚡ Admin Demo"** và **"⚡ User Demo"** giúp tự động điền thông tin đăng nhập trong 1 click mà không cần gõ thủ công.

---

## 2. Kịch Bản Demo Phỏng Vấn (4 Luồng Nghiệp Vụ Chính)

### Luồng 1: Khám Phá Bài Viết, Trải Nghiệm Đọc & Tương Tác Cộng Đồng (Guest / Member)
- **Mục tiêu:** Chứng minh khả năng hiển thị UI hiện đại, typography chuyên nghiệp, phân loại danh mục, tìm kiếm và tương tác tức thì.
- **Các bước thực hiện:**
  1. Truy cập Trang chủ (`/`). Quan sát thanh Hero tương tác, thống kê số lượng bài viết và danh sách bài viết hiển thị theo dạng Card hiện đại.
  2. Bấm chọn các tab danh mục ở Sidebar: **Công nghệ**, **Lập trình**, **AI**, **Cuộc sống** để thấy bộ lọc Client mượt mà.
  3. Thử gõ từ khóa vào thanh tìm kiếm ở Navbar (ví dụ: *"React"*, *"Docker"*, *"Burnout"*). Hệ thống tự động truy vấn API và hiển thị kết quả tương ứng.
  4. Bấm vào bài viết bất kỳ (ví dụ: *"React 19 Chính Thức Ra Mắt..."*).
     - Chiêm ngưỡng bố cục bài viết: Hero header, huy hiệu danh mục, thời gian đọc ước tính (*Reading Time*), avatar tác giả.
     - Kiểm tra nội dung bài viết hiển thị chuẩn Markdown: Headings, blockquote, danh sách và **khối code có highlight cú pháp**.
  5. Bấm nút **"Thích bài viết"** (Like Button) để thấy số lượt thích tăng trực tiếp.
  6. Cuộn xuống khu vực bình luận để đọc các thảo luận kỹ thuật có sẵn từ các thành viên.

---

### Luồng 2: Quy Trình Đăng Bài & Quản Lý Nội Dung Cá Nhân (User Flow)
- **Mục tiêu:** Chứng minh chức năng xác thực JWT, bảo vệ Route, Form Validation, Live Preview và trang Dashboard quản trị cá nhân.
- **Các bước thực hiện:**
  1. Vào `/login`, bấm nút **"⚡ User Demo"** (tài khoản `nam.tech@spiderum.dev`), sau đó bấm **Đăng nhập**.
  2. Quan sát Navbar: Hiển thị avatar tròn với chữ viết tắt `N`, tên người dùng `nam_tech`, huy hiệu vai trò `MEMBER`, và các nút thao tác nhanh.
  3. Bấm nút **"Viết bài mới"** trên Navbar (chuyển tới `/create`):
     - Nhập tiêu đề bài viết.
     - Chọn danh mục dạng Pill Tag.
     - Dán một đường dẫn ảnh bìa (Thumbnail URL) hợp lệ để thấy khung **Live Image Preview**.
     - Nhập nội dung Markdown (hỗ trợ đầy đủ cú pháp).
     - Bấm **"Xuất bản bài viết"**. Hệ thống hiển thị thông báo thành công và chuyển hướng về trang chi tiết bài vừa tạo.
  4. Bấm vào menu cá nhân, chọn **"Bài viết của tôi"** (`/my-blogs`):
     - Quan sát 3 Metric Cards thống kê tổng quan: **Tổng bài viết**, **Tổng lượt xem**, **Tổng lượt thích**.
     - Danh sách bài viết cá nhân kèm Thumbnail, ngày đăng, lượt tương tác và nút hành động nhanh.
  5. Thử bấm **"Sửa"** bài viết để cập nhật tiêu đề, hoặc bấm **"Xóa"** để kiểm tra Modal xác nhận bảo vệ trước khi xóa.

---

### Luồng 3: Kiểm Duyệt Nội Dung & Quyền Quản Trị Tối Cao (Admin RBAC Flow)
- **Mục tiêu:** Chứng minh hệ thống phân quyền RBAC (Role-Based Access Control) hoạt động nghiêm ngặt cả ở Frontend lẫn Backend.
- **Các bước thực hiện:**
  1. Đăng xuất tài khoản hiện tại.
  2. Tại trang `/login`, bấm nút **"⚡ Admin Demo"** (`admin@spiderum.dev`), sau đó bấm **Đăng nhập**.
  3. Quan sát Navbar: Xuất hiện huy hiệu **ADMIN** màu nổi bật.
  4. Truy cập vào bất kỳ bài viết nào do người dùng khác tạo (ví dụ bài của `hoang_dev` hoặc `mai.life`).
  5. Admin nhìn thấy nút **"Xóa bài viết"** (được cấp quyền Admin Override).
  6. Tại khu vực bình luận, Admin có quyền xóa bất kỳ bình luận nào không phù hợp mà không bị giới hạn chỉ xóa bình luận của chính mình.
  7. Backend đảm bảo kiểm tra: `req.user.role === 'admin' || blog.author.equals(req.user.id)`.

---

### Luồng 4: Bảo Vệ Tuyến Đường & Trải Nghiệm Chuyển Hướng Thông Minh (Security Flow)
- **Mục tiêu:** Đảm bảo người dùng chưa đăng nhập không thể truy cập trái phép vào các tài nguyên nội bộ, đồng thời giữ nguyên trải nghiệm mượt mà.
- **Các bước thực hiện:**
  1. Mở một cửa sổ ẩn danh (Incognito) hoặc Đăng xuất khỏi hệ thống.
  2. Thử gõ trực tiếp đường dẫn `/create` hoặc `/my-blogs` lên thanh địa chỉ trình duyệt.
  3. **Kết quả:** Hệ thống lập tức nhận diện trạng thái chưa xác thực, tự động điều hướng về `/login` kèm thông báo thân thiện *"Vui lòng đăng nhập để tiếp tục"*.
  4. Sau khi đăng nhập thành công, hệ thống tự động đưa người dùng quay trở lại đúng trang họ đang muốn truy cập trước đó (`location.state.from`).

---

## 3. Hướng Dẫn Chạy Lại Dữ Liệu Seed Khi Cần Thiết

Nếu trong quá trình test và phỏng vấn bạn đã chỉnh sửa hoặc xóa bớt dữ liệu, bạn hoàn toàn có thể khôi phục lại trạng thái ban đầu chỉ với 1 câu lệnh:

\`\`\`bash
# Di chuyển vào thư mục backend
cd backend

# Chạy script seed an toàn
npm run seed
\`\`\`

### Cơ Chế An Toàn Của Seed Script:
- Script **chỉ dọn dẹp các tài khoản có đuôi `@spiderum.dev`** và dữ liệu liên kết của chúng.
- Tuyệt đối không xóa bất kỳ tài khoản cá nhân hoặc dữ liệu production nào khác đang có trong cơ sở dữ liệu.
- Tự động mã hóa lại mật khẩu với bcrypt và thiết lập các liên kết quan hệ (ObjectId Reference) chuẩn xác giữa Users, Blogs và Comments.

---

## 4. Ghi Chú Bảo Mật (Security Compliance)

- **Môi trường:** Tài liệu này chỉ áp dụng cho môi trường Demo & Phỏng vấn tuyển dụng.
- **Mã hóa:** Toàn bộ mật khẩu lưu trữ trong cơ sở dữ liệu đều được hash bằng thuật toán `bcryptjs`.
- **Cấu hình môi trường:** Các thông tin nhạy cảm thực tế như MongoDB Atlas Connection String và JWT Secret Key được quản lý độc lập qua tệp `.env` và không bao giờ commit lên GitHub công khai.
