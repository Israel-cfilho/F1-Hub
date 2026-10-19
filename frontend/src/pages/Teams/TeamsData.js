import mercedesCar from "../../assets/cars/mercedes.png";
import ferrariCar from "../../assets/cars/ferrari.png";
import mclarenCar from "../../assets/cars/mclaren.png";
import redBullCar from "../../assets/cars/red-bull.png";
import racingBullsCar from "../../assets/cars/racingbulls.png";
import alpineCar from "../../assets/cars/alpine.png";
import haasCar from "../../assets/cars/haas.png";
import audiCar from "../../assets/cars/audi.png";
import williamsCar from "../../assets/cars/williams.png";
import astonMartinCar from "../../assets/cars/aston-martin.png";
import cadillacCar from "../../assets/cars/cadillac.png";

import mercedesLogo from "../../assets/teams/mercedes.png";
import ferrariLogo from "../../assets/teams/ferrari.png";
import mclarenLogo from "../../assets/teams/mclaren.png";
import redBullLogo from "../../assets/teams/red-bull.png";
import racingBullsLogo from "../../assets/teams/racingbulls.png";
import alpineLogo from "../../assets/teams/alpine.png";
import haasLogo from "../../assets/teams/haas.png";
import audiLogo from "../../assets/teams/audi.png";
import williamsLogo from "../../assets/teams/williams.png";
import astonMartinLogo from "../../assets/teams/aston-martin.png";
import cadillacLogo from "../../assets/teams/cadillac.png";

import albonPhoto from "../../assets/pilots/albon.png";
import alonsoPhoto from "../../assets/pilots/alonso.png";
import antonelliPhoto from "../../assets/pilots/antonelli.png";
import bearmanPhoto from "../../assets/pilots/bearman.png";
import bortoletoPhoto from "../../assets/pilots/bortoleto.png";
import bottasPhoto from "../../assets/pilots/bottas.png";
import colapintoPhoto from "../../assets/pilots/colapinto.png";
import gaslyPhoto from "../../assets/pilots/gasly.png";
import hadjarPhoto from "../../assets/pilots/hadjar.png";
import hamiltonPhoto from "../../assets/pilots/hamilton.png";
import hulkenbergPhoto from "../../assets/pilots/hulkenberg.png";
import lawsonPhoto from "../../assets/pilots/lawson.png";
import leclercPhoto from "../../assets/pilots/leclerc.png";
import lindbladPhoto from "../../assets/pilots/lindblad.png";
import norrisPhoto from "../../assets/pilots/norris.png";
import oconPhoto from "../../assets/pilots/ocon.png";
import perezPhoto from "../../assets/pilots/perez.png";
import piastriPhoto from "../../assets/pilots/piastri.png";
import russellPhoto from "../../assets/pilots/russell.png";
import sainzPhoto from "../../assets/pilots/sainz.png";
import strollPhoto from "../../assets/pilots/stroll.png";
import verstappenPhoto from "../../assets/pilots/verstappen.png";



export const TEAM_DATA = [
  {
    id: "mercedes",
    name: "Mercedes",
    logo: mercedesLogo,
    color: "#16D6B5",
    dark: "#006B5B",
    car: mercedesCar,
    drivers: ["George Russell", "Kimi Antonelli"],
  },
  {
    id: "ferrari",
    name: "Ferrari",
    logo: ferrariLogo,
    color: "#E8002D",
    dark: "#780019",
    car: ferrariCar,
    drivers: ["Charles Leclerc", "Lewis Hamilton"],
  },
  {
    id: "mclaren",
    name: "McLaren",
    logo: mclarenLogo,
    color: "#FF8700",
    dark: "#8C3A00",
    car: mclarenCar,
    drivers: ["Lando Norris", "Oscar Piastri"],
  },
  {
    id: "red-bull",
    name: "Red Bull Racing",
    logo: redBullLogo,
    color: "#3671C6",
    dark: "#10284F",
    car: redBullCar,
    drivers: ["Max Verstappen", "Isack Hadjar"],
  },
  {
    id: "racing-bulls",
    name: "Racing Bulls",
    logo: racingBullsLogo,
    color: "#3264F5",
    dark: "#082B91",
    car: racingBullsCar,
    drivers: ["Liam Lawson", "Arvid Lindblad"],
  },
  {
    id: "alpine",
    name: "Alpine",
    logo: alpineLogo,
    color: "#0093CC",
    dark: "#003D5B",
    car: alpineCar,
    drivers: ["Pierre Gasly", "Franco Colapinto"],
  },
  {
    id: "haas",
    name: "Haas F1 Team",
    logo: haasLogo,
    color: "#D9D9D9",
    dark: "#46494D",
    car: haasCar,
    drivers: ["Esteban Ocon", "Oliver Bearman"],
  },
  {
    id: "audi",
    name: "Audi",
    logo: audiLogo,
    color: "#E32219",
    dark: "#67120F",
    car: audiCar,
    drivers: ["Nico Hulkenberg", "Gabriel Bortoleto"],
  },
  {
    id: "williams",
    name: "Williams",
    logo: williamsLogo,
    color: "#3478F6",
    dark: "#102C66",
    car: williamsCar,
    drivers: ["Carlos Sainz", "Alexander Albon"],
  },
  {
    id: "aston-martin",
    name: "Aston Martin",
    logo: astonMartinLogo,
    color: "#16866A",
    dark: "#003E32",
    car: astonMartinCar,
    drivers: ["Fernando Alonso", "Lance Stroll"],
  },
  {
    id: "cadillac",
    name: "Cadillac",
    logo: cadillacLogo,
    color: "#A9ADB3",
    dark: "#34363B",
    car: cadillacCar,
    drivers: ["Sergio Perez", "Valtteri Bottas"],
  },
];

export const TEAM_STYLES = {
  red_bull: { color: "#3671C6", short: "RBR" },
  ferrari: { color: "#E8002D", short: "FER" },
  mclaren: { color: "#FF8000", short: "MCL" },
  mercedes: { color: "#27F4D2", short: "MER" },
  aston_martin: { color: "#229971", short: "AMR" },
  alpine: { color: "#FF87BC", short: "ALP" },
  williams: { color: "#64C4FF", short: "WIL" },
  rb: { color: "#6692FF", short: "RB" },
  racing_bulls: { color: "#6692FF", short: "RB" },
  haas: { color: "#B6BABD", short: "HAA" },
  audi: { color: "#D71920", short: "AUD" },
  cadillac: { color: "#D9D9D9", short: "CAD" },
};

export const DEFAULT_STYLE = {
  color: "#E10600",
  short: "F1",
};

export const TEAM_ALIASES = {
  redbullracing: "red_bull",
  redbull: "red_bull",
  astonmartin: "aston_martin",
  astonmartinaramco: "aston_martin",
  racingbulls: "racing_bulls",
  rb: "rb",
  mercedesamgf1: "mercedes",
  scuderiaferrari: "ferrari",
  mclarenf1team: "mclaren",
  williamsracing: "williams",
  haasf1team: "haas",
  kicksauber: "sauber",
};


export const DRIVER_DETAILS = {
  "Alexander Albon": {
    number: 23,
    country: "Thailand",
    flag: "🇹🇭",
    photo: albonPhoto,
  },

  "Fernando Alonso": {
    number: 14,
    country: "Spain",
    flag: "🇪🇸",
    photo: alonsoPhoto,
  },

  "Kimi Antonelli": {
    number: 12,
    country: "Italy",
    flag: "🇮🇹",
    photo: antonelliPhoto,
  },

  "Oliver Bearman": {
    number: 87,
    country: "United Kingdom",
    flag: "🇬🇧",
    photo: bearmanPhoto,
  },

  "Gabriel Bortoleto": {
    number: 5,
    country: "Brazil",
    flag: "🇧🇷",
    photo: bortoletoPhoto,
  },

  "Valtteri Bottas": {
    number: 77,
    country: "Finland",
    flag: "🇫🇮",
    photo: bottasPhoto,
  },

  "Franco Colapinto": {
    number: 43,
    country: "Argentina",
    flag: "🇦🇷",
    photo: colapintoPhoto,
  },

  "Pierre Gasly": {
    number: 10,
    country: "France",
    flag: "🇫🇷",
    photo: gaslyPhoto,
  },

  "Isack Hadjar": {
    number: 6,
    country: "France",
    flag: "🇫🇷",
    photo: hadjarPhoto,
  },

  "Lewis Hamilton": {
    number: 44,
    country: "United Kingdom",
    flag: "🇬🇧",
    photo: hamiltonPhoto,
  },

  "Nico Hulkenberg": {
    number: 27,
    country: "Germany",
    flag: "🇩🇪",
    photo: hulkenbergPhoto,
  },

  "Liam Lawson": {
    number: 30,
    country: "New Zealand",
    flag: "🇳🇿",
    photo: lawsonPhoto,
  },

  "Charles Leclerc": {
    number: 16,
    country: "Monaco",
    flag: "🇲🇨",
    photo: leclercPhoto,
  },

  "Arvid Lindblad": {
    number: 41,
    country: "United Kingdom",
    flag: "🇬🇧",
    photo: lindbladPhoto,
  },

  "Lando Norris": {
    number: 1,
    country: "United Kingdom",
    flag: "🇬🇧",
    photo: norrisPhoto,
  },

  "Esteban Ocon": {
    number: 31,
    country: "France",
    flag: "🇫🇷",
    photo: oconPhoto,
  },

  "Sergio Perez": {
    number: 11,
    country: "Mexico",
    flag: "🇲🇽",
    photo: perezPhoto,
  },

  "Oscar Piastri": {
    number: 81,
    country: "Australia",
    flag: "🇦🇺",
    photo: piastriPhoto,
  },

  "George Russell": {
    number: 63,
    country: "United Kingdom",
    flag: "🇬🇧",
    photo: russellPhoto,
  },

  "Carlos Sainz": {
    number: 55,
    country: "Spain",
    flag: "🇪🇸",
    photo: sainzPhoto,
  },

  "Lance Stroll": {
    number: 18,
    country: "Canada",
    flag: "🇨🇦",
    photo: strollPhoto,
  },

  "Max Verstappen": {
    number: 3,
    country: "Netherlands",
    flag: "🇳🇱",
    photo: verstappenPhoto,
  },
};