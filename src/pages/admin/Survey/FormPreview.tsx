import { Checkbox, DatePicker, Form, Input, Radio, Select, Space } from "antd";
import { useSurveyStore } from "../../../feature/survey/hooks/useSurveyStore";
import "./../../../components/css/survey.css";
interface Props {
  themeId?: string
}

export default function FormPreview({ themeId = 'academic' }: Props) {
  const { survey } = useSurveyStore();
  const sortedSections = [...survey.sections].sort((a, b) => a.order - b.order);
  const header = survey.defaultHeader || {};
  const footer = survey.defaultFooter || {};
  if (sortedSections.length === 0) {
    return (
      <div className="text-center text-gray-400 py-20">
        <p>Chưa có section nào</p>
      </div>
    );
  }

  return (
    <div className="theme-academic">

      {/* HEADER */}
      <div className="fp-header">
        {header.logoUrl && (
          <img src={header.logoUrl} alt="Logo" className="fp-logo" />
        )}
        {header.showDate && (
           <p className="fp-date">
            Ngày {new Date().getDate()} / {new Date().getMonth() + 1} / {new Date().getFullYear()}
          </p>
        )}
        <p className="fp-ministry">{ header.ministry }</p>
        <p className="fp-academy">{ header.academy }</p>
        <p className="fp-address">{ header.address }</p>
         {(header.phone || header.fax) && (
        <p className="fp-contact">
          Điện thoại: {header.phone} - Fax: {header.fax}
        </p>
         )}
      </div>

      {/* TIÊU ĐỀ */}
      <div className="fp-title-block">
        <h1 className="fp-title">{survey.title || 'TIÊU ĐỀ KHẢO SÁT'}</h1>
        {survey.description && (
          <p className="fp-description">{survey.description}</p>
        )}
      </div>

      <hr className="fp-divider" />

      {/* SECTIONS */}
      <div className="fp-sections">
        {sortedSections.map((section, sIdx) => {
          const questions = survey.questions
            .filter(q => q.sectionId === section.id)
            .sort((a, b) => a.order - b.order)

          return (
            <div key={section.id} className="fp-section">
              <div className="fp-section-title">{section.title}</div>
              <Form layout="vertical" className="fp-form">
                {questions.length === 0 && (
                  <p className="fp-empty">Chưa có câu hỏi</p>
                )}
                {questions.map((q, qIdx) => (
                  <Form.Item
                    key={q.id}
                    className="fp-form-item"
                    label={
                      <span className="fp-question-label">
                        {sIdx + 1}.{qIdx + 1}. {q.label || 'Câu hỏi chưa có tiêu đề'}
                        {q.required && <span className="fp-required"> *</span>}
                      </span>
                    }
                  >
                    {q.type === 'text' && (
                      <Input className="fp-input" placeholder={q.placeholder || ''} disabled />
                    )}
                    {q.type === 'multiple-choice' && (
                      <Radio.Group disabled>
                        <Space direction="vertical">
                          {q.options?.map(opt => (
                            <Radio key={opt} value={opt} className="fp-radio">{opt}</Radio>
                          ))}
                        </Space>
                      </Radio.Group>
                    )}
                    {q.type === 'checkbox' && (
                      <Space direction="vertical">
                        {q.options?.map(opt => (
                          <Checkbox key={opt} disabled className="fp-checkbox">{opt}</Checkbox>
                        ))}
                      </Space>
                    )}
                    {q.type === 'select' && (
                      <Select className="w-full" disabled placeholder="-- Chọn --"
                        options={q.options?.map(o => ({ label: o, value: o }))} />
                    )}
                    {q.type === 'date' && (
                      <DatePicker className="w-full" disabled />
                    )}
                  </Form.Item>
                ))}
              </Form>
            </div>
          )
        })}
      </div>

      {/* FOOTER */}
      <div className="fp-footer">
        <p>{footer.primaryText}</p>
        <p>{footer.secondaryText}</p>
      </div>

    </div>
  )
}