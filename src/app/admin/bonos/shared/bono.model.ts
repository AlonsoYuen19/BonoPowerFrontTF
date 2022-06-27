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
    id: number;
    nombre: string;
    fecha: Date;
    importancia: number;
    vn: number;
    vc: number;
    anios: number;
    periodo_cupon_id: number;
    plazo_gracia: number;
    dxa: number;
    tipo_tasa: string;
    periodo_capitalizacion_id: number;
    p_tasa_interes: number;
    p_tasa_anual_descuento: number;
    p_impuesto: number;
    emision: Date;
    p_prima: number;
    p_estructuracion: number;
    p_colocacion: number;
    p_flotacion: number;
    p_cavali: number;
    tipo_moneda: string;
}

export interface BonoReq {
    nombre: string;
    importancia: number;
    vn: number;
    vc: number;
    anios: number;
    periodo_cupon_id: number;
    plazo_gracia: number;
    dxa: number;
    tipo_tasa: string;
    periodo_capitalizacion_id: number;
    p_tasa_interes: number;
    p_tasa_anual_descuento: number;
    p_impuesto: number;
    emision: Date;
    p_prima: number;
    p_estructuracion: number;
    p_colocacion: number;
    p_flotacion: number;
    p_cavali: number;
    tipo_moneda: string;
}

export interface Inflacion {	
    id: number;
    bono_id: number;
    anio: number;
    inflacion: number;
}

export interface InflacionReq {
    anio: number;
    inflacion: number;
}

export interface ObjetoTabla {
    Indice: number;
    Inflacion_Periodo: string,
    Bono: string,
    Bono_Indexado: string,
    Cupon_Interes: string;
    Flujo_Emisor: string;
    Flujo_Escudo: string;
    Flujo_Bonista: string;
    Flujo_Actual: string;
    FlujoXPlazo: string;
    Factor_Convexividad: string;
}