import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Loader2, Send } from "lucide-react";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  shortenFormSchema,
  type ShortenFormSchema,
} from "../schemas/shortenFormSchema";

type ShortenFormProps = {
  isLoading: boolean;
  onSubmit: SubmitHandler<ShortenFormSchema>;
};

export function ShortenForm({ isLoading, onSubmit }: ShortenFormProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ShortenFormSchema>({
    resolver: zodResolver(shortenFormSchema),
    defaultValues: {
      url: "",
    },
  });
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 sm:flex-row space-y-1 sm:space-y-0"
    >
      <div className="flex-1 flex flex-col">
        <Input
          placeholder="Paste your long URL here..."
          className={`sm:h-12 sm:text-lg! w-full border-border ${
            errors.url ? "border-destructive" : ""
          }`}
          {...register("url")}
        />
        <div className="h-5 mt-1">
          {errors.url && (
            <p className="text-sm text-destructive ml-1">
              {errors.url.message}
            </p>
          )}
        </div>
      </div>
      <Button
        type="submit"
        className="text-base w-full sm:w-auto sm:h-12"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-primary-foreground" />
            Shortening...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Shorten URL
          </>
        )}
      </Button>
    </form>
  );
}
