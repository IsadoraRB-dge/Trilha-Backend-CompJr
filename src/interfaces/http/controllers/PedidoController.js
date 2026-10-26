const { StatusPedido } = require('../../../domain/constants');

class PedidoController {
  constructor({
    createAdoptionRequest,
    listAdoptionRequests,
    getAdoptionRequest,
    updateAdoptionRequest,
    decideAdoptionRequest,
    cancelAdoptionRequest,
  }) {
    this.createAdoptionRequest = createAdoptionRequest;
    this.listAdoptionRequests = listAdoptionRequests;
    this.getAdoptionRequest = getAdoptionRequest;
    this.updateAdoptionRequest = updateAdoptionRequest;
    this.decideAdoptionRequest = decideAdoptionRequest;
    this.cancelAdoptionRequest = cancelAdoptionRequest;
  }

  create = async (req, res) => {
    const pedido = await this.createAdoptionRequest.execute({
      animalId: req.validado.params.id,
      solicitante: req.usuario,
      motivo: req.body.motivo,
    });
    res.status(201).json(pedido);
  };

  listMine = async (req, res) => {
    const resultado = await this.listAdoptionRequests.execute({
      escopo: 'meus',
      solicitante: req.usuario,
      ...req.validado.query,
    });
    res.status(200).json(resultado);
  };

  listByAnimal = async (req, res) => {
    const resultado = await this.listAdoptionRequests.execute({
      escopo: 'animal',
      solicitante: req.usuario,
      animalId: req.validado.params.id,
      ...req.validado.query,
    });
    res.status(200).json(resultado);
  };

  listAll = async (req, res) => {
    const resultado = await this.listAdoptionRequests.execute({
      escopo: 'todos',
      solicitante: req.usuario,
      ...req.validado.query,
    });
    res.status(200).json(resultado);
  };

  get = async (req, res) => {
    const pedido = await this.getAdoptionRequest.execute({
      id: req.validado.params.id,
      solicitante: req.usuario,
    });
    res.status(200).json(pedido);
  };

  update = async (req, res) => {
    const pedido = await this.updateAdoptionRequest.execute({
      id: req.validado.params.id,
      solicitante: req.usuario,
      motivo: req.body.motivo,
    });
    res.status(200).json(pedido);
  };

  approve = async (req, res) => {
    const pedido = await this.decideAdoptionRequest.execute({
      id: req.validado.params.id,
      solicitante: req.usuario,
      decisao: StatusPedido.APROVADO,
    });
    res.status(200).json(pedido);
  };

  reject = async (req, res) => {
    const pedido = await this.decideAdoptionRequest.execute({
      id: req.validado.params.id,
      solicitante: req.usuario,
      decisao: StatusPedido.RECUSADO,
    });
    res.status(200).json(pedido);
  };

  cancel = async (req, res) => {
    const pedido = await this.cancelAdoptionRequest.execute({
      id: req.validado.params.id,
      solicitante: req.usuario,
    });
    res.status(200).json(pedido);
  };
}

module.exports = PedidoController;