import { User } from 'src/user/entity/user.entity';

export const id = '3';

export const idMlDto = { idMl: 'ML123456' };

export const amount = 1;

export const purchaseDto = { amount };

export const productRelations = { images: true, favorites: true };

export const userRelations = { purchases: { product: { images: true, favorites: true }, user: true } };

export const userDto = { id: '1' } as User;
