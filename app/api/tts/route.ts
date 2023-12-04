import OpenAI from "openai";
import fs from "fs";
import path from "path";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const speechFile = path.resolve("./speech.mp3");

const openai = new OpenAI();

export async function GET() {
  const res = await fetch("https://data.mongodb-api.com/...", {
    method: "GET",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const data = await res.json();
  return Response.json({ data });
}

export async function POST(req: Request, res: Response) {
  const { file, sourceLang, targetLang } = await req.json();
  const blobResponse = await fetch(file);
  const blob = await blobResponse.blob();

  const formData = new FormData();
  formData.append("file", blob, "audio.wav");
  formData.append("model", "whisper-1");
  formData.append("language", sourceLang);

  const res1 = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });

  const data = await res1.json();
  const transcribed = data.text;

  // convert text to target language
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You will be provided with a sentence in ${sourceLang} language to ${targetLang} language in same length as the original sentence to be dubbed`,
      },
      { role: "user", content: transcribed },
    ],
  });

  const translated = completion.choices[0].message.content as string;

  // convert text to audio
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: translated,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
}
