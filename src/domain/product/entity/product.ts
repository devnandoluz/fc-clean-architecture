import Entity from "../../@shared/entity/entity.abstract";
import Notification from "../../@shared/notification/notification";
import NotificationError from "../../@shared/notification/notification.error";
import ProductValidatorFactory from "../factory/product.validator.factory";
import ProductInterface from "./product.interface";

export default class Product extends Entity implements ProductInterface {
  private _name: string;
  private _price: number;

  constructor(id: string, name: string, price: number) {
    super();
    this._id = id;
    this._name = name;
    this._price = price;
    this.validate();
    this.throwIfInvalid();
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  changeName(name: string): void {
    this._name = name;
    this.validate();
    this.throwIfInvalid();
  }

  changePrice(price: number): void {
    this._price = price;
    this.validate();
    this.throwIfInvalid();
  }

  validate(): void {
    // Cada validacao parte de uma notificacao limpa, para que chamadas
    // sucessivas nao acumulem erros de estados ja corrigidos.
    this.notification = new Notification();
    ProductValidatorFactory.create().validate(this);
  }

  private throwIfInvalid(): void {
    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors());
    }
  }
}
