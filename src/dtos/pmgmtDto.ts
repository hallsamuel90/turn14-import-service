/**
 * Product Management Data Transfer Object.
 *
 * @author Sam Hall <hallsamuel90@gmail.com>
 */
export class PmgmtDTO {
  constructor(
    public siteUrl: string,
    public turn14Keys: Keys,
    public wcKeys: Keys,
    public brandId: string
  ) {}
}

class Keys {
  client: string;
  secret: string;
}
