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
import { useAuth } from "@/context/AuthContext";

const FilloutFormModal = ({
  open,
  onOpenChange,
  formId,
  forms,
  onFormSubmit,
}) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const handleSubmission = async (submission) => {
    console.log("🎯 Fillout form submitted!", submission);

    const submissionId = submission;
    const formIdLocal = formId;

    try {
      const res = await fetch(
        `https://api.fillout.com/v1/api/forms/${formIdLocal}/submissions/${submissionId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_FILLOUT_API_KEY}`,
          },
        }
      );

      const data = await res.json();

      // 🔹 Extract answers in key:value form
      const answersObj = {};
      data.answers?.forEach((ans) => {
        if (typeof ans.value === "object" && ans.value !== null) {
          // flatten address or similar nested answers
          Object.entries(ans.value).forEach(([key, val]) => {
            answersObj[`${ans.id}_${key}`] = val;
          });
        } else {
          answersObj[ans.id] = ans.value;
        }
      });
      console.log(answersObj);

      // 🔹 Format same as your working example
      const formattedSubmission = {
        submitter_name: user?.user_metadata?.full_name,
        answers: data.raw_data?.submissions?.questions[0],
        form_id: formIdLocal,
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
