"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FilloutFullScreenEmbed } from "@fillout/react";
import { useTheme } from "@/context/ThemeContext";

const FilloutFormModal = ({
  open,
  onOpenChange,
  formId,
  forms,
  onFormSubmit,
}) => {
  const { isDarkMode } = useTheme();

const handleSubmission = async (submission) => {
  console.log("🎯 Fillout form submitted!", submission);

  // ✅ Handle both object and string cases
  const submissionId =
    typeof submission === "string"
      ? submission
      : submission?.submissionId || submission?.id;

  const formIdLocal = formId;

  if (!submissionId) {
    console.error("❌ Missing submissionId in Fillout submission:", submission);
    return;
  }

  try {
    console.log("📡 Fetching Fillout data for:", formIdLocal, submissionId);

    const res = await fetch(
      `https://api.fillout.com/v1/api/forms/${formIdLocal}/submissions/${submissionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_FILLOUT_API_KEY}`,
        },
      }
    );

    const data = await res.json();
    console.log("✅ Fillout API data:", data);

    if (!res.ok) {
      console.error("❌ Fillout API error:", data);
      return;
    }

    // Extract answers and questions
    const questionsList = [];
    const answersObj = {};

    data.answers?.forEach((ans) => {
      questionsList.push({
        id: ans.id,
        question: ans.name || ans.question || "Unnamed Question",
        type: ans.type,
        value: ans.value,
      });

      if (typeof ans.value === "object" && ans.value !== null) {
        Object.entries(ans.value).forEach(([key, val]) => {
          answersObj[`${ans.id}_${key}`] = val;
        });
      } else {
        answersObj[ans.id] = ans.value;
      }
    });

    const formattedSubmission = {
      title:
        forms.find((f) => f.id === formIdLocal)?.formName ||
        "Untitled Document",
      answers: answersObj,
      form_id: formIdLocal,
      raw_data: data,
      questions: questionsList,
      submitted_at: data.submissionTime,
      submission_id: submissionId,
    };

    onFormSubmit(formattedSubmission);
    onOpenChange(false);
  } catch (err) {
    console.error("❌ Failed to fetch or format submission:", err);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-full">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Fill out Form - {forms.find((f) => f.id === formId)?.formName}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Fill out the form to generate your document
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-[70vh]">
          {formId && (
            <FilloutFullScreenEmbed
              filloutId={formId}
              onSubmit={handleSubmission}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilloutFormModal;
