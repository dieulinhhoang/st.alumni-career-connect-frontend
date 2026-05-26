export async function fetchWithFallback<T>(
  apiFn: () => Promise<T>,
  mockData: T,
): Promise<T> {
  try {
    const data = await apiFn();
    
    // Nếu data rỗng ([], null, undefined) → fallback mock
    if (
      data === null ||
      data === undefined ||
      (Array.isArray(data) && data.length === 0)
    ) {
      console.warn('API trả về rỗng, dùng mock data');
      return mockData;
    }

    return data;
  } catch (error) {
    console.warn(' API lỗi, dùng mock data:', error);
    return mockData;
  }
}