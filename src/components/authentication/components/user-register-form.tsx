"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { AlertCircleIcon, LoaderIcon } from "lucide-react";

import { register } from "@/services/user-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { COUNTRIES } from "@/lib/countries";

export function UserRegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [countryCode, setCountryCode] = React.useState("");
  const [city, setCity] = React.useState("");

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const selectedCountry = COUNTRIES.find(c => c.code === countryCode);

      const location = {
        city: city,
        country: selectedCountry?.name || "",
        country_code: selectedCountry?.code || "",
        continent: selectedCountry?.continent || ""
      };
      const data = await register(name, email, password, location);
      console.log(data.token);

      router.push("/home");
    } catch (err) {
      console.error("Erreur détectée:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inconnue est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">

          {error && (
            <div className="mb-4">
              <Alert variant="destructive" className="max-w-md">
                <AlertCircleIcon />
                <AlertTitle>Erreur de connexion</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
            </div>
          )}

          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              placeholder="Nom complet (ex: Jean Voyageur)"
              autoCapitalize="words"
              autoCorrect="off"
              disabled={isLoading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Mot de passe
            </Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Select disabled={isLoading} value={countryCode} onValueChange={setCountryCode} required>
              <SelectTrigger className="w-full text-muted-foreground">
                <SelectValue placeholder="Sélectionnez votre pays" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="mr-2 text-base">{c.flag}</span>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="city">Ville</Label>
            <Input
              id="city"
              placeholder="Ville de résidence (ex: Paris)"
              autoCapitalize="words"
              disabled={isLoading || !countryCode}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div />
          <div />
          <Button disabled={isLoading}>
            {isLoading && <LoaderIcon className="animate-spin" />}
            S&apos;enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}
