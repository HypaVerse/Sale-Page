import React, { useEffect, useState } from 'react';
import HeaderPage from 'components/HeaderPage';
import { IAsset, IResponse } from 'types';
import api from 'services/api';
import Loader from 'components/Loader';
import Select from 'react-select';
import {
  AssetContainer,
  AssetsList,
  IDAsset,
  PackItem,
  PackContainer,
  EmptyList,
  ChooseAsset,
  SideList,
  MainContainer,
  ItemsContainer,
  ITOContent,
  ITOContainer,
  LoadingContainer,
} from './styles';

import { useWidth } from 'contexts/width';
import { getPrecision } from 'utils';

export interface IAssetResponse extends IResponse {
  data: {
    assets: IAsset[];
  };
}

const ITOList: React.FC = () => {
  const width = useWidth();
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<IAsset | undefined>();
  const [assetsOptions, setAssetsOption] = useState<any[]>([]);

  const getOtherAssets = async (
    auxAssets: IAsset[],
    totalPages: number,
    justByOwner?: boolean,
  ) => {
    const options: any[] = [];

    for (const x of Array(totalPages).keys()) {
      if (x !== 0) {
        const response: IAssetResponse = await api.get({
          route: `assets/kassets`,
          query: {
            owner: justByOwner ? walletAddress : '',
            page: x,
          },
        });

        if (response.error) {
          return;
        }

        response.data.assets.forEach(asset => {
          if (asset.ito) {
            asset.ito.packData.forEach(async (item: any, index1: number) => {
              const precision = await getPrecision(item.key);
              if (precision) {
                item.packs.forEach((pack: any, index2: number) => {
                  if (asset.ito) {
                    asset.ito.packData[index1].packs[index2].price =
                      pack.price / precision;
                  }
                });
              }
            });
            auxAssets.push(asset);
            options.push({ value: asset, label: asset.assetId });
          }
        });
      }
    }
    setLoading(false);
    setAssets(auxAssets);
    setAssetsOption([...options]);
  };

  const getAssets = async (justByOwner?: boolean) => {
    setLoading(true);
    setSelectedAsset(undefined);
    const response: IAssetResponse = await api.get({
      route: `assets/kassets`,
      query: {
        owner: justByOwner ? walletAddress : '',
      },
    });

    if (response.error) {
      return;
    }

    const auxAssets: IAsset[] = [];
    const options: any[] = [];

    response.data.assets.forEach(asset => {
      if (asset.ito) {
        asset.ito.packData.forEach(async (item: any, index1: number) => {
          const precision = await getPrecision(item.key);
          if (precision) {
            item.packs.forEach((pack: any, index2: number) => {
              if (asset.ito) {
                asset.ito.packData[index1].packs[index2].price =
                  pack.price / precision;
              }
            });
          }
        });
        auxAssets.push(asset);
        options.push({ value: asset, label: asset.assetId });
      }
    });

    setAssetsOption([...options]);
    getOtherAssets(auxAssets, response.pagination.totalPages, justByOwner);
  };

  useEffect(() => {
    getAssets();
  }, []);

  const getAddress = async () => {
    try {
      const address = await window.kleverWeb.getWalletAddress();

      if (address.length > 0) {
        setWalletAddress(await window.kleverWeb.getWalletAddress());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getAddress();
  }, [walletAddress]);

  const assetsTable = () => {
    if (assets.length > 0) {
      return (
        <>
          {assets.map((item: IAsset) => {
            return (
              <AssetContainer onClick={() => setSelectedAsset(item)}>
                <IDAsset>
                  <span>{item.name}</span>
                  <span>{item.assetId}</span>
                  <span>{item.mintedValue}</span>
                </IDAsset>
              </AssetContainer>
            );
          })}
        </>
      );
    }

    return (
      <EmptyList>
        <span>None found</span>
      </EmptyList>
    );
  };

  const displaySelect = () => {
    if (width.width <= 768) {
      if (!loading)
        return (
          <Select
            options={assetsOptions}
            onChange={e => setSelectedAsset(e.value)}
          />
        );
      else
        return (
          <LoadingContainer>
            <Loader />
          </LoadingContainer>
        );
    }

    return <></>;
  };

  return (
    <MainContainer>
      {width.width > 768 && (
        <SideList>
          {!loading ? (
            <AssetsList>{assetsTable()}</AssetsList>
          ) : (
            <LoadingContainer>
              <Loader />
            </LoadingContainer>
          )}
        </SideList>
      )}
      <ITOContainer>
        <HeaderPage refresh={getAssets}>
          HGT Initial Offering Private
        </HeaderPage>
        {displaySelect()}
        <ITOContent>
          <div>
            {selectedAsset ? (
              <>
                {selectedAsset?.ito?.packData.map((item: any) => {
                  return (
                    <PackContainer>
                      <span>{item.key}</span>
                      <ItemsContainer>
                        {item.packs.map((pack: any) => {
                          return (
                            <PackItem>
                              <p>
                                {pack.amount} {selectedAsset.ticker}
                              </p>
                              <p>
                                {pack.price} {item.key}
                              </p>
                            </PackItem>
                          );
                        })}
                      </ItemsContainer>
                    </PackContainer>
                  );
                })}
              </>
            ) : (
              <>
                {!loading && (
                  <ChooseAsset>
                    <span>Choose an asset</span>
                    <div></div>
                    <span>Please Select Hypatia Games HGT-1V37 </span>
                  </ChooseAsset>
                )}
              </>
            )}
          </div>
        </ITOContent>
      </ITOContainer>
    </MainContainer>
  );
};

export default ITOList;
