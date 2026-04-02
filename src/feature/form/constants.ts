import type { Theme, Form } from "./types";
import type { QuestionTypeOption, FontOption, RadiusOption } from "./types";

//  QUESTION TYPES 
export const Q_TYPES: QuestionTypeOption[] = [
  { value: "short",    label: "Văn bản ngắn",   icon: "" },
  { value: "long",     label: "Văn bản dài",     icon: "" },
  { value: "radio",    label: "Một lựa chọn",   icon: "" },
  { value: "checkbox", label: "Nhiều lựa chọn", icon: "" },
  { value: "rating",   label: "Thang điểm",     icon: "" },
  { value: "date",     label: "Ngày tháng",      icon: "" },
];

//  THEMES 
export const THEMES: Theme[] = [
  { id:"purple",  name:"Tím VNUA",    accent:"#6d28d9", header:"#6d28d9", bg:"#f5f3ff", font:"'Be Vietnam Pro',sans-serif", radius:"12px" },
  { id:"blue",    name:"Xanh dương",  accent:"#1d4ed8", header:"#1d4ed8", bg:"#eff6ff", font:"'Be Vietnam Pro',sans-serif", radius:"12px" },
  { id:"green",   name:"Xanh lá",     accent:"#15803d", header:"#15803d", bg:"#f0fdf4", font:"'Be Vietnam Pro',sans-serif", radius:"12px" },
  { id:"red",     name:"Đỏ hồng",     accent:"#be123c", header:"#be123c", bg:"#fff1f2", font:"'Be Vietnam Pro',sans-serif", radius:"12px" },
  { id:"teal",    name:"Xanh ngọc",   accent:"#0f766e", header:"#0f766e", bg:"#f0fdfa", font:"'Be Vietnam Pro',sans-serif", radius:"12px" },
  { id:"orange",  name:"Cam",         accent:"#c2410c", header:"#c2410c", bg:"#fff7ed", font:"'Be Vietnam Pro',sans-serif", radius:"12px" },
  { id:"dark",    name:"Tối giản",    accent:"#18181b", header:"#18181b", bg:"#fafafa", font:"'DM Mono',monospace",         radius:"6px"  },
  { id:"pastel",  name:"Pastel nhẹ",  accent:"#7c3aed", header:"#c4b5fd", bg:"#faf5ff", font:"'Nunito',sans-serif",         radius:"20px" },
];

//  ACCENT COLORS 
export const ACCENT_COLORS = [
  "#6d28d9","#1d4ed8","#15803d","#be123c","#0f766e",
  "#c2410c","#0369a1","#7e22ce","#92400e","#18181b",
];

//  FONTS 
export const FONTS: FontOption[] = [
  { name:"Be Vietnam Pro", val:"'Be Vietnam Pro',sans-serif" },
  { name:"Serif",          val:"Georgia,serif" },
  { name:"Mono",           val:"'DM Mono',monospace" },
  { name:"Nunito",         val:"'Nunito',sans-serif" },
];

//  RADIUS OPTIONS 
export const RADIUS_OPTIONS: RadiusOption[] = [
  { name:"Vuông",   val:"4px"  },
  { name:"Vừa",     val:"12px" },
  { name:"Tròn",    val:"20px" },
];

//  AI SUGGESTIONS 
export const SUGGESTIONS = [
  "Khảo sát việc làm cựu sinh viên sau tốt nghiệp",
  "Đánh giá chất lượng giảng viên và môn học",
  "Khảo sát mức độ hài lòng về cơ sở vật chất",
  "Thu thập phản hồi về chương trình thực tập",
  "Khảo sát nhu cầu học bổng sinh viên khó khăn",
];

//  MOCK DATA — Prefilled from PDF 655185_Ngô_Xuân_Sáng 
export const MOCK_FORMS: Form[] = [
  {
    id: 1,
    name: "Khảo sát tình hình việc làm sinh viên tốt nghiệp 2024",
    description:
      "Học viện Nông nghiệp Việt Nam – Phiếu khảo sát tình hình việc làm của sinh viên tốt nghiệp năm 2024.",
    themeId: "green",
    created_at: "2026-03-02",
    questions: [
      { id:"q01", type:"short",    title:"Mã sinh viên",             required:true,  options:[] },
      { id:"q02", type:"short",    title:"Họ và tên",                required:true,  options:[] },
      { id:"q03", type:"radio",    title:"Giới tính",                required:true,
        options:[{id:"o1",label:"Nam"},{id:"o2",label:"Nữ"},{id:"o3",label:"Khác"}] },
      { id:"q04", type:"date",     title:"Ngày sinh",                required:true,  options:[] },
      { id:"q05", type:"short",    title:"Mã ngành đào tạo",         required:true,  options:[] },
      { id:"q06", type:"short",    title:"Tên ngành được đào tạo",   required:true,  options:[] },
      { id:"q07", type:"short",    title:"Số điện thoại",            required:true,  options:[] },
      { id:"q08", type:"short",    title:"Email",                    required:true,  options:[] },
      { id:"q09", type:"radio",    title:"Tình trạng việc làm hiện tại", required:true,
        options:[
          {id:"o1",label:"Đã có việc làm"},
          {id:"o2",label:"Đang tiếp tục học"},
          {id:"o3",label:"Chưa có việc làm"},
          {id:"o4",label:"Chưa đi tìm việc"},
        ],
      },
      { id:"q10", type:"short",    title:"Tên đơn vị tuyển dụng",   required:false, options:[] },
      { id:"q11", type:"date",     title:"Thời gian tuyển dụng",     required:false, options:[] },
      { id:"q12", type:"short",    title:"Chức vụ / Vị trí việc làm", required:false, options:[] },
      { id:"q13", type:"radio",    title:"Khu vực làm việc",         required:false,
        options:[
          {id:"o1",label:"Khu vực Nhà nước"},
          {id:"o2",label:"Khu vực tư nhân"},
          {id:"o3",label:"Khu vực có yếu tố nước ngoài"},
          {id:"o4",label:"Tự tạo việc làm"},
        ],
      },
      { id:"q14", type:"radio",    title:"Sau tốt nghiệp, Anh/Chị có việc làm từ khi nào?", required:false,
        options:[
          {id:"o1",label:"Dưới 3 tháng"},
          {id:"o2",label:"Từ 3 tháng đến dưới 6 tháng"},
          {id:"o3",label:"Từ 6 tháng đến dưới 12 tháng"},
          {id:"o4",label:"Từ 12 tháng trở lên"},
        ],
      },
      { id:"q15", type:"radio",    title:"Công việc có phù hợp với ngành đào tạo không?", required:false,
        options:[
          {id:"o1",label:"Đúng ngành đào tạo"},
          {id:"o2",label:"Liên quan đến ngành đào tạo"},
          {id:"o3",label:"Không liên quan đến ngành đào tạo"},
        ],
      },
      { id:"q16", type:"radio",    title:"Công việc có phù hợp với trình độ chuyên môn không?", required:false,
        options:[
          {id:"o1",label:"Phù hợp với trình độ chuyên môn"},
          {id:"o2",label:"Chưa phù hợp với trình độ chuyên môn"},
        ],
      },
      { id:"q17", type:"radio",    title:"Anh/Chị có học được kiến thức và kỹ năng cần thiết từ nhà trường không?", required:false,
        options:[
          {id:"o1",label:"Đã học được"},
          {id:"o2",label:"Không học được"},
          {id:"o3",label:"Chỉ học được một phần"},
        ],
      },
      { id:"q18", type:"short",    title:"Mức lương khởi điểm (triệu đồng/tháng)", required:false, options:[] },
      { id:"q19", type:"radio",    title:"Mức thu nhập bình quân/tháng hiện nay", required:false,
        options:[
          {id:"o1",label:"Dưới 5 triệu"},
          {id:"o2",label:"Từ 5 triệu đến dưới 10 triệu"},
          {id:"o3",label:"Từ 10 triệu đến dưới 15 triệu"},
          {id:"o4",label:"Từ 15 triệu trở lên"},
        ],
      },
      { id:"q20", type:"checkbox", title:"Hình thức tìm được việc làm (có thể chọn nhiều)", required:false,
        options:[
          {id:"o1",label:"Do Học viện/Khoa giới thiệu"},
          {id:"o2",label:"Bạn bè, người quen giới thiệu"},
          {id:"o3",label:"Tự tìm việc làm"},
          {id:"o4",label:"Tự tạo việc làm"},
          {id:"o5",label:"Hình thức khác (nhập ngũ, v.v.)"},
        ],
      },
      { id:"q21", type:"checkbox", title:"Hình thức tuyển dụng", required:false,
        options:[
          {id:"o1",label:"Thi tuyển"},
          {id:"o2",label:"Xét tuyển"},
          {id:"o3",label:"Hợp đồng"},
          {id:"o4",label:"Biệt phái"},
          {id:"o5",label:"Điều động"},
          {id:"o6",label:"Hình thức khác"},
        ],
      },
      { id:"q22", type:"checkbox", title:"Kỹ năng mềm cần thiết trong công việc (có thể chọn nhiều)", required:false,
        options:[
          {id:"o1",label:"Kỹ năng giao tiếp"},
          {id:"o2",label:"Kỹ năng lãnh đạo"},
          {id:"o3",label:"Kỹ năng thuyết trình"},
          {id:"o4",label:"Kỹ năng tiếng Anh"},
          {id:"o5",label:"Kỹ năng làm việc nhóm"},
          {id:"o6",label:"Kỹ năng tin học"},
          {id:"o7",label:"Kỹ năng viết báo cáo tài liệu"},
          {id:"o8",label:"Kỹ năng hội nhập quốc tế"},
        ],
      },
      { id:"q23", type:"checkbox", title:"Khóa học nâng cao sau tuyển dụng (có thể chọn nhiều)", required:false,
        options:[
          {id:"o1",label:"Nâng cao kiến thức chuyên môn"},
          {id:"o2",label:"Nâng cao kỹ năng chuyên môn nghiệp vụ"},
          {id:"o3",label:"Nâng cao kỹ năng công nghệ thông tin"},
          {id:"o4",label:"Nâng cao kỹ năng ngoại ngữ"},
          {id:"o5",label:"Phát triển kỹ năng quản lý"},
          {id:"o6",label:"Tiếp tục học thạc sĩ, tiến sĩ"},
          {id:"o7",label:"Khóa học khác"},
        ],
      },
      { id:"q24", type:"checkbox", title:"Giải pháp giúp tăng tỷ lệ có việc làm đúng ngành (có thể chọn nhiều)", required:false,
        options:[
          {id:"o1",label:"Học viện tổ chức trao đổi kinh nghiệm tìm việc giữa cựu SV với SV"},
          {id:"o2",label:"Học viện tổ chức trao đổi giữa đơn vị tuyển dụng với sinh viên"},
          {id:"o3",label:"Đơn vị sử dụng lao động tham gia vào quá trình đào tạo"},
          {id:"o4",label:"Chương trình đào tạo điều chỉnh theo nhu cầu thị trường"},
          {id:"o5",label:"Tăng cường hoạt động thực hành và chuyên môn tại cơ sở"},
          {id:"o6",label:"Các giải pháp khác"},
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Đánh giá chương trình đào tạo",
    description: "Thu thập ý kiến về chất lượng đào tạo",
    themeId: "blue",
    created_at: "2025-08-20",
    questions: [
      { id:"q1", type:"short",  title:"Mã sinh viên",         required:true,  options:[] },
      { id:"q2", type:"rating", title:"Chất lượng giảng viên", required:true,  options:[] },
    ],
  },
  {
    id: 3,
    name: "Khảo sát doanh nghiệp đối tác",
    description: "Phản hồi từ doanh nghiệp về sinh viên thực tập",
    themeId: "purple",
    created_at: "2025-09-01",
    questions: [
      { id:"q1", type:"short",  title:"Tên doanh nghiệp",    required:true,  options:[] },
      { id:"q2", type:"rating", title:"Chất lượng sinh viên", required:true,  options:[] },
    ],
  },
];