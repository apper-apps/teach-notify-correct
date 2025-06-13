import studentData from '../mockData/student.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let students = [...studentData];

const studentService = {
  async getAll() {
    await delay(300);
    return [...students];
  },

  async getById(id) {
    await delay(200);
    const student = students.find(s => s.id === id);
    if (!student) {
      throw new Error('Student not found');
    }
    return { ...student };
  },

  async create(studentData) {
    await delay(400);
    const newStudent = {
      id: Date.now().toString(),
      name: studentData.name,
      email: studentData.email,
      classIds: studentData.classIds || []
    };
    students = [...students, newStudent];
    return { ...newStudent };
  },

  async update(id, updates) {
    await delay(300);
    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Student not found');
    }
    const updatedStudent = { ...students[index], ...updates };
    students = students.map(s => s.id === id ? updatedStudent : s);
    return { ...updatedStudent };
  },

  async delete(id) {
    await delay(300);
    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Student not found');
    }
    students = students.filter(s => s.id !== id);
    return true;
  }
};

export default studentService;