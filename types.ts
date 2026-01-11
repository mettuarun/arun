
export interface EditedImage {
  originalUrl: string;
  editedUrl: string | null;
  prompt: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}

export type AppState = {
  currentImage: string | null;
  history: EditedImage[];
  isProcessing: boolean;
};
