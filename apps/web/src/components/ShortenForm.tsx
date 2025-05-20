import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Loader2, Send } from "lucide-react";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import {
  CreateShortLinkRequestSchema,
  type CreateShortLinkRequest,
} from "@workspace/schema";
import { cn } from "@workspace/ui/lib/utils";

type ShortenFormProps = {
  isLoading: boolean;
  onSubmit: SubmitHandler<CreateShortLinkRequest>;
};

export function ShortenForm({ isLoading, onSubmit }: ShortenFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateShortLinkRequest>({
    resolver: zodResolver(CreateShortLinkRequestSchema),
    defaultValues: {
      originalUrl: "",
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
          className={cn("sm:h-12 sm:text-lg! w-full border-border", {
            "border-destructive": errors.originalUrl,
          })}
          {...register("originalUrl")}
          ref={(e) => {
            register("originalUrl").ref(e);
            (inputRef as React.RefObject<HTMLInputElement | null>).current = e;
          }}
        />
        <div className={cn("sm:h-5 mt-1", errors.originalUrl ? "h-5" : "h-0")}>
          {errors.originalUrl && (
            <p className="text-sm text-destructive ml-1">
              {errors.originalUrl.message}
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
            <Loader2 className="animate-spin mr-2 h-5 w-5" />
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
