import { HistoryItem, ToolId, UserSettings } from '../types';

export interface ApiStatus {
  status: string;
  configured: boolean;
  defaultModel: string;
  supportedMimeTypes: string[];
}

export const checkServerStatus = async (): Promise<ApiStatus> => {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Status endpoint unavailable');
    return await res.json();
  } catch (err: any) {
    return {
      status: 'error',
      configured: false,
      defaultModel: 'gemini-3.8-flash',
      supportedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'],
    };
  }
};

/**
 * Converts a File into a base64 string, downscaling if oversized (> 2048px)
 * to keep network transmission and memory fast and reliable.
 */
export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 2048;
        let { width, height } = img;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const mime = file.type || 'image/jpeg';
            const resizedDataUrl = canvas.toDataURL(mime, 0.92);
            resolve({
              base64: resizedDataUrl,
              mimeType: mime,
            });
            return;
          }
        }

        resolve({
          base64: result,
          mimeType: file.type || 'image/jpeg',
        });
      };
      img.onerror = () => {
        resolve({
          base64: result,
          mimeType: file.type || 'image/jpeg',
        });
      };
      img.src = result;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Fetches an image URL (such as a local sample asset) and converts it to a base64 data URI.
 */
export const urlToBase64 = async (url: string): Promise<{ base64: string; mimeType: string }> => {
  const response = await fetch(url);
  const blob = await response.blob();
  const mimeType = blob.type || 'image/jpeg';
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        base64: reader.result as string,
        mimeType,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Calls the server-side Gemini analyze endpoint
 */
export const runGeminiAnalysis = async (
  imageBase64: string,
  mimeType: string,
  action: ToolId | 'analyze' | 'alt_text',
  options: Record<string, any> = {}
): Promise<any> => {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageBase64,
      mimeType,
      action,
      options,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Gemini analysis failed. Please try again.');
  }

  return data.data;
};

// LocalStorage History Helpers
const HISTORY_KEY = 'pixelmind_analysis_history_v1';
const SETTINGS_KEY = 'pixelmind_user_settings_v1';

export const getStoredHistory = (): HistoryItem[] => {
  try {
    const item = localStorage.getItem(HISTORY_KEY);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
};

export const saveHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem => {
  try {
    const history = getStoredHistory();
    const newItem: HistoryItem = {
      ...item,
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
    // Keep up to 50 most recent items
    const updated = [newItem, ...history].slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return newItem;
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
    return {
      ...item,
      id: `hist_${Date.now()}`,
      timestamp: Date.now(),
    };
  }
};

export const deleteStoredHistoryItem = (id: string): HistoryItem[] => {
  try {
    const history = getStoredHistory().filter((h) => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch {
    return [];
  }
};

export const clearStoredHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (err) {
    console.warn('Failed to clear history:', err);
  }
};

export const getStoredSettings = (): UserSettings => {
  const defaults: UserSettings = {
    model: 'gemini-3.8-flash',
    defaultTone: 'luxury',
    defaultPromptStyle: 'photorealistic',
    autoAnalyzeOnUpload: true,
  };
  try {
    const item = localStorage.getItem(SETTINGS_KEY);
    return item ? { ...defaults, ...JSON.parse(item) } : defaults;
  } catch {
    return defaults;
  }
};

export const saveStoredSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save settings:', err);
  }
};
