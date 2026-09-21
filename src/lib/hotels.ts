import type { Accommodation, HotelTemplate } from "@/workspace/types";

const ACCOMMODATIONS: Accommodation[] = ["Single", "Double", "Triple", "Quadruple"];

export const HOTELS: HotelTemplate[] = [
  {
    id: "ac-hotel",
    name: "AC Hotel",
    address: "Punta Pacífica, Ciudad de Panamá, Panamá",
    accent: "#707070",
    secondary: "#9a9a9a",
    tint: "#F4F4F4",
    roomTypes: ["King Bed", "Two Queen Beds", "Ocean View King", "AC Corner Suite"],
    accommodations: ACCOMMODATIONS,
    checkIn: "15:00",
    checkOut: "12:00",
    taxRate: 0.1,
    taxLabel: "ITBMS (10%)",
    es: {
      intro:
        "Agradecemos su interés por las facilidades y servicios que ofrece el AC Hotel Panamá City para el alojamiento en nuestros apartamentos.",
      descriptionTemplate:
        "Hospedaje con desayuno para {accommodation} en {roomType} del {arrival} al {departure} ({nights}).",
      includedServices: [
        "Internet inalámbrico en la habitación y en áreas públicas sin costo adicional",
        "Estacionamiento gratuito",
        "Centro de lavandería ubicado en el nivel E4",
        "Acceso a piscina y gimnasio ubicados en el Roof Top",
        "Persona adicional, a partir de 12 años en adelante, aplica un cargo de USD 20.00 + 10% por noche",
      ],
      hotelInfo:
        "Calle Ricardo Arias 14, Campo Alegre Área Bancaria, Ciudad de Panamá, Panamá",
      signature: "Departamento de Reservas\nAC Hotel\nreservas@achotelpanama.com",
    },
    en: {
      intro:
        "We appreciate your interest in the facilities and services offered by AC Hotel Panama City for accommodation in our apartments.",
      descriptionTemplate:
        "Accommodation with breakfast for {accommodation} in {roomType} from {arrival} to {departure} ({nights}).",
      includedServices: [
        "Complimentary wireless internet in guest rooms and public areas",
        "Free parking",
        "Laundry center located on level E4",
        "Pool and gym access located on the Roof Top",
        "Additional guest, age 12 and older, incurs a charge of USD 20.00 + 10% per night",
      ],
      hotelInfo:
        "Calle Ricardo Arias 14, Campo Alegre Área Bancaria, Panama City, Panama",
      signature: "Reservations Department\nAC Hotel\nreservations@achotelpanama.com",
    },
  },
  {
    id: "marriott-finisterre",
    name: "Marriott Executive Apartments Panamá City – Finisterre",
    shortName: "Marriott Executive Apartments",
    address: "Calle 51 Este, Bella Vista, Ciudad de Panamá, Panamá",
    accent: "#582C35",
    secondary: "#8f6b73",
    tint: "#F8F3F4",
    roomTypes: [
      "Studio Apartment",
      "One Bedroom Apartment",
      "Two Bedroom Apartment",
      "Executive Suite",
    ],
    accommodations: ACCOMMODATIONS,
    checkIn: "15:00",
    checkOut: "12:00",
    taxRate: 0.1,
    taxLabel: "ITBMS (10%)",
    es: {
      intro:
        "Agradecemos su interés por las facilidades y servicios que ofrece Marriott Executive Apartments Panamá City – Finisterre para el alojamiento en nuestros apartamentos.",
      descriptionTemplate:
        "Apartamento con desayuno para {accommodation} en {roomType} del {arrival} al {departure} ({nights}).",
      includedServices: [
        "Internet inalámbrico en la habitación y en áreas públicas sin costo adicional",
        "Cocina equipada",
        "Servicio de lavandería en cada piso",
        "Estacionamiento gratuito",
        "Acceso a piscina y gimnasio ubicados en el nivel AS",
        "Persona adicional, a partir de 12 años en adelante, aplica un cargo de USD 25.00 + 10% por noche",
        "Late check-out y early check-in sujetos a disponibilidad (previa confirmación)",
      ],
      hotelInfo:
        "Calle Colombia y Calle República del Paraguay, Ciudad de Panamá, Panamá",
      signature:
        "Ventas Corporativas\nMarriott Executive Apartments Finisterre\nventas@finisterre.com",
    },
    en: {
      intro:
        "We appreciate your interest in the facilities and services offered by Marriott Executive Apartments Panama City – Finisterre for accommodation in our apartments.",
      descriptionTemplate:
        "Apartment with breakfast for {accommodation} in {roomType} from {arrival} to {departure} ({nights}).",
      includedServices: [
        "Complimentary wireless internet in guest rooms and public areas",
        "Fully equipped kitchen",
        "Laundry service on every floor",
        "Free parking",
        "Pool and gym access located on level AS",
        "Additional guest, age 12 and older, incurs a charge of USD 25.00 + 10% per night",
        "Late check-out and early check-in subject to availability (prior confirmation required)",
      ],
      hotelInfo:
        "Calle Colombia y Calle República del Paraguay, Panama City, Panama",
      signature:
        "Corporate Sales\nMarriott Executive Apartments Finisterre\nsales@finisterre.com",
    },
  },
  {
    id: "residence-inn",
    name: "Residence Inn",
    address: "Av. Balboa, Ciudad de Panamá, Panamá",
    accent: "#4A4043",
    secondary: "#8D8D8D",
    tint: "#F6F5F5",
    roomTypes: ["Studio Suite", "One Bedroom Suite", "Two Bedroom Suite", "City View Suite"],
    accommodations: ACCOMMODATIONS,
    checkIn: "15:00",
    checkOut: "12:00",
    taxRate: 0.1,
    taxLabel: "ITBMS (10%)",
    es: {
      intro:
        "Agradecemos su interés por las facilidades y servicios que ofrece el Residence Inn Panamá City para el alojamiento en nuestros apartamentos.",
      descriptionTemplate:
        "Suite con desayuno para {accommodation} en {roomType} del {arrival} al {departure} ({nights}).",
      includedServices: [
        "Desayuno incluido de cortesía",
        "Internet inalámbrico en la habitación y en áreas públicas sin costo adicional",
        "Cocina equipada",
        "Autoservicio de lavandería en el nivel 15",
        "Estacionamiento gratuito",
        "Acceso a piscina y gimnasio ubicados en el nivel 15",
        "Persona adicional, a partir de 12 años en adelante, aplica un cargo de USD 25.00 + 10% por noche",
        "Las habitaciones cuentan con 1 sofá cama",
        "Opcional: por USD 20.00 + 10% se puede hacer upgrade de habitación Studio King a Ocean View King",
      ],
      hotelInfo:
        "Calle Ramón H. Jurado y Calle Tomás Gabriel Duque, Edificio Pacific Center, Ciudad de Panamá, Panamá",
      signature: "Reservas\nResidence Inn\nreservas@residenceinnpanama.com",
    },
    en: {
      intro:
        "We appreciate your interest in the facilities and services offered by Residence Inn Panama City for accommodation in our apartments.",
      descriptionTemplate:
        "Suite with breakfast for {accommodation} in {roomType} from {arrival} to {departure} ({nights}).",
      includedServices: [
        "Complimentary breakfast included",
        "Complimentary wireless internet in guest rooms and public areas",
        "Fully equipped kitchen",
        "Self-service laundry on the 15th floor",
        "Free parking",
        "Pool and gym access located on the 15th floor",
        "Additional guest, age 12 and older, incurs a charge of USD 25.00 + 10% per night",
        "Rooms include 1 sofa bed",
        "Optional: upgrade from a Studio King room to an Ocean View King for USD 20.00 + 10%",
      ],
      hotelInfo:
        "Calle Ramón H. Jurado y Calle Tomás Gabriel Duque, Pacific Center Building, Panama City, Panama",
      signature: "Reservations\nResidence Inn\nreservations@residenceinnpanama.com",
    },
  },
];

export const getBaseHotel = (id: string) => HOTELS.find((h) => h.id === id) ?? HOTELS[0]!;

/** Merge stored per-hotel customization over the bundled defaults. */
export function mergeHotel(
  id: string,
  overrides?: Partial<HotelTemplate>,
  logo?: string,
): HotelTemplate {
  const base = getBaseHotel(id);
  const merged: HotelTemplate = {
    ...base,
    ...(overrides ?? {}),
    es: { ...base.es, ...(overrides?.es ?? {}) },
    en: { ...base.en, ...(overrides?.en ?? {}) },
  };
  if (logo) merged.logoUrl = logo;
  return merged;
}

export const getHotel = getBaseHotel;
