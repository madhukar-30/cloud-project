'use client';

import Loader from "@/components/Loader";
import Login from "@/components/Login";
import Navbar from "@/components/Navbar";
import { UserContext } from "@/context/userContext";
import React, { useContext, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  files: z.any().refine((file) => file instanceof FileList && file.length > 0, {
    message: "Please upload at least one file.",
  }),
});

export default function Home() {
  const { authenticated, loading, setNavTracker, setLoading, userData, user } = useContext(UserContext);

  useEffect(() => {
    setNavTracker('home');
  }, [setNavTracker]);

  const email = user;
  const backendUri = process.env.NEXT_PUBLIC_BACKEND_URI;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.files || values.files.length === 0) {
      console.error("No files selected");
      return;
    }

    const formData = new FormData();
    formData.append('cloud', values.files[0]);
    formData.append('email', email);

    try {
      setLoading(true);
      const response = await fetch(`${backendUri}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      const fileUrl = result.url;

      const responseNew = await fetch('/api/users/update', {
        method: 'POST',
        body: JSON.stringify({ email, fileUrl }),
      });

      if (!responseNew.ok) {
        throw new Error(`Failed to add url to the array: ${responseNew.statusText}`);
      }

      console.log(`File URL (${fileUrl}) added to user's files section.`);

      form.reset();
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <React.Fragment>
      <div className='w-full md:h-screen h-full min-h-screen flex flex-col items-center bg-black p-5 relative'>

        {loading && <Loader />}

        <div className='flex flex-col w-full min-h-full my-auto justify-start rounded-2xl bg-[#E6E4D5] shadow-md'>

          {authenticated ? (
            <div className='flex flex-col h-full w-full items-center'>

              <Navbar />

              <div className='flex flex-col w-full md:px-28 px-10 h-auto items-center justify-center mt-10'>
                <div className='md:text-8xl text-4xl font-black uppercase'>Manas Cloud Share</div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10">
                    <FormField
                      control={form.control}
                      name="files"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Files</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              multiple
                              onChange={(e) =>
                                form.setValue("files", e.target.files)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Upload one or more files.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="mt-6">Submit</Button>
                  </form>
                </Form>

              </div>

            </div>
          ) : (
            <Login />
          )}

        </div>
      </div>
    </React.Fragment>
  );
}

// so as we're sending the files from the homepage, we don't have to add anything in the backend as after sending the files we'll dynamically update the files url.