import classData from '../mockData/class.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let classes = [...classData];

const classService = {
  async getAll() {
    await delay(300);
    return [...classes];
  },

  async getById(id) {
    await delay(200);
    const classItem = classes.find(c => c.id === id);
    if (!classItem) {
      throw new Error('Class not found');
    }
    return { ...classItem };
  },

  async create(classData) {
    await delay(400);
    const newClass = {
      id: Date.now().toString(),
      name: classData.name,
      subject: classData.subject,
      studentIds: classData.studentIds || [],
      createdAt: new Date().toISOString()
    };
    classes = [...classes, newClass];
    return { ...newClass };
  },

  async update(id, updates) {
    await delay(300);
    const index = classes.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Class not found');
    }
    const updatedClass = { ...classes[index], ...updates };
    classes = classes.map(c => c.id === id ? updatedClass : c);
    return { ...updatedClass };
  },

  async delete(id) {
    await delay(300);
    const index = classes.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Class not found');
    }
    classes = classes.filter(c => c.id !== id);
    return true;
  }
};

export default classService;