"use client";
import * as React from "react";
import Image from "next/image";
import AccountImage from "../../../public/access_account.svg";
import { callAPI } from "@/config/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FormInput from "@/components/core/FormInput";
import { useRouter } from "next/navigation";

const SignUpPage: React.FunctionComponent = () => {
  const router = useRouter();

  // Refs untuk semua field input
  const firstnameRef = React.useRef<HTMLInputElement>(null);
  const lastnameRef = React.useRef<HTMLInputElement>(null);
  const usernameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confPasswordRef = React.useRef<HTMLInputElement>(null);

  const onSignUp = async () => {
    try {
      const username = usernameRef.current?.value || "";
      const email = emailRef.current?.value || "";
      const password = passwordRef.current?.value || "";
      const confPassword = confPasswordRef.current?.value || "";

      if (password !== confPassword) {
        alert("Password dan konfirmasi password tidak cocok");
        return;
      }
      await callAPI.post("/accounts", {
        username,
        email,
        password,
      });

      alert("Pendaftaran akun berhasil");
      router.push("/sign-in");
    } catch (error) {
      console.error(error);
      alert("Gagal mendaftar akun");
    }
  };

  return (
    <div className="h-screen px-10">
      <div className="container m-auto flex flex-col md:flex-row items-center gap-5 md:gap-16">
        <div
          id="left"
          className="flex w-full md:w-1/2 flex-col justify-center md:space-y-5"
        >
          <h1 className="text-3xl font-bold">Post your story</h1>
          <p className="text-2xl font-thin">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <div className="hidden md:block space-y-5">
            <Image
              src={AccountImage}
              alt="image"
              width={350}
              className="m-auto"
            />
          </div>
        </div>

        <div id="right" className="w-full md:w-1/2 h-fit">
          <Card>
            <CardHeader>
              <h1 className="text-2xl">Sign up now</h1>
            </CardHeader>
            <CardContent>
              <form>
                <div className="py-2 md:py-6 space-y-5">
                  <div className="flex flex-col md:flex-row gap-5 md:gap-8">
                    <FormInput
                      type="text"
                      name="firstname"
                      label="First name"
                      ref={firstnameRef}
                    />
                    <FormInput
                      type="text"
                      name="lastname"
                      label="Last name"
                      ref={lastnameRef}
                    />
                  </div>
                  <FormInput
                    type="text"
                    name="username"
                    label="Username"
                    ref={usernameRef}
                  />
                  <FormInput
                    type="text"
                    name="email"
                    label="Email"
                    ref={emailRef}
                  />
                  <FormInput
                    type="password"
                    name="password"
                    label="Password"
                    ref={passwordRef}
                  />
                  <FormInput
                    type="password"
                    name="confPassword"
                    label="Confirmation Password"
                    ref={confPasswordRef}
                  />
                  <div className="flex items-center justify-between gap-4">
                    <p
                      className="text-xs cursor-pointer hover:text-blue-600"
                      onClick={() => router.push("/sign-in")}
                    >
                      Already have an account ?
                    </p>
                    <Button
                      type="button"
                      className="bg-gray-400 text-white px-2 md:px-4 py-1 md:py-2 text-sm md:text-base shadow"
                      onClick={onSignUp}
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
