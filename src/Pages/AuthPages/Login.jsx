import { useLogin } from "@/Hooks/auth.mutation";
import React from "react";

const Login = () => {
  const { mutateAsync: loginMutation, isPending } = useLogin();

  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
    const data = { email, password };
    await loginMutation(data);
  };

  return (
    <section className="flex justify-center items-center pt-40">
      <div className="w-[400px] mx-auto">
        <h4 className="text-black font-merriweather text-center text-3xl mb-6">
          Login
        </h4>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm">
              Email
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm">
              Password
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-full bg-blue-500 py-3 font-semibold text-white transition-all"
          >
            {isPending ? "Logging..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
