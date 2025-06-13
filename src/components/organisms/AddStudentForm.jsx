import React, { useState } from 'react';
import { toast } from 'react-toastify';
import studentService from '@/services/api/studentService';
import classService from '@/services/api/classService';
import Modal from '@/components/molecules/Modal';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Checkbox from '@/components/atoms/Checkbox';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const AddStudentForm = ({ isOpen, onClose, onStudentAdded, classes, onClassesUpdated }) => {
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    selectedClassIds: []
  });
  const [adding, setAdding] = useState(false);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name.trim() || !newStudent.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setAdding(true);
    try {
      const createdStudent = await studentService.create({
        name: newStudent.name.trim(),
        email: newStudent.email.trim(),
        classIds: newStudent.selectedClassIds
      });

      // Update classes to include this student
      const updatedClasses = [];
      for (const classId of newStudent.selectedClassIds) {
        const classData = classes.find(c => c.id === classId);
        if (classData && !classData.studentIds.includes(createdStudent.id)) {
          const updatedClass = {
            ...classData,
            studentIds: [...classData.studentIds, createdStudent.id]
          };
          await classService.update(classId, updatedClass);
          updatedClasses.push(updatedClass);
        } else if (classData) {
          updatedClasses.push(classData); // Already has student, just include for local update
        }
      }
      onClassesUpdated(updatedClasses); // Notify parent to update classes state

      onStudentAdded(createdStudent);
      setNewStudent({ name: '', email: '', selectedClassIds: [] });
      onClose();
      toast.success('Student added successfully');
    } catch (err) {
      toast.error('Failed to add student');
    } finally {
      setAdding(false);
    }
  };

  return (
    &lt;Modal isOpen={isOpen} onClose={onClose} title="Add New Student" className="max-w-md"&gt;
      &lt;form onSubmit={handleAddStudent} className="space-y-4"&gt;
        &lt;FormField label="Student Name" required&gt;
          &lt;Input
            type="text"
            value={newStudent.name}
            onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter student name"
            required
          /&gt;
        &lt;/FormField&gt;

        &lt;FormField label="Email Address" required&gt;
          &lt;Input
            type="email"
            value={newStudent.email}
            onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter email address"
            required
          /&gt;
        &lt;/FormField&gt;

        &lt;div&gt;
          &lt;label className="block text-sm font-medium text-gray-700 mb-2"&gt;
            Assign to Classes
          &lt;/label&gt;
          &lt;div className="space-y-2 max-h-40 overflow-y-auto"&gt;
            {classes.map(classItem => (
              &lt;label key={classItem.id} className="flex items-center space-x-2"&gt;
                &lt;Checkbox
                  checked={newStudent.selectedClassIds.includes(classItem.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewStudent(prev => ({
                        ...prev,
                        selectedClassIds: [...prev.selectedClassIds, classItem.id]
                      }));
                    } else {
                      setNewStudent(prev => ({
                        ...prev,
                        selectedClassIds: prev.selectedClassIds.filter(id => id !== classItem.id)
                      }));
                    }
                  }}
                /&gt;
                &lt;Text type="span" className="text-sm text-gray-700"&gt;
                  {classItem.name} - {classItem.subject}
                &lt;/Text&gt;
              &lt;/label&gt;
            ))}
          &lt;/div&gt;
        &lt;/div&gt;

        &lt;div className="flex items-center justify-end space-x-3 pt-4"&gt;
          &lt;Button
            type="button"
            variant="ghost"
            onClick={onClose}
          &gt;
            Cancel
          &lt;/Button&gt;
          &lt;Button
            type="submit"
            variant="primary"
            loading={adding}
            disabled={adding}
          &gt;
            {adding ? 'Adding...' : 'Add Student'}
          &lt;/Button&gt;
        &lt;/div&gt;
      &lt;/form&gt;
    &lt;/Modal&gt;
  );
};

export default AddStudentForm;