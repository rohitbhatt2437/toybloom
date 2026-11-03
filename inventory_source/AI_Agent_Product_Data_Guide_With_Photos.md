# Toy Store Inventory Import Guide (Photos Included)

## Important correction
The original Excel workbook DOES contain 14 embedded product photos. The earlier formatted export omitted them. This corrected package extracts and maps every embedded photo to the product on the same source worksheet row.

## Package contents
- `Toy_Store_Product_Catalogue_With_Photos.xlsx`: formatted workbook with visible embedded thumbnails.
- `toy_store_products_import_with_photos.csv`: flat import data with image filenames.
- `toy_store_products_import_with_photos.json`: structured import data with image filenames.
- `product_images/`: 14 extracted JPEG product photos.
- This guide.

## Photo mapping
Photos are mapped by their Excel anchor row to the product name on that same row. Filenames use provisional SKUs such as `TOY-0001.jpg`. Confirm each mapping visually before production import.

## Import rules
1. Preserve all 14 product records and their source values.
2. Use `image_filename` to locate the corresponding file in `product_images/`.
3. Upload these files to the chosen image storage (e.g. Cloudinary or S3) and save the resulting public image URL in the product's image records.
4. Do not expose `purchase_price_inr` in public APIs or customer pages.
5. Amazon and Meesho prices are marketplace reference prices, not the store's approved selling price.
6. `store_selling_price_inr` is null. Keep the product in DRAFT until the owner supplies an approved selling price.
7. Do not invent missing categories, brands, descriptions, age groups or product specifications.
8. Confirm the stock snapshot date and current stock before accepting orders.
9. The duplicate `Electronic Flash Cards` records must remain separate until the owner confirms whether they are variants or duplicates.
10. A marketplace price range needs clarification before using it for a specific product variant.

## Suggested database mapping
- `sku` -> internal SKU
- `name` -> `product_name`
- `costPrice` -> `purchase_price_inr` (admin-only)
- `stockQuantity` -> `stock_on_hand_2026_08_27` (verify before launch)
- `sellingPrice` -> `store_selling_price_inr` (null means draft)
- `images[]` -> upload `product_images/<image_filename>` then save URL
- marketplace price fields -> optional private reference fields only

## Agent task
Read the workbook, JSON, CSV, and images. Create a validated import script that preserves source data, maps each photo to its product, produces a missing-data report, and imports products as drafts where required. Do not publish products or accept paid orders until selling price and stock are verified.
