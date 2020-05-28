/* eslint-disable @typescript-eslint/camelcase */
import { Turn14ProductDTO } from '../../../src/turn14/dtos/turn14ProductDto';

/**
 * WcMapperTestUtil.
 *
 * Provides utility methods for testing WcMapper.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class WcMapperTestUtil {
  /**
   * Returns a new Turn14ProductDTO populated with fake data.
   *
   * @returns {Turn14ProductDTO} the created Turn14ProductDTO.
   */
  static getFakeTurn14ProductDTO(): Turn14ProductDTO {
    const fakeItem = this.getFakeItem();
    const fakeItemData = this.getFakeItemData();
    const fakeItemInventory = this.getFakeItemInventory();
    const fakeItemPricing = this.getFakeItemPricing();

    return new Turn14ProductDTO(
      fakeItem,
      fakeItemData,
      fakeItemInventory,
      fakeItemPricing
    );
  }

  private static getFakeItem(): JSON {
    const fakeItem = {
      data: {
        id: '10030',
        type: 'Item',
        attributes: {
          product_name: 'DBA 4000 Slot&Drill Rotors',
          part_number: 'DBA4583XS',
          mfr_part_number: '4583XS',
          part_description:
            'DBA 92-95 MR-2 Turbo Rear Drilled & Slotted 4000 Series Rotor',
          category: 'Brake',
          subcategory: 'Drums and Rotors',
          dimensions: [
            {
              box_number: 1,
              length: 15,
              width: 15,
              height: 4,
              weight: 13,
            },
          ],
          brand_id: 18,
          brand: 'DBA',
          price_group_id: 106,
          price_group: 'DBA',
          active: true,
          regular_stock: false,
          dropship_controller_id: 12,
          air_freight_prohibited: false,
          not_carb_approved: false,
          ltl_freight_required: false,
          warehouse_availability: [
            {
              location_id: '01',
              can_place_order: true,
            },
          ],
          thumbnail: 'https://d5otzd52uv6zz.cloudfront.net/be0798de',
          barcode: '12345678765432',
          alternate_part_number: '1234567',
          prop_65: 'Y',
          epa: 'Compliant',
        },
      },
    };

    const jsonString = JSON.stringify(fakeItem);
    return JSON.parse(jsonString);
  }

  private static getFakeItemData(): JSON {
    const fakeItemData = {
      data: [
        {
          id: '123456',
          type: 'ProductData',
          files: [
            {
              id: 123456780,
              type: 'Image',
              file_extension: 'JPG',
              media_content: 'Photo - Primary',
              links: [
                {
                  url:
                    'https://d32vzsop7y1h3k.cloudfront.net/40df3ff8361b556415ce2df87ac9c9ee.JPG',
                  height: 66,
                  width: 100,
                  asset_size: 'S',
                },
                {
                  url:
                    'https://d32vzsop7y1h3k.cloudfront.net/40df3ff8361b556415ce2df87ac9c9ee.JPG',
                  height: 132,
                  width: 200,
                  asset_size: 'M',
                },
              ],
            },
            {
              id: 123456781,
              type: 'Other',
              file_extension: 'PDF',
              media_content: 'Instruction Manual',
              links: [
                {
                  url:
                    'https://d32vzsop7y1h3k.cloudfront.net/40df3ff8361b556415ce2df87ac9c9ee.PDF',
                },
              ],
            },
          ],
          descriptions: [
            {
              type: 'Market Description',
              description:
                'Cylinder Head Specifications: Combustion chamber volume: 75cc / 84cc / 88cc; Intake runner volume: 210cc; Exhaust runner volume: 70cc; Intake valve diameter: 2.140\\"; Exhaust valve diameter: 1.81\\"; Valve stem diameter: 11/32\\"; Valve guides: Manganese bronze; Deck thickness: 5/8\\"; Valve spring diameter: 1.55\\"; Valve spring maximum lift: .600\\"; Rocker stud: N/A; Guideplate: N/A; Pushrod diameter: 3/8\\"; Valve angle: 15°; Exhaust port location: Stock; Spark plug fitment: 14mm x 3/4 reach, gasket seat. * For headers, contact TTI (951) 371-4878. Vacuum advance distributor may not clear cylinder head. Deck thickness: 5/8\\", pushrod diameter: 3/8\\".',
            },
            {
              type: 'Product Description - Long',
              description:
                'Cylinder Head; BB Chrysler; Performer RPM; 440ci; 88cc Chamber; For Hydraulic Ro',
            },
          ],
          relationships: {
            vehicle_fitments: {
              links: {
                self: '/v1/items/fitment/1234567',
              },
            },
          },
        },
      ],
    };

    const jsonString = JSON.stringify(fakeItemData);
    return JSON.parse(jsonString);
  }

  private static getFakeItemInventory(): JSON {
    const fakeItemInventory = {
      type: 'InventoryItem',
      id: '15074',
      attributes: {
        inventory: {
          '59': 1,
          '01': 2,
          '02': 3,
        },
        manufacturer: {
          stock: 1,
          esd: '2016-01-01',
        },
      },
      relationships: {
        item: {
          links: '/v1/items/15074',
        },
      },
    };

    const jsonString = JSON.stringify(fakeItemInventory);
    return JSON.parse(jsonString);
  }

  private static getFakeItemPricing(): JSON {
    const fakeItemPricing = {
      data: {
        id: '54545',
        type: 'PricingItem',
        attributes: {
          purchase_cost: 4.95,
          has_map: true,
          can_purchase: true,
          pricelists: [
            {
              name: 'map',
              price: 12.36,
            },
          ],
        },
      },
    };

    const jsonString = JSON.stringify(fakeItemPricing);
    return JSON.parse(jsonString);
  }
}
