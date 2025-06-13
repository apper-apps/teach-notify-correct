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
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Class" className="max-w-md">
      <form onSubmit={handleCreateClass} className="space-y-4">
        <FormField label="Class Name" required>
          <Input
            type="text"
            value={newClass.name}
            onChange={(e) => setNewClass(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter class name"
            required
          />
        </FormField>

        <FormField label="Subject" required>
          <Input
            type="text"
            value={newClass.subject}
            onChange={(e) => setNewClass(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Enter subject"
            required
          />
        </FormField>

        <div className="flex items-center justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={creating} disabled={creating}>
            {creating ? 'Creating...' : 'Create Class'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateClassForm;