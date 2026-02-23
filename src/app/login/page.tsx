import Link from "next/link";
import Image from 'next/image';
import { UserAuthForm } from "../../components/authentication/components/user-auth-form";

export default function LoginPage() {
  return (
    <div className="relative container flex-1 shrink-0 items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="text-primary relative hidden h-full flex-col p-10 lg:flex dark:border-r">
        <div
          className="bg-primary/5 absolute inset-0"
          style={{
            backgroundImage: "url('/assets/b1d80d109839183.5fdcc8397ebb4.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <div className="relative z-20 flex items-center text-lg font-medium text-white/80"
            style={{
                fontSize: 25
            }}>
          <Image 
            src="/assets/Island On Water.png" 
            className="mr-2 h-6 w-6" 
            width={20} 
            height={20} 
            alt="OtherDestiMatch logo" />
          DestiMatch
        </div>
        <div className="relative z-20 mt-auto max-w-3xl text-white/70">
          <blockquote className="leading-normal text-balance">
            &ldquo;This library has saved me countless hours of work and helped me deliver stunning
            designs to my clients faster than ever before.&rdquo; - Sofia Davis
          </blockquote>
        </div>
      </div>
      <div className="flex items-center justify-center lg:h-screen lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <div className="flex flex-col gap-2 text-center">
            <div className="flex flex-col gap-2 text-center">
                <h1 className="flex justify-center mb-4">
                    <Image 
                        src="/assets/Untitled.png" 
                        width={112.5} 
                        height={112.5} 
                        alt="DestiMatch logo" 
                        className="rounded-full shadow-sm"
                    />
                </h1>
                <h2 className="text-2xl font-semibold tracking-tight">Ravi de vous revoir!</h2>
                <p className="text-muted-foreground text-sm">
                  Entrez votre email et votre mot de passe pour vous connecter à votre compte.
                </p>
            </div>
          </div>
          <UserAuthForm />
          <div className="flex flex-col items-center gap-1">
            <p className="text-muted-foreground px-8 text-center text-sm">
              Vous n&apos;avez pas encore de compte ?
            </p>
            <Link href="/register" className="hover:text-primary text-muted-foreground px-8 text-center underline underline-offset-4">
              Enregistrez-vous
            </Link>
          </div>
          {/* <p className="text-muted-foreground px-8 text-center text-sm">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="hover:text-primary underline underline-offset-4">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="hover:text-primary underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p> */}
        </div>
      </div>
    </div>
  );
}
