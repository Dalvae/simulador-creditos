import { Banco } from "../utils/parsearBancos";

export const cache: {
  banksCache: Banco[] | null;
  ufCache: { ufValue: number; updatedAt: string } | null;
} = {
  banksCache: null,
  ufCache: null,
};
