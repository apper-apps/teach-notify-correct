import React, { useState } from 'react';
import { toast } from 'react-toastify';
import classService from '@/services/api/classService';
import Modal from '@/components/molecules/Modal';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const CreateClassForm = ({ isOpen, onClose, onClassCreated }) => {
  const [newClass, setNewClass] = useState({ name: '', subject: '' });
  const [creating, setCreating] = useState(false);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClass.name.trim() || !newClass.subject.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setCreating(true);
    try {
      const createdClass = await classService.create({
        name: newClass.name.trim(),
        subject: newClass.subject.trim(),
        studentIds: []
      });
      onClassCreated(createdClass);
      setNewClass({ name: '', subject: '' });
      onClose();
      toast.success('Class created successfully');
    } catch (err) {
      toast.error('Failed to create class');
    } finally {
      setCreating(false);
    }
  };

  return (
    &lt;Modal isOpen={isOpen} onClose={onClose} title="Create New Class" className="max-w-md"&gt;
      &lt;form onSubmit={handleCreateClass} className="space-y-4"&gt;
        &lt;FormField label="Class Name" required&gt;
          &lt;Input
            type="text"
            value={newClass.name}
            onChange={(e) => setNewClass(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter class name"
            required
          /&gt;
        &lt;/FormField&gt;

        &lt;FormField label="Subject" required&gt;
          &lt;Input
            type="text"
            value={newClass.subject}
            onChange={(e) => setNewClass(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Enter subject"
            required
          /&gt;
        &lt;/FormField&gt;

        &lt;div className="flex items-center justify-end space-x-3 pt-4"&gt;
          &lt;Button type="button" variant="ghost" onClick={onClose}&gt;
            Cancel
          &lt;/Button&gt;
          &lt;Button type="submit" variant="primary" loading={creating} disabled={creating}&gt;
            {creating ? 'Creating...' : 'Create Class'}
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/form&gt;
    &lt;/Modal&gt;
  );
};

export default CreateClassForm;