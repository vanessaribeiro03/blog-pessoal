import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Postagem } from "../../postagem/entities/postagem.entity";

@Entity({name: 'tb_temas'})  // CREATE TABLE tb_tema()
export class Tema{
    @PrimaryGeneratedColumn()  // AUTO_INCREMENT PRIMARY KEY
    id: number;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()  // validação dos dados do objeto
    @Column({length: 100, nullable: false})  // VARCHAR(100) NOT NULL
    descricao: string;

    @OneToMany(() => Postagem, (postagem) => postagem.tema)
    postagem: Postagem[]
}