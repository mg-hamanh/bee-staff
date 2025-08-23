import LoginForm from "@/components/auth/LoginForm";
import LogoBee from "@/components/bee-ui/LogoBee";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LogoBee href="#" type="full" height={20} width={40} />
        <LoginForm />
      </div>
    </div>
  );
}
