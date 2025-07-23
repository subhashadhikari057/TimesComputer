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

export const createBulkInquiry = async (req: Request, res: Response) => {
    try {
        const sellerNo = process.env.SELLER_NO || process.env.WHATSAPP_NUMBER;
        const productId = Number(req.params.id);
        const { quantity, selectedColor } = req.body;

        if (isNaN(productId)) {
            return res.status(400).json({ message: "Invalid product ID." });
        }

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Invalid quantity. Minimum quantity is 1." });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                colors: {
                    include: {
                        color: true
                    }
                },
                brand: true,
                category: true
            }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const specsObj = typeof product.specs === "string" ? JSON.parse(product.specs) : product.specs;

        let specificationText = '';
        if (specsObj && typeof specsObj === 'object' && !Array.isArray(specsObj)) {
            specificationText = Object.entries(specsObj)
                .slice(0, 5) // Show top 5 specs for bulk order
                .map(([key, value]) => `• ${key}: ${value}`)
                .join('\n');
        }

        // Calculate estimated total
        const estimatedTotal = product.price ? (product.price * quantity).toLocaleString('en-IN') : 'To be discussed';
        
        // Build color information
        let colorText = '';
        if (selectedColor && selectedColor !== 'Any Color') {
            colorText = `\nPreferred Color: ${selectedColor}`;
        } else if (selectedColor === null) {
            colorText = '\nColor Preference: Any available color';
        }

        // Construct bulk order WhatsApp message
        const message = 
            `🛒 BULK ORDER INQUIRY\n\n` +
            `Product: ${product.name}\n` +
            `Quantity: ${quantity} units\n` +
            `Unit Price: Rs ${product.price?.toLocaleString('en-IN') || "To be discussed"}\n` +
            `Estimated Total: Rs ${estimatedTotal}${colorText}\n\n` +
            `Key Specifications:\n${specificationText}\n\n` +
            `Please provide:\n` +
            `• Best bulk pricing for ${quantity} units\n` +
            `• Delivery timeline and shipping costs\n` +
            `• Payment terms and options\n` +
            `• Warranty and support details\n\n` +
            `Looking forward to your response. Thank you!`;

        const whatsappURL = `https://wa.me/${sellerNo}?text=${encodeURIComponent(message)}`;

        return res.status(200).json({ 
            whatsappURL,
            orderDetails: {
                productName: product.name,
                quantity,
                selectedColor: selectedColor || 'Any Color',
                estimatedTotal: product.price ? product.price * quantity : null
            }
        });
    } catch (error: any) {
        return res.status(500).json({ message: "Unable to create bulk inquiry", error: error.message });
    }
};
