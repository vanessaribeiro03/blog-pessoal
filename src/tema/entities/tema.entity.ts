import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Postagem } from "../../postagem/entities/postagem.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name: 'tb_temas'})  
export class Tema{
    @PrimaryGeneratedColumn()
    @ApiProperty()  
    id: number;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @IsNotEmpty() 
    @Column({length: 100, nullable: false})  
    @ApiProperty()
    descricao: string;

    @ApiProperty()
    @OneToMany(() => Postagem, (postagem) => postagem.tema)
    postagem: Postagem[]
}