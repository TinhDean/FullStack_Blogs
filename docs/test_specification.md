# Test Specification - Kịch bản Kiểm thử Blog Platform "Spiderum"

Tài liệu này chứa kế hoạch kiểm thử và danh sách các kịch bản test (Test Cases) chi tiết cho cả hai đầu Frontend và Backend của ứng dụng Spiderum Blog.

---

## 1. Kế hoạch Kiểm thử (Test Plan)

* **Phạm vi kiểm thử (Scope)**: Kiểm thử toàn bộ luồng chức năng, giao diện, tính hợp lệ dữ liệu và phân quyền bảo mật.
* **Môi trường thử nghiệm**:
  * Backend: Port 5000 (`http://localhost:5000`)
  * Frontend: Port 3000 (`http://localhost:3000`)
  * Database: Local MongoDB (`mongodb://127.0.0.1:27017/blogs`)
* **Công cụ kiểm thử**:
  * Kiểm thử tự động (Automation Test): Vitest (Backend controllers).
  * Kiểm thử thủ công (Manual Test): Google Chrome DevTools.

---

## 2. Danh sách Kịch bản Kiểm thử (Test Cases)

### Chức năng Đăng ký & Đăng nhập (TC-AUTH)

| Mã Case | Phân loại | Tên kịch bản (Scenario) | Các bước thực hiện (Steps) | Dữ liệu thử nghiệm (Test Data) | Kết quả mong đợi (Expected Result) | Trạng thái thực tế |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-01** | Positive | Đăng ký tài khoản mới thành công | 1. Truy cập `/register`<br>2. Nhập đầy đủ thông tin hợp lệ<br>3. Bấm Đăng ký | - Username: `testuser`<br>- Email: `testuser@gmail.com`<br>- Password: `password123`<br>- Confirm: `password123` | Hệ thống đăng ký thành công, tự động lưu token và chuyển hướng về trang chủ hiển thị badge `testuser`. | **Pass** |
| **TC-AUTH-02** | Boundary | Đăng ký với mật khẩu ngắn dưới 6 kí tự | 1. Truy cập `/register`<br>2. Nhập các thông tin hợp lệ trừ mật khẩu ngắn<br>3. Bấm Đăng ký | - Username: `testuser`<br>- Email: `test@gmail.com`<br>- Password: `12345`<br>- Confirm: `12345` | Hệ thống báo lỗi validation trực quan: "Mật khẩu phải có độ dài tối thiểu 6 ký tự." và không gửi request lên server. | **Pass** |
| **TC-AUTH-03** | Negative | Đăng ký với Email đã tồn tại | 1. Truy cập `/register`<br>2. Nhập email trùng với tài khoản đã đăng ký trước đó<br>3. Bấm Đăng ký | - Email: `testuser@gmail.com` | Hệ thống hiển thị thông báo lỗi từ backend trả về: "Username hoặc Email đã tồn tại". | **Pass** |
| **TC-AUTH-04** | Positive | Đăng nhập tài khoản thành công | 1. Truy cập `/login`<br>2. Nhập thông tin đăng nhập hợp lệ<br>3. Bấm Đăng nhập | - Email: `testuser@gmail.com`<br>- Password: `password123` | Đăng nhập thành công, lưu token JWT vào localStorage, chuyển hướng về trang chủ và cập nhật Navbar. | **Pass** |

---

### Quản lý bài viết (TC-BLOG)

| Mã Case | Phân loại | Tên kịch bản (Scenario) | Các bước thực hiện (Steps) | Dữ liệu thử nghiệm (Test Data) | Kết quả mong đợi (Expected Result) | Trạng thái thực tế |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-BLOG-01** | Positive | Viết bài mới thành công | 1. Đăng nhập<br>2. Bấm nút "Viết bài"<br>3. Điền Tiêu đề, Danh mục, Nội dung hợp lệ<br>4. Bấm Xuất bản | - Title: `Học React JS`<br>- Category: `Lập trình`<br>- Content: `Nội dung hướng dẫn React...` | Bài viết được tạo thành công trong DB, chuyển hướng người dùng sang trang chi tiết bài viết mới tạo. | **Pass** |
| **TC-BLOG-02** | Validation | Tạo bài viết để trống tiêu đề hoặc nội dung | 1. Bấm nút "Viết bài"<br>2. Bỏ trống tiêu đề hoặc nội dung<br>3. Bấm Xuất bản | - Title: ` ` (khoảng trắng)<br>- Content: ` ` | Hiển thị thông báo cảnh báo màu đỏ: "Tiêu đề và Nội dung bài viết không được để trống." | **Pass** |
| **TC-BLOG-03** | Positive | Chỉnh sửa bài viết của chính mình | 1. Vào bài viết do mình viết<br>2. Bấm "Sửa bài"<br>3. Thay đổi tiêu đề bài viết<br>4. Bấm Lưu thay đổi | - New Title: `Học React JS nâng cao` | Bài viết cập nhật tiêu đề mới thành công trên UI và database. | **Pass** |
| **TC-BLOG-04** | Positive | Xóa bài viết của chính mình | 1. Vào bài viết do mình viết<br>2. Bấm "Xóa bài"<br>3. Chọn OK trên hộp thoại xác nhận | - | Bài viết được xóa khỏi database (hoặc đánh dấu xóa), điều hướng người dùng về trang chủ và không hiển thị bài viết đó. | **Pass** |

---

### Bình luận & Tương tác (TC-INT)

| Mã Case | Phân loại | Tên kịch bản (Scenario) | Các bước thực hiện (Steps) | Dữ liệu thử nghiệm (Test Data) | Kết quả mong đợi (Expected Result) | Trạng thái thực tế |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-INT-01** | Positive | Tăng số lượt xem (Views) khi mở bài | 1. Ở trang chủ, bấm vào xem một bài viết bất kỳ<br>2. Quan sát số lượt xem hiển thị | - | Số lượt xem của bài viết tăng thêm 1 đơn vị so với trước khi mở. | **Pass** |
| **TC-INT-02** | Positive | Tăng lượt thích (Likes) bài viết | 1. Mở bài viết bất kỳ<br>2. Bấm nút "Thích bài viết" | - | Lượt thích của bài viết tăng ngay 1 đơn vị trên giao diện. | **Pass** |
| **TC-INT-03** | Positive | Gửi bình luận thành công | 1. Đăng nhập<br>2. Mở bài viết bất kỳ<br>3. Nhập văn bản bình luận<br>4. Bấm Gửi bình luận | - Content: `Bài viết rất hữu ích!` | Bình luận được thêm vào DB và xuất hiện ngay lập tức trong danh sách bình luận dưới bài viết dưới tên tài khoản. | **Pass** |

---

### Phân quyền & Bảo mật (TC-SEC)

| Mã Case | Phân loại | Tên kịch bản (Scenario) | Các bước thực hiện (Steps) | Dữ liệu thử nghiệm (Test Data) | Kết quả mong đợi (Expected Result) | Trạng thái thực tế |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-SEC-01** | Negative | Viết bình luận khi chưa đăng nhập | 1. Ở trạng thái chưa đăng nhập, mở một bài viết bất kỳ | - | - Khung nhập bình luận và nút Gửi bị ẩn.<br>- Hiển thị banner cảnh báo: "Bạn cần Đăng nhập để tham gia bình luận." | **Pass** |
| **TC-SEC-02** | Negative | Cố tình truy cập trang viết bài khi chưa đăng nhập | 1. Chưa đăng nhập<br>2. Gõ trực tiếp URL `/create` trên trình duyệt | - | Hệ thống tự động chuyển hướng người dùng về trang Đăng nhập (`/login`). | **Pass** |
| **TC-SEC-03** | Negative | Người dùng khác sửa bài viết của tác giả | 1. Đăng nhập tài khoản A<br>2. Truy cập URL `/blog/:id/edit` của bài viết do tài khoản B viết | - ID bài viết của B | Hệ thống hiển thị thông báo lỗi quyền truy cập: "Bạn không có quyền chỉnh sửa bài viết của người khác." và ẩn form. | **Pass** |

---

### Giao diện phản hồi & hiển thị (TC-RSP)

| Mã Case | Phân loại | Tên kịch bản (Scenario) | Các bước thực hiện (Steps) | Dữ liệu thử nghiệm (Test Data) | Kết quả mong đợi (Expected Result) | Trạng thái thực tế |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-RSP-01** | Responsive | Responsive hiển thị trên Mobile | 1. Mở Chrome DevTools<br>2. Chọn chế độ xem di động (375px)<br>3. Kiểm tra Navbar và Sidebar | - Kích thước 375px | - Sidebar danh mục chuyển thành danh sách cuộn ngang mượt mà.<br>- Không bị lỗi vỡ layout hoặc tràn màn hình ngang. | **Pass** |
