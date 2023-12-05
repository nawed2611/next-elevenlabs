import OpenAI from "openai";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
const openai = new OpenAI();

export async function GET() {
  return Response.json({ data: "Hello" });
}

export async function POST(req: Request, res: Response) {
  const { file, sourceLang, targetLang } = await req.json();
  const blobResponse = await fetch(file);
  const blob = await blobResponse.blob();

  const formData = new FormData();
  formData.append("file", blob, "audio.mp3");
  formData.append("model", "whisper-1");
  formData.append("language", sourceLang);

  console.log("formdata", formData);

  // convert audio to text
  const res1 = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });

  const data = await res1.json();
  const transcribed = data.text;

  console.log("transcribed", transcribed);

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

  console.log("translated", translated);

  const output = await replicate.run(
    "afiaka87/tortoise-tts:e9658de4b325863c4fcdc12d94bb7c9b54cbfe351b7ca1b36860008172b91c71",
    {
      input: {
        text: translated,
        voice_a: "custom_voice",
        seed: 0,
        preset: "fast",
        custom_voice: file,
      },
    }
  );

  console.log(output);

  return Response.json({
    transcribed,
    translated,
    data: output,
  });
}
