// Polygon Amoy Testnet Configuration
export const AMOY_NETWORK = {
  chainId: '0x13882', // 80002 in hex
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: [
    'https://rpc-amoy.polygon.technology/',
    'https://polygon-amoy.drpc.org'
  ],
  blockExplorerUrls: [
    'https://amoy.polygonscan.com/'
  ]
};

export const addAmoyNetwork = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Try to switch to Amoy network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: AMOY_NETWORK.chainId }],
    });
  } catch (switchError) {
    // Network doesn't exist, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [AMOY_NETWORK],
        });
        console.log('Amoy network added successfully');
      } catch (addError) {
        throw new Error('Failed to add Amoy network');
      }
    } else {
      throw switchError;
    }
  }
};

export const checkNetwork = async () => {
  if (!window.ethereum) return false;
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId === AMOY_NETWORK.chainId;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
};

export const getNetworkName = (chainId) => {
  switch (chainId) {
    case '0x13882':
      return 'Polygon Amoy Testnet';
    case '0x89':
      return 'Polygon Mainnet';
    case '0x1':
      return 'Ethereum Mainnet';
    default:
      return 'Unknown Network';
  }
};

// Faucet URLs for getting test MATIC
export const FAUCET_URLS = [
  'https://faucet.polygon.technology/',
  'https://www.alchemy.com/faucets/polygon-amoy'
];