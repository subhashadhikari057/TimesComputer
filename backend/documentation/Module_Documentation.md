# Backend Module Documentation

**Version:** 1.0  
**Author:** NABIN POUDEL: Full Stack Developer || Software Developer || Backend Engineer


## Executive Summary: Standout Features

This backend system is designed with enterprise excellence and business growth in mind. Key features that set it apart and deliver direct value to company leadership include:

- **Seamless WhatsApp Integration for Sales:** Instantly connects customers to sellers via WhatsApp with pre-filled product details, accelerating lead conversion and enhancing customer engagement.
- **Enterprise-Grade Search (Elasticsearch):** Lightning-fast, full-text, and fuzzy product search across multiple fields, ensuring customers find what they want quickly—driving higher sales and satisfaction.
- **Robust Admin Controls & Security:** Fine-grained authentication and authorization for all sensitive operations, ensuring only authorized personnel can manage critical business data.
- **Scalable, Modular Architecture:** Each business domain (inquiries, marketing, search, catalog, etc.) is encapsulated in its own module, supporting rapid feature expansion and easy maintenance as the company grows.
- **Advanced Product Tagging & Filtering:** Flexible marketing and feature tags enable dynamic product promotions, targeted campaigns, and advanced filtering for both customers and internal teams.
- **Rich Media & Content Management:** Supports image uploads for products, brands, categories, blogs, and ads, enabling visually compelling marketing and branding.
- **Extensibility for Future Growth:** Designed to easily integrate new sales channels, analytics, and cloud storage solutions, future-proofing the business as market needs evolve.
- **Standardized Error Handling & Documentation:** Ensures reliability, maintainability, and smooth onboarding for new developers and partners.


## Table of Contents
1. [Inquiry Module](#1-inquiry-module)
2. [MarketingTag Module](#2-marketingtag-module)
3. [Search Module](#3-search-module)
4. [Color Module](#4-color-module)
5. [Category Module](#5-category-module)
6. [Blog Module](#6-blog-module)
7. [AdBanner Module](#7-adbanner-module)
8. [Brand Module](#8-brand-module)
9. [FeatureTag Module](#9-featuretag-module)

---

## 1. Inquiry Module

### Overview
Facilitates direct customer inquiries about products by generating WhatsApp links with pre-filled product information, streamlining user-to-seller communication.

### Key Features
- **WhatsApp Integration:** Seamless redirection to WhatsApp with product details.
- **Dynamic Message Generation:** Includes product name, specifications, and price.
- **Robust Validation:** Ensures only valid, existing products are referenced.

### API Endpoints
| Method | Path         | Auth | Description                                 |
|--------|--------------|------|---------------------------------------------|
| POST   | /inquiry/:id | None | Generate WhatsApp inquiry link for product  |

### Core Logic & Workflows
- Validates product ID and existence.
- Parses and formats product specifications.
- Constructs a WhatsApp message and returns a URL for user redirection.

### Integration Points
- WhatsApp API (via URL schema).
- Prisma ORM for product data.

### Error Handling
- 400: Invalid product ID.
- 404: Product not found.
- 500: Internal server error, with descriptive message.

### Security & Access Control
- No authentication required (public endpoint).

### Special Considerations
- Handles both JSON and string product specs.
- Designed for extensibility to other messaging platforms.


## 2. MarketingTag Module

### Overview
Enables management of marketing tags for products, supporting promotional categorization and advanced filtering.

### Key Features
- **Full CRUD:** Create, read, update, and delete marketing tags.
- **Product Association:** Link tags to products for marketing campaigns.
- **Admin-Only Mutations:** Only authorized admins can modify tags.
- **Uniqueness Enforcement:** Prevents duplicate tag names.

### API Endpoints
| Method | Path                          | Auth   | Description                                 |
|--------|-------------------------------|--------|---------------------------------------------|
| GET    | /marketing-tags/              | None   | List all marketing tags                     |
| POST   | /marketing-tags/              | Admin  | Create a new marketing tag                  |
| GET    | /marketing-tags/:id           | None   | Get a marketing tag by ID                   |
| PUT    | /marketing-tags/:id           | Admin  | Update a marketing tag                      |
| DELETE | /marketing-tags/:id           | Admin  | Delete a marketing tag                      |
| GET    | /marketing-tags/:id/products  | None   | Get products by marketing tag               |

### Core Logic & Workflows
- Validates tag uniqueness and input data.
- Associates tags with products for targeted queries.
- Enforces admin authentication for mutations.

### Integration Points
- Prisma ORM for tag and product data.
- Middleware for authentication/authorization.

### Error Handling
- 400: Invalid input.
- 404: Tag not found.
- 409: Duplicate tag name.
- 500: Internal server error.

### Security & Access Control
- Admin authentication required for create, update, and delete.
- Public access for read operations.

### Special Considerations
- Designed for scalability with large product catalogs.
- Extensible for future marketing features.


## 3. Search Module

### Overview
Enterprise-grade, full-text product search leveraging Elasticsearch for high performance and relevance.

### Key Features
- **Elasticsearch Integration:** Fast, fuzzy, multi-field search.
- **Auto Indexing:** Self-healing index creation and data sync.
- **Comprehensive Querying:** Supports search by name, brand, category, specs, price, and more.

### API Endpoints
| Method | Path    | Auth | Description                        |
|--------|---------|------|------------------------------------|
| GET    | /search | None | Search products by query string     |

### Core Logic & Workflows
- Checks and creates Elasticsearch index if missing.
- Indexes product data from the database.
- Executes multi-field, fuzzy search and returns enriched product data.

### Integration Points
- Elasticsearch (external service).
- Prisma ORM for product data.

### Error Handling
- 400: Invalid or missing query.
- 500: Elasticsearch or internal error.

### Security & Access Control
- Public endpoint (no authentication required).

### Special Considerations
- Designed for high concurrency and large datasets.
- Easily extensible for additional search fields.


## 4. Color Module

### Overview
Manages product color options, supporting color-based filtering and product association.

### Key Features
- **Full CRUD:** Manage color entries.
- **Product Association:** Link colors to products.
- **Validation:** Ensures data integrity for color records.

### API Endpoints
| Method | Path                  | Auth | Description                        |
|--------|-----------------------|------|------------------------------------|
| GET    | /colors/              | None | List all colors                    |
| POST   | /colors/              | Admin| Create a new color                 |
| GET    | /colors/:id           | None | Get color by ID                    |
| PUT    | /colors/:id           | Admin| Update color                       |
| DELETE | /colors/:id           | Admin| Delete color                       |
| GET    | /colors/:id/products  | None | Get products by color              |

### Core Logic & Workflows
- Validates color data on create/update.
- Associates colors with products for filtering.

### Integration Points
- Prisma ORM for color and product data.

### Error Handling
- 400: Invalid input.
- 404: Color not found.
- 500: Internal server error.

### Security & Access Control
- Admin authentication required for create, update, delete.
- Public access for read operations.

### Special Considerations
- Supports many-to-many product-color relationships.
- Extensible for color attributes (e.g., hex codes).


## 5. Category Module

### Overview
Provides robust management of product categories, each with image support for enhanced UI/UX.

### Key Features
- **Full CRUD:** Manage categories with images.
- **File Uploads:** Handles image uploads.
- **Admin-Only Mutations:** Only authorized admins can modify categories.
- **Validation:** Ensures all required fields and files are present.

### API Endpoints
| Method | Path              | Auth  | Description                                         |
|--------|-------------------|-------|-----------------------------------------------------|
| GET    | /categories/      | None  | List all categories                                 |
| POST   | /categories/      | Admin | Create a new category (with image)             |
| GET    | /categories/:id   | None  | Get category by ID                                  |
| PUT    | /categories/:id   | Admin | Update category (with image)                   |
| DELETE | /categories/:id   | Admin | Delete category                                     |

### Core Logic & Workflows
- Validates input and file uploads.
- Handles file storage and path management.
- Enforces admin authentication for mutations.

### Integration Points
- Multer middleware for file uploads.
- Prisma ORM for category data.
- Authentication/authorization middleware.

### Error Handling
- 400: Invalid input or missing files.
- 404: Category not found.
- 409: Duplicate category name.
- 500: Internal server error.

### Security & Access Control
- Admin authentication required for create, update, delete.
- Public access for read operations.

### Special Considerations
- Designed for extensibility (e.g., subcategories).
- File storage can be migrated to cloud solutions.

## 6. Blog Module

### Overview
Enterprise blogging platform for content marketing, SEO, and user engagement, supporting rich content and metadata.

### Key Features
- **Full CRUD:** Manage blog posts with images and metadata.
- **File Uploads:** Supports multiple images per blog.
- **Metadata Support:** Accepts and validates JSON metadata for SEO.
- **Validation:** Ensures all required fields and at least one image are present.

### API Endpoints
| Method | Path         | Auth  | Description                                 |
|--------|--------------|-------|---------------------------------------------|
| GET    | /blogs/      | None  | List all blogs                              |
| POST   | /blogs/      | Admin | Create a new blog (with image upload)       |
| GET    | /blogs/:id   | None  | Get blog by ID                              |
| PUT    | /blogs/:id   | Admin | Update blog (with image upload)             |
| DELETE | /blogs/:id   | Admin | Delete blog                                 |

### Core Logic & Workflows
- Validates input and file uploads.
- Parses and validates JSON metadata.
- Handles image storage and path management.

### Integration Points
- Multer middleware for file uploads.
- Prisma ORM for blog data.
- Authentication/authorization middleware.

### Error Handling
- 400: Invalid input or missing files.
- 404: Blog not found.
- 409: Duplicate blog slug.
- 500: Internal server error.

### Security & Access Control
- Admin authentication required for create, update, delete.
- Public access for read operations.

### Special Considerations
- Metadata extensible for future SEO requirements.
- File storage can be migrated to cloud solutions.

## 7. AdBanner Module

### Overview
Manages advertisement banners for marketing and promotions, supporting multiple images per banner.

### Key Features
- **Full CRUD:** Manage ad banners with image uploads.
- **File Uploads:** Supports multiple images per banner.
- **Validation:** Ensures at least one image is provided for each banner.

### API Endpoints
| Method | Path      | Auth  | Description                                 |
|--------|-----------|-------|---------------------------------------------|
| GET    | /ads/     | None  | List all ad banners                         |
| POST   | /ads/     | Admin | Create a new ad banner (with image upload)  |
| GET    | /ads/:id  | None  | Get ad banner by ID                         |
| PUT    | /ads/:id  | Admin | Update ad banner (with image upload)        |
| DELETE | /ads/:id  | Admin | Delete ad banner                            |

### Core Logic & Workflows
- Validates input and file uploads.
- Handles image storage and path management.
- Enforces admin authentication for mutations.

### Integration Points
- Multer middleware for file uploads.
- Prisma ORM for ad banner data.
- Authentication/authorization middleware.

### Error Handling
- 400: Invalid input or missing files.
- 404: Ad banner not found.
- 500: Internal server error.

### Security & Access Control
- Admin authentication required for create, update, delete.
- Public access for read operations.

### Special Considerations
- Designed for high-traffic marketing campaigns.
- File storage can be migrated to cloud solutions.


## 8. Brand Module

### Overview
Enterprise-grade management of product brands, each with image and SVG icon support for branding and UI consistency.

### Key Features
- **Full CRUD:** Manage brands with image and icon uploads.
- **File Uploads:** Handles image and SVG icon uploads.
- **Admin-Only Mutations:** Only authorized admins can modify brands.
- **Validation:** Ensures required fields and files are present.

### API Endpoints
| Method | Path        | Auth  | Description                                         |
|--------|-------------|-------|-----------------------------------------------------|
| GET    | /brands/    | None  | List all brands                                     |
| POST   | /brands/    | Admin | Create a new brand (with image/icon)                |
| GET    | /brands/:id | None  | Get brand by ID                                     |
| PUT    | /brands/:id | Admin | Update brand (with image/icon)                      |
| DELETE | /brands/:id | Admin | Delete brand                                        |

### Core Logic & Workflows
- Validates input and file uploads.
- Handles file storage and path management.
- Enforces admin authentication for mutations.

### Integration Points
- Multer middleware for file uploads.
- Prisma ORM for brand data.
- Authentication/authorization middleware.

### Error Handling
- 400: Invalid input or missing files.
- 404: Brand not found.
- 409: Duplicate brand name.
- 500: Internal server error.

### Security & Access Control
- Admin authentication required for create, update, delete.
- Public access for read operations.

### Special Considerations
- Designed for extensibility (e.g., brand partnerships).
- File storage can be migrated to cloud solutions.


## 9. FeatureTag Module

### Overview
Manages feature tags for products, enabling advanced filtering and categorization for end-users and admins.

### Key Features
- **Full CRUD:** Manage feature tags.
- **Product Association:** Link feature tags to products for filtering.
- **Validation:** Ensures tag data integrity.

### API Endpoints
| Method | Path                        | Auth  | Description                                 |
|--------|-----------------------------|-------|---------------------------------------------|
| GET    | /feature-tags/              | None  | List all feature tags                       |
| POST   | /feature-tags/              | Admin | Create a new feature tag                    |
| GET    | /feature-tags/:id           | None  | Get feature tag by ID                       |
| PUT    | /feature-tags/:id           | Admin | Update feature tag                          |
| DELETE | /feature-tags/:id           | Admin | Delete feature tag                          |
| GET    | /feature-tags/products/:id  | None  | Get products by feature tag                 |

### Core Logic & Workflows
- Validates tag data on create/update.
- Associates feature tags with products for advanced filtering.
- Enforces admin authentication for mutations.

### Integration Points
- Prisma ORM for feature tag and product data.
- Authentication/authorization middleware.

### Error Handling
- 400: Invalid input.
- 404: Feature tag not found.
- 500: Internal server error.

### Security & Access Control
- Admin authentication required for create, update, delete.
- Public access for read operations.

### Special Considerations
- Designed for extensibility (e.g., tag hierarchies).
- Supports advanced product filtering in the frontend.


**General Notes:**
- All modules follow RESTful conventions and leverage Prisma ORM for database operations.
- File uploads are managed via Multer middleware and can be migrated to cloud storage as needed.
- Error responses are standardized for consistency and maintainability. 