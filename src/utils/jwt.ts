export function parseJwt(token: string): Record<string, any> | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function getEnterpriseSession() {
  const token = localStorage.getItem('accessToken')
  if (!token) return null
  const payload = parseJwt(token)
  if (!payload || payload.type !== 'enterprise') return null
  return {
    enterpriseId: String(payload.enterpriseId),
    name: payload.name as string,
  }
}

export function isEnterpriseUser(): boolean {
  return getEnterpriseSession() !== null
}
