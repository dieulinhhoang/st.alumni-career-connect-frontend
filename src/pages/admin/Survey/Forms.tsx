import { useState } from "react";
import type { SurveyResponse } from "../../../feature/survey/type";
import { useSurveyStore } from "../../../feature/survey/hooks/useSurveyStore";
import { Button, Card, Input, message, Typography } from "antd";
import SectionPanel from "./SectionPanel";
import AdminLayout from "../../../components/layout/AdminLayout";
import FormPreview from "./FormPreview";
import  "./../../../components/css/Forms.css";
import { THEMES } from "../../../feature/survey/theme";

export default function Forms() {
    const { survey, updateMeta, addSection } = useSurveyStore();
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
    const [messageApi, contextHolder] = message.useMessage();
     const handleAddSecion = () => {
        if (newSectionTitle.trim() === '') return;
        addSection(newSectionTitle.trim());
        setNewSectionTitle('');
    }

    const handleSave = () => {
        // call api save survey
        console.log(survey);
        messageApi.success('Lưu thành công!');
    }
    // sort section theo order (copy sang 1 array khac sau do moi loc)
    const sortedSections = [...survey.sections].sort((a, b) => a.order - b.order);
    return (
     <AdminLayout>
        {contextHolder}
         <div className="survey-builder-layout">

             <div className="column editor-sidebar">
                <Typography.Text strong className="block mb-4">1. Cấu trúc câu hỏi</Typography.Text>
                
                <Card title="Thông tin chung" size="small">
                    <Input 
                        value={survey.title} 
                        onChange={e => updateMeta({ title: e.target.value })}
                        className="mb-2"
                        placeholder="Tiêu đề..."
                    />
                    <Input.TextArea 
                        value={survey.description} 
                        onChange={e => updateMeta({ description: e.target.value })}
                        placeholder="Mô tả..."
                    />
                </Card>

                {sortedSections.map(sec => (
                    <SectionPanel key={sec.id} section={sec} />
                ))}

                <div className="add-section-area">
                    <Input
                        placeholder="Tên phần mới..."
                        value={newSectionTitle}
                        onChange={e => setNewSectionTitle(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleAddSecion() }}
                    />
                    <Button className="add-section-btn" onClick={handleAddSecion}>
                        + Thêm section
                    </Button>
                </div>
            </div>

             <div className="column preview-center">
                <div className="preview-paper">
                    <p className="text-center text-gray-400 font-mono text-xs mb-8">— MÀN HÌNH XEM TRƯỚC —</p>
                    <FormPreview  themeId={selectedTheme.id}/>
                </div>
            </div>

             <div className="column theme-sidebar">
                <Typography.Text strong className="block mb-4">Giao diện & Theme</Typography.Text>
                <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-400">
                    Khu vực tùy chỉnh Theme
                     {THEMES.map(theme=>(
                        <div onClick={()=>setSelectedTheme(theme)} key={theme.name} className={`theme-option ${selectedTheme.name === theme.name ? 'selected' : ''}`}>
                            <div className="theme-preview" style={{ backgroundColor: theme.primaryColor }}></div>
                            <span className="theme-name">{theme.name}</span>
                        </div>
                     ))}
                </div>

                <div className="mt-8">
                    <Button type="primary" block size="large" onClick={handleSave}>
                         Lưu khảo sát
                    </Button>
                </div>
            </div>

        </div>
    </AdminLayout>
);
}