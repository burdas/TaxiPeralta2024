// Configuración y tipos de Notion
namespace Notion {
    export const API_VERSION = "2022-06-28";
    export const BASE_ENDPOINT = "https://api.notion.com/v1/databases";
    
    export enum PropertyType {
      SELECT = "select",
      TITLE = "title",
      NUMBER = "number"
    }
  
    interface Select {
      name: string;
    }
  
    interface Title {
      text: { content: string };
    }
  
    interface Number {
      number: number;
    }
  
    export interface Property<T> {
      [key: string]: T;
    }
  
    export interface Properties {
      Tipo: Property<Select>;
      Nombre: Property<Title[]>;
      "Precio (€)": Number;
    }
  
    export interface Result {
      properties: Properties;
    }
  
    export interface ApiResponse {
      results: Result[];
    }
  }
  
  // Dominio de la aplicación
  namespace Tarifa {
    export enum Tipo {
      DIURNA = "Diurna",
      NOCTURNA = "Nocturna"
    }
  
    export enum Metricas {
      KM_RECORRIDO = "Km Recorrido",
      HORA_ESPERA = "Hora de espera",
      MINIMO_PERCEPCION = "Mínimo de percepción"
    }
  
    export interface Detalles {
      kmRecorrido: number;
      horaEspera: number;
      minimoPercepcion: number;
    }
  
    export interface Tarifa {
      diurna: Detalles;
      nocturna: Detalles;
    }
  
    export interface RawData {
      tipo: string;
      nombre: string;
      precio: number;
    }
  }
  
  // Configuración de la API
  const CONFIG = {
    DATABASE_ID: "1a3cbe5d534d801886eede2d78bdd3b5",
    get ENDPOINT() {
      return `${Notion.BASE_ENDPOINT}/${this.DATABASE_ID}/query`;
    },
    FILTER: {
      property: "Precio (€)",
      number: { is_not_empty: true }
    }
  };
  
  // Helpers
  const createResponse = (data: unknown, status = 200) => 
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  
  const getAuthHeaders = (apiKey: string) => ({
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Notion-Version": Notion.API_VERSION
  });
  
  // Servicio de Notion
  async function fetchNotionData() {
    try {
      const response = await fetch(CONFIG.ENDPOINT, {
        method: "POST",
        headers: getAuthHeaders(import.meta.env.NOTION_API),
        body: JSON.stringify({ filter: CONFIG.FILTER })
      });
  
      if (!response.ok) throw new Error("Error fetching data from Notion");
      
      return await response.json() as Notion.ApiResponse;
    } catch (error) {
      console.error("Notion API Error:", error);
      throw error;
    }
  }
  
  // Transformación de datos
  const mapMetricToProperty: Record<Tarifa.Metricas, keyof Tarifa.Detalles> = {
    [Tarifa.Metricas.KM_RECORRIDO]: "kmRecorrido",
    [Tarifa.Metricas.HORA_ESPERA]: "horaEspera",
    [Tarifa.Metricas.MINIMO_PERCEPCION]: "minimoPercepcion"
  };
  
  function transformTarifaData(rawData: Tarifa.RawData[]): Tarifa.Tarifa {
    const initialDetails: Tarifa.Detalles = { 
      kmRecorrido: 0, 
      horaEspera: 0, 
      minimoPercepcion: 0 
    };
  
    return rawData.reduce((acc, { tipo, nombre, precio }) => {
      const targetType = tipo === Tarifa.Tipo.DIURNA ? "diurna" : "nocturna";
      const metricKey = mapMetricToProperty[nombre as Tarifa.Metricas];
      
      if (metricKey) {
        acc[targetType][metricKey] = precio;
      }
      
      return acc;
    }, {
      diurna: { ...initialDetails },
      nocturna: { ...initialDetails }
    });
  }
  
  // Controlador principal
  export async function GET() {
    try {
      const notionData = await fetchNotionData();
      
      const rawTarifas: Tarifa.RawData[] = notionData.results.map(result => ({
        tipo: result.properties.Tipo[Notion.PropertyType.SELECT]?.name,
        nombre: result.properties.Nombre[Notion.PropertyType.TITLE]?.[0]?.text.content,
        precio: result.properties["Precio (€)"][Notion.PropertyType.NUMBER]
      }));
  
      const transformedData = transformTarifaData(rawTarifas);
      return createResponse(transformedData);
    } catch (error) {
      return createResponse({ error: "Internal Server Error" }, 500);
    }
  }