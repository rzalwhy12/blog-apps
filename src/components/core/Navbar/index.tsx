"use client";
import * as React from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { callAPI } from "@/config/axios";
import { setSignIn, setSignOut } from "@/lib/redux/features/userSlice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FunctionComponent = () => {
  const router = useRouter();
  // Redux
  const dispatch = useAppDispatch();
  // Get value from global store reducer user
  const user = useAppSelector((state) => state.userReducer);
  console.log("Data from reducer", user);

  const keepLogin = async () => {
    try {
      const auth = localStorage.getItem("tkn");
      if (auth) {
        const query = encodeURIComponent(`objectId='${auth}'`);
        const response = await callAPI.get(`/accounts?where=${query}`);
        console.log("CHECK SIGNIN RESPONSE : ", response.data);
        if (response.data.length === 1) {
          dispatch(setSignIn({ ...response.data[0], isAuth: true })); // store data to global store redux
          localStorage.setItem("tkn", response.data[0].objectId);
        }
      } else {
        dispatch(setSignIn({ isAuth: false })); // store data to global store redux
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    keepLogin();
  }, []);
  return (
    <div className="flex items-center justify-between px-6 lg:px-24 py-5">
      <Link href="/" className="text-3xl font-bold">
        P
      </Link>
      <ul className="flex items-center gap-5">
        <li className="hidden lg:block">
          <div className="relative">
            <span className="absolute top-2.5 left-2">
              <FaSearch color="gray" />
            </span>
            <input
              type="text"
              placeholder="Search"
              className="border w-28 px-3 py-1 rounded-full pl-8"
            />
          </div>
        </li>

        <li className="flex items-center gap-2">
          {user.email ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>Hello, {user.email}</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>What are you doing ?</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/my-article">My Article</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => {
                        dispatch(setSignOut());
                        localStorage.removeItem("tkn");
                        router.replace("/");
                      }}
                    >
                      Sign Out
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/sign-up"
                className="bg-slate-200 text-slate-700 px-3 py-1 rounded-md shadow"
              >
                Sign Up
              </Link>
              <Link
                href="/sign-in"
                className="bg-slate-700 text-white px-3 py-1 rounded-md shadow"
              >
                Sign In
              </Link>
            </>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
