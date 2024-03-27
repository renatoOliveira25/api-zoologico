import express from "express";
import cors from "cors";
import { DatabaseModel } from "./model/DatabaseModel";
import { Reptil } from "./model/Reptil";
import { Mamifero } from "./model/Mamifero";
import { Ave } from "./model/Ave";

const server = express();
const port: number = 3000;

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.json("ola");
});

server.get('/list/reptil', async (req, res) => {
    const repteis = await Reptil.listarRepteis();

    res.status(200).json(repteis);
})

server.post('/new/reptil', async (req, res) => {
    const { nome, idade, genero, tipo_de_escamas } = req.body;

    const novoReptil = new Reptil(nome, idade, genero, tipo_de_escamas);

    const result = await Reptil.cadastrarReptil(novoReptil);

    if(result) {
        return res.status(200).json('Reptil cadastrado com sucesso');
    } else {
        return res.status(400).json('Não foi possível cadastrar o réptil no banco de dados');
    }
    
})

server.get('/list/mamifero', async (req, res) => {
    const mamifero = await Mamifero.listarMamiferos();

    res.status(200).json(mamifero);
})

server.post('/new/mamifero', async (req, res) => {
    const { nome, idade, genero, raca } = req.body;

    const novoMamifero = new Mamifero(raca, nome, idade, genero);

    const result = await Mamifero.cadastrarMamifero(novoMamifero);

    if(result) {
        return res.status(200).json('Mamifero cadastrado com sucesso');
    } else {
        return res.status(400).json('Não foi possível cadastrar o mamifero no banco de dados');
    }
})

server.get('/list/aves', async (req, res) => {
    const ave = await Ave.listarAves();

    res.status(200).json(ave);
})

server.post('/new/ave', async (req, res) => {
    const { nome, idade, genero, envergadura } = req.body;

    const novaAve = new Ave(nome, idade, genero, envergadura);

    const result = await Ave.cadastrarAve(novaAve);

    if(result) {
        return res.status(200).json('Ave cadastrado com sucesso');
    } else {
        return res.status(400).json('Não foi possível cadastrar o ave no banco de dados');
    }
})

new DatabaseModel().testeConexao().then((resbd) => {
    if(resbd) {
        server.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        })
    } else {
        console.log('Não foi possível conectar ao banco de dados');
    }
})