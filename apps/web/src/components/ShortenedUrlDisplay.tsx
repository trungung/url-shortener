import { Button } from "@workspace/ui/components/button";
import { Check, Copy, QrCode, Download, ExternalLink } from "lucide-react";
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

  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const qrCodeRef = useRef<SVGSVGElement | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
              className="w-full sm:pr-32 px-3.5 py-3.5 bg-background rounded-lg border border-border text-foreground font-medium break-all focus:outline-none cursor-pointer whitespace-nowrap truncate block"
              aria-label="Shortened URL"
            >
              {shortUrl}
            </a>
            <div className="sm:hidden mt-3 flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 justify-center border-border"
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
              <Button
                type="button"
                variant="outline"
                className="flex-1 justify-center border-border"
                onClick={() => setIsQrDialogOpen(true)}
                tabIndex={0}
                aria-label="Show QR Code"
              >
                <QrCode className="w-4 h-4 mr-2" />
                <span>QR Code</span>
              </Button>
            </div>
            <div className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 gap-2">
              <Button
                type="button"
                variant="outline"
                className="p-2 h-9 w-9 hover:bg-transparent border-border"
                onClick={() => setIsQrDialogOpen(true)}
                tabIndex={0}
                aria-label="Show QR Code"
              >
                <QrCode className="w-4 h-4" />
                <span className="sr-only">QR Code</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="p-2 h-9 w-9 hover:bg-transparent border-border"
                onClick={copyToClipboard}
                tabIndex={0}
                aria-label={isCopied ? "Copied!" : "Copy short URL"}
              >
                {isCopied ? (
                  <Check className="w-4 h-4 text-green-700" />
                ) : (
                  <Copy className="w-4 h-4" />
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
          <div className="flex flex-col items-center justify-center py-4 gap-6">
            <Button variant="link" asChild>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-centers flex items-center gap-2"
              >
                {shortUrl}
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
            <QRCodeSVG
              ref={qrCodeRef}
              value={shortUrl}
              className="h-60 w-60 sm:h-80 sm:w-80 max-w-full"
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
