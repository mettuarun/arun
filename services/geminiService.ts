
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

export type ImageModel = 'gemini-3-pro-image-preview' | 'gemini-2.5-flash-image';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
export type ImageSize = '1K' | '2K' | '4K';

interface GenerateOptions {
  model: ImageModel;
  prompt: string;
  image?: string; // base64
  aspectRatio?: AspectRatio;
  imageSize?: ImageSize;
}

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateCinematicImage = async (options: GenerateOptions): Promise<string> => {
  const ai = getAIClient();
  const { model, prompt, image, aspectRatio = '1:1', imageSize = '1K' } = options;

  const systemInstruction = "Generate a highly realistic, cinematic image. Focus on dramatic lighting, volumetric fog, high fidelity, 8k resolution, and photorealistic textures. Avoid cartoonish or artistic styles unless specifically requested.";
  const fullPrompt = `${systemInstruction} Subject: ${prompt}`;

  const contents: any = {
    parts: [{ text: fullPrompt }]
  };

  if (image) {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    contents.parts.unshift({
      inlineData: {
        data: base64Data,
        mimeType: 'image/png'
      }
    });
  }

  const config: any = {
    imageConfig: {
      aspectRatio,
    }
  };

  if (model === 'gemini-3-pro-image-preview') {
    config.imageConfig.imageSize = imageSize;
    config.tools = [{ googleSearch: {} }];
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config,
    });

    let resultImageUrl: string | null = null;

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          resultImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!resultImageUrl) {
      throw new Error("Generation failed. No image data returned.");
    }

    return resultImageUrl;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("KEY_RESET_REQUIRED");
    }
    throw new Error(error.message || "Cinematic engine encountered an error.");
  }
};

export const startChatSession = (systemInstruction: string) => {
  const ai = getAIClient();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction,
      tools: [{ googleSearch: {} }], // Enable real-time web search for "ChatGPT-like" immediate answers
    },
  });
};
