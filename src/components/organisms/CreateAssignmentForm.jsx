import React, { useState } from 'react';
import { toast } from 'react-toastify';
import assignmentService from '@/services/api/assignmentService';
import Modal from '@/components/molecules/Modal';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import TextArea from '@/components/atoms/TextArea';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

const CreateAssignmentForm = ({ isOpen, onClose, onAssignmentCreated, classes }) => {
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    classId: '',
    dueDate: ''
  });
  const [creating, setCreating] = useState(false);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.title.trim() || !newAssignment.classId || !newAssignment.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      const createdAssignment = await assignmentService.create({
        title: newAssignment.title.trim(),
        description: newAssignment.description.trim(),
        classId: newAssignment.classId,
        dueDate: newAssignment.dueDate,
        attachments: []
      });
      onAssignmentCreated(createdAssignment);
      setNewAssignment({ title: '', description: '', classId: '', dueDate: '' });
      onClose();
      toast.success('Assignment created successfully');
    } catch (err) {
      toast.error('Failed to create assignment');
    } finally {
      setCreating(false);
    }
  };

  return (
    &lt;Modal isOpen={isOpen} onClose={onClose} title="Create Assignment" className="max-w-md"&gt;
      &lt;form onSubmit={handleCreateAssignment} className="space-y-4"&gt;
        &lt;FormField label="Assignment Title" required&gt;
          &lt;Input
            type="text"
            value={newAssignment.title}
            onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter assignment title"
            required
          /&gt;
        &lt;/FormField&gt;

        &lt;FormField label="Class" required&gt;
          &lt;Select
            value={newAssignment.classId}
            onChange={(e) => setNewAssignment(prev => ({ ...prev, classId: e.target.value }))}
            required
          &gt;
            &lt;option value=""&gt;Select a class&lt;/option&gt;
            {classes.map(classItem => (
              &lt;option key={classItem.id} value={classItem.id}&gt;
                {classItem.name} - {classItem.subject}
              &lt;/option&gt;
            ))}
          &lt;/Select&gt;
        &lt;/FormField&gt;

        &lt;FormField label="Due Date" required&gt;
          &lt;Input
            type="date"
            value={newAssignment.dueDate}
            onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
            required
          /&gt;
        &lt;/FormField&gt;

        &lt;FormField label="Description"&gt;
          &lt;TextArea
            value={newAssignment.description}
            onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter assignment description"
            rows="3"
          /&gt;
        &lt;/FormField&gt;

        &lt;div className="flex items-center justify-end space-x-3 pt-4"&gt;
          &lt;Button type="button" variant="ghost" onClick={onClose}&gt;
            Cancel
          &lt;/Button&gt;
          &lt;Button type="submit" variant="primary" loading={creating} disabled={creating}&gt;
            {creating ? 'Creating...' : 'Create Assignment'}
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/form&gt;
    &lt;/Modal&gt;
  );
};

export default CreateAssignmentForm;