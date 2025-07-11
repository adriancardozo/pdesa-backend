import { User } from 'src/user/entity/user.entity';

export const idMlDto = { idMl: 'ML123456' };

export const amount = 1;

export const purchaseDto = { amount };

export const productRelations = { images: true };

export const userRelations = { purchases: { product: { images: true } } };

export const userDto = { id: '1' } as User;
