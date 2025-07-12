declare module 'xss-clean' {
    import { RequestHandler } from 'express';
    const xssClean: () => RequestHandler;
    export default xssClean;
}

declare module ''



export async function updateAdmin(
    id: string,
    data: Partial<{
        name: string;
        role: Role;
        isActive: boolean;
        password: string;
    }>,
    file?: Express.Multer.File
) {
    // implementation
}
