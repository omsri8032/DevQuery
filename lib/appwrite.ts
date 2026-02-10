// Appwrite Client
import { Client, Account, Databases, Storage, Avatars } from "appwrite";
import env from "./env";

export const client = new Client();

client.setEndpoint(env.appwrite.endpoint).setProject(env.appwrite.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
