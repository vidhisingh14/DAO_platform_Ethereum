// Replace your src/utils/networks.jsx with this:

// Polygon Mainnet Configuration
export const POLYGON_MAINNET = {
  chainId: '0x89', // 137 in hex
  chainName: 'Polygon Mainnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  },
  rpcUrls: [
    'https://polygon-rpc.com',
    'https://rpc-mainnet.matic.network',
    'https://matic-mainnet.chainstacklabs.com',
    'https://rpc-mainnet.maticvigil.com',
    'https://rpc-mainnet.matic.quiknode.pro'
  ],
  blockExplorerUrls: [
    'https://polygonscan.com/'
  ]
};

export const addPolygonMainnet = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Try to switch to Polygon Mainnet
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_MAINNET.chainId }],
    });
  } catch (switchError) {
    // Network doesn't exist, add it
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [POLYGON_MAINNET],
        });
        console.log('Polygon Mainnet added successfully');
      } catch (addError) {
        throw new Error('Failed to add Polygon Mainnet');
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
    return chainId === POLYGON_MAINNET.chainId;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }
};

export const getNetworkName = (chainId) => {
  switch (chainId) {
    case '0x89':
      return 'Polygon Mainnet';
    case '0x13882':
      return 'Polygon Amoy Testnet';
    case '0x1':
      return 'Ethereum Mainnet';
    case '0xa':
      return 'Optimism';
    case '0xa4b1':
      return 'Arbitrum One';
    default:
      return 'Unknown Network';
  }
};