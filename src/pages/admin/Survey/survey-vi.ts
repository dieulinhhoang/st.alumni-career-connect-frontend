import { editorLocalization } from "survey-creator-core";

const viStrings = {
  // --- Tab chính ---
  ed: {
    designer: "Thiết kế",
    Preview: "Xem trước",
    Themes: "Giao diện",
    logic: "Thiết lập Logic",
    JsonEditor: "Chỉnh sửa JSON", // Cái tab mới hiện ở hình 3 của ông đó
    surveySettings: "Cài đặt khảo sát"
  },

  // --- Các nút bấm & Thông báo trạng thái ---
  survey: {
    addNewQuestion: "Thêm câu hỏi mới",
    addPanel: "Thêm nhóm (Panel)",
    dropQuestion: "Thả câu hỏi vào đây",
    emptySurvey: "Biểu mẫu đang trống. Kéo một phần tử từ hộp công cụ hoặc bấm nút bên dưới.",
    completingSurvey: "Đang lưu kết quả...",
    loadingSurvey: "Đang tải biểu mẫu..."
  },

  // --- Property Grid (Cái bảng Survey Settings bên phải trong hình) ---
  pe: {
    // Thuộc tính chung
    name: "Tên (Mã ID)",
    title: "Tiêu đề hiển thị",
    description: "Mô tả chi tiết",
    visible: "Hiển thị?",
    isRequired: "Bắt buộc?",
    readOnly: "Chỉ đọc (Không cho sửa)",
    defaultValue: "Giá trị mặc định",
    placeholder: "Văn bản gợi ý (Placeholder)",
    
    // Cấu hình lựa chọn
    choices: "Các lựa chọn",
    choicesOrder: "Thứ tự sắp xếp lựa chọn",
    colCount: "Số cột hiển thị",
    showNoneItem: "Có mục 'Không chọn gì'",
    showOtherItem: "Có mục 'Khác (ghi rõ)'",
    otherText: "Nhãn cho mục 'Khác'",
    
    // Tab Logic & Validate
    visibleIf: "Chỉ hiển thị nếu...",
    requiredIf: "Bắt buộc nếu...",
    validators: "Quy tắc kiểm tra dữ liệu (Validators)",
    expression: "Biểu thức tính toán"
  },

  // --- Toolbox nâng cao (Mấy cái Matrix ở cuối hình 3) ---
  qt: {
    matrix: "Bảng chọn đơn",
    matrixdropdown: "Bảng chọn thả xuống",
    matrixdynamic: "Bảng nhập liệu động",
    paneldynamic: "Nhóm câu hỏi động",
    multipletext: "Nhiều ô nhập liệu",
    html: "Nội dung HTML/Văn bản"
  }
};

 export const applyVietnamese = () => {
  const locale = editorLocalization.getLocale("vi");
  
  // assign : đè / sao chép thuộc tính từ đối tượng này sang đối tượng khác
  // obj keys : lấy tất cả các khóa (tên thuộc tính) của một đối tượng
  // as mảng  ép kiểu vistring . đè nó zô
  (Object.keys(viStrings) as Array<keyof typeof viStrings>).forEach((key) => {
    Object.assign(locale[key], viStrings[key]);
  });

   editorLocalization.currentLocale = "vi";
};