"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DocAddModal = ({ open, onOpenChange, onFormSelect, forms }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Add New Document
          </DialogTitle>
          <DialogDescription>
            Select a form to add as a new document.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-3 mt-4">
          {forms.map((form, index) => (
            <div
              key={index}
              className="border p-4 border-gray-300 rounded-2xl text-black hover:border-black cursor-pointer"
              onClick={() => onFormSelect(form)}
            >
              {form.formName}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocAddModal;
