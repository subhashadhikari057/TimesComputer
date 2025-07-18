import { Request, Response } from "express";
import prisma from '../prisma/client';

export const createInquiry = async (req: Request, res: Response) => {
    try {
        const sellerNo = process.env.SELLER_NO;
        const productId = Number(req.params.id);

        if (isNaN(productId)) {
            return res.status(400).json({ message: "Invalid product ID." });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const specsObj = typeof product.specs === "string" ? JSON.parse(product.specs) : product.specs;

        let specificationText = '';
        if (specsObj && typeof specsObj === 'object' && !Array.isArray(specsObj)) {
            specificationText = Object.entries(specsObj)
                .map(([key, value]) => `• ${key}: ${value}`)
                .join('\n');
        } else if (product.description) {
            specificationText = product.description;
        }

        // Construct WhatsApp message
        const message =
            `Hello, I am interested in your product:\n` +
            `Name: ${product.name}\n` +
            `Specification:\n${specificationText}\n` +
            `Price: Rs ${product.price || "not revealed"} (Negotiable) \n` +
            `Please contact me for more details.`;

        const whatsappURL = `https://wa.me/${sellerNo}?text=${encodeURIComponent(message)}`;

        return res.status(200).send(whatsappURL);
    } catch (error: any) {
        return res.status(500).json({ message: "Unable to send product", error: error.message });
    }
};
