import assignmentData from '../mockData/assignment.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let assignments = [...assignmentData];

const assignmentService = {
  async getAll() {
    await delay(300);
    return [...assignments];
  },

  async getById(id) {
    await delay(200);
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) {
      throw new Error('Assignment not found');
    }
    return { ...assignment };
  },

  async create(assignmentData) {
    await delay(400);
    const newAssignment = {
      id: Date.now().toString(),
      classId: assignmentData.classId,
      title: assignmentData.title,
      description: assignmentData.description,
      dueDate: assignmentData.dueDate,
      attachments: assignmentData.attachments || [],
      createdAt: new Date().toISOString()
    };
    assignments = [...assignments, newAssignment];
    return { ...newAssignment };
  },

  async update(id, updates) {
    await delay(300);
    const index = assignments.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Assignment not found');
    }
    const updatedAssignment = { ...assignments[index], ...updates };
    assignments = assignments.map(a => a.id === id ? updatedAssignment : a);
    return { ...updatedAssignment };
  },

  async delete(id) {
    await delay(300);
    const index = assignments.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Assignment not found');
    }
    assignments = assignments.filter(a => a.id !== id);
    return true;
  }
};

export default assignmentService;