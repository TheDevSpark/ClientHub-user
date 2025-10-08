'use client';

import { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { supabase } from '@/lib/supabaseClient';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/app/components/ui/select';

export default function CaseModal({ isOpen, onClose, onAddCase }) {
  const { isDarkMode } = useTheme();

  // internal form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    caseType: '',
    caseId: '',     // 👈 new field
    status: 'In Progress', // 👈 default value
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // agar caseId user khali chor de to fallback random ID generate karna
     const caseId = formData.caseId || `C-${Date.now()}`;


      const payload = {
        'case-name': formData.title,
        'case-description': formData.description,
        'case-type': formData.caseType,
        status: formData.status,         // 👈 user ka chosen status
        'case-id': formData.caseId,          // 👈 user ka ya fallback ID
        'created_at': new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('cases')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        alert('Error creating case: ' + error.message);
        return;
      }

      if (onAddCase) onAddCase(data);

      // reset form
      setFormData({ title: '', description: '', caseType: '', caseId: '', status: 'In Progress' });
      onClose();
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Unexpected error: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[500px] rounded-[15px] border ${
          isDarkMode
            ? 'bg-[#18181b] border-[#27272a] text-white'
            : 'bg-white border-gray-200 text-gray-900'
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter case title"
              required
              className="rounded-[10px]"
            />
          </div>
                {/* Case ID */}
          <div className="space-y-2">
            <Label htmlFor="caseId">Case ID</Label>
            <Input
              id="caseId"
              value={formData.caseId}
              onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
              placeholder="Enter Case ID (optional)"
              className="rounded-[10px]"
            />
          </div>

          {/* Case Type */}
          <div className="space-y-2">
            <Label htmlFor="caseType">Case Type</Label>
            <Select
              value={formData.caseType}
              onValueChange={(value) => setFormData({ ...formData, caseType: value })}
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

          {/* Status */}
          {/* Status */}
<div className="space-y-2">
  <Label htmlFor="status">Status</Label>
  <Select
    value={formData.status}
    onValueChange={(value) => setFormData({ ...formData, status: value })}
  >
    <SelectTrigger className="rounded-[10px]">
      <SelectValue placeholder="Select status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="In Progress">In Progress</SelectItem>
      <SelectItem value="Complete">Complete</SelectItem>
    </SelectContent>
  </Select>
</div>


          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter case description"
              rows={4}
              required
              className="rounded-[10px] resize-none"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="rounded-[10px]">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" className="rounded-[10px]" disabled={loading}>
              {loading ? 'Saving...' : 'Create Case'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
