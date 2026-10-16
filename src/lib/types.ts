export type User = {id: string; username: string; displayName: string; email?: string; createdAt?: string};
export type Friend = User & {friendsSince?: string};
export type FriendRequest = {id: string; senderId: string; recipientId: string; senderUsername: string; recipientUsername: string; status: string; createdAt?: string};
export type Registration = {username: string; email: string; password: string; displayName?: string};
export interface Service {
  restore(): Promise<User | null>;
  login(email: string, password: string): Promise<User>;
  register(input: Registration): Promise<User>;
  logout(): Promise<void>;
  friends(): Promise<Friend[]>;
  requests(): Promise<FriendRequest[]>;
  sendRequest(username: string): Promise<void>;
  respond(id: string, action: 'accept' | 'decline'): Promise<void>;
  cancel(id: string): Promise<void>;
  remove(userId: string): Promise<void>;
  updateName(displayName: string): Promise<User>;
  health(): Promise<boolean>;
}
