import type { Form } from "../types";
import { genId } from "./Useformutils";
import mammoth from "mammoth";  
import * as pdfjs from "pdfjs-dist";  

// Cấu hình PDF Worker  
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const GROQ_KEY =   "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" ; 
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL    = "llama-3.3-70b-versatile"; 

const SYSTEM_PROMPT = `Bạn là máy chủ JSON. Nhiệm vụ: Phân tích văn bản từ tài liệu và tạo JSON form khảo sát.
Cấu trúc: {"name":"...","description":"...","questions":[{"type":"short|long|radio|checkbox|rating|date","title":"...","required":true,"options":[{"label":"..."}]}]}
Chỉ trả về JSON duy nhất, không giải thích. Ngôn ngữ: Tiếng Việt.`;

// Hàm phụ để đọc text từ File
async function extractTextFromFile(file: File): Promise<string> {
  const type = file.type;

  // 1. Xử lý file Word (.docx)
  if (type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  }

  // 2. Xử lý file PDF
  if (type === "application/pdf") {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return fullText;
  }

  // 3. File Text bình thường
  return await file.text();
}

export async function generateFormWithAI(
  prompt: string,
  file?: File | null 
): Promise<Omit<Form, "id" | "created_at" | "themeId">> {
  
  let contentFromFile = "";
  if (file) {
    try {
      contentFromFile = await extractTextFromFile(file);
    } catch (e) {
      console.error("Không thể đọc file:", e);
    }
  }

  const userMsg = `Yêu cầu: ${prompt || "Tạo form"}\n\nNội dung tài liệu đính kèm:\n${contentFromFile}\n\nOUTPUT_FORMAT: JSON ONLY.`;

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMsg }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,
      }),
    });

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    return {
      name: parsed.name || "Form từ tài liệu",
      description: parsed.description || "",
      questions: (parsed.questions ?? []).map((q: any) => ({
        ...q,
        id: genId(),
        options: (q.options ?? []).map((o: any) => ({ label: o.label, id: genId() })),
      })),
    };
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
}