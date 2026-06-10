import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";
import { ExecArgs } from "@medusajs/framework/types";

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve("logger");

  logger.info("Seeding Fiorisce store...");

  // Create sales channel
  const { result: salesChannels } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        {
          name: "Fiorisce Storefront",
          description: "Main storefront channel",
        },
      ],
    },
  });

  // Create stock location
  const { result: stockLocations } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: "Fiorisce Warehouse",
          address: {
            address_1: "Jakarta",
            country_code: "id",
          },
        },
      ],
    },
  });

  // Link sales channel to stock location
  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocations[0].id,
      add: [salesChannels[0].id],
    },
  });

  // Create region for Indonesia
  await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Indonesia",
          currency_code: "idr",
          countries: ["id"],
          payment_providers: ["midtrans"],
        },
      ],
    },
  });

  // Create product categories
  await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        { name: "Bouquets", is_active: true },
        { name: "Arrangements", is_active: true },
        { name: "Plants", is_active: true },
        { name: "Gifts & Accessories", is_active: true },
      ],
    },
  });

  logger.info("Seed complete.");
}
