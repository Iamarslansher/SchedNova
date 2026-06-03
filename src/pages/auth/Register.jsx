import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { authSchema } from "../../utils/validators";

function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(authSchema) });

  const onSubmit = async (data) => {
    try {
      await registerUser(data.email, data.password);
      toast.success("Account created successfully.");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Unable to register. Please check your details.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-glass">
        <h1 className="text-3xl font-semibold text-white">
          Create your SchedNova account
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign up and start generating smart timetables.
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
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-300 hover:text-brand-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
