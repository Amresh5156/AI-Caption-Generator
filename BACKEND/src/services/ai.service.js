const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateCaption(base64ImageFile, captionType = 'professional '){
  const captionPrompts = {
    descriptive: "Write a detailed, descriptive caption for this image that accurately describes what you see.",
    aesthetic: "Write an aesthetic, visually pleasing caption for this image. Focus on mood, style, and beauty.",
    funny: "Write a funny, humorous caption for this image. Make it witty and entertaining.",
    professional: "Write a professional, business-appropriate caption for this image. Keep it formal and polished.",
    creative: "Write a creative and imaginative caption for this image. Be artistic and expressive.",
    poetic: "Write a poetic, lyrical caption for this image. Use beautiful language and imagery.",
    casual: "Write a casual, friendly caption for this image. Keep it relaxed and conversational."
  };
  console.log(captionType);
  
  const prompt = captionPrompts[captionType] || captionPrompts.descriptive;

  const contents = [
    { 
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: prompt },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      systemInstruction: `
        you are an expert in generating captions for image,
        you generate single caption for the image,
        your caption shold be short and consise,
        you use hashtags and emojis in the caption
      `
    }
  });
  return (response.text);
}

module.exports = {
  generateCaption
}