import { create } from "zustand";

interface Themes {
    selectedTheme : string,
    selectTheTheme : (theme : string) => void 
}

export const useThemeStore = create<Themes>((set)=> ({
    selectedTheme : localStorage.getItem("chat-theme") || "coffee",
    selectTheTheme : (selectedTheme) => {
        localStorage.setItem("chat-theme", selectedTheme)
        set({selectedTheme})
    }


}))