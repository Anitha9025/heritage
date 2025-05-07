import { toast } from "sonner";

const OLLAMA_API_URL = "http://localhost:11434/api";

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export async function generateResponse(prompt: string): Promise<string> {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3:8b",
        prompt: prompt,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error calling Ollama API:", error);
    toast.error("Failed to get response from AI");
    throw error;
  }
}

export async function generateHeritageResponse(question: string, siteName: string): Promise<string> {
  const prompt = `You are a helpful AI assistant specializing in heritage sites. 
  Please provide information about ${siteName} based on the following question: ${question}
  Keep your response concise, informative, and focused on heritage-related aspects.`;

  return generateResponse(prompt);
}

export async function generateTranslation(text: string, targetLanguage: string): Promise<string> {
  const prompt = `Translate the following text to ${targetLanguage}. Only provide the translation, no explanations:
  "${text}"`;

  return generateResponse(prompt);
} 