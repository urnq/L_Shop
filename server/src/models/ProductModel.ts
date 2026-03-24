import fs from 'fs/promises';
import path from 'path';
import { Product, QueryParams } from '../types';

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

export class ProductModel {
    private static async readProducts(): Promise<Product[]> {
        try {
            const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    static async findAll(params?: QueryParams): Promise<Product[]> {
        let products = await this.readProducts();

        if (!params) return products;

        if (params.search) {
            const searchLower = params.search.toLowerCase();
            products = products.filter(p => 
                p.title.toLowerCase().includes(searchLower) || 
                p.description.toLowerCase().includes(searchLower)
            );
        }

        if (params.category) {
            products = products.filter(p => p.category === params.category);
        }

        if (params.platform) {
            products = products.filter(p => p.platform === params.platform);
        }

        if (params.minPrice !== undefined) {
            products = products.filter(p => p.price >= params.minPrice!);
        }

        if (params.maxPrice !== undefined) {
            products = products.filter(p => p.price <= params.maxPrice!);
        }

        if (params.inStock !== undefined && params.inStock) {
            products = products.filter(p => p.inStock === true);
        }

        if (params.sortBy) {
            switch (params.sortBy) {
                case 'price_asc':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price_desc':
                    products.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    products.sort((a, b) => b.rating - a.rating);
                    break;
                case 'newest':
                    products.sort((a, b) => b.releaseYear - a.releaseYear);
                    break;
            }
        }

        return products;
    }

    static async findById(id: string): Promise<Product | undefined> {
        const products = await this.readProducts();
        return products.find(p => p.id === id);
    }
}