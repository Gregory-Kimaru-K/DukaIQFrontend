import { Categories, Products, Shops, Types, Vendors } from "../FakeDatabase";
import { Category } from "../models/products/Category";
import { Product } from "../models/products/Product";
import { Shop } from "../models/products/Shop";
import { Type } from "../models/products/Type";
import { Vendor } from "../models/products/Vendors";

const now = () => new Date().toISOString();
const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const ProductRepo = {
  listShops: () => Shops,
  getShopById: (id: string) => Shops.find((shop) => shop.id === id),
  createShop: (shop: Omit<Shop, "id" | "created_at" | "updated_at">): Shop => {
    const newShop: Shop = {
      id: generateId(),
      created_at: now(),
      updated_at: now(),
      ...shop,
    };
    Shops.push(newShop);
    return newShop;
  },
  updateShop: (
    id: string,
    updates: Partial<Omit<Shop, "id" | "created_at" | "updated_at">>,
  ): Shop | undefined => {
    const index = Shops.findIndex((shop) => shop.id === id);
    if (index === -1) return undefined;
    Shops[index] = {
      ...Shops[index],
      ...updates,
      updated_at: now(),
    };
    return Shops[index];
  },
  deleteShop: (id: string): boolean => {
    const index = Shops.findIndex((shop) => shop.id === id);
    if (index === -1) return false;
    Shops.splice(index, 1);
    return true;
  },

  listCategories: () => Categories,
  getCategoryById: (id: string) =>
    Categories.find((category) => category.id === id),
  createCategory: (
    category: Omit<Category, "id" | "created_at" | "updated_at">,
  ): Category => {
    const newCategory: Category = {
      id: generateId(),
      created_at: now(),
      updated_at: now(),
      ...category,
    };
    Categories.push(newCategory);
    return newCategory;
  },
  updateCategory: (
    id: string,
    updates: Partial<Omit<Category, "id" | "created_at" | "updated_at">>,
  ): Category | undefined => {
    const index = Categories.findIndex((category) => category.id === id);
    if (index === -1) return undefined;
    Categories[index] = {
      ...Categories[index],
      ...updates,
      updated_at: now(),
    };
    return Categories[index];
  },
  deleteCategory: (id: string): boolean => {
    const index = Categories.findIndex((category) => category.id === id);
    if (index === -1) return false;
    Categories.splice(index, 1);
    return true;
  },

  listTypes: () => Types,
  getTypeById: (id: string) => Types.find((type) => type.id === id),
  createType: (type: Omit<Type, "id" | "created_at" | "updated_at">): Type => {
    const newType: Type = {
      id: generateId(),
      created_at: now(),
      updated_at: now(),
      ...type,
    };
    Types.push(newType);
    return newType;
  },
  updateType: (
    id: string,
    updates: Partial<Omit<Type, "id" | "created_at" | "updated_at">>,
  ): Type | undefined => {
    const index = Types.findIndex((type) => type.id === id);
    if (index === -1) return undefined;
    Types[index] = {
      ...Types[index],
      ...updates,
      updated_at: now(),
    };
    return Types[index];
  },
  deleteType: (id: string): boolean => {
    const index = Types.findIndex((type) => type.id === id);
    if (index === -1) return false;
    Types.splice(index, 1);
    return true;
  },

  listVendors: () => Vendors,
  getVendorById: (id: string) => Vendors.find((vendor) => vendor.id === id),
  createVendor: (vendor: Omit<Vendor, "id">): Vendor => {
    const newVendor: Vendor = {
      id: generateId(),
      ...vendor,
    };
    Vendors.push(newVendor);
    return newVendor;
  },
  updateVendor: (
    id: string,
    updates: Partial<Omit<Vendor, "id">>,
  ): Vendor | undefined => {
    const index = Vendors.findIndex((vendor) => vendor.id === id);
    if (index === -1) return undefined;
    Vendors[index] = {
      ...Vendors[index],
      ...updates,
    };
    return Vendors[index];
  },
  deleteVendor: (id: string): boolean => {
    const index = Vendors.findIndex((vendor) => vendor.id === id);
    if (index === -1) return false;
    Vendors.splice(index, 1);
    return true;
  },

  listProducts: () => Products,
  getProductById: (id: string) => Products.find((product) => product.id === id),
  createProduct: (product: Omit<Product, "id">): Product => {
    const newProduct: Product = {
      id: generateId(),
      ...product,
    };
    Products.push(newProduct);
    return newProduct;
  },
  updateProduct: (
    id: string,
    updates: Partial<Omit<Product, "id">>,
  ): Product | undefined => {
    const index = Products.findIndex((product) => product.id === id);
    if (index === -1) return undefined;
    Products[index] = {
      ...Products[index],
      ...updates,
    };
    return Products[index];
  },
  deleteProduct: (id: string): boolean => {
    const index = Products.findIndex((product) => product.id === id);
    if (index === -1) return false;
    Products.splice(index, 1);
    return true;
  },
};
