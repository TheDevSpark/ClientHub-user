"use client";

import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabaseClient";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";

export default function CaseModal({ isOpen, onClose, onAddCase }) {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  // internal form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    caseType: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.title,
        description: formData.description,
        type: formData.caseType,
        status: "In Progress",
        user_id: user?.id,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("cases")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        alert("Error creating case: " + error.message);
        return;
      }

      if (onAddCase) onAddCase(data);

      // reset form
      setFormData({ title: "", description: "", caseType: "" });
      onClose();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[500px] rounded-[15px] border ${
          isDarkMode
            ? "bg-[#18181b] border-[#27272a] text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <DialogHeader>
          <DialogTitle>Create New Case</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new case.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Case Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Case Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter case title"
              required
              className="rounded-[10px]"
            />
          </div>

          {/* Case Type */}
          <div className="space-y-2">
            <Label htmlFor="caseType">Case Type</Label>
            <Select
              value={formData.caseType}
              onValueChange={(value) =>
                setFormData({ ...formData, caseType: value })
              }
            >
              <SelectTrigger className="rounded-[10px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contract">Contract Review</SelectItem>
                <SelectItem value="property">Property Dispute</SelectItem>
                <SelectItem value="employment">Employment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter case description"
              rows={4}
              required
              className="rounded-[10px] resize-none"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="rounded-[10px]"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" className="rounded-[10px]" disabled={loading}>
              {loading ? "Saving..." : "Create Case"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
