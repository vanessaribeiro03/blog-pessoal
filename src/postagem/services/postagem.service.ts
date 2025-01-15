import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Postagem } from "../entities/postagem.entity";
import { DeleteResult, ILike, Repository } from "typeorm";
import { TemaService } from "../../tema/services/tema.service";

@Injectable()
export class PostagemService{
    constructor(
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>,
        private temaService: TemaService
    ){}

    async findAll(): Promise<Postagem[]>{
        return this.postagemRepository.find({relations: {tema: true}});
    }

    async findById(id: number): Promise<Postagem>{
        const postagem = await this.postagemRepository.findOne({where: {id}, relations: {tema: true}})

        if(!postagem){
            throw new HttpException('Postagem não encontrada.', HttpStatus.NOT_FOUND)
        }

        return postagem;
    }

    async findByTitulo(titulo: string): Promise<Postagem[]>{
        return this.postagemRepository.find({where: {titulo: ILike(`%${titulo}%`)}, relations: {tema: true}});
    }

    async create(postagem: Postagem): Promise<Postagem>{
        await this.temaService.findById(postagem.tema.id);
        return await this.postagemRepository.save(postagem);
    }

    async update(postagem: Postagem): Promise<Postagem>{
        await this.findById(postagem.id)
        await this.temaService.findById(postagem.tema.id);
        return await this.postagemRepository.save(postagem);
    }

    async delete(id: number): Promise<DeleteResult>{
        await this.findById(id)

        return await this.postagemRepository.delete(id)
    }

}