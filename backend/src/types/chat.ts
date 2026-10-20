export type ChatRequest = {
  user: "Sanjar" | "Akira" | "Mike" | "John";
  messages: { role: "user" | "assistant"; content: string }[];
};

export type ChatCompletion = {
  choices?: { message?: { content?: unknown } }[];
};

export type ChatResult =
  | { ok: true; content: string }
  | { ok: false; status: 502 | 504; message: string };
