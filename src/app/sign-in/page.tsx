"use client";
import FormInput from "@/components/core/FormInput";
import * as React from "react";
import AccountImage from "../../../public/access_account.svg";
import Image from "next/image";
import { callAPI } from "../../config/axios";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setSignIn } from "@/lib/redux/features/userSlice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const SignInPage: React.FunctionComponent = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Refs for form inputs
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    try {
      const query = encodeURIComponent(
        `email='${email}' AND password='${password}'`
      );
      const response = await callAPI.get(`/accounts?where=${query}`);
      console.log("CHECK SIGNIN RESPONSE : ", response.data);

      if (response.data.length === 1) {
        dispatch(setSignIn({ ...response.data[0], isAuth: true }));
        localStorage.setItem("tkn", response.data[0].objectId);
        router.replace("/timeline");
      } else {
        alert("Invalid credentials");
      }
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
          <form onSubmit={onSignIn}>
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
                  type="submit"
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
