import { useState, useEffect } from 'react';
import { core } from '@klever/sdk';
import { parseAddress } from 'utils';
import { toast } from 'react-toastify';
import { Container, AddressContainer } from './styles';
import Copy from 'components/Copy';

const Header: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');

  const connectWallet = async (silent?: boolean) => {
    try {
      const address = await window.kleverWeb.getWalletAddress();

      if (address.length > 0) {
        setWalletAddress(address);
      }
    } catch (e) {
      handleConnect(silent);
    }
  };

  const handleConnect = async (silent?: boolean) => {
    if (!walletAddress) {
      window.kleverWeb.provider = {
        api:
          process.env.DEFAULT_API_HOST ||
          'https://api.testnet.klever.finance/v1.0',
        node:
          process.env.DEFAULT_NODE_HOST ||
          'https://node.testnet.klever.finance',
      };

      try {
        if (!core.isKleverWebActive()) {
          await core.initialize();
        }

        const address: string = await window.kleverWeb.getWalletAddress();

        if (address.startsWith('klv') && address.length === 62) {
          setWalletAddress(address);
        } else {
          !silent &&
            toast.error(
              'Invalid wallet address, please switch to a klv wallet',
            );
        }
      } catch (e) {
        !silent && toast.error(String(e).split(':')[1]);
      }
    }
  };

  useEffect(() => {
    connectWallet(true);
  }, [walletAddress]);

  return (
    <Container>
      <AddressContainer onClick={() => connectWallet()}>
        {walletAddress
          ? parseAddress(walletAddress, 25)
          : 'Connect your wallet'}
      </AddressContainer>
      {walletAddress && <Copy data={walletAddress} info="Address" />}
    </Container>
  );
};

export default Header;
