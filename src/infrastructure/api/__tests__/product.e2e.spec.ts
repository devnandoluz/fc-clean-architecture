import request from "supertest";
import Product from "../../../domain/product/entity/product";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import { app, sequelize } from "../express";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should list all products", async () => {
    const productRepository = new ProductRepository();
    await productRepository.create(new Product("123", "Product 1", 100));
    await productRepository.create(new Product("456", "Product 2", 200));

    const response = await request(app).get("/product").send();

    expect(response.status).toBe(200);
    expect(response.body.products.length).toBe(2);

    const product = response.body.products[0];
    expect(product.id).toBe("123");
    expect(product.name).toBe("Product 1");
    expect(product.price).toBe(100);

    const product2 = response.body.products[1];
    expect(product2.id).toBe("456");
    expect(product2.name).toBe("Product 2");
    expect(product2.price).toBe(200);
  });

  it("should return an empty list when there is no product", async () => {
    const response = await request(app).get("/product").send();

    expect(response.status).toBe(200);
    expect(response.body.products).toEqual([]);
  });

  it("should list all products in XML format", async () => {
    const productRepository = new ProductRepository();
    await productRepository.create(new Product("123", "Product 1", 100));
    await productRepository.create(new Product("456", "Product 2", 200));

    const response = await request(app)
      .get("/product")
      .set("Accept", "application/xml")
      .send();

    expect(response.status).toBe(200);
    expect(response.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(response.text).toContain(`<products>`);
    expect(response.text).toContain(`<product>`);
    expect(response.text).toContain(`<id>123</id>`);
    expect(response.text).toContain(`<name>Product 1</name>`);
    expect(response.text).toContain(`<price>100</price>`);
    expect(response.text).toContain(`</product>`);
    expect(response.text).toContain(`<id>456</id>`);
    expect(response.text).toContain(`<name>Product 2</name>`);
    expect(response.text).toContain(`<price>200</price>`);
    expect(response.text).toContain(`</products>`);
  });
});
