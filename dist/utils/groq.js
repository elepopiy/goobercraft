"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askGroq = askGroq;
async function askGroq(prompt, apiKey) {
    if (!apiKey)
        return "";
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.2,
            }),
        });
        if (!response.ok)
            return "";
        const data = await response.json();
        return data?.choices?.[0]?.message?.content?.trim() || "";
    }
    catch {
        return "";
    }
}
//# sourceMappingURL=groq.js.map