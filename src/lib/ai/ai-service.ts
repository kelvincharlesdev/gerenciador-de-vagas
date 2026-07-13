const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL ?? "google/gemini-2.0-flash-lite";

export interface AIOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function callAI(
  prompt: string,
  options: AIOptions = {},
): Promise<string> {
  const { systemPrompt, temperature = 0.7, maxTokens = 4096 } = options;

  const messages: { role: string; content: string }[] = [];

  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }

  messages.push({ role: "user", content: prompt });

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content ?? "";
}
