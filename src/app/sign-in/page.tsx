"use client";
import FormInput from "@/components/core/FormInput";
import * as React from "react";
import AccountImage from "../../../public/access_account.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const SignInPage: React.FunctionComponent = () => {
  // Refs for form inputs
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const onSignIn = async () => {
    try {
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="h-screen px-10">
      <div className="container m-auto flex flex-col md:flex-row items-center gap-5 md:gap-16">
        <div
          id="left"
          className="w-full md:w-1/2 h-fit order-2 md:order-1 rounded-2xl px-5 md:px-10 py-4 md:py-8 bg-white"
        >
          <h1 className="text-2xl">Sign in</h1>
          <form>
            <div className="py-6 space-y-5">
              <FormInput
                name="email"
                type="text"
                label="Email"
                ref={emailRef}
              />
              <FormInput
                name="password"
                type="password"
                label="Password"
                ref={passwordRef}
              />
              <div className="flex items-center justify-end gap-4">
                <Button
                  type="button"
                  className="bg-slate-700 text-white px-4 py-2 shadow"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div
          id="right"
          className="w-full md:w-1/2 flex flex-col order-1 md:order-2 justify-center md:space-y-5"
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
      </div>
    </div>
  );
};

export default SignInPage;
