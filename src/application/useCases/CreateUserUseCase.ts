import { IUserRepository } from "@domain/repositories/IUserRepository";
import { User } from "@domain/entities/User";

export class CreateUserUseCase {
    constructor(private userRepository: IUserRepository){}

    async execute(name: string, email: string): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new Error("Já existe um usuário registrado com este e-mail.");
        }

        const user = new User(name, email);

        return await this.userRepository.save(user);
    }
}