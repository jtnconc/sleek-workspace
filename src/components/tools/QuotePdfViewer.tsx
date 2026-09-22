interface QuotePdfViewerProps {
  /** Blob URL of the generated quotation PDF. */
  url: string;
}

/**
 * Renders the PDF using the browser's own native PDF viewer via <iframe>,
 * instead of pdf.js/canvas — avoids the Worker entirely, which was causing
 * the preview to hang or crash the tab in some environments. Trade-off: shows
 * the browser's native PDF toolbar (zoom, print, download) instead of a
 * borderless custom render.
 */
export function QuotePdfViewer({ url }: QuotePdfViewerProps) {
  return (
    <div className="h-[80vh] min-h-[500px] w-full overflow-auto rounded-xl border border-border">
      <iframe
        src={url}
        title="Quote preview"
        className="h-full w-full"
        style={{ border: "none" }}
      />
    </div>
  );
}

export default QuotePdfViewer;
