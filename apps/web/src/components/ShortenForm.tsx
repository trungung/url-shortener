import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Switch } from "@workspace/ui/components/switch";
import { Label } from "@workspace/ui/components/label";
import { Loader2, Send, Calendar as CalendarIcon, Braces } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import { format } from "date-fns";

import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useCheckShortCode } from "../hooks/queries/useCheckShortCode";
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

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    setError,
    clearErrors,
  } = useForm<CreateShortLinkRequest>({
    resolver: zodResolver(CreateShortLinkRequestSchema),
    defaultValues: {
      originalUrl: "",
      customCode: "",
      expiresAt: "",
    },
  });
  const [isAdvanced, setIsAdvanced] = useState(false);

  const customCode = watch("customCode");
  const debouncedCustomCode = useDebounce(customCode, 500);

  const { data: codeExists = false } = useCheckShortCode(
    debouncedCustomCode,
    !!debouncedCustomCode,
  );

  const customCodeError = useMemo(() => errors.customCode, [errors.customCode]);

  useEffect(() => {
    if (!debouncedCustomCode) return;

    if (codeExists) {
      if (customCodeError?.type !== "exists") {
        setError("customCode", {
          type: "exists",
          message: "This code already exists.",
        });
      }
    } else {
      if (customCodeError?.type === "exists") {
        clearErrors("customCode");
      }
    }
  }, [codeExists, debouncedCustomCode, customCodeError, setError, clearErrors]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (errors.customCode) {
          return;
        }
        onSubmit(data);
      })}
      className="w-full"
    >
      <div className="grid-cols-16 grid gap-x-3 gap-y-6">
        <div className="col-span-16 space-y-2 sm:col-span-11">
          <Input
            id="originalUrl"
            placeholder="Paste your long URL here..."
            className={cn("sm:text-lg! border-border w-full sm:h-12", {
              "border-destructive": errors.originalUrl,
            })}
            {...register("originalUrl")}
            ref={(e) => {
              register("originalUrl").ref(e);
              (inputRef as React.RefObject<HTMLInputElement | null>).current =
                e;
            }}
          />
          {errors.originalUrl && (
            <p className="text-destructive ml-1 text-sm">
              {errors.originalUrl.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="col-span-16 w-full text-base sm:col-span-5 sm:h-12 sm:text-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Shortening...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Shorten URL
            </>
          )}
        </Button>

        <div className="col-span-16 flex items-center space-x-2">
          <Switch
            id="advanced-mode"
            checked={isAdvanced}
            onCheckedChange={setIsAdvanced}
          />
          <Label htmlFor="advanced-mode">Advanced Options</Label>
        </div>

        {isAdvanced && (
          <>
            <div className="col-span-16 space-y-2 sm:col-span-8">
              <Label htmlFor="customCode">
                Custom Code
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <div className="flex items-center">
                <div className="relative w-full">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Braces
                      className={cn("h-4 w-4", {
                        "text-muted-foreground": !customCode,
                      })}
                    />
                  </div>
                  <Input
                    id="customCode"
                    placeholder="Enter custom code"
                    className={cn("border-border w-full pl-10 pr-8", {
                      "border-destructive": errors.customCode,
                    })}
                    {...register("customCode")}
                  />
                </div>
              </div>
              {errors.customCode && (
                <p className="text-destructive ml-1 text-sm">
                  {errors.customCode.message}
                </p>
              )}
            </div>

            <div className="col-span-16 space-y-2 sm:col-span-8">
              <Label htmlFor="expiresAt">
                Expiration Date{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Controller
                control={control}
                name="expiresAt"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "border-border w-full justify-start text-left text-base font-normal hover:bg-inherit hover:text-current md:text-sm",
                          !field.value &&
                            "text-muted-foreground hover:text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Choose when link expires</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            const expiryDate = new Date(date);
                            expiryDate.setHours(23, 59, 59);
                            field.onChange(expiryDate.toISOString());
                          } else {
                            field.onChange("");
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.expiresAt && (
                <p className="text-destructive ml-1 text-sm">
                  {errors.expiresAt.message}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </form>
  );
}
