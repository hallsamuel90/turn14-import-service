/* eslint-disable @typescript-eslint/camelcase */
import { Turn14ProductDTO } from '../../../src/turn14/dtos/turn14ProductDto';
import { Turn14Brand } from '../../../src/turn14/interfaces/turn14Brand';

/**
 * Turn14FakeData.
 *
 * Provides utility methods for testing.
 */
export class Turn14FakeData {
  public static getFakeTurn14ProductDTO(): Turn14ProductDTO;
  public static getFakeTurn14ProductDTO(sku): Turn14ProductDTO;

  /**
   * Returns a new Turn14ProductDTO populated with fake data.
   *
   * @param {string} partNumber optionally specified partNumber id.
   * @returns {Turn14ProductDTO} the created Turn14ProductDTO.
   */
  public static getFakeTurn14ProductDTO(partNumber?: string): Turn14ProductDTO {
    const fakeItem = this.getFakeItem(partNumber);
    const fakeItemData = this.getFakeItemData();
    const fakeItemPricing = this.getFakeItemPricing();
    const fakeItemInventory = this.getFakeItemInventory();

    return new Turn14ProductDTO(
      fakeItem,
      fakeItemData,
      fakeItemPricing,
      fakeItemInventory
    );
  }

  /**
   * Returns a new Turn14ProductDTO populated with fake data.
   *
   * @returns {Turn14ProductDTO} the created Turn14ProductDTO.
   */
  public static getFakeTurn14ProductDTONoLongDescription(): Turn14ProductDTO {
    const turn14Product = this.getFakeTurn14ProductDTO();
    turn14Product.itemData = this.getFakeItemDataNoLongDescription();

    return turn14Product;
  }

  /**
   * Returns a new Turn14ProductDTO populated with arbitrary fox brand data.
   *
   * @returns {Turn14ProductDTO} the created Turn14ProductDTO.
   */
  public static getUndefinedItemAttributesProductDTO(): Turn14ProductDTO {
    const undefinedItemAttributesItem = this.getUndefinedAttributesItem();
    const fakeItemData = this.getFakeItemData();
    const fakeItemPricing = this.getFakeItemPricing();
    const fakeItemInventory = this.getFakeItemInventory();

    return new Turn14ProductDTO(
      undefinedItemAttributesItem,
      fakeItemData,
      fakeItemPricing,
      fakeItemInventory
    );
  }

  private static getFakeItem(partNumber?: string): JSON {
    const fakeItem = {
      id: '10030',
      type: 'Item',
      attributes: {
        product_name: 'DBA 4000 Slot&Drill Rotors',
        part_number: 'DBA4583XS',
        mfr_part_number: partNumber || '4583XS',
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
    };

    const jsonString = JSON.stringify(fakeItem);
    return JSON.parse(jsonString);
  }

  public static getFakeBrands(): Turn14Brand[] {
    const brandsJson = [
      {
        id: '212',
        type: 'Brand',
        attributes: {
          name: 'ACL',

          AAIA: ['BBBV'],
        },
      },
    ];

    return brandsJson as Turn14Brand[];
  }

  private static getUndefinedAttributesItem(): JSON {
    const undefinedItemAttributesItem = {
      id: '10030',
      type: 'Item',
    };

    const jsonString = JSON.stringify(undefinedItemAttributesItem);
    return JSON.parse(jsonString);
  }

  private static getFakeItemData(): JSON {
    const fakeItemData = {
      id: '10030',
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
            {
              url:
                'https://d32vzsop7y1h3k.cloudfront.net/cf5fe9a38d8506d29ecfa29b1034c25b.JPG',
              height: 11214.0,
              width: 800.0,
              asset_size: 'L',
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
    };

    const jsonString = JSON.stringify(fakeItemData);
    return JSON.parse(jsonString);
  }

  private static getFakeItemDataNoLongDescription(): JSON {
    const fakeItemData = {
      id: '10030',
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
            {
              url:
                'https://d32vzsop7y1h3k.cloudfront.net/40df3ff8361b556415ce2df87ac9c9ee.JPG',
              height: 132,
              width: 200,
              asset_size: 'L',
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
          type: 'Product Description - Short',
          description:
            'Baja Designs 40in OnX6 Racer Arc Series Driving Pattern Wide LED Light Bar',
        },
      ],
      relationships: {
        vehicle_fitments: {
          links: {
            self: '/v1/items/fitment/1234567',
          },
        },
      },
    };

    const jsonString = JSON.stringify(fakeItemData);
    return JSON.parse(jsonString);
  }

  private static getFakeItemPricing(): JSON {
    const fakeItemPricing = {
      id: '10030',
      type: 'PricingItem',
      attributes: {
        purchase_cost: 4.95,
        has_map: true,
        can_purchase: true,
        pricelists: [
          {
            name: 'MAP',
            price: 12.36,
          },
        ],
      },
    };

    const jsonString = JSON.stringify(fakeItemPricing);
    return JSON.parse(jsonString);
  }

  private static getFakeItemInventory(): JSON {
    const fakeItemInventory = {
      type: 'InventoryItem',
      id: '10030',
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
}
