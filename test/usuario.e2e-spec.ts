import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Testes dos Módulos Usuario e Auth (e2e)', () => {
  let token: any;
  let usuarioId: any;
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [__dirname + "./../src/**/entities/*.entity.ts"],
          synchronize: true,
        dropSchema: true
      }),
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {

    await app.close();
  
  });

  it('01 - Deve cadastrar um novo ususario', async() => {
    const resposta = await request(app.getHttpServer())
    .post('/usuarios/cadastrar')
    .send({
      nome: "Root",
      usuario: "root@root.com",
      senha: "rootroot",
      foto: "-"
    }).expect(201)

    usuarioId = resposta.body.id
  })

  it('02 - Não deve cadastrar usuario duplicado', async() =>{
    return await request(app.getHttpServer())
    .post('/usuarios/cadastrar')
    .send({
      nome: "Root",
      usuario: "root@root.com",
      senha: "rootroot",
      foto: "-"
    }).expect(400)
  })

it('03 - Deve autenticar o usuário (Login)', async () => {
  const resposta = await request(app.getHttpServer())
  .post('/usuarios/logar')
  .send({
    usuario: "root@root.com",
    senha: "rootroot",
  }).expect(200)
  
  token = resposta.body.token
})

it('04 - Deve listar todos os usuáios', async() => {
  return await request(app.getHttpServer())
  .get('/usuarios/all')
  .set('Authorization', `${token}`)
  .expect(200)
})

it('05 - Deve atualizar o usuáios', async() => {
  return await request(app.getHttpServer())
  .put('/usuarios/atualizar')
  .set('Authorization', `${token}`)
  .send({
    id: usuarioId,
    nome: 'Root atualizado',
    usuario: 'root@root.com',
    senha: 'rootroot',
    foto: 'fotobonita.png'
  })
  .expect(200)
  .then(resposta => {
    expect ('Root atualizado').toEqual(resposta.body.nome)
  })
})

it('06 - Deve retornar o usuário por ID', async() => {
  return await request(app.getHttpServer())
  .get(`/usuarios/${usuarioId}`)
  .set('Authorization', `${token}`)
  .expect(200)
  .then((resposta) => {
    expect(resposta.body).toHaveProperty('id', usuarioId)
    expect(resposta.body).toHaveProperty('nome', 'Root atualizado')
    expect(resposta.body).toHaveProperty('usuario', 'root@root.com')
    expect(resposta.body).toHaveProperty('foto', 'fotobonita.png') 
  });
})

});
