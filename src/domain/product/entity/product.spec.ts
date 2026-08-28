import { NotificationErrorProps } from "../../@shared/notification/notification";
import NotificationError from "../../@shared/notification/notification.error";
import Product from "./product";

const captureNotificationErrors = (
  createProduct: () => void
): NotificationErrorProps[] => {
  try {
    createProduct();
  } catch (error) {
    return (error as NotificationError).errors;
  }
  return [];
};

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      new Product("", "Product 1", 100);
    }).toThrowError("product: Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      new Product("123", "", 100);
    }).toThrowError("product: Name is required");
  });

  it("should throw error when price is less than zero", () => {
    expect(() => {
      new Product("123", "Name", -1);
    }).toThrowError("product: Price must be greater than zero");
  });

  it("should notify both errors when name is empty and price is less than zero", () => {
    const errors = captureNotificationErrors(() => {
      new Product("123", "", -1);
    });

    expect(errors.length).toBe(2);
    expect(errors).toEqual([
      { context: "product", message: "Name is required" },
      { context: "product", message: "Price must be greater than zero" },
    ]);

    expect(() => {
      new Product("123", "", -1);
    }).toThrowError(
      "product: Name is required,product: Price must be greater than zero"
    );
  });

  it("should notify every error when id, name and price are invalid", () => {
    const errors = captureNotificationErrors(() => {
      new Product("", "", -1);
    });

    expect(errors.length).toBe(3);
    expect(errors).toEqual([
      { context: "product", message: "Id is required" },
      { context: "product", message: "Name is required" },
      { context: "product", message: "Price must be greater than zero" },
    ]);
  });

  it("should have an empty notification when the product is valid", () => {
    const product = new Product("123", "Product 1", 100);

    expect(product.notification.hasErrors()).toBe(false);
    expect(product.notification.getErrors()).toEqual([]);
    expect(product.notification.messages()).toBe("");
  });

  it("should notify an error when changing the name to an empty value", () => {
    const product = new Product("123", "Product 1", 100);

    const errors = captureNotificationErrors(() => {
      product.changeName("");
    });

    expect(errors).toEqual([
      { context: "product", message: "Name is required" },
    ]);
  });

  it("should notify an error when changing the price to a value less than zero", () => {
    const product = new Product("123", "Product 1", 100);

    const errors = captureNotificationErrors(() => {
      product.changePrice(-1);
    });

    expect(errors).toEqual([
      { context: "product", message: "Price must be greater than zero" },
    ]);
  });

  it("should not accumulate errors from previous validations", () => {
    const product = new Product("123", "Product 1", 100);

    expect(() => {
      product.changePrice(-1);
    }).toThrowError("product: Price must be greater than zero");

    const errors = captureNotificationErrors(() => {
      product.changePrice(-1);
    });

    expect(errors.length).toBe(1);
  });

  it("should change name", () => {
    const product = new Product("123", "Product 1", 100);
    product.changeName("Product 2");
    expect(product.name).toBe("Product 2");
    expect(product.notification.hasErrors()).toBe(false);
  });

  it("should change price", () => {
    const product = new Product("123", "Product 1", 100);
    product.changePrice(150);
    expect(product.price).toBe(150);
    expect(product.notification.hasErrors()).toBe(false);
  });
});
