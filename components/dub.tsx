"use client";

import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { UploadButton } from "@/lib/uploadthing"
import { useState } from "react";

export function Dub() {
  const [file, setFile] = useState<String>("");

  return (
    <Card className="w-full bg-zinc-900">
      <CardHeader>
        <CardTitle>Create a Dub</CardTitle>
      </CardHeader>

      <CardContent>
        <form>
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
                <TabsList className="flex bg-transparent">
                  <TabsTrigger value="upload" className="px-4 py-2 rounded-t-lg">Upload</TabsTrigger>
                  <TabsTrigger value="youtube" className="px-4 py-2 rounded-t-lg">Youtube</TabsTrigger>
                </TabsList>
                <TabsContent className="h-[20vh] w-[35vw]" value="upload">
                  <div className="p-12 border-2 border-dashed rounded-lg flex justify-center items-center">

                    <div className="text-center">
                      <UploadButton
                        endpoint="mediaPost"
                        onClientUploadComplete={(res) => {
                          // Do something with the response
                          console.log("Files: ", res);
                        }}
                        onUploadError={(error: Error) => {
                          // Do something with the error.
                          alert(`ERROR! ${error.message}`);
                        }}
                      />
                      <p className="text-sm text-gray-500">Audio or Video file, up to 1GB or 15 minutes.</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent className="h-[20vh] w-[35vw]" value="youtube">
                  <Input id="youtube-link" placeholder="Drop a YouTube Link here..." />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button variant="destructive">Create</Button>
      </CardFooter>
      <p className="text-sm text-gray-500 p-4">This dub will use 2000 characters per minute of audio.</p>
    </Card>
  )
}


function IconCloudupload(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  )
}
