import express, { Request, Response } from "express";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import ProductPresenter from "../presenters/product.presenter";

export const productRoute = express.Router();

productRoute.get("/", async (req: Request, res: Response) => {
  const usecase = new ListProductUseCase(new ProductRepository());
  try {
    const output = await usecase.execute({});

    res.format({
      json: async () => res.send(output),
      xml: async () => res.send(ProductPresenter.listXML(output)),
    });
  } catch (err) {
    res.status(500).send(err);
  }
});
