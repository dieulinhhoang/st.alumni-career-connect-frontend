export type QuestionType = 'text' | 'multiple-choice' | 'checkbox' | 'address' | 'date' | 'select';
export interface Question {
    id: string;
    type: QuestionType;
    label: string;
    placeholder?: string; // For text type
    options?: string[]; // For multiple-choice, checkbox, and select types
    required: boolean;
     sectionId: string;
    order: number;
}
export interface SurveyHeader {
  logoUrl?: string        // URL ảnh logo
  ministry?: string       // "BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG"
  academy?: string        // "HỌC VIỆN NÔNG NGHIỆP VIỆT NAM"
  address?: string        // "Xã Gia Lâm, Thành phố Hà Nội"
  phone?: string          // "024.62617586"
  fax?: string            // "024.62617586"
  showDate?: boolean      // hiện ngày tự động
}
export interface SurveyFooter {
  primaryText?: string    // dòng bold — "Xin trân trọng cảm ơn..."
  secondaryText?: string  // dòng italic — "Kính chúc Anh/Chị..."
}

export interface Section{
    id:string;
    title:string;
    order:number;
}
export interface Survey{
    id: string;
    title: string;
    description: string;
    sections:Section[];
    questions: Question[];
    defaultHeader: SurveyHeader;
    defaultFooter: SurveyFooter;
}

export interface SurveyResponse {
    surveyId: string;
    responses: {
        questionId: string;
        answer: string | string[]; // string for text, date, and address; string[] for multiple-choice, checkbox, and select
    }[];
}

