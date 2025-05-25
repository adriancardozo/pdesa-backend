export const mlProductJson = {
  id: 'ML329082894',
  name: 'Zapatillas',
  description: 'Super zapatillas',
  date_created: new Date('2025-04-24T03:46:03.986Z'),
  keywords: 'zapatillas deportes pies',
  attributes: [],
  pictures: [],
  status: 'active',
};

export const picturesJson = Array(20).fill(null);

export const imagesJson = Array(20)
  .fill(null)
  .map((_, index) => ({ id: index }));

export const mlInactiveProductJson = {
  ...mlProductJson,
  status: 'inactive',
};

export const productJson = {
  idMl: mlProductJson.id,
  name: mlProductJson.name,
  mlCreatedAt: mlProductJson.date_created,
  description: mlProductJson.description,
  keywords: mlProductJson.keywords,
  images: imagesJson,
};

export const errors = { inactiveProduct: 'Product not exists or is inactive.' };
