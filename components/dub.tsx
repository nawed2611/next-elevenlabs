"use client";

import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { UploadButton } from "@/lib/uploadthing"
import { useRef, useState } from "react";
import { Toaster, toast } from 'sonner';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Youtube from "react-youtube";

export function Dub() {
  const [file, setFile] = useState<any>("");
  const [yt, setYT] = useState<any>("");
  const [fileName, setFileName] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sourceLang, setSourceLang] = useState<string>("auto-detect");
  const [targetLang, setTargetLang] = useState<string>("en");


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    console.log(file, sourceLang, targetLang);

    if (!targetLang) {
      toast.error("Please select a target language");
      return;
    }

    if (sourceLang === targetLang) {
      toast.error("Source and Target language cannot be the same");
      return;
    }

    if (yt) {
      handleYT(yt);
      return;
    }

    if (!file) {
      toast.error("Please upload a file");
      return;
    }

    fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file, sourceLang, targetLang }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setResponse(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Something went wrong!");
        setLoading(false);
      });
  }

  const handleYT = (yt: string) => {
    setLoading(true);

    fetch("/api/yt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file: yt, sourceLang, targetLang }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Something went wrong!");
        setLoading(false);
      });
  }

  return (
    <Card className="w-[40vw] bg-zinc-900">
      <Toaster richColors expand={true} />
      <CardHeader>
        <CardTitle>Create a Dub</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="project-name">Dubbing Project Name (Optional)</Label>
              <Input id="project-name" placeholder="Enter a name here..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="source-language">Source Language</Label>
                <Select defaultValue={sourceLang} onValueChange={(value) => setSourceLang(value)}>
                  <SelectTrigger id="source-language">
                    <SelectValue placeholder="Detect" />
                  </SelectTrigger>
                  <SelectContent className='z-100 bg-zinc-800' position="popper">
                    <SelectItem value="auto-detect">Detect</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="target-language">Target Language *</Label>
                <Select defaultValue={targetLang} onValueChange={(value) => setTargetLang(value)}>
                  <SelectTrigger id="target-language">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className='z-100 bg-zinc-800' position="popper">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="ko">Korean</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="source">Select a Source *</Label>
              <Tabs defaultValue="upload">
                <TabsList className="flex p-2 w-fit bg-transparent">
                  <TabsTrigger value="upload" className="px-4 py-2 rounded-lg">Upload</TabsTrigger>
                  <TabsTrigger value="youtube" className="px-4 py-2 rounded-lg">Youtube</TabsTrigger>
                </TabsList>
                <TabsContent className="h-[20vh]" value="upload">
                  <div className="p-12 border border-dashed rounded-lg flex justify-center items-center">
                    <div className="items-center text-center">
                      <UploadButton
                        endpoint="mediaPost"
                        onUploadProgress={(progress) => {
                          // Do something with the progress
                          console.log("Progress: ", progress);
                        }}
                        onClientUploadComplete={(res: any) => {
                          // Do something with the response
                          console.log("Response: ", res);
                          setLoading(false);
                          toast.success("File uploaded successfully!");
                          setFileName(res[0].name);
                          setFile(res[0].url);
                        }}
                        onUploadError={(error: Error) => {
                          // Do something with the error.
                          alert(`ERROR! ${error.message}`);
                        }}
                      />
                      <p className="text-sm text-gray-500">Audio or Video file, up to 1GB or 15 minutes.</p>
                      {
                        fileName && <p className="text-sm text-gray-500">{fileName}</p>
                      }
                    </div>

                  </div>
                </TabsContent>
                <TabsContent className="h-[20vh]" value="youtube">
                  <Input value={yt} onChange={(e) =>
                    setYT(e.target.value)
                  } id="youtube-link" placeholder="Drop a YouTube Link here..." />
                  {
                    yt &&
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="m-4 text-base text-gray-500">Preview</h1>
                      <Youtube videoId={yt.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)[1]} />
                    </div>
                  }
                </TabsContent>
              </Tabs>
            </div>
          </div>
          {
            file &&
            <div className="mt-12 flex flex-col items-center justify-center">
              <h1 className="text-base font-bold text-gray-500">Preview</h1>
              <AudioPlayer
                autoPlay
                className="mt-2 rounded"
                showJumpControls={false}
                hasDefaultKeyBindings={false}
                layout="horizontal-reverse"
                src={file}
                onPlay={e => console.log("onPlay")}
              />
            </div>
          }

          <CardFooter className="flex justify-between mt-12">
            <Button variant="outline">Cancel</Button>
            <Button type="submit" variant="secondary">Create</Button>
          </CardFooter>
        </form>
      </CardContent>
      <p className="text-sm text-gray-500 p-4">This dub will use 2000 characters per minute of audio.</p>
      {
        loading && <div className="flex flex-col items-center justify-center"> <h1 className="text-base font-bold text-gray-500">Loading...</h1> </div>
      }
      <div className="p-4">
        {
          response &&
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-base font-bold text-gray-500">Response</h1>
            <AudioPlayer
              autoPlay
              className="mt-2 rounded"
              showJumpControls={false}
              hasDefaultKeyBindings={false}
              layout="horizontal-reverse"
              src={response}
              onPlay={e => console.log("onPlay")}
            />
          </div>
        }
      </div>
    </Card >

  )
}