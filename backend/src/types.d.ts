type User = {
    id: string,
    name: string,
    email: string,
    password: string,
    role: 'ADMIN' | 'SUPERADMIN',
    isActive: boolean,
    createdAt?: Date,
    auditLogs?: any[],
} | null;