import { useState } from "react";
import { useSurveyStore } from "../../../feature/survey/hooks/useSurveyStore";
import { Button, Collapse, Input, message, Typography, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import SectionPanel from "./SectionPanel";
import AdminLayout from "../../../components/layout/AdminLayout";
import FormPreview from "./FormPreview";
import "./../../../components/css/Forms.css";
import { THEMES } from "../../../feature/survey/theme";

export default function Forms() {
    const { survey, updateMeta, addSection, setHeader, setFooter } = useSurveyStore();
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
    const [messageApi, contextHolder] = message.useMessage();

    const handleAddSection = () => {
        if (newSectionTitle.trim() === '') return;
        addSection(newSectionTitle.trim());
        setNewSectionTitle('');
    }

    const handleSave = () => {
        console.log({ survey, theme: selectedTheme.id });
        messageApi.success('Lưu thành công!');
    }

    const handleLogoUpload = (file: File) => {
        const url = URL.createObjectURL(file);
        setHeader({ logoUrl: url });
        return false;
    }

    const sortedSections = [...survey.sections].sort((a, b) => a.order - b.order);
    const header = survey.defaultHeader || {};
    const footer = survey.defaultFooter || {};

    return (
        <AdminLayout>
            {contextHolder}
            <div className="survey-builder-layout">

                {/* CỘT 1: EDITOR */}
                <div className="column editor-sidebar">
                    <div className="sidebar-block">
                        <Collapse defaultActiveKey={['meta']} ghost className="editor-collapse">

                            {/* Thông tin chung + Header + Footer gộp chung */}
                            <Collapse.Panel header="Thông tin khảo sát" key="meta">
                                <div className="field-group">
                                    <p className="field-label">Tiêu đề</p>
                                    <Input value={survey.title} onChange={e => updateMeta({ title: e.target.value })} placeholder="Tiêu đề khảo sát..." />
                                </div>
                                <div className="field-group">
                                    <p className="field-label">Mô tả</p>
                                    <Input.TextArea value={survey.description} onChange={e => updateMeta({ description: e.target.value })} placeholder="Mô tả..." rows={2} />
                                </div>

                                <div className="field-divider">Header</div>

                                <div className="field-group">
                                    <p className="field-label">Logo</p>
                                    <Upload accept="image/*" showUploadList={false} beforeUpload={handleLogoUpload}>
                                        <Button icon={<UploadOutlined />} size="small" block>
                                            {header.logoUrl ? 'Đổi logo' : 'Tải logo lên'}
                                        </Button>
                                    </Upload>
                                    {header.logoUrl && (
                                        <div className="logo-preview-container">
                                            <img src={header.logoUrl} alt="Survey logo" className="logo-preview-image" />
                                            <Button size="small" danger type="text" onClick={() => setHeader({ logoUrl: '' })}>Xóa</Button>
                                        </div>
                                    )}
                                </div>
                                <div className="field-group">
                                    <p className="field-label">Tên bộ</p>
                                    <Input size="small" value={header.ministry || ''} onChange={e => setHeader({ ministry: e.target.value })} placeholder="BỘ NÔNG NGHIỆP..." />
                                </div>
                                <div className="field-group">
                                    <p className="field-label">Tên học viện</p>
                                    <Input size="small" value={header.academy || ''} onChange={e => setHeader({ academy: e.target.value })} placeholder="HỌC VIỆN..." />
                                </div>
                                <div className="field-group">
                                    <p className="field-label">Địa chỉ</p>
                                    <Input size="small" value={header.address || ''} onChange={e => setHeader({ address: e.target.value })} placeholder="Địa chỉ..." />
                                </div>
                                <div className="field-group" style={{ display: 'flex', gap: 8 }}>
                                    <div style={{ flex: 1 }}>
                                        <p className="field-label">Điện thoại</p>
                                        <Input size="small" value={header.phone || ''} onChange={e => setHeader({ phone: e.target.value })} placeholder="024..." />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p className="field-label">Fax</p>
                                        <Input size="small" value={header.fax || ''} onChange={e => setHeader({ fax: e.target.value })} placeholder="024..." />
                                    </div>
                                </div>

                                <div className="field-divider">Footer</div>

                                <div className="field-group">
                                    <p className="field-label">Dòng chính</p>
                                    <Input.TextArea size="small" rows={2} value={footer.primaryText || ''} onChange={e => setFooter({ primaryText: e.target.value })} placeholder="Xin trân trọng cảm ơn..." />
                                </div>
                                <div className="field-group">
                                    <p className="field-label">Dòng phụ</p>
                                    <Input.TextArea size="small" rows={2} value={footer.secondaryText || ''} onChange={e => setFooter({ secondaryText: e.target.value })} placeholder="Kính chúc Anh/Chị..." />
                                </div>
                            </Collapse.Panel>

                            {/* Cấu trúc câu hỏi */}
                            <Collapse.Panel header="Cấu trúc câu hỏi" key="sections">
                                <div className="space-y-3">
                                    {sortedSections.map(sec => (
                                        <SectionPanel key={sec.id} section={sec} />
                                    ))}
                                    <div className="add-section-area">
                                        <Input
                                            placeholder="Tên phần mới..."
                                            value={newSectionTitle}
                                            onChange={e => setNewSectionTitle(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') handleAddSection() }}
                                        />
                                        <Button className="add-section-btn" onClick={handleAddSection}>+ Thêm</Button>
                                    </div>
                                </div>
                            </Collapse.Panel>

                        </Collapse>
                    </div>

                    <div className="sidebar-block" style={{ marginTop: 12 }}>
                        <Button type="primary" block size="large" onClick={handleSave}>
                            Lưu khảo sát
                        </Button>
                    </div>
                </div>

                {/* CỘT 2: PREVIEW */}
                <div className="column preview-center">
                    <div className="preview-paper">
                        <p style={{ textAlign: 'center', fontSize: 10, color: '#bfbfbf', fontFamily: 'monospace', marginBottom: 24, letterSpacing: '0.1em' }}>
                            — MÀN HÌNH XEM TRƯỚC —
                        </p>
                        <FormPreview themeId={selectedTheme.id} />
                    </div>
                </div>

                {/* CỘT 3: THEME */}
                <div className="column theme-sidebar">
                    <div className="sidebar-block">
                        <Typography.Text strong style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>Chọn Theme</Typography.Text>
                        <div className="theme-grid">
                            {THEMES.map(theme => (
                                <div
                                    key={theme.id}
                                    onClick={() => setSelectedTheme(theme)}
                                    className={`theme-card ${selectedTheme.id === theme.id ? 'selected' : ''}`}
                                    style={{ borderColor: selectedTheme.id === theme.id ? theme.primaryColor : '#e8e8e8' }}
                                >
                                    <div className="theme-thumbnail">
                                        <div style={{ background: theme.primaryColor, height: 32, borderRadius: '6px 6px 0 0' }} />
                                        <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                            <div style={{ background: '#ddd', height: 5, borderRadius: 3, width: '70%' }} />
                                            <div style={{ background: '#eee', height: 4, borderRadius: 3, width: '90%' }} />
                                            <div style={{ background: '#eee', height: 4, borderRadius: 3, width: '55%' }} />

                                        </div>
                                    </div>
                                    <p className="theme-card-name" style={{ color: selectedTheme.id === theme.id ? theme.primaryColor : '#555' }}>
                                        {theme.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}