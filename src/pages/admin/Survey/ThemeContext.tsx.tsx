import { createContext } from "react"
import { THEMES, type Theme } from "../../../feature/survey/theme"
import React from "react"

interface ThemeContextType{
  theme: Theme
  setTheme: (theme: Theme) => void  
}

const ThemeContext = createContext<ThemeContextType>({
  theme : THEMES[0], // mặc định là theme đầu tiên 
  setTheme: () => {} // hàm rỗng để tránh lỗi khi chưa có provider
})

export function ThemeProvider({children}: {children: React.ReactNode}){ // cung cấp theme cho các component con
  const [theme, setTheme] = React.useState<Theme>(THEMES[0]) // khởi tạo theme mặc định 

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => React.useContext(ThemeContext)
//{  khi goi ham se tra  ve 
//   theme: Theme       // theme đang chọn
//   setTheme: Function // hàm đổi theme
// }
//