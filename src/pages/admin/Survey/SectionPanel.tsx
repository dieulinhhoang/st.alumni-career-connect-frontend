import { useState } from "react";
import { useSurveyStore } from "../../../feature/survey/hooks/useSurveyStore";
import type { Question, Section } from "../../../feature/survey/type";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { QuestionEditor } from "./QuestionEditor";

const ADD_TYPES :{type :Question['type'], label: string}[] = [
    { type: 'text', label: 'Câu hỏi văn bản' },
    { type: 'multiple-choice', label: 'Câu hỏi nhiều lựa chọn' },
    { type: 'date', label: 'Câu hỏi ngày tháng' },
]

export default function SectionPanel({section}:{section: Section}) {
    // lay data tu store
    const {survey , addQuestion,updateQuestion,deleteQuestion,deleteSection,updateSection} = useSurveyStore();
    const [editTitle, setEditTitle] = useState(false); // xem co edit title khong, mac dinh la false
    const [titleDraft, setTitleDraft] = useState(section.title); // luu title khi edit
    // loc cau hoi thuoc section do
    const questions = survey.questions.filter(q=>q.sectionId === section.id).sort((a,b)=>a.order - b.order);

    return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Section header */}
      <div className="bg-green-800 text-white px-4 py-3 flex items-center gap-3">
        {editTitle ? (
          <Input
            autoFocus
            className="flex-1"
            value={titleDraft}
            onChange={e => setTitleDraft(e.target.value)}
            onBlur={() => { updateSection(section.id,  titleDraft ); setEditTitle(false) }}
            onKeyDown={e => {
              if (e.key === 'Enter') { updateSection(section.id, titleDraft ); setEditTitle(false) }
            }}
          />
        ) : (
          <span
            className="flex-1 font-bold text-sm cursor-pointer hover:underline"
            onDoubleClick={() => { setTitleDraft(section.title); setEditTitle(true) }}
            title="Double click để đổi tên"
          >
           <b>{section.title}</b>
          </span>
        )}
        <span className="text-white/50 text-xs" style={{ marginLeft: '1rem' }} >{questions.length} câu</span>
        <Button
          type="text"
          icon={<DeleteOutlined />}
          className="text-white/50 hover:text-red-300"
          onClick={() => deleteSection(section.id)}
        />
      </div>

      {/* Questions */}
      <div className="p-4 space-y-3 bg-white">
        {questions.length === 0 && (
          <p className="text-center text-gray-300 text-sm py-2">
            Chưa có câu hỏi nào
          </p>
        )}
        {questions.map(q => (
          <QuestionEditor key={q.id} question={q} />
        ))}

        {/* Add question */}
        <div className="flex flex-wrap gap-2 pt-2">
          {ADD_TYPES.map(({ type, label }) => (
            <Button
              key={type}
              size="small"
              onClick={() => addQuestion(section.id, type)}
            >
              + {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
    );
}
