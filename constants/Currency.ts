import { Currency } from "@/interfaces/Currency";

export const CHARACTER_LIMIT = 140;

export const currencyList:Currency[] = [
    {
      id: 'EUR',
      name: "Euro",
      image: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg",
      symbol: '€'
    },
    {
      id: 'USD',
      name: "Dolar Estadounidense",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg",
      symbol: '$'
    },
    {
      id: 'GBP',
      name: "Libra Esterlina",
      image: "https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg",
      symbol: '£'
    }
  ]