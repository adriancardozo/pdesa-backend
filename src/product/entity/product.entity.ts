export class Product {
  id: string;
  idMl: string;
  name: string;
  mlCreatedAt: Date;
  description: string;
  keywords: string;

  constructor(idMl: string, name: string, mlCreatedAt: Date, description: string, keywords: string) {
    this.idMl = idMl;
    this.name = name;
    this.mlCreatedAt = mlCreatedAt;
    this.description = description;
    this.keywords = keywords;
  }
}
