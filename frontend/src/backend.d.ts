import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface NewProduct {
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: Category;
    brand: string;
    price: bigint;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: Category;
    brand: string;
    price: bigint;
}
export interface UpdateProduct {
    id: string;
    name: string;
    description: string;
    stock: bigint;
    imageUrl: string;
    category: Category;
    brand: string;
    price: bigint;
}
export enum Category {
    watches = "watches",
    electronics = "electronics"
}
export interface backendInterface {
    addProduct(id: string, productInfo: NewProduct): Promise<Product>;
    deleteProduct(id: string): Promise<Product>;
    getAllProducts(): Promise<Array<Product>>;
    getProductById(id: string): Promise<Product | null>;
    getProductsByCategory(category: Category): Promise<Array<Product>>;
    updateProduct(productInfo: UpdateProduct): Promise<Product>;
    /**
     * / ADMIN
     */
    verifyAdminPassword(password: string): Promise<boolean>;
}
