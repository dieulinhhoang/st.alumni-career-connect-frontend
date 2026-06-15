import api from "../../libs/api";

export interface MajorPayload {
  code: string;
  name: string;
  slug?: string;
  description?: string;
  facultyId?: number;
  status?: number;
}

/**
 * Tạo mới một ngành.
 * BE: POST /major
 */
export async function createMajor(payload: MajorPayload) {
  const res = await api.post("/major", payload);
  return res.data;
}

/**
 * Cập nhật thông tin ngành.
 * BE: PUT /major/:id
 */
export async function updateMajor(id: number, payload: Partial<MajorPayload>) {
  const res = await api.put(`/major/${id}`, payload);
  return res.data;
}

/**
 * Xoá một ngành.
 * BE: DELETE /major/:id
 */
export async function deleteMajor(id: number): Promise<void> {
  await api.delete(`/major/${id}`);
}
