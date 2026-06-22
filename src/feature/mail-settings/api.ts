import api from '../../libs/api';
import type { EmailConfig, EmailTemplate, UpdateEmailConfigPayload, UpdateEmailTemplatePayload } from './types';

export const getEmailConfigAPI = async (): Promise<EmailConfig> => {
  const { data } = await api.get('/mail-settings/config');
  return data;
};

export const updateEmailConfigAPI = async (payload: UpdateEmailConfigPayload): Promise<EmailConfig> => {
  const { data } = await api.patch('/mail-settings/config', payload);
  return data;
};

export const sendTestEmailAPI = async (to: string): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.post('/mail-settings/config/test', { to });
  return data;
};

export const getAllTemplatesAPI = async (): Promise<EmailTemplate[]> => {
  const { data } = await api.get('/mail-settings/templates');
  return data;
};

export const getTemplateAPI = async (id: number): Promise<EmailTemplate> => {
  const { data } = await api.get(`/mail-settings/templates/${id}`);
  return data;
};

export const getTemplatePreviewAPI = async (id: number): Promise<{ html: string }> => {
  const { data } = await api.get(`/mail-settings/templates/${id}/preview`);
  return data;
};

export const updateTemplateAPI = async (id: number, payload: UpdateEmailTemplatePayload): Promise<EmailTemplate> => {
  const { data } = await api.patch(`/mail-settings/templates/${id}`, payload);
  return data;
};
