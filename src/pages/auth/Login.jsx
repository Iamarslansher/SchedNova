import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { authSchema } from "../../utils/validators";

function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(authSchema) });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back to SchedNova");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Unable to sign in. Please check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-glass">
        <h1 className="text-3xl font-semibold text-white">
          Sign in to SchedNova
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Enter your email and password to access the timetable dashboard.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <label className="block space-y-2 text-sm text-slate-200">
            <span>Email</span>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
            />
            {errors.email && (
              <span className="text-xs text-rose-400">
                {errors.email.message}
              </span>
            )}
          </label>

          <label className="block space-y-2 text-sm text-slate-200">
            <span>Password</span>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-400"
            />
            {errors.password && (
              <span className="text-xs text-rose-400">
                {errors.password.message}
              </span>
            )}
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-400"
          >
            Continue
          </button>

          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            Sign in with Google
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New to SchedNova?{" "}
          <Link to="/register" className="text-brand-300 hover:text-brand-200">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
