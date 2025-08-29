import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle } from "react-icons/fa";
import { ModeToggle } from "@/components/mode-toggle";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";

// ✅ Zod Schema
const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    cnfpass: z.string().min(6),
  })
  .refine((data) => data.password === data.cnfpass, {
    message: "Passwords do not match",
    path: ["cnfpass"],
  });

export default function SignupPage() {
  const navigate = useNavigate();
  const [verify, setVerify] = useState(true);

  // ✅ Form Setup
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      cnfpass: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/register", data);
      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          err.message ||
          `Server Error.`,
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
        await api.get("/user/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/", { replace: true });
      } catch {
        setVerify(false);
      }
    };

    verifyToken();
  }, [navigate]);

  if (verify) return null;

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
                <div className="bg-muted relative hidden md:block">
                  <img
                    src="https://previews.123rf.com/images/ntlstudio/ntlstudio2109/ntlstudio210900313/174725861-doctor-office-visit-flat-color-vector-illustration-hospital-appointment-for-family-clinical-visit-fo.jpg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-6"
                    >
                      <div className="flex flex-col items-center text-center">
                        <h1 className="text-2xl font-bold">Registration</h1>
                        <p className="text-muted-foreground text-balance">
                          Create a new account
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            <p className="text-muted-foreground text-xs">
                              This is your public username
                            </p>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <div className="min-h-[20px]">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cnfpass"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Re-enter Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <div className="min-h-[20px]" />{" "}
                              {/* keeps spacing even without FormMessage */}
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" className="w-full font-bold">
                        Register
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
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="underline underline-offset-4"
                        >
                          Login
                        </Link>
                      </div>
                    </form>
                  </Form>
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
