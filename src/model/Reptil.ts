import { Animal } from "./Animal";
import { DatabaseModel } from "./DatabaseModel";
import { Habitat } from "./Habitat";

/**
 * Pool de conexão do banco de dados
 */
const database = new DatabaseModel().pool;

/**
 * Representa um réptil no zoológico, que é uma subclasse de Animal.
 */
export class Reptil extends Animal {
    /**
     * O tipo de escamas do réptil.
     */
    private tipo_escamas: string;

    /**
     * Cria uma nova instância de Reptil.
     * 
     * @param _nome O nome do réptil.
     * @param _idade A idade do réptil.
     * @param _genero O gênero do réptil.
     * @param _tipo_escamas O tipo de escamas do réptil.
     */
    constructor(_nome: string, 
                _idade: number, 
                _genero: string, 
                _tipo_escamas: string) {
        super(_nome, _idade, _genero);
        this.tipo_escamas = _tipo_escamas;
    }

    /**
     * Obtém o tipo de escamas do réptil.
     * 
     * @returns O tipo de escamas do réptil.
     */
    public getTipoEscamas(): string {
        return this.tipo_escamas;
    }

    /**
     * Define o tipo de escamas do réptil.
     * 
     * @param _tipo_escamas O tipo de escamas a ser atribuído ao réptil.
     */
    public setTipoEscamas(_tipo_escamas: string): void {
        this.tipo_escamas = _tipo_escamas;
    }

    /**
     * Retorna uma lista com todos os répteis cadastrados no banco de dados
     * 
     * @returns Lista com todos os répteis cadastrados no banco de dados
     */
    static async listarRepteis() {
        // Cria uma lista (array) vazia do tipo Réptil
        const listaDeRepteis: Array<Reptil> = [];
        
        // Construção da query para selecionar as informações de um Réptil
        const querySelectReptil = `SELECT Animal.idAnimal, Animal.nomeAnimal, Animal.idadeAnimal, Animal.generoAnimal, Reptil.tipodeescamas 
                                        FROM Animal 
                                        JOIN Reptil ON Animal.idAnimal = Reptil.idReptil;`;
        
        try {
            // Faz a consulta no banco de dados e retorna o resultado para a variável queryReturn
            const queryReturn = await database.query(querySelectReptil);
            // Percorre todas as linhas da queryReturn e acessa cada objeto individualmente
            queryReturn.rows.forEach(reptil => {
                // Coloca o objeto dentro da lista de répteis
                listaDeRepteis.push(reptil);
            });

            // retorna a lista de mamiferos para quem chamou a função
            return listaDeRepteis;
        } catch (error) {
            // Caso dê algum erro na query do banco, é lançado o erro para quem chamou a função
            console.log('Erro no modelo');
            console.log(error);
            return "error, verifique os logs do servidor";
        }
    }

    /**
     * Cadastra um objeto do tipo Reptil no banco de dados
     * 
     * @param reptil Objeto do tipo Reptil
     * @returns **true** caso sucesso, **false** caso erro
     */
    static async cadastrarReptil(reptil: Reptil, idHabitat: number): Promise<any> {
        // Cria uma variável do tipo booleano para guardar o status do resultado da query
        let insertResult = false;
        
        try {
            // Construção da query para inserir as informações de um Réptil. A query irá retornar o ID gerado para o animal pelo banco de dados
            const queryInsertAnimal = `INSERT INTO animal (nomeAnimal, idadeAnimal, generoAnimal) 
                                        VALUES 
                                        ('${reptil.getNomeAnimal().toUpperCase()}', ${reptil.getIdadeAnimal()}, '${reptil.getGeneroAnimal().toUpperCase()}')
                                        RETURNING idAnimal;`;

            // Faz a query de insert no banco de dados, passando para o banco as informações do objeto recebibo como parâmetro pela função
            await database.query(queryInsertAnimal)
            // Testa para ter certeza que foi possível inserir os dados no banco
            .then(async (result) => {
                // Verifica se o número de linhas adicionadas no banco foi diferente de zero
                // Caso positivo, insere no banco a informação sobre o tipo de escamas do animal
                if (result.rowCount != 0) {
                    // Armazena o ID do animal gerado na query anterior
                    const idAnimal = result.rows[0].idanimal;
                    // Preparando a query para inserir a raça do mamífero no banco de dados
                    const queryInsertReptil = `INSERT INTO reptil (idReptil, tipodeescamas)
                                                VALUES
                                                (${idAnimal}, '${reptil.getTipoEscamas().toUpperCase()}')`;
                                                
                    // Inserindo o animal no Habitat
                    Habitat.inserirAnimalHabitat(idAnimal, idHabitat);

                    // Faz a query de insert da raça do mamífero no banco de dados
                    await database.query(queryInsertReptil)

                        // Testa para ter certeza que foi possível inserir os dados no banco
                        .then((resultReptil) => {
                            if (resultReptil.rowCount != 0) {
                                // Se o número de linhas for diferente de zero, a operação deu certo e o valor VERDADEIRO é atribuido na variável
                                insertResult = true;
                            }
                        });
                }
            });
        // Retorna VERDADEIRO para quem chamou a função, indicando que a operação foi realizada com sucesso
        return insertResult;
        } catch(error) {
            // Caso a inserção no banco der algum erro, é restorno o valor FALSO para quem chamou a função
            return insertResult;
        }
    }
}
