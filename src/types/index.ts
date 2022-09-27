export enum Service {
  PROXY,
  NODE,
}

export interface IResponse {
  data: any;
  code: string;
  error: string;
  pagination: IPagination;
}

export interface IPagination {
  next: number;
  previous: number;
  perPage: number;
  totalPages: number;
  totalRecords: number;
}

export interface IAsset {
  assetType: string;
  assetId: string;
  name: string;
  ticker: string;
  ownerAddress: string;
  logo: string;
  uris?: any;
  precision: number;
  initialSupply: number;
  circulatingSupply: number;
  maxSupply: number;
  mintedValue: number;
  burntValue: number;
  issueDate: number;
  royalties?: {
    [address: string]: string;
  };
  properties: IProperties;
  attributes?: {
    isPaused: boolean;
    isNFTMintStopped: boolean;
  };
  roles?: IRolesInfo[];
  ito?: {
    isActive: boolean;
    maxAmount: number;
    mintedAmount: number;
    receiverAddress: string;
    packData: {
      key: string;
      packs: IPack[];
    }[];
  };
}

interface IProperties {
  canFreeze: boolean;
  canWipe: boolean;
  canPause: boolean;
  canMint: boolean;
  canBurn: boolean;
  canChangeOwner: boolean;
  canAddRoles: boolean;
}

export interface IRolesInfo {
  address: string;
  hasRoleMint: boolean;
  hasRoleSetITOPrices: boolean;
}

export interface IPack {
  name: string;
  amount: number;
  description: string;
  url: string;
  price: number;
}
