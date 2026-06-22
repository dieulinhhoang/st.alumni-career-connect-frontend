import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getEmailConfigAPI,
  updateEmailConfigAPI,
  sendTestEmailAPI,
  getAllTemplatesAPI,
  getTemplateAPI,
  getTemplatePreviewAPI,
  updateTemplateAPI,
} from '../api';
import type { UpdateEmailConfigPayload, UpdateEmailTemplatePayload } from '../types';

export const useGetEmailConfig = () =>
  useQuery({ queryKey: ['email-config'], queryFn: getEmailConfigAPI });

export const useUpdateEmailConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateEmailConfigPayload) => updateEmailConfigAPI(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['email-config'] }),
  });
};

export const useSendTestEmail = () =>
  useMutation({ mutationFn: (to: string) => sendTestEmailAPI(to) });

export const useGetAllTemplates = () =>
  useQuery({ queryKey: ['email-templates'], queryFn: getAllTemplatesAPI });

export const useGetTemplate = (id: number) =>
  useQuery({ queryKey: ['email-template', id], queryFn: () => getTemplateAPI(id), enabled: !!id });

export const useGetTemplatePreview = (id: number, enabled: boolean) =>
  useQuery({
    queryKey: ['email-template-preview', id],
    queryFn: () => getTemplatePreviewAPI(id),
    enabled: !!id && enabled,
  });

export const useUpdateTemplate = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateEmailTemplatePayload) => updateTemplateAPI(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['email-templates'] });
      qc.invalidateQueries({ queryKey: ['email-template', id] });
      qc.invalidateQueries({ queryKey: ['email-template-preview', id] });
    },
  });
};
