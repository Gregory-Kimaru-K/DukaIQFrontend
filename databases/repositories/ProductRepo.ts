import type Collection from "@nozbe/watermelondb/Collection";

import { Category } from "../models/products/Category";
import { Product } from "../models/products/Product";
import { Shop } from "../models/products/Shop";
import { Type as ProductType } from "../models/products/Type";
import { Vendor } from "../models/products/Vendors";
import { database } from "../watermelon/database";
import {
  CategoryRecord,
  ProductRecord,
  ShopRecord,
  TypeRecord,
  VendorRecord,
} from "../watermelon/models";

const now = () => new Date().toISOString();

const shopsCollection = () => database.get<ShopRecord>("shops");
const categoriesCollection = () => database.get<CategoryRecord>("categories");
const typesCollection = () => database.get<TypeRecord>("types");
const vendorsCollection = () => database.get<VendorRecord>("vendors");
const productsCollection = () => database.get<ProductRecord>("products");

const findRecord = async <T extends { id: string }>(
  collection: Collection<any>,
  id: string,
): Promise<T | undefined> => {
  try {
    return (await collection.find(id)) as T;
  } catch {
    return undefined;
  }
};

export const toShopDto = (shop: ShopRecord): Shop => ({
  id: shop.id,
  name: shop.name,
  created_at: shop.createdAt,
  updated_at: shop.updatedAt,
});

export const toCategoryDto = async (
  category: CategoryRecord,
): Promise<Category> => {
  const shop = await shopsCollection().find(category.shopId);

  return {
    id: category.id,
    name: category.name,
    shop: toShopDto(shop),
    created_at: category.createdAt,
    updated_at: category.updatedAt,
  };
};

export const toTypeDto = async (type: TypeRecord): Promise<ProductType> => {
  const category = await categoriesCollection().find(type.categoryId);

  return {
    id: type.id,
    name: type.name,
    category: await toCategoryDto(category),
    created_at: type.createdAt,
    updated_at: type.updatedAt,
  };
};

export const toVendorDto = (vendor: VendorRecord): Vendor => ({
  id: vendor.id,
  name: vendor.name,
  phone_number: vendor.phoneNumber,
});

export const toProductDto = async (
  product: ProductRecord,
): Promise<Product> => {
  const [shop, category, type] = await Promise.all([
    shopsCollection().find(product.shopId),
    categoriesCollection().find(product.categoryId),
    typesCollection().find(product.typeId),
  ]);

  return {
    id: product.id,
    barcode: product.barcode,
    name: product.name,
    shop: toShopDto(shop),
    category: await toCategoryDto(category),
    type: await toTypeDto(type),
    created_at: product.createdAt,
    updated_at: product.updatedAt,
    current_stock: product.currentStock,
    total_purchased: product.totalPurchased,
    total_sold: product.totalSold,
    batch_count: product.batchCount,
    unit: product.unit as Product["unit"],
  };
};

export const ProductRepo = {
  listShops: async (): Promise<Shop[]> => {
    const shops = await shopsCollection().query().fetch();
    return shops.map(toShopDto);
  },
  getShopById: async (id: string): Promise<Shop | undefined> => {
    const shop = await findRecord<ShopRecord>(shopsCollection(), id);
    return shop ? toShopDto(shop) : undefined;
  },
  createShop: async (
    shop: Omit<Shop, "id" | "created_at" | "updated_at">,
  ): Promise<Shop> =>
    database.write(async () => {
      const timestamp = now();
      const record = await shopsCollection().create((newShop) => {
        newShop.name = shop.name;
        newShop.createdAt = timestamp;
        newShop.updatedAt = timestamp;
      });
      return toShopDto(record);
    }),
  updateShop: async (
    id: string,
    updates: Partial<Omit<Shop, "id" | "created_at" | "updated_at">>,
  ): Promise<Shop | undefined> =>
    database.write(async () => {
      const shop = await findRecord<ShopRecord>(shopsCollection(), id);
      if (!shop) return undefined;
      await shop.update((record) => {
        if (updates.name !== undefined) record.name = updates.name;
        record.updatedAt = now();
      });
      return toShopDto(shop);
    }),
  deleteShop: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const shop = await findRecord<ShopRecord>(shopsCollection(), id);
      if (!shop) return false;
      await shop.destroyPermanently();
      return true;
    }),

  listCategories: async (): Promise<Category[]> => {
    const categories = await categoriesCollection().query().fetch();
    return Promise.all(categories.map(toCategoryDto));
  },
  getCategoryById: async (id: string): Promise<Category | undefined> => {
    const category = await findRecord<CategoryRecord>(categoriesCollection(), id);
    return category ? toCategoryDto(category) : undefined;
  },
  createCategory: async (
    category: Omit<Category, "id" | "created_at" | "updated_at">,
  ): Promise<Category> =>
    database.write(async () => {
      const timestamp = now();
      const record = await categoriesCollection().create((newCategory) => {
        newCategory.name = category.name;
        newCategory.shopId = category.shop.id;
        newCategory.createdAt = timestamp;
        newCategory.updatedAt = timestamp;
      });
      return toCategoryDto(record);
    }),
  updateCategory: async (
    id: string,
    updates: Partial<Omit<Category, "id" | "created_at" | "updated_at">>,
  ): Promise<Category | undefined> =>
    database.write(async () => {
      const category = await findRecord<CategoryRecord>(
        categoriesCollection(),
        id,
      );
      if (!category) return undefined;
      await category.update((record) => {
        if (updates.name !== undefined) record.name = updates.name;
        if (updates.shop !== undefined) record.shopId = updates.shop.id;
        record.updatedAt = now();
      });
      return toCategoryDto(category);
    }),
  deleteCategory: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const category = await findRecord<CategoryRecord>(
        categoriesCollection(),
        id,
      );
      if (!category) return false;
      await category.destroyPermanently();
      return true;
    }),

  listTypes: async (): Promise<ProductType[]> => {
    const types = await typesCollection().query().fetch();
    return Promise.all(types.map(toTypeDto));
  },
  getTypeById: async (id: string): Promise<ProductType | undefined> => {
    const type = await findRecord<TypeRecord>(typesCollection(), id);
    return type ? toTypeDto(type) : undefined;
  },
  createType: async (
    type: Omit<ProductType, "id" | "created_at" | "updated_at">,
  ): Promise<ProductType> =>
    database.write(async () => {
      const timestamp = now();
      const record = await typesCollection().create((newType) => {
        newType.name = type.name;
        newType.categoryId = type.category.id;
        newType.createdAt = timestamp;
        newType.updatedAt = timestamp;
      });
      return toTypeDto(record);
    }),
  updateType: async (
    id: string,
    updates: Partial<Omit<ProductType, "id" | "created_at" | "updated_at">>,
  ): Promise<ProductType | undefined> =>
    database.write(async () => {
      const type = await findRecord<TypeRecord>(typesCollection(), id);
      if (!type) return undefined;
      await type.update((record) => {
        if (updates.name !== undefined) record.name = updates.name;
        if (updates.category !== undefined) record.categoryId = updates.category.id;
        record.updatedAt = now();
      });
      return toTypeDto(type);
    }),
  deleteType: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const type = await findRecord<TypeRecord>(typesCollection(), id);
      if (!type) return false;
      await type.destroyPermanently();
      return true;
    }),

  listVendors: async (): Promise<Vendor[]> => {
    const vendors = await vendorsCollection().query().fetch();
    return vendors.map(toVendorDto);
  },
  getVendorById: async (id: string): Promise<Vendor | undefined> => {
    const vendor = await findRecord<VendorRecord>(vendorsCollection(), id);
    return vendor ? toVendorDto(vendor) : undefined;
  },
  createVendor: async (vendor: Omit<Vendor, "id">): Promise<Vendor> =>
    database.write(async () => {
      const record = await vendorsCollection().create((newVendor) => {
        newVendor.name = vendor.name;
        newVendor.phoneNumber = vendor.phone_number;
      });
      return toVendorDto(record);
    }),
  updateVendor: async (
    id: string,
    updates: Partial<Omit<Vendor, "id">>,
  ): Promise<Vendor | undefined> =>
    database.write(async () => {
      const vendor = await findRecord<VendorRecord>(vendorsCollection(), id);
      if (!vendor) return undefined;
      await vendor.update((record) => {
        if (updates.name !== undefined) record.name = updates.name;
        if (updates.phone_number !== undefined) {
          record.phoneNumber = updates.phone_number;
        }
      });
      return toVendorDto(vendor);
    }),
  deleteVendor: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const vendor = await findRecord<VendorRecord>(vendorsCollection(), id);
      if (!vendor) return false;
      await vendor.destroyPermanently();
      return true;
    }),

  listProducts: async (): Promise<Product[]> => {
    const products = await productsCollection().query().fetch();
    return Promise.all(products.map(toProductDto));
  },
  getProductById: async (id: string): Promise<Product | undefined> => {
    const product = await findRecord<ProductRecord>(productsCollection(), id);
    return product ? toProductDto(product) : undefined;
  },
  createProduct: async (product: Omit<Product, "id">): Promise<Product> =>
    database.write(async () => {
      const record = await productsCollection().create((newProduct) => {
        newProduct.name = product.name;
        newProduct.barcode = product.barcode;
        newProduct.shopId = product.shop.id;
        newProduct.categoryId = product.category.id;
        newProduct.typeId = product.type.id;
        newProduct.createdAt = product.created_at;
        newProduct.updatedAt = product.updated_at;
        newProduct.currentStock = product.current_stock;
        newProduct.totalPurchased = product.total_purchased;
        newProduct.totalSold = product.total_sold;
        newProduct.currentBatchId = product.current_batch?.id;
        newProduct.batchCount = product.batch_count;
        newProduct.unit = product.unit;
      });
      return toProductDto(record);
    }),
  updateProduct: async (
    id: string,
    updates: Partial<Omit<Product, "id">>,
  ): Promise<Product | undefined> =>
    database.write(async () => {
      const product = await findRecord<ProductRecord>(productsCollection(), id);
      if (!product) return undefined;
      await product.update((record) => {
        if (updates.name !== undefined) record.name = updates.name;
        if (updates.barcode !== undefined) record.barcode = updates.barcode;
        if (updates.shop !== undefined) record.shopId = updates.shop.id;
        if (updates.category !== undefined) record.categoryId = updates.category.id;
        if (updates.type !== undefined) record.typeId = updates.type.id;
        if (updates.current_stock !== undefined) {
          record.currentStock = updates.current_stock;
        }
        if (updates.total_purchased !== undefined) {
          record.totalPurchased = updates.total_purchased;
        }
        if (updates.total_sold !== undefined) record.totalSold = updates.total_sold;
        if (updates.current_batch !== undefined) {
          record.currentBatchId = updates.current_batch?.id;
        }
        if (updates.batch_count !== undefined) record.batchCount = updates.batch_count;
        if (updates.unit !== undefined) record.unit = updates.unit;
        record.updatedAt = updates.updated_at ?? now();
      });
      return toProductDto(product);
    }),
  deleteProduct: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const product = await findRecord<ProductRecord>(productsCollection(), id);
      if (!product) return false;
      await product.destroyPermanently();
      return true;
    }),
};
