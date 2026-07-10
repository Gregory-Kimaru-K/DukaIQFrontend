import { Batch } from "../stock/Batch";
import { Vendor } from "./Vendors";

export interface Credit {
    id:string;
    vendor:Vendor;
    batch:Batch[];
}