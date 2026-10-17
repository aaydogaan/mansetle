type GeminiUsage = {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
};

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  usageMetadata?: GeminiUsage;
};

export type NewsDraftInput = {
  sourceName: string;
  sourceTitle: string;
  sourceUrl: string;
  sourceSummary?: string;
};

export type NewsDraft = {
  title: string;
  summary: string;
  bodyMarkdown: string;
  category: string;
  inputTokens: number | null;
  outputTokens: number | null;
  model: string;
};

const DEFAULT_MODEL = "gemini-3.1-flash-lite";
const categories = new Set(["gundem", "turkiye", "dunya", "para", "spor", "teknoloji", "kultur", "yasam", "eglence"]);

function readDraft(value: unknown): Omit<NewsDraft, "inputTokens" | "outputTokens" | "model"> {
  if (!value || typeof value !== "object") throw new Error("Gemini geçerli bir haber taslağı döndürmedi.");
  const draft = value as Record<string, unknown>;
  const fields = ["title", "summary", "bodyMarkdown", "category"] as const;
  for (const field of fields) {
    if (typeof draft[field] !== "string" || !draft[field].trim()) throw new Error("Gemini haber taslağında zorunlu alan eksik.");
  }
  const category = String(draft.category).trim().toLocaleLowerCase("tr-TR");
  if (!categories.has(category)) throw new Error("Gemini geçersiz haber kategorisi döndürdü.");
  return { title: String(draft.title).trim(), summary: String(draft.summary).trim(), bodyMarkdown: String(draft.bodyMarkdown).trim(), category };
}

export async function generateNewsDraft(input: NewsDraftInput): Promise<NewsDraft> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY yapılandırılmamış.");

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const prompt = `Sen Mansetle için Türkçe haber editörüsün. Aşağıdaki kaynak bilgisinden özgün ve tarafsız bir haber taslağı oluştur.

Kurallar:
- Kaynak metni veya başlığı kopyalama; özgün cümlelerle yaz.
- Doğrulanmamış ayrıntı ekleme, tahmin yapma.
- Kaynağı metin içinde belirtme; yayın ekranı kaynak bilgisini ayrıca gösterecek.
- Başlık en fazla 90 karakter, özet en fazla 180 karakter olsun.
- Gövde 250-450 kelime olsun ve Markdown paragraf biçiminde yazılsın.
- category içeriğe göre en uygun olan seçilmelidir:
  * Futbol, basketbol, maç sonuçları, transfer, lig, Süper Lig, sporcular -> spor
  * Ekonomi, finans, borsa, altın, döviz, enflasyon, şirketler, faiz -> para
  * Yazılım, yapay zeka, siber güvenlik, telefon, bilim, uzay, donanım -> teknoloji
  * Dış politika, diplomasi, yabancı ülkeler, uluslararası gelişmeler -> dunya
  * Hükümet, iç politika, genel flaş gelişmeler -> gundem
  * Yurt içi yerel olaylar, valilik, emniyet, kaza, asayiş -> turkiye
  * Sanat, edebiyat, sinema, tiyatro, konser, sergi -> kultur
  * Sağlık, çevre, beslenme, seyahat -> yasam
  * Magazin, dizi, televizyon, eğlence dünyası -> eglence
- Yalnızca şu JSON biçimini döndür: {"title":"...","summary":"...","bodyMarkdown":"...","category":"spor|para|teknoloji|gundem|turkiye|dunya|kultur|yasam|eglence"}.

Kaynak: ${input.sourceName}
Başlık: ${input.sourceTitle}
Bağlantı: ${input.sourceUrl}
Özet: ${input.sourceSummary ?? "Kaynak özeti bulunmuyor."}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", maxOutputTokens: 1_200, temperature: 0.2 },
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) throw new Error(`Gemini isteği başarısız oldu (${response.status}).`);
  const payload = (await response.json()) as GeminiResponse;
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
  if (!text) throw new Error("Gemini boş yanıt döndürdü.");

  const draft = readDraft(JSON.parse(text));
  return { ...draft, inputTokens: payload.usageMetadata?.promptTokenCount ?? null, outputTokens: payload.usageMetadata?.candidatesTokenCount ?? null, model };
}
