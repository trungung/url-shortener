import { Button } from "@workspace/ui/components/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

type ShortenedUrlDisplayProps = {
  shortUrl: string;
};

export function ShortenedUrlDisplay({ shortUrl }: ShortenedUrlDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <motion.div>
      <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-accent rounded-xl border border-border flex flex-col gap-3">
        <p className="text-sm font-medium text-primary flex items-center">
          <Check className="w-4 h-4 mr-1.5 text-green-700" />
          Your short URL is ready!
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex-1 relative">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              role="button"
              className="w-full sm:pr-16 px-3.5 py-3.5 bg-background rounded-lg border border-border text-foreground font-medium break-all focus:outline-none cursor-pointer whitespace-nowrap truncate block"
              aria-label="Shortened URL"
            >
              {shortUrl}
            </a>
            <div className="sm:hidden mt-3">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-center border-border"
                onClick={copyToClipboard}
                tabIndex={0}
                aria-label={isCopied ? "Copied!" : "Copy short URL"}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-green-700 mr-2" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    <span>Copy URL</span>
                  </>
                )}
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 px-3 hover:bg-transparent border-border"
              onClick={copyToClipboard}
              tabIndex={0}
              aria-label={isCopied ? "Copied!" : "Copy short URL"}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-green-700" />
                  <span className="sr-only">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="sr-only">Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
