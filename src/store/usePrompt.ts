import { create } from "zustand";

interface PromptState {
    prompt: string;
    setPrompt : (prompt:string) => void;
}

const usePromptStore = create<PromptState>((set) => ({
    prompt: "",
    setPrompt: (prompt) => set({ prompt }),
}));

export default usePromptStore;