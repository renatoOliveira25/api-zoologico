import express from "express";
import cors from "cors";
import { DatabaseModel } from "./model/DatabaseModel";
import { Reptil } from "./model/Reptil";
import { Mamifero } from "./model/Mamifero";
import { Ave } from "./model/Ave";
import { Animal } from "./model/Animal";
import { Habitat } from "./model/Habitat";

const server = express();
const port: number = 3000;

server.use(express.json());
server.use(cors());

// Rota principal, usada para testar o servidor
// NÃO COLOCAR EM PRODUÇÃO
server.get('/', (req, res) => {
    res.json("ola");
});

// Rota para listar todos os repteis
server.get('/list/reptil', async (req, res) => {
    const repteis = await Reptil.listarRepteis();

    res.status(200).json(repteis);
})

// Rota para cadastrar um reptil
server.post('/new/reptil', async (req, res) => {
    const { nome, idade, genero, tipo_de_escamas, idHabitat } = req.body;

    const novoReptil = new Reptil(nome, idade, genero, tipo_de_escamas);

    const result = await Reptil.cadastrarReptil(novoReptil, idHabitat);

    if(result) {
        return res.status(200).json('Reptil cadastrado com sucesso');
    } else {
        return res.status(400).json('Não foi possível cadastrar o réptil no banco de dados');
    }
    
})

// Rota para listar todos os mamiferos
server.get('/list/mamifero', async (req, res) => {
    const mamifero = await Mamifero.listarMamiferos();

    res.status(200).json(mamifero);
})

// Rota para cadastrar um mamífero
server.post('/new/mamifero', async (req, res) => {
    const { nome, idade, genero, raca, idHabitat } = req.body;

    const novoMamifero = new Mamifero(raca, nome, idade, genero);

    const result = await Mamifero.cadastrarMamifero(novoMamifero, idHabitat);

    if(result) {
        return res.status(200).json('Mamifero cadastrado com sucesso');
    } else {
        return res.status(400).json('Não foi possível cadastrar o mamifero no banco de dados');
    }
})

// Rota para listar todos as aves
server.get('/list/aves', async (req, res) => {
    const ave = await Ave.listarAves();

    res.status(200).json(ave);
})

// Rota para cadastrar todas as aves
server.post('/new/ave', async (req, res) => {
    const { nome, idade, genero, envergadura, idHabitat } = req.body;
    
    const novaAve = new Ave(nome, idade, genero, envergadura);

    const result = await Ave.cadastrarAve(novaAve, idHabitat);

    if(result) {
        return res.status(200).json('Ave cadastrado com sucesso');
    } else {
        return res.status(400).json('Não foi possível cadastrar o ave no banco de dados');
    }
})

// Rota para listar todos os animais
server.get('/list/todos', async (req, res) => {
    const  todosAnimais = await Animal.listarTodosAnimais();

    res.status(200).json(todosAnimais.rows);
})

server.get('/list/habitats', async(req, res) => {
    const listaHabitats = await Habitat.listarHabitats();

    res.status(200).json(listaHabitats);
})

server.get('/list/animalhabitat/:idHabitat', async (req, res) => {
    const listaAnimaisHabitat = await Habitat.exibirAnimaisPorHabitat(parseInt(req.params.idHabitat));
    
    res.status(200).json(listaAnimaisHabitat);
});

new DatabaseModel().testeConexao().then((resbd) => {
    if(resbd) {
        server.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        })
    } else {
        console.log('Não foi possível conectar ao banco de dados');
    }
})