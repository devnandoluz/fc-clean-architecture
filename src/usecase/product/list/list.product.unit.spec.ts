import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";

const product1 = new Product("123", "Product 1", 100);
const product2 = new Product("456", "Product 2", 200);

const MockRepository = () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
  };
};

describe("Unit test for listing product use case", () => {
  it("should list the products", async () => {
    const productRepository = MockRepository();
    const usecase = new ListProductUseCase(productRepository);

    const output = await usecase.execute({});

    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe(product1.id);
    expect(output.products[0].name).toBe(product1.name);
    expect(output.products[0].price).toBe(product1.price);
    expect(output.products[1].id).toBe(product2.id);
    expect(output.products[1].name).toBe(product2.name);
    expect(output.products[1].price).toBe(product2.price);
  });

  it("should return an empty list when there is no product", async () => {
    const productRepository = MockRepository();
    productRepository.findAll.mockReturnValue(Promise.resolve([]));
    const usecase = new ListProductUseCase(productRepository);

    const output = await usecase.execute({});

    expect(output.products).toEqual([]);
  });
});
