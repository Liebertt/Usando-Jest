/**
 * @author Lieberte Ferreira <liebertt7@gmail.com>
 * @date 2025-05-10
 * Define o Data Transfer Object (DTO) para a criação e validação de Contatos.
 */
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class ContatoDTO {
    @IsNotEmpty({ message: "O ID do usuário é obrigatório" })
    Id_usuario!: number; // Adicionado '!' para asserção de atribuição definitiva

    @IsNotEmpty({ message: "O telefone celular é obrigatório" })
    @IsString({ message: "O telefone celular deve ser uma string" })
    @Length(9, 9, { message: "O telefone celular deve ter exatamente 9 caracteres" })
    Telefone_celular!: string; // Adicionado '!'

    @IsOptional()
    @IsString({ message: "O telefone recado deve ser uma string" })
    @Length(9, 9, { message: "O telefone recado deve ter exatamente 9 caracteres" })
    Telefone_recado?: string;

    @IsNotEmpty({ message: "O email é obrigatório" })
    @IsEmail({}, { message: "O email deve ser um endereço de email válido" })
    @Length(1, 50, { message: "O email deve ter no máximo 50 caracteres" })
    Email!: string; // Adicionado '!'

    @IsNotEmpty({ message: "O endereço é obrigatório" })
    @IsString({ message: "O endereço deve ser uma string" })
    @Length(1, 100, { message: "O endereço deve ter no máximo 100 caracteres" })
    Endereco!: string; // Adicionado '!'
}

