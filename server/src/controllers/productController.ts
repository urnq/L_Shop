import { Request, Response } from 'express';
import { ProductModel } from '../models/ProductModel';
import { QueryParams } from '../types';

export class ProductController {
    static async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            const {
                search,
                category,
                platform,
                minPrice,
                maxPrice,
                inStock,
                sortBy
            } = req.query;

            const queryParams: QueryParams = {
                search: search as string,
                category: category as string,
                platform: platform as string,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                inStock: inStock === 'true',
                sortBy: sortBy as QueryParams['sortBy']
            };

            const products = await ProductModel.findAll(queryParams);
            res.json({ success: true, data: products });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to fetch products' });
        }
    }

    static async getProductById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const product = await ProductModel.findById(id);
            
            if (!product) {
                res.status(404).json({ success: false, error: 'Product not found' });
                return;
            }

            res.json({ success: true, data: product });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Failed to fetch product' });
        }
    }
}