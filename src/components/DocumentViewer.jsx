// components/DocumentViewer.js
"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateDocument } from "@/lib/document-service";
import { useState } from "react";
import { Download, FileText, X, AlertCircle } from "lucide-react";

const DocumentViewer = ({ open, onOpenChange, document }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateAndView = async () => {
    if (!document?.form_data?.answers) {
      setError("No form data available to generate document");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await generateDocument(
      document.form_data.raw_data,
      document.form_data.title
    );
    console.log("from Doc Viewver", document.form_data);

    if (!result.success) setError(result.error);
    setLoading(false);
  };

  const handleClose = () => {
    setError(null);
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-full">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            {document?.form_data?.title || "Document Preview"}
          </DialogTitle>
          <DialogDescription>
            Generate and download the filled document
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle size={16} />
                <span className="font-medium">Error:</span>
                <span>
                  {typeof error === "string" ? error : JSON.stringify(error)}
                </span>
              </div>
            </div>
          )}

          {/* Document Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Document Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Title:</span>{" "}
                {document?.form_data?.title}
              </div>
              <div>
                <span className="font-medium">Form ID:</span>{" "}
                {document?.form_data?.form_id}
              </div>
              <div>
                <span className="font-medium">Submitted:</span>{" "}
                {document?.form_data?.submitted_at
                  ? new Date(
                      document.form_data.submitted_at
                    ).toLocaleDateString()
                  : "N/A"}
              </div>
              <div>
                <span className="font-medium">Submission ID:</span>{" "}
                {document?.form_data?.submission_id}
              </div>
            </div>
          </div>

          {/* Form Data Preview */}
          {document?.form_data?.answers &&
            Object.keys(document.form_data.answers).length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  Form Data ({Object.keys(document.form_data.answers).length}{" "}
                  fields)
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {Object.entries(document.form_data.answers).map(
                    ([field, value]) => (
                      <div key={field} className="flex text-sm">
                        <span className="font-medium w-1/3 truncate">
                          {field}:
                        </span>
                        <span className="w-2/3">{String(value)}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleGenerateAndView}
              disabled={loading || !document?.form_data?.answers}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Generate & Download Document
                </>
              )}
            </button>

            <button
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-600 text-center">
            <p>
              Click "Generate & Download Document" to create a Word document
              with the form data filled in.
            </p>
            <p>The document will automatically download to your computer.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
