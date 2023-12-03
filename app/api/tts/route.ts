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

export async function POST(req: Request) {
  const { file } = await req.json();
  const blobResponse = await fetch(file);
  const blob = await blobResponse.blob();

  const formData = new FormData();
  formData.append("file", blob, "audio.wav");
  formData.append("model", "whisper-1");

  // speech-to-text
  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formData,
  });

  const data = await res.json();

  const transcribed = data.text;

  // text-to-speech

  return Response.json({ data });
}
