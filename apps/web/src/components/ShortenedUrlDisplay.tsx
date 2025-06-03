import { Button } from "@workspace/ui/components/button";
import {
  Check,
  Copy,
  QrCode,
  Download,
  ExternalLink,
  Link2,
} from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";

type ShortenedUrlDisplayProps = {
  shortUrl: string;
};

const downloadQRCode = (qrCodeRef: React.RefObject<SVGSVGElement | null>) => {
  const svg = qrCodeRef.current;
  if (!svg) return;

  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);

  // Create a blob from the SVG XML
  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link to trigger download
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "qr-code.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  // Revoke the object URL to free memory
  URL.revokeObjectURL(url);
};

export function ShortenedUrlDisplay({ shortUrl }: ShortenedUrlDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);
  const qrCodeRef = useRef<SVGSVGElement | null>(null);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);

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

  if (!shortUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        role="button"
        tabIndex={0}
        aria-label="Paste a URL above to create a short link"
        onClick={() => document.getElementById("originalUrl")?.focus()}
        className="h-42 border-border/50 bg-muted mt-6 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 sm:mt-8 sm:h-32"
      >
        <Link2 className="text-muted-foreground h-6 w-6" />
        <p className="text-muted-foreground">
          Paste a URL above to create a short link
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-accent border-border mt-6 flex flex-col gap-3 rounded-xl border p-4 sm:mt-8 sm:p-5">
        <p className="text-primary flex items-center text-sm font-medium">
          <Check className="mr-1.5 h-4 w-4 text-green-700" />
          Your short URL is ready!
        </p>
        <div className="flex flex-col gap-3">
          <div className="relative flex-1">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              role="button"
              className="bg-background border-border text-foreground block w-full cursor-pointer truncate whitespace-nowrap break-all rounded-lg border px-3.5 py-3.5 font-medium focus:outline-none sm:pr-32"
              aria-label="Shortened URL"
            >
              {shortUrl}
            </a>
            <div className="mt-3 flex gap-2 sm:hidden">
              <Button
                type="button"
                variant="outline"
                className="border-border flex-1 justify-center"
                onClick={copyToClipboard}
                tabIndex={0}
                aria-label={isCopied ? "Copied!" : "Copy short URL"}
              >
                {isCopied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-700" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>Copy URL</span>
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-border flex-1 justify-center"
                onClick={() => setIsQrDialogOpen(true)}
                tabIndex={0}
                aria-label="Show QR Code"
              >
                <QrCode className="mr-2 h-4 w-4" />
                <span>QR Code</span>
              </Button>
            </div>
            <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 gap-2 sm:flex">
              <Button
                type="button"
                variant="outline"
                className="border-border h-9 w-9 p-2 hover:bg-transparent"
                onClick={() => setIsQrDialogOpen(true)}
                tabIndex={0}
                aria-label="Show QR Code"
              >
                <QrCode className="h-4 w-4" />
                <span className="sr-only">QR Code</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-border h-9 w-9 p-2 hover:bg-transparent"
                onClick={copyToClipboard}
                tabIndex={0}
                aria-label={isCopied ? "Copied!" : "Copy short URL"}
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-700" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">{isCopied ? "Copied!" : "Copy"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-6 py-4">
            <Button variant="link" asChild>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-centers flex items-center gap-2"
              >
                {shortUrl}
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <QRCodeSVG
              ref={qrCodeRef}
              value={shortUrl}
              className="h-60 w-60 max-w-full sm:h-80 sm:w-80"
              level="H"
            />
            <Button
              onClick={() => downloadQRCode(qrCodeRef)}
              size="lg"
              variant="outline"
              className="border-border"
            >
              <Download />
              Download QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
