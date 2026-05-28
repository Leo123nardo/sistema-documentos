interface PdfPreviewProps {
  requisicionId: number;
  height?: string;
}

export default function PdfPreview({
  requisicionId,
  height = "600px",
}: PdfPreviewProps) {
  const pdfUrl = `http://localhost:3000/api/requisiciones/${requisicionId}/pdf`;

  return (
    <div className="border rounded overflow-hidden">
      <iframe
        title="Vista previa requisición"
        src={pdfUrl}
        style={{ width: "100%", height }}
      />
    </div>
  );
}
