import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import CustomTable from '../../../components/common/customTable';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { fetchAllForms } from '../../../feature/form/api';
import {
  confirmLegacyImport,
  fetchFaculties,
  fetchMajors,
  previewLegacyImport,
  type FacultyOption,
  type MajorOption,
} from '../../../feature/legacyImport/api';
import type {
  ConfirmImportPayload,
  MajorGroupDecision,
  PreviewImportResult,
} from '../../../feature/legacyImport/types';
import AdminLayout from "../../../components/layout/AdminLayout";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function LegacyImportPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [systemForm, setSystemForm] = useState<{ id: number; name: string } | null>(null);
  const [majors, setMajors] = useState<MajorOption[]>([]);
  const [faculties, setFaculties] = useState<FacultyOption[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [preview, setPreview] = useState<PreviewImportResult | null>(null);
  const [decisions, setDecisions] = useState<Record<string, MajorGroupDecision>>({});

  useEffect(() => {
    fetchAllForms().then((data) => {
      const sys = data
        .filter((f) => f.isSystem)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];
      if (sys) {
        const entry = { id: Number(sys.id), name: sys.name };
        setSystemForm(entry);
        form.setFieldValue('formId', entry.id);
      }
    });
    fetchMajors().then(setMajors);
    fetchFaculties().then(setFaculties);
  }, []);

  const handlePreview = async () => {
    try {
      if (!systemForm) {
        message.error('Không tìm thấy form hệ thống');
        return;
      }
      if (!file) {
        message.warning('Vui lòng chọn file Excel (.xlsx)');
        return;
      }
      setPreviewLoading(true);
      const result = await previewLegacyImport(file, systemForm.id);
      setPreview(result);

      const initialDecisions: Record<string, MajorGroupDecision> = {};
      for (const mg of result.majorGroups) {
        initialDecisions[mg.oldCode] = {
          oldCode: mg.oldCode,
          industryName: mg.industryName,
          matchedMajorId: mg.matchedMajorId ?? undefined,
        };
      }
      setDecisions(initialDecisions);
    } catch (err: any) {
      if (err?.errorFields) return; // lỗi validate form
      message.error(err?.response?.data?.message ?? 'Xem trước thất bại');
    } finally {
      setPreviewLoading(false);
    }
  };

  const updateDecision = (oldCode: string, patch: Partial<MajorGroupDecision>) => {
    setDecisions((prev) => ({
      ...prev,
      [oldCode]: { ...prev[oldCode], ...patch },
    }));
  };

  const allMajorsDecided = useMemo(() => {
    if (!preview) return false;
    return preview.majorGroups.every((mg) => {
      const d = decisions[mg.oldCode];
      return !!d && (d.matchedMajorId != null || (d.newMajor?.code && d.newMajor?.name));
    });
  }, [preview, decisions]);

  const handleConfirm = async () => {
    if (!preview) return;
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      const [startDate, endDate] = values.dateRange ?? [];
      const payload: ConfirmImportPayload = {
        formId: values.formId,
        batch: {
          title: values.title,
          year: values.year,
          startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : '',
          endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : '',
          graduationName: values.graduationName,
        },
        majorGroups: preview.majorGroups.map((mg) => decisions[mg.oldCode]),
        roster: preview.roster,
        responses: preview.responses,
      };
      const res = await confirmLegacyImport(payload);
      message.success(`Đã tạo đợt khảo sát mới #${res.batchId}`);
      navigate('/admin/alumni/batches');
    } catch (err: any) {
      if (err?.errorFields) return;
      message.error(err?.response?.data?.message ?? 'Import thất bại');
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <AdminLayout>
    <div>
      <Title level={3}>Nhập dữ liệu khảo sát từ file Excel báo cáo cũ</Title>

      <Card title="1. Thông tin đợt khảo sát mới" style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="formId" label="Form khảo sát">
                <Text>{systemForm ? systemForm.name : 'Đang tải...'}</Text>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="title" label="Tên đợt khảo sát" rules={[{ required: true, message: 'Nhập tên đợt' }]}>
                <Input placeholder="Báo cáo tổng hợp năm 2024" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="year" label="Năm" rules={[{ required: true, message: 'Nhập năm' }]}>
                <InputNumber style={{ width: '100%' }} placeholder="2024" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="dateRange" label="Thời gian khảo sát" rules={[{ required: true, message: 'Chọn khoảng thời gian' }]}>
                <RangePicker
                  placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="graduationName" label="Tên đợt tốt nghiệp mới" rules={[{ required: true, message: 'Nhập tên đợt tốt nghiệp' }]}>
                <Input placeholder="Tốt nghiệp - 2024 (Khoa CNTT)" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="2. Upload file Excel báo cáo cũ" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Upload.Dragger
            accept=".xlsx"
            maxCount={1}
            beforeUpload={(f) => {
              setFile(f);
              return false;
            }}
            onRemove={() => setFile(null)}
            fileList={file ? [{ uid: '-1', name: file.name } as any] : []}
          >
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p>Kéo thả hoặc bấm để chọn file "Báo cáo tổng hợp" (.xlsx)</p>
          </Upload.Dragger>
          <Button type="primary" icon={<UploadOutlined />} loading={previewLoading} onClick={handlePreview}>
            Xem trước
          </Button>
        </Space>
      </Card>

      {preview && (
        <>
          <Card title="3. Mã ngành cần đối chiếu" style={{ marginBottom: 16 }}>
            <CustomTable
              rowKey="oldCode"
              data={preview.majorGroups}
              pagination={false}
              columns={[
                { title: 'Mã ngành (cũ)', dataIndex: 'oldCode' },
                { title: 'Tên ngành (file cũ)', dataIndex: 'industryName' },
                { title: 'Tổng SV', dataIndex: 'total', width: 90 },
                { title: 'Đã phản hồi', dataIndex: 'responded', width: 100 },
                {
                  title: 'Map vào ngành',
                  width: 420,
                  render: (_: any, mg) => {
                    const decision = decisions[mg.oldCode];
                    const isNew = !!decision?.newMajor;
                    return (
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Select
                          style={{ width: '100%' }}
                          placeholder="Chọn ngành có sẵn hoặc tạo mới"
                          value={isNew ? '__new__' : decision?.matchedMajorId}
                          onChange={(val) => {
                            if (val === '__new__') {
                              updateDecision(mg.oldCode, {
                                matchedMajorId: undefined,
                                newMajor: { code: '', name: mg.industryName },
                              });
                            } else {
                              updateDecision(mg.oldCode, { matchedMajorId: val, newMajor: undefined });
                            }
                          }}
                          options={[
                            ...majors.map((m) => ({ value: m.id, label: `${m.code} - ${m.name}` })),
                            { value: '__new__', label: '+ Tạo ngành mới' },
                          ]}
                          showSearch
                          optionFilterProp="label"
                        />
                        {isNew && (
                          <Space>
                            <Input
                              placeholder="Mã ngành mới"
                              style={{ width: 120 }}
                              value={decision?.newMajor?.code}
                              onChange={(e) =>
                                updateDecision(mg.oldCode, {
                                  newMajor: { ...decision!.newMajor!, code: e.target.value },
                                })
                              }
                            />
                            <Input
                              placeholder="Tên ngành mới"
                              style={{ width: 180 }}
                              value={decision?.newMajor?.name}
                              onChange={(e) =>
                                updateDecision(mg.oldCode, {
                                  newMajor: { ...decision!.newMajor!, name: e.target.value },
                                })
                              }
                            />
                            <Select
                              placeholder="Khoa"
                              style={{ width: 140 }}
                              value={decision?.newMajor?.facultyId}
                              onChange={(val) =>
                                updateDecision(mg.oldCode, {
                                  newMajor: { ...decision!.newMajor!, facultyId: val },
                                })
                              }
                              options={faculties.map((f) => ({ value: f.id, label: f.name }))}
                              allowClear
                            />
                          </Space>
                        )}
                      </Space>
                    );
                  },
                },
              ]}
            />
          </Card>

          <Card title="4. Số liệu tổng hợp dự kiến (so sánh với 'Mẫu báo cáo 1' của file gốc)" style={{ marginBottom: 16 }}>
            <CustomTable
              rowKey="oldCode"
              data={preview.previewStats}
              pagination={false}
              scroll={{ x: 'max-content' }}
              columns={[
                { title: 'Ngành', dataIndex: 'industryName' },
                { title: 'Tổng SV', dataIndex: 'total' },
                { title: 'Nữ', dataIndex: 'totalNu' },
                { title: 'Phản hồi', dataIndex: 'submitted' },
                { title: 'Phản hồi nữ', dataIndex: 'submittedNu' },
                { title: 'Đúng ngành', dataIndex: 'dungNganh' },
                { title: 'Liên quan', dataIndex: 'lienQuan' },
                { title: 'Không liên quan', dataIndex: 'khongLienQuan' },
                { title: 'Tiếp tục học', dataIndex: 'tiepTucHoc' },
                { title: 'Chưa có VL', dataIndex: 'chuaCoVl' },
                { title: 'Nhà nước', dataIndex: 'kvNhaNuoc' },
                { title: 'Tư nhân', dataIndex: 'kvTuNhan' },
                { title: 'Tự tạo', dataIndex: 'kvTuTao' },
                { title: 'Nước ngoài', dataIndex: 'kvYNuocNgoai' },
              ]}
            />
          </Card>

          <Card>
            <Space direction="vertical">
              {!allMajorsDecided && <Text type="warning">Vui lòng map đầy đủ các ngành ở bước 3 trước khi xác nhận.</Text>}
              <Button type="primary" size="large" disabled={!allMajorsDecided} loading={confirmLoading} onClick={handleConfirm}>
                Xác nhận import
              </Button>
            </Space>
          </Card>
        </>
      )}
    </div>
    </AdminLayout>
  );
}
