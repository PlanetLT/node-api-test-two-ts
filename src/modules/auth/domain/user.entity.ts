import type { IUser } from "./user.interface";

type NewUserInput = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export class User {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly createdAt?: Date
  ) {}

  // Use create(...) for brand-new users created inside the application flow.
  static create(data: NewUserInput): User {
    return new User(
      data.id,
      User.normalizeName(data.name),
      User.normalizeEmail(data.email),
      User.requirePassword(data.password)
    );
  }

  // Use reconstitute(...) when rebuilding an existing user from persistence.
  static reconstitute(data: IUser): User {
    return new User(
      data.id,
      User.normalizeName(data.name),
      User.normalizeEmail(data.email),
      User.requirePassword(data.password),
      data.createdAt
    );
  }

  // Convert the entity back to a plain object for repository/database work.
  toObject(): IUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      ...(this.createdAt ? { createdAt: this.createdAt } : {}),
    };
  }

  private static normalizeName(value: string): string {
    const name = value.trim();

    if (!name) {
      throw new Error("Name is required");
    }

    return name;
  }

  private static normalizeEmail(value: string): string {
    // Emails are normalized once here so the rest of the app can rely on a stable format.
    const email = value.trim().toLowerCase();

    if (!email) {
      throw new Error("Email is required");
    }

    return email;
  }

  private static requirePassword(value: string): string {
    if (!value) {
      throw new Error("Password is required");
    }

    return value;
  }
}
