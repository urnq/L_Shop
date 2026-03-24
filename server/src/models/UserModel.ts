import fs from 'fs/promises';
import path from 'path';
import { User } from '../types';

const USERS_FILE = path.join(__dirname, '../data/users.json');

export class UserModel {
    private static async readUsers(): Promise<User[]> {
        try {
            const data = await fs.readFile(USERS_FILE, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    private static async writeUsers(users: User[]): Promise<void> {
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    }

    static async findByEmail(email: string): Promise<User | undefined> {
        const users = await this.readUsers();
        return users.find(u => u.email === email);
    }

    static async findById(id: string): Promise<User | undefined> {
        const users = await this.readUsers();
        return users.find(u => u.id === id);
    }

    static async create(user: User): Promise<User> {
        const users = await this.readUsers();
        users.push(user);
        await this.writeUsers(users);
        return user;
    }

    static async update(id: string, updates: Partial<User>): Promise<User | null> {
        const users = await this.readUsers();
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return null;
        
        users[index] = { ...users[index], ...updates };
        await this.writeUsers(users);
        return users[index];
    }
}