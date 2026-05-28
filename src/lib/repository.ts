import auditsData from "@/data/audits.json";
import creditMatrixData from "@/data/credit-matrix.json";
import walletsData from "@/data/credit-wallets.json";
import inventoryData from "@/data/inventory-items.json";
import providersData from "@/data/providers.json";
import quotesData from "@/data/quotes.json";
import residencesData from "@/data/residences.json";
import roomsData from "@/data/rooms.json";
import requestsData from "@/data/service-requests.json";
import usersData from "@/data/users.json";
import type {
  Audit,
  CreditMatrixItem,
  CreditWallet,
  InventoryItem,
  Provider,
  Quote,
  Residence,
  Room,
  ServiceRequest,
  User
} from "./types";

export function getPocData() {
  const users = usersData as User[];
  const residences = residencesData as Residence[];
  const rooms = roomsData as Room[];
  const inventory = inventoryData as InventoryItem[];
  const requests = requestsData as ServiceRequest[];
  const providers = providersData as Provider[];
  const quotes = quotesData as Quote[];
  const wallets = walletsData as CreditWallet[];
  const creditMatrix = creditMatrixData as CreditMatrixItem[];
  const audits = auditsData as Audit[];

  return {
    users,
    residences,
    rooms,
    inventory,
    requests,
    providers,
    quotes,
    wallets,
    creditMatrix,
    audits
  };
}
