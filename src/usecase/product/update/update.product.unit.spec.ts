import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";

const product = new Product("123", "Product 1", 100);

const input = {
  id: product.id,
  name: "Product 1 Updated",
  price: 200,
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn(),
  };
};

describe("Unit test for product update use case", () => {
  it("should update a product", async () => {
    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    const output = await productUpdateUseCase.execute(input);

    expect(productRepository.update).toHaveBeenCalledTimes(1);
    expect(output).toEqual(input);
  });

  it("should thrown an error when product is not found", async () => {
    const productRepository = MockRepository();
    productRepository.find.mockImplementation(() => {
      throw new Error("Product not found");
    });
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    await expect(productUpdateUseCase.execute(input)).rejects.toThrow(
      "Product not found"
    );
    expect(productRepository.update).not.toHaveBeenCalled();
  });

  it("should thrown an error when name is missing", async () => {
    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    await expect(
      productUpdateUseCase.execute({ ...input, name: "" })
    ).rejects.toThrow("Name is required");
    expect(productRepository.update).not.toHaveBeenCalled();
  });
});
