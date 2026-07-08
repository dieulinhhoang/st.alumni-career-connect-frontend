import { useCallback, useState } from 'react'
import { createForm, updateForm, publishForm, unpublishForm } from '../api'
import type { Form, Question, Section, SurveyHeader, SurveyFooter } from '../types'
import type { LogicRule } from '../../../pages/system/Form/builder/BuilderView'

export interface SaveExtras {
  header?: SurveyHeader
  footer?: SurveyFooter
  logoUrl?: string
  logoSize?: number
  logicRules?: LogicRule[]
  themeId?: string
  descriptionParagraphs?: string[]
}

interface Params {
  name: string
  desc: string
  questions: Question[]
  sections: Section[]
  savedFormIdRef: React.MutableRefObject<number | null>
}

export interface FormPersistence {
  saving: boolean; saved: boolean; saveError: string; handleSave: (extras?: SaveExtras) => Promise<Form | null>
  publishing: boolean; published: boolean; publishError: string
  handlePublish: () => Promise<Form | null>; handleUnpublish: () => Promise<Form | null>
  formStatus: 'draft' | 'published' | undefined
  setFormStatus: (s: 'draft' | 'published' | undefined) => void
}

async function runAsync<T>(
  fn: () => Promise<T>,
  setBusy: (b: boolean) => void,
  setError: (s: string) => void,
  fallbackMsg: string,
): Promise<T | null> {
  setBusy(true)
  setError('')
  try {
    return await fn()
  } catch (e) {
    setError(e instanceof Error ? e.message : fallbackMsg)
    return null
  } finally {
    setBusy(false)
  }
}

// Lưu (tạo/cập nhật) và xuất bản/hủy xuất bản form
export function useFormPersistence({ name, desc, questions, sections, savedFormIdRef }: Params): FormPersistence {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [formStatus, setFormStatus] = useState<'draft' | 'published' | undefined>(undefined)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [publishError, setPublishError] = useState('')

  // FIX: dùng savedFormIdRef thay vì mode+formId — tránh createForm bị gọi nhiều lần
  const handleSave = useCallback(async (extras?: SaveExtras): Promise<Form | null> => {
    if (!name.trim()) return null
    setSaved(false)
    const { descriptionParagraphs, ...rest } = extras ?? {}
    const payload = {
      name,
      description: descriptionParagraphs ? descriptionParagraphs.join('\n') : desc,
      questions, sections, ...rest,
    }
    const result = await runAsync(async () => {
      const id = savedFormIdRef.current
      const form = id != null ? await updateForm(id, payload) : await createForm(payload)
      savedFormIdRef.current = form.id as number
      return form
    }, setSaving, setSaveError, 'Lưu thất bại.')
    if (result) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
    return result
  }, [name, desc, questions, sections, savedFormIdRef])

  const setPublishStatus = useCallback(async (publish: boolean): Promise<Form | null> => {
    const id = savedFormIdRef.current
    if (!id) return null
    const result = await runAsync(
      () => (publish ? publishForm(id) : unpublishForm(id)),
      setPublishing, setPublishError,
      publish ? 'Xuất bản thất bại.' : 'Hủy xuất bản thất bại.',
    )
    if (result) {
      setFormStatus(publish ? 'published' : 'draft')
      setPublished(publish)
      if (publish) setTimeout(() => setPublished(false), 2500)
    }
    return result
  }, [savedFormIdRef])

  const handlePublish = useCallback(() => setPublishStatus(true), [setPublishStatus])
  const handleUnpublish = useCallback(() => setPublishStatus(false), [setPublishStatus])

  return {
    saving, saved, saveError, handleSave,
    publishing, published, publishError, handlePublish, handleUnpublish,
    formStatus, setFormStatus,
  }
}
