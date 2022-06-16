export interface Periodo {
    id: number;
    nombre: string;
    dias: number;
}

export interface PeriodoReq {
    nombre: string;
    dias: number;
}

export interface Bono {
    Id: number;
    Nombre: string;
    Fecha: Date;
    Importancia: number;
    VN: number;
    VC: number;
    Anios: number;
    Periodo_Cupon_id: number;
    Plazo_Gracia: number;
    DXA: number;
    Tipo_Tasa: string;
    Periodo_Capitalizacion_id: number;
    P_Tasa_Interes: number;
    P_Tasa_Anual_Descuento: number;
    P_Impuesto: number;
    Emision: Date;
    P_Prima: number;
    P_Estructuracion: number;
    P_Colocacion: number;
    P_Flotacion: number;
    P_Cavali: number;
}

export interface BonoReq {
    Nombre: string;
    Importancia: number;
    VN: number;
    VC: number;
    Anios: number;
    Periodo_Cupon_id: number;
    Plazo_Gracia: number;
    DXA: number;
    Tipo_Tasa: string;
    Periodo_Capitalizacion_id: number;
    P_Tasa_Interes: number;
    P_Tasa_Anual_Descuento: number;
    P_Impuesto: number;
    Emision: Date;
    P_Prima: number;
    P_Estructuracion: number;
    P_Colocacion: number;
    P_Flotacion: number;
    P_Cavali: number;
}

export interface Inflacion {	
    id: number;
    Bono_id: number;
    Anio: number;
    Inflacion: number;
}

export interface InflacionReq {
    Anio: number;
    Inflacion: number;
}

export interface ObjetoTabla {
    Indice: number;
    Cupon_Interes: number;
    Flujo_Escudo: number;
    Flujo_Bonista: number;
    Flujo_Actual: number;
    FlujoXPlazo: number;
    Factor_Convexividad: number;
}