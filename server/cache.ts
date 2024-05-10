import { Banco } from "../utils/parsearBancos";

export const cache: {
  banksCache: Banco[] | null;
  ufCache: { ufValue: number; updatedAt: string } | null;
} = {
  banksCache: [
    {
      nombre: "SCOTIABANK",
      imagen:
        "https://d7nxjt1whovz0.cloudfront.net/marketplace/logos/divisions/scotiabank.png",
    },
    {
      nombre: "BANCO SANTANDER",
      imagen:
        "https://d7nxjt1whovz0.cloudfront.net/marketplace/logos/divisions/banco-santander.png",
    },
    {
      nombre: "BANCO ESTADO",
      imagen:
        "https://d7nxjt1whovz0.cloudfront.net/marketplace/logos/divisions/banco-estado.png",
    },
    {
      nombre: "BANCO FALABELLA",
      imagen:
        "https://d7nxjt1whovz0.cloudfront.net/marketplace/logos/divisions/banco-falabella.png",
    },
    {
      nombre: "BICE HIPOTECARIA",
      imagen:
        "https://d7nxjt1whovz0.cloudfront.net/marketplace/logos/divisions/banco-bice-hipotecaria.png",
    },
    {
      nombre: "BANCO EDWARDS CITI",
      imagen: undefined,
    },
    {
      nombre: "BANCO BCI",
      imagen:
        "https://s3.amazonaws.com/marketplace.comparaonline.com/marketplace//bci.png",
    },
    {
      nombre: "BANCO DE CHILE",
      imagen:
        "https://d7nxjt1whovz0.cloudfront.net/marketplace/logos/divisions/banco-de-chile.png",
    },
    {
      nombre: "BANCO SECURITY",
      imagen:
        "https://d7nxjt1whovz0.cloudfront.net/marketplace/logos/divisions/banco-security.png",
    },
    {
      nombre: "BANCO CONSORCIO",
      imagen:
        "https://s3.amazonaws.com/marketplace.comparaonline.com/marketplace/logos/divisions/Consorcio.png",
    },
  ],
  ufCache: {
    ufValue: 37312.63,
    updatedAt: new Date().toISOString(),
  },
};
