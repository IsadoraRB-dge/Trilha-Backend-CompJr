class AnimalController {
  constructor({ createAnimal, listAnimals, getAnimal, updateAnimal, deleteAnimal }) {
    this.createAnimal = createAnimal;
    this.listAnimals = listAnimals;
    this.getAnimal = getAnimal;
    this.updateAnimal = updateAnimal;
    this.deleteAnimal = deleteAnimal;
  }

  create = async (req, res) => {
    const animal = await this.createAnimal.execute({ solicitante: req.usuario, dados: req.body });
    res.status(201).json(animal);
  };

  list = async (req, res) => {
    const resultado = await this.listAnimals.execute(req.validado.query);
    res.status(200).json(resultado);
  };

  get = async (req, res) => {
    const animal = await this.getAnimal.execute(req.validado.params.id);
    res.status(200).json(animal);
  };

  update = async (req, res) => {
    const animal = await this.updateAnimal.execute({
      id: req.validado.params.id,
      solicitante: req.usuario,
      dados: req.body,
    });
    res.status(200).json(animal);
  };

  remove = async (req, res) => {
    await this.deleteAnimal.execute({ id: req.validado.params.id, solicitante: req.usuario });
    res.status(204).send();
  };
}

module.exports = AnimalController;