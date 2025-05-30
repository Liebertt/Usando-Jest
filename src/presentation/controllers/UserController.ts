import { Request, Response } from 'express';
import { CreateUserUseCase } from '@application/useCases/CreateUserUseCase';
import { GetAllUsersUseCase } from '@application/useCases/GetAllUsersUseCase';
// import { GetUserByEmailUseCase } from '@application/useCases/GetUserByEmailUseCase'; // Comentado pois o arquivo não existe
import { UserRepository } from '@infrastructure/repositories/UserRepository'; // Corrigido para usar alias
import { UserDTO } from '@presentation/dtos/UserDTO';
import { plainToInstance } from 'class-transformer'; // Importar plainToInstance

export class UserController{
    private createUserUseCase: CreateUserUseCase;
    private getAllUsersUsecase: GetAllUsersUseCase;
    // private getByEmailUsecase: GetUserByEmailUseCase; // Comentado
    private userRepository: UserRepository; // Adicionado para findByEmail

    constructor(){
        this.userRepository = new UserRepository();
        this.createUserUseCase = new CreateUserUseCase(this.userRepository);
        this.getAllUsersUsecase = new GetAllUsersUseCase(this.userRepository);
        // this.getByEmailUsecase = new GetUserByEmailUseCase(userRepository); // Comentado
    }

    async createUser(req: Request, res: Response) {
        try {
            const { name, email } = req.body;
            // Validação básica (poderia usar class-validator DTO aqui também)
            if (!name || !email) {
                return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
            }
            const user = await this.createUserUseCase.execute(name, email);
            
            return res.status(201).json(user);
        } catch (error) {
             // Verifica se o erro é de email duplicado (SQLite)
            if ((error as Error).message.includes('UNIQUE constraint failed: Usuario.email')) {
                return res.status(409).json({ error: `O email '${req.body.email}' já está cadastrado.` });
            }
            return res.status(500).json({error: `Erro interno ao criar usuário: ${(error as Error).message}` });
        }
    }

    async getAllUsers(req: Request, res: Response){
        try {
            const users: UserDTO[] | null = await this.getAllUsersUsecase.execute(); // Ajustado tipo para aceitar null

            // Retorna 200 com array vazio se não houver usuários, em vez de 404
            return res.status(200).json(users || []); 

        } catch (error) {
            return res.status(500).json({error: `Erro interno ao buscar usuários: ${(error as Error).message}`});
        }
    }

    // Método getUserByEmail movido para usar o repositório diretamente, já que o UseCase não existe
    async getUserByEmail(req: Request, res: Response){
        try {
            const email = req.params.email;
            if (!email) {
                return res.status(400).json({ error: 'Email é obrigatório no parâmetro da rota.' });
            }

            const user = await this.userRepository.findByEmail(email);
            
            if (!user) {
                return res.status(404).json({ message: `Usuário com email '${email}' não encontrado.` });
            }
            // Converte para DTO antes de retornar
            return res.status(200).json(plainToInstance(UserDTO, user));

        } catch (error) {
            return res.status(500).json({error: `Erro interno ao buscar usuário por email: ${(error as Error).message}`});
        }
    }
}

