import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { api } from "@/utils/api";
import { ModeToggle } from "@/components/mode-toggle";
import { useUserStore } from "@/store/userStore";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FaGoogle } from "react-icons/fa";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Define Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verify, setVerify] = useState(true);

  const setUser = useUserStore((state) => state.setUser);

  // ✅ React Hook Form setup
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.data);
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          err.message ||
          "Server Error.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          theme: "colored",
        }
      );
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setVerify(false);

      try {
        const res = await api.get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.data);
        if (location.pathname === "/login") navigate("/", { replace: true });
      } catch {
        setVerify(false);
      }
    };

    verifyToken();
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        theme: "colored",
      });
    }
  }, [location.state]);

  if (verify) return false;

  return (
    <>
      <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-neutral-200 dark:bg-neutral-950 transition-colors duration-300">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <div className="w-full max-w-sm md:max-w-4xl">
          <div className={cn("flex flex-col gap-6")}>
            <Card className="overflow-hidden p-0 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
              <CardContent className="grid p-0 md:grid-cols-2">
                <div className="p-6 md:p-8">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-6"
                    >
                      <div className="flex flex-col items-center text-center">
                        <h1 className="text-2xl font-bold">Welcome Back</h1>
                        <p className="text-muted-foreground text-balance">
                          Login to your account
                        </p>
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
                                placeholder="m@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center">
                              <FormLabel>Password</FormLabel>
                              <a
                                href="#"
                                className="ml-auto text-sm underline-offset-2 hover:underline"
                              >
                                Forgot your password?
                              </a>
                            </div>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full font-bold">
                        Login
                      </Button>

                      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-card text-muted-foreground relative z-10 px-2">
                          Or continue with
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        type="button"
                        className="w-full"
                      >
                        <FaGoogle />
                        <p className="font-bold pb-0.5">Login with Google</p>
                      </Button>

                      <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link
                          to="/register"
                          className="underline underline-offset-4"
                        >
                          Sign up
                        </Link>
                      </div>
                    </form>
                  </Form>
                </div>

                <div className="bg-muted relative hidden md:block">
                  <img
                    src="https://plus.unsplash.com/premium_vector-1682306073127-71958617fdb6?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover transition-all"
                  />
                </div>
              </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
              By clicking continue, you agree to our{" "}
              <Link to="#">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer limit={4} />
    </>
  );
}
