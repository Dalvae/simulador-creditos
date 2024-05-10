import { Banco } from "../utils/parsearBancos";

export const cache: {
  banksCache: Banco[] | null;
  ufCache: { value: number; updatedAt: string } | null;
} = {
  banksCache: null,
  ufCache: null,
};
