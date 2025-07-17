import prisma from "../prisma/client";
import { Request, Response } from "express";
import { client } from "../utils/elasticSearch.connect";

interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    slug: string;
}

export const searchFilter = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== "string") {
            return res.status(400).send("Missing or invalid search query.");
        }

        const indexExists = await client.indices.exists({ index: "products" });

        // If index does not exist, create it and sync data from Prisma
        if (!indexExists) {
            // 1. Create index with mapping
            await client.indices.create({
                index: "products",
                mappings: {
                    properties: {
                        name: { type: "text" },
                        brand: { type: "text" },
                        category: { type: "keyword" },
                        price: { type: "float" },
                        stock: { type: "integer" },
                        slug: { type: "text" },
                    }
                }
            });
            // 2. Fetch all products from Prisma (with brand and category names)
            const allProducts = await prisma.product.findMany({
                include: { brand: true, category: true }
            });
            // 3. Index each product into Elasticsearch
            for (const product of allProducts) {
                await client.index({
                    index: "products",
                    id: product.id.toString(),
                    document: {
                        name: product.name,
                        brand: product.brand?.name || "",
                        category: product.category?.name || "",
                        slug: product.slug,
                        price: product.price,
                        stock: product.stock,
                        specs: product.specs ? Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join(', ') : "",
                        price_str: product.price?.toString() || "",
                        views_str: product.views?.toString() || ""
                    }
                });
            }

            // 4. Refresh index to make documents searchable
            await client.indices.refresh({ index: "products" });
        }

        // Search Elasticsearch
        const result = await client.search({
            index: "products",
            query: {
                multi_match: {
                    query: q,
                    fields: ["name^2", "brand", "category", "slug", "specs", "price_str", "views_str"],
                    fuzziness: "AUTO",
                },
            },
        });

        // Extract IDs from ES hits
        const ids = result.hits.hits
            .map((hit) => Number(hit._id))
            .filter((id) => !isNaN(id));

        // Fetch full product info from Prisma
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        res.status(200).json({ total: products.length, products });
    } catch (error: any) {
        console.error("Elasticsearch error:", error);
        res.status(500).send("Search failed");
    }
};
