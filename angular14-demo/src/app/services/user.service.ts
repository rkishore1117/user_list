import { Injectable } from '@angular/core';
import { User } from 'src/user.model';

const STORAGE_KEY = 'userList';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [];

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): void {
    const data = localStorage.getItem(STORAGE_KEY);
    this.users = data ? JSON.parse(data) : [];
  }

  private saveUsers(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users));
  }

  getUsers(): User[] {
    return [...this.users];
  }

  getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  addUser(user: User): void {
    user.id = new Date().getTime();
    this.users.push(user);
    this.saveUsers();
  }

  updateUser(user: User): void {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
      this.saveUsers();
    }
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
    this.saveUsers();
  }
}
