import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Tema } from "../../tema/entities/tema.entity";

@Entity({name: 'tb_postagens'})  // CREATE TABLE tb_postagens()
export class Postagem{
    @PrimaryGeneratedColumn()  // AUTO_INCREMENT PRIMARY KEY
    id: number;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()  // validação dos dados do objeto
    @Column({length: 100, nullable: false})  // VARCHAR(100) NOT NULL
    titulo: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty()  // validação dos dados do objeto
    @Column({length: 1000, nullable: false})  // VARCHAR(100) NOT NULL
    texto: string;

    @UpdateDateColumn() // atualiza a hora automaticamente, conforme o sistema
    data: Date;

    @ManyToOne(() => Tema, (tema) => tema.postagem, {
        onDelete: 'CASCADE'
    })
    tema: Tema;
}