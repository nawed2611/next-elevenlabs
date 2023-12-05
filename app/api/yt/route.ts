import OpenAI from "openai";
import Replicate from "replicate";
import ytdl from "ytdl-core";
import fs from "fs";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
const openai = new OpenAI();

export async function GET() {
  return Response.json({ data: "Hello" });
}

async function getMp3AudioLink(youtubeVideoUrl: any) {
  try {
    // Get video info from the YouTube video URL
    const videoInfo = await ytdl.getInfo(youtubeVideoUrl);

    // Find the highest quality audio stream
    const audioStream = ytdl.chooseFormat(videoInfo.formats, {
      filter: "audioonly",
    });

    if (!audioStream) {
      throw new Error("No audio stream found for the given video.");
    }

    // Convert the audio stream URL to MP3 using yt1s.com
    const mp3ConversionUrl = `https://yt1s.com/api/ajaxConvert/media/mp3/${audioStream.url}`;

    // Fetch the MP3 conversion link
    const mp3ConversionResponse = await fetch(mp3ConversionUrl);

    console.log("mp3ConversionResponse", mp3ConversionResponse);
    const mp3ConversionData = await mp3ConversionResponse.json();

    console.log("mp3ConversionData", mp3ConversionData);

    if (mp3ConversionData.status === "success") {
      return mp3ConversionData.result;
    } else {
      throw new Error(
        "Failed to convert to MP3. Status: " + mp3ConversionData.status
      );
    }
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

const cloning =
  "afiaka87/tortoise-tts:e9658de4b325863c4fcdc12d94bb7c9b54cbfe351b7ca1b36860008172b91c71";
const dubbing =
  "cjwbw/video-retalking:ecd06c5e9ceed2e3e061b44fb852240c5a24bb902db08061b55f7f85a4d0cbe2";

export async function POST(req: Request, res: Response) {
  const { file, sourceLang, targetLang } = await req.json();

  const videoInfo: any = await ytdl.getInfo(file);

  const mp3URL =
    videoInfo.player_response.streamingData.adaptiveFormats[22].url;
  const mp4URL = videoInfo.player_response.streamingData.formats[0].url;

  console.log("urls", mp3URL, mp4URL);

  const audiomp4Blob = await (await fetch(mp3URL)).blob();
  const mp4Blob = await (await fetch(mp4URL)).blob();

  console.log("blobs", audiomp4Blob, mp4Blob);

  const formData = new FormData();
  formData.append("file", audiomp4Blob, "audio.mp3");
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
  const data: any = await res1.json();
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

  const output = await replicate.run(cloning, {
    input: {
      text: translated,
      voice_a: "custom_voice",
      seed: 0,
      preset: "fast",
      custom_voice: mp3URL,
    },
  });
  console.log(output);

  const output1 = await replicate.run(dubbing, {
    input: {
      face: mp4URL,
      input_audio: output,
    },
  });
  console.log(output1);

  return Response.json({
    data: output1,
    transcribed,
    translated,
    cloned: output,
  });
}
