 import type {
  Form,
  Question,
  QuestionOption,
  CreateFormPayload,
  UpdateFormPayload,
  GetFormsParams,
  PaginatedResponse,
  AIFormResult,
  QuestionTypeOption,
  QuestionType,
  Theme,
  FontOption,
  RadiusOption,
} from "./types";

// MOCK STORE (xóa khi có backend)

let _store: Form[] = [
  {
    id: 1,
    themeId: "blue",
    name: "Khảo sát việc làm sau tốt nghiệp",
    description: "Khảo sát tình trạng việc làm của sinh viên sau khi tốt nghiệp",
    questions: [
      { id: "q1", type: "short",  title: "Họ và tên",                                   required: true, options: [] },
      { id: "q2", type: "short",  title: "Mã số sinh viên",                             required: true, options: [] },
      { id: "q3", type: "date",   title: "Ngày tốt nghiệp",                             required: true, options: [] },
      {
        id: "q4", type: "radio", title: "Bạn hiện đang làm việc ở đâu?", required: true,
        options: [
          { id: "o1", label: "Doanh nghiệp trong nước" },
          { id: "o2", label: "Doanh nghiệp nước ngoài" },
          { id: "o3", label: "Tự kinh doanh"            },
          { id: "o4", label: "Học tiếp / Nghiên cứu sinh" },
          { id: "o5", label: "Chưa có việc làm"         },
        ],
      },
      {
        id: "q5", type: "radio", title: "Công việc hiện tại có liên quan đến ngành học không?", required: true,
        options: [
          { id: "o1", label: "Đúng chuyên ngành"        },
          { id: "o2", label: "Liên quan một phần"        },
          { id: "o3", label: "Không liên quan"           },
        ],
      },
      { id: "q6", type: "rating", title: "Mức độ phù hợp của công việc với ngành học", required: false, options: [] },
      { id: "q7", type: "rating", title: "Mức độ hài lòng với thu nhập hiện tại",      required: false, options: [] },
      { id: "q8", type: "long",   title: "Nhận xét về chương trình đào tạo",            required: false, options: [] },
    ],
    created_at: "2024-06-15",
    updated_at: "2024-06-15",
  },
  {
    id: 2,
    themeId: "blue",
    name: "Đánh giá chương trình đào tạo",
    description: "Thu thập ý kiến sinh viên về chất lượng đào tạo",
    questions: [
      { id: "q1", type: "short",    title: "Mã sinh viên",                     required: true, options: [] },
      { id: "q2", type: "short",    title: "Tên ngành học",                     required: true, options: [] },
      { id: "q3", type: "rating",   title: "Chất lượng giảng viên",            required: true, options: [] },
      { id: "q4", type: "rating",   title: "Cơ sở vật chất",                   required: true, options: [] },
      { id: "q5", type: "rating",   title: "Tài liệu và học liệu",             required: true, options: [] },
      { id: "q6", type: "rating",   title: "Mức độ hài lòng tổng thể",        required: true, options: [] },
      {
        id: "q7", type: "checkbox", title: "Bạn mong muốn cải thiện điều gì?", required: false,
        options: [
          { id: "o1", label: "Nội dung môn học"       },
          { id: "o2", label: "Phương pháp giảng dạy"  },
          { id: "o3", label: "Trang thiết bị học tập" },
          { id: "o4", label: "Hoạt động ngoại khóa"   },
          { id: "o5", label: "Hỗ trợ sinh viên"       },
          { id: "o6", label: "Kết nối doanh nghiệp"   },
        ],
      },
      { id: "q8", type: "long",     title: "Góp ý thêm cho nhà trường",        required: false, options: [] },
    ],
    created_at: "2024-08-20",
    updated_at: "2024-08-20",
  }
 ];

const _delay = (ms = 250) => new Promise<void>(res => setTimeout(res, ms));
const _today = () => new Date().toISOString().slice(0, 10);
const _genId = () => Math.random().toString(36).slice(2, 8);


// Forms CRUD


export async function getForms(
  params: GetFormsParams = {}
): Promise<PaginatedResponse<Form>> {
  await _delay();
  const { search = "", page = 1, pageSize = 20 } = params;

  let result = [..._store];
  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q)
    );
  }

  const total = result.length;
  const data  = result.slice((page - 1) * pageSize, page * pageSize);
  return { data, total, page, pageSize };
}

export async function getFormById(id: number): Promise<Form> {
  await _delay();
  const form = _store.find(f => f.id === id);
  if (!form) throw new Error(`Form #${id} không tồn tại.`);
  return { ...form, questions: form.questions.map(q => ({ ...q })) };
}

export async function createForm(payload: CreateFormPayload): Promise<Form> {
  await _delay();
  const now  = _today();
  const form: Form = { themeId: "blue", ...payload, id: Date.now(), created_at: now, updated_at: now };
  _store.push(form);
  return { ...form };
}

export async function updateForm(id: number, updates: UpdateFormPayload): Promise<Form> {
  await _delay();
  const idx = _store.findIndex(f => f.id === id);
  if (idx === -1) throw new Error(`Form #${id} không tồn tại.`);
  const updated: Form = { ..._store[idx], ...updates, updated_at: _today() };
  _store[idx] = updated;
  return { ...updated };
}

export async function deleteForm(id: number): Promise<void> {
  await _delay();
  const idx = _store.findIndex(f => f.id === id);
  if (idx === -1) throw new Error(`Form #${id} không tồn tại.`);
  _store.splice(idx, 1);
}

export async function duplicateForm(id: number): Promise<Form> {
  await _delay();
  const src = _store.find(f => f.id === id);
  if (!src) throw new Error(`Form #${id} không tồn tại.`);
  return createForm({
    name:         `${src.name} (bản sao)`,
    description: src.description,
    questions:   src.questions.map(q => ({
      ...q,
      id:      _genId(),
      options: (q.options ?? []).map(o => ({ ...o, id: _genId() })),
    })),
  });
}

 
// AI Generator (GOOGLE GEMINI)
 

const GEMINI_API_KEY = "AIzaSyDgC7-mDSp4ZvmA_m-ua3J52KdSjBSUf3k"
const GEMINI_MODEL   = "gemini-1.5-flash";
const GEMINI_URL     = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDgC7-mDSp4ZvmA_m-ua3J52KdSjBSUf3k`;

// Type cho file đính kèm
interface FileInput {
  base64Data: string; 
  mimeType: string;   
}

/**
 * Gọi Gemini API sinh form từ prompt tiếng Việt và file (PDF/Word/Text) nếu có.
 */
export async function generateFormWithAI(prompt: string, file?: FileInput): Promise<AIFormResult> {
  const parts: any[] = [{ text: _buildAIPrompt(prompt) }];

  if (file) {
    parts.push({
      inline_data: {
        mime_type: file.mimeType,
        data: file.base64Data,
      },
    });
  }

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 1,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Gemini API lỗi: ${err.error?.message || res.statusText}`);
  }

  const data = await res.json();
  const raw  = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  
  return _parseAIResponse(raw);
}

//  AI helpers 

function _buildAIPrompt(userPrompt: string): string {
  return `Tạo một form khảo sát dựa trên yêu cầu sau: "${userPrompt}"

Nếu có tài liệu đính kèm, hãy đọc nội dung để tạo câu hỏi sát thực tế.
Trả về JSON với cấu trúc sau, KHÔNG có markdown hay backtick:
{
  "name": "Tên form ngắn gọn",
  "description": "Mô tả 1-2 câu",
  "questions": [
    {
      "type": "short|long|radio|checkbox|rating|date",
      "title": "Nội dung câu hỏi",
      "required": true|false,
      "options": [{"label":"..."}]
    }
  ]
}

Quy tắc:
- Tạo 5-8 câu hỏi phù hợp.
- "options" chỉ có khi type là "radio" hoặc "checkbox", các type khác để [].
- Viết bằng tiếng Việt, chỉ trả về JSON thuần.`;
}

function _parseAIResponse(raw: string): AIFormResult {
  const parsed = JSON.parse(raw);

  const questions: Question[] = (parsed.questions || []).map((q: any) => ({
    ...q,
    id:      _genId(),
    options: (q.options ?? []).map((o: any) => ({ ...o, id: _genId() })),
  }));

  return {
    name:        parsed.name || "Form mới",
    description: parsed.description || "",
    questions,
  };
}

 
 
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

 
//  QUESTION BANK (câu hỏi mẫu) 
export interface BankQuestion {
  id: string;
  category: string;
  title: string;
  type: QuestionType;
  options?: Array<{ id: string; label: string }>;
}

export const QUESTION_BANK: BankQuestion[] = [
  { id: "b1", category: "Cá nhân", title: "Họ và tên", type: "short" },
  { id: "b2", category: "Cá nhân", title: "Email liên hệ", type: "short" },
  { id: "b3", category: "Cá nhân", title: "Số điện thoại", type: "short" },
  { id: "b4", category: "Cá nhân", title: "Ngày sinh", type: "date" },
  {
    id: "b5", category: "Cá nhân", title: "Giới tính", type: "radio",
    options: [{ id: "o1", label: "Nam" }, { id: "o2", label: "Nữ" }, { id: "o3", label: "Khác" }]
  },
  {
    id: "b6", category: "Học vấn", title: "Trình độ học vấn", type: "radio",
    options: [{ id: "o1", label: "THPT" }, { id: "o2", label: "Cao đẳng" }, { id: "o3", label: "Đại học" }, { id: "o4", label: "Sau đại học" }]
  },
  { id: "b7", category: "Học vấn", title: "Chuyên ngành", type: "short" },
  { id: "b8", category: "Học vấn", title: "Năm tốt nghiệp", type: "short" },
  { id: "b9", category: "Việc làm", title: "Đơn vị / công ty", type: "short" },
  { id: "b10", category: "Việc làm", title: "Chức vụ hiện tại", type: "short" },
  {
    id: "b11", category: "Việc làm", title: "Lĩnh vực làm việc", type: "checkbox",
    options: [{ id: "o1", label: "Nông nghiệp" }, { id: "o2", label: "Công nghệ" }, { id: "o3", label: "Giáo dục" }, { id: "o4", label: "Kinh doanh" }, { id: "o5", label: "Khác" }]
  },
  {
    id: "b12", category: "Việc làm", title: "Thu nhập hàng tháng", type: "radio",
    options: [{ id: "o1", label: "Dưới 5 triệu" }, { id: "o2", label: "5–10 triệu" }, { id: "o3", label: "10–20 triệu" }, { id: "o4", label: "Trên 20 triệu" }]
  },
  { id: "b13", category: "Đánh giá", title: "Mức độ hài lòng", type: "rating" },
  { id: "b14", category: "Đánh giá", title: "Nhận xét chung", type: "long" },
  { id: "b15", category: "Đánh giá", title: "Đề xuất cải thiện", type: "long" },
];