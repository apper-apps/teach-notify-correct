import notificationData from '../mockData/notification.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let notifications = [...notificationData];

const notificationService = {
  async getAll() {
    await delay(300);
    return [...notifications];
  },

  async getById(id) {
    await delay(200);
    const notification = notifications.find(n => n.id === id);
    if (!notification) {
      throw new Error('Notification not found');
    }
    return { ...notification };
  },

  async create(notificationData) {
    await delay(500); // Simulate sending time
    const newNotification = {
      id: Date.now().toString(),
      type: notificationData.type,
      recipientIds: notificationData.recipientIds,
      subject: notificationData.subject,
      message: notificationData.message,
      assignmentId: notificationData.assignmentId || null,
      sentAt: new Date().toISOString(),
      status: notificationData.status || 'sent'
    };
    notifications = [newNotification, ...notifications];
    return { ...newNotification };
  },

  async update(id, updates) {
    await delay(300);
    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) {
      throw new Error('Notification not found');
    }
    const updatedNotification = { ...notifications[index], ...updates };
    notifications = notifications.map(n => n.id === id ? updatedNotification : n);
    return { ...updatedNotification };
  },

  async delete(id) {
    await delay(300);
    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) {
      throw new Error('Notification not found');
    }
    notifications = notifications.filter(n => n.id !== id);
    return true;
  }
};

export default notificationService;