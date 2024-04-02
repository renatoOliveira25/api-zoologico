import { Animal } from "./Animal";
import { DatabaseModel } from "./DatabaseModel";
import { Habitat } from "./Habitat";

/**
 * Pool de conexão do banco de dados
 */
const database = new DatabaseModel().pool;

/**
 * Representa um mamífero no zoológico, uma subclasse de Animal.
 */
export class Mamifero extends Animal {

    /**
     * A raça do mamífero.
     */
    private raca: string;

    /**
     * Cria uma nova instância de Mamifero.
     * 
     * @param _raca A raça do mamífero.
     * @param _nome O nome do mamífero.
     * @param _idade A idade do mamífero.
     * @param _genero O gênero do mamífero.
     */
    constructor(_raca: string,
        _nome: string,
        _idade: number,
        _genero: string) {
        // Chamada ao construtor da classe pai (Animal) para definir nome, idade e gênero
        super(_nome, _idade, _genero);
        this.raca = _raca;
    }

    /**
     * Obtém a raça do mamífero.
     * 
     * @returns A raça do mamífero.
     */
    public getRaca(): string {
        return this.raca;
    }

    /**
     * Define a raça do mamífero.
     * 
     * @param raca A raça a ser atribuída ao mamífero.
     */
    public setRaca(raca: string): void {
        this.raca = raca;
    }

    /**
     * Retorna uma lista com todos os mamíferos cadastrados no banco de dados
     * 
     * @returns Lista com todos os mamíferos cadastrados no banco de dados
     */
    static async listarMamiferos() {
        // Cria uma lista (array) vazia do tipo Mamifero
        const listaDeMamiferos: Array<Mamifero> = [];

        // Construção da query para selecionar as informações de um Mamifero
        const querySelectMamifero = `SELECT Animal.idAnimal, Animal.nomeAnimal, Animal.idadeAnimal, Animal.generoAnimal, Mamifero.especie 
                                        FROM Animal 
                                        JOIN Mamifero ON Animal.idAnimal = Mamifero.idMamifero;`;

        try {
            // Faz a consulta no banco de dados e retorna o resultado para a variável queryReturn
            const queryReturn = await database.query(querySelectMamifero);
            // Percorre todas as linhas da queryReturn e acessa cada objeto individualmente
            queryReturn.rows.forEach(mamifero => {
                // Coloca o objeto dentro da lista de mamiferos
                listaDeMamiferos.push(mamifero);
            });

            // retorna a lista de mamiferos para quem chamou a função
            return listaDeMamiferos;
        } catch (error) {
            // Caso dê algum erro na query do banco, é lançado o erro para quem chamou a função
            console.log('Erro no modelo');
            console.log(error);
            return "error, verifique os logs do servidor";
        }
    }

    /**
     * Cadastra um objeto do tipo Mamifero no banco de dados
     * 
     * @param mamifero Objeto do tipo Mamifero
     * @returns **true** caso sucesso, **false** caso erro
     */
    static async cadastrarMamifero(mamifero: Mamifero, idHabitat: number): Promise<any> {
        // Cria uma variável do tipo booleano para guardar o status do resultado da query
        let insertResult = false;
        try {
            // Construção da query para inserir as informações de um Mamifero. A query irá retornar o ID gerado para o animal pelo banco de dados
            const queryInsertAnimal = `INSERT INTO animal (nomeAnimal, idadeAnimal, generoAnimal) 
                                        VALUES 
                                        ('${mamifero.getNomeAnimal().toUpperCase()}', ${mamifero.getIdadeAnimal()}, '${mamifero.getGeneroAnimal().toUpperCase()}')
                                        RETURNING idAnimal;`;

            // Faz a query de insert no banco de dados, passando para o banco as informações do objeto recebibo como parâmetro pela função
            await database.query(queryInsertAnimal)
                // Testa para ter certeza que foi possível inserir os dados no banco
                .then(async (result) => {
                    // Verifica se o número de linhas adicionadas no banco foi diferente de zero
                    // Caso positivo, insere no banco a informação sobre a raça do animal
                    if (result.rowCount != 0) {
                        // Armazena o ID do animal gerado na query anterior
                        const idAnimal = result.rows[0].idanimal;
                        // Preparando a query para inserir a raça do mamífero no banco de dados
                        const queryInsertMamifero = `INSERT INTO mamifero (idMamifero, especie)
                                                VALUES
                                                (${idAnimal}, '${mamifero.getRaca().toUpperCase()}')`;

                        // Inserindo o animal no Habitat
                        Habitat.inserirAnimalHabitat(idAnimal, idHabitat);

                        // Faz a query de insert da raça do mamífero no banco de dados
                        await database.query(queryInsertMamifero)

                            // Testa para ter certeza que foi possível inserir os dados no banco
                            .then((resultMamifero) => {
                                if (resultMamifero.rowCount != 0) {
                                    // Se o número de linhas for diferente de zero, a operação deu certo e o valor VERDADEIRO é atribuido na variável
                                    insertResult = true;
                                }
                            });
                    }
                });
            // Retorna VERDADEIRO para quem chamou a função, indicando que a operação foi realizada com sucesso
            return insertResult;
        } catch (error) {
            // Imprime o erro no console
            console.log(error);

            // Caso a inserção no banco der algum erro, é restorno o valor FALSO para quem chamou a função
            return insertResult;
        }
    }
}
