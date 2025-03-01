const ENDPOINT = "https://api.notion.com/v1/databases/DATABASE_ID/query";
const DATABASE_ID = "1a3cbe5d534d801886eede2d78bdd3b5";
const tarifa = {
  diurna: {
    kmRecorrido: 0.7,
    horaEspera: 19.38,
    minimoPercepcion: 3.78
  },
  nocturna: {
    kmRecorrido: 0.88,
    horaEspera: 28.83,
    minimoPercepcion: 5.63
  }
};

export { DATABASE_ID as D, ENDPOINT as E, tarifa as t };
