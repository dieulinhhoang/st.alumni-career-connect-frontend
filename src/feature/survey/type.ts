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
}

export interface SurveyResponse {
    surveyId: string;
    responses: {
        questionId: string;
        answer: string | string[]; // string for text, date, and address; string[] for multiple-choice, checkbox, and select
    }[];
}

