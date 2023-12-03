"use client";

import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { UploadButton } from "@/lib/uploadthing"
import { useRef, useState } from "react";
import { Toaster, toast } from 'sonner'

export function Dub() {
  const [file, setFile] = useState<String>("");
  const [name, setName] = useState<String>("");
  const [response, setResponse] = useState<String>("");
  const [loading, setLoading] = useState<Boolean>(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    console.log("File: ", file);

    if (!file) {
      console.log("Please upload a file");
      return;
    }

    fetch("/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ file: file }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("Response: ", res);
        setResponse(res.data.text);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error: ", err);
        setLoading(false);
      });
  }

  return (
    <Card className="w-full bg-zinc-900">
      <Toaster richColors expand={true} />
      <CardHeader>
        <CardTitle>Create a Dub</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="project-name">Dubbing Project Name (Optional)</Label>
              <Input id="project-name" placeholder="Untitled" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="source-language">Source Language</Label>
                <Select>
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
                <Select>
                  <SelectTrigger id="target-language">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className='z-100 bg-zinc-800' position="popper">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="source">Select a Source *</Label>
              <Tabs defaultValue="upload">
                <TabsList className="flex p-2 w-fit bg-transparent">
                  <TabsTrigger value="upload" className="px-4 py-2 rounded-t-lg">Upload</TabsTrigger>
                  <TabsTrigger value="youtube" className="px-4 py-2 rounded-t-lg">Youtube</TabsTrigger>
                </TabsList>
                <TabsContent className="h-[20vh] w-[35vw]" value="upload">
                  <div className="p-12 border-2 border-dashed rounded-lg flex justify-center items-center">

                    <div className="text-center">
                      <UploadButton
                        endpoint="mediaPost"
                        onUploadProgress={(progress) => {
                          // Do something with the progress
                          console.log("Progress: ", progress);
                        }}
                        onClientUploadComplete={(res: any) => {
                          // Do something with the response
                          console.log("Response: ", res);
                          toast.success("File uploaded successfully!");
                          setName(res[0].name);
                          setFile(res[0].url);
                        }}
                        onUploadError={(error: Error) => {
                          // Do something with the error.
                          alert(`ERROR! ${error.message}`);
                        }}
                      />
                      {/* <input onChange={handleChange} type="file" id="upload" placeholder="Drop a file here..." /> */}
                      <p className="text-sm text-gray-500">Audio or Video file, up to 1GB or 15 minutes.</p>
                      {
                        name && <p className="text-sm text-gray-500">{name}</p>
                      }
                    </div>
                  </div>
                </TabsContent>
                <TabsContent className="h-[20vh] w-[35vw]" value="youtube">
                  <Input id="youtube-link" placeholder="Drop a YouTube Link here..." />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <CardFooter className="flex justify-between mt-8">
            <Button variant="outline">Cancel</Button>
            <Button type="submit" disabled={!loading} variant="destructive">Create</Button>
          </CardFooter>
        </form>
      </CardContent>
      <p className="text-sm text-gray-500 p-4">This dub will use 2000 characters per minute of audio.</p>
      {
        response && <p className="text-sm text-gray-500 p-4">{response}</p>
      }
    </Card>

  )
}