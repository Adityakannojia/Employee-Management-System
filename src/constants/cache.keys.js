export const CACHE_KEYS = {
    employeesAll: "employees:all",
    employeeMe: (userId) => `employee:me:${userId}`,
    leavesAll: "leaves:all",
    leavesMy: (userId) => `leaves:my:${userId}`,
    tasksAll: "tasks:all",
    tasksMy: (userId) => `tasks:my:${userId}`,
    worklogsAll: "worklogs:all",
    worklogsMy: (userId) => `worklogs:my:${userId}`,
};

export const CACHE_TTL = {
    short: 120,
    medium: 180,
    default: 300,
    long: 600,
};
