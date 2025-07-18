"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {  OctagonAlertIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SignupSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z.string().min(1, { message: "Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });
export function SignUpView() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof SignupSchema>) => {
    setError(null);
    setPending(true);
    authClient.signUp.email(
      { email: data.email, password: data.password, name: data.name },
      {
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
        },
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
      }
    );
  };
  return (
    <div className="flex flex-col gap-6 ">
      <Card className="flex flex-col  gap-6 ">
        <CardContent className="  grid p-0  md:grid-cols-2 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 md:p-8 "
            >
              <div className="flex flex-col items-center text-center">
                <h1 className="font-bold text-2xl">Let&apos;s get started</h1>
                <p className="text-muted-foreground text-balance">
                  Create your account
                </p>
              </div>
              <div className="grid gap-3 ">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="ajay@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="***********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="***********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {error && (
                  <Alert className="bg-destructive/10  border-none ">
                    <OctagonAlertIcon className=" !text-destructive h-4 w-4" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
                <Button type="submit" disabled={pending} className="w-full">
                  Sign up
                </Button>
                <div className="after:border-border  relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground  relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 ">
                  <Button
                    variant={"outline"}
                    type="button"
                    className="w-full"
                    onClick={() => {
                      authClient.signIn.social({
                        provider: "google",
                        callbackURL: "/",
                      });
                    }}
                  >
                    <FcGoogle/>
                  </Button>
                  <Button
                    variant={"outline"}
                    type="button"
                    className="w-full"
                    onClick={() => {
                      authClient.signIn.social({
                        provider: "github",
                        callbackURL: "/",
                      });
                    }}
                  >
                    <FaGithub />
                  </Button>
                </div>
                <div className="text-center text-sm ">
                  Already have an account?{" "}
                  <Link
                    href={"/sign-in"}
                    className="  underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="bg-radial from-sidebar-accent to-sidebar relative  hidden  md:flex flex-col gap-y-4 items-center justify-center">
            <Image width={100} height={100} src="/logo.svg" className=" h-[80px] w-[80px] " alt="Logo" />
            <p className="text-2xl font-semibold  text-white ">Hello ai</p>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of service</a>
        and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
}
