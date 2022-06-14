export interface Periodo {
    id: number;
    nombre: string;
    dias: number;
}

export interface Bono {
    id: number;
    nombre: string;
    fecha: Date;
    importancia: number;
    VN: number;
    VC: number;
    Anios: number;
    Periodo_Cupon: Periodo;
    Plazo_Gracia: number;
    DXA: number;
    Tipo_Tasa: string;
    Periodo_Capitalizacion: Periodo;
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
    nombre: string;
    fecha: Date;
    importancia: number;
    VN: number;
    VC: number;
    Anios: number;
    Periodo_Cupon: Periodo;
    Plazo_Gracia: number;
    DXA: number;
    Tipo_Tasa: string;
    Periodo_Capitalizacion: Periodo;
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
