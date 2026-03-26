export interface Theme {
  id: string
  name: string
  primaryColor: string
  fontFamily: string
  borderRadius: string
}

export const THEMES: Theme[] = [
  {
    id: '1',
    name: 'academy',
    primaryColor: '#015e37',
    fontFamily: '"Times New Roman", serif',
    borderRadius: '4px',
  },
]