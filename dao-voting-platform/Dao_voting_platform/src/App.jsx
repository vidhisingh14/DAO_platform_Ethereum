import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import WalletConnect from './components/WalletConnect';
import ProposalForm from './components/ProposalForm';
import ProposalList from './components/ProposalList';
import { getContract, ensureCorrectNetwork } from './utils/contract';
import { checkNetwork, getNetworkName } from './utils/networks';
import './App.css';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState('');
  
  // Reference to ProposalList component for refreshing
  const proposalListRef = useRef();

  useEffect(() => {
    checkWalletConnection();
    
    // Listen for network changes
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleChainChanged = async (chainId) => {
    setCurrentNetwork(getNetworkName(chainId));
    const isCorrect = await checkNetwork();
    setNetworkError(!isCorrect);
    
    if (isCorrect && account) {
      // Reinitialize contract with new network
      await initializeContract();
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
    }
  };

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const initializeContract = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(provider, signer);

      setProvider(provider);
      setSigner(signer);
      setContract(contract);

      return true;
    } catch (error) {
      console.error('Error initializing contract:', error);
      return false;
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      setLoading(true);
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Check and switch to correct network
      const networkSwitched = await ensureCorrectNetwork();
      const isCorrectNetwork = await checkNetwork();
      
      if (!isCorrectNetwork) {
        setNetworkError(true);
        setCurrentNetwork(getNetworkName(await window.ethereum.request({ method: 'eth_chainId' })));
        setAccount(accounts[0]); // Still set account even if wrong network
        return;
      }

      setNetworkError(false);
      setAccount(accounts[0]);
      
      // Initialize contract
      const success = await initializeContract();
      if (!success) {
        throw new Error('Failed to initialize contract');
      }

    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Error connecting wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setContract(null);
    setProvider(null);
    setSigner(null);
    setNetworkError(false);
  };

  const switchToPolygonMainnet = async () => {
    try {
      await ensureCorrectNetwork();
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

  // Function to refresh proposals after creating a new one
  const handleProposalCreated = () => {
    console.log('🎉 Proposal created! Refreshing proposal list...');
    if (proposalListRef.current && proposalListRef.current.refreshProposals) {
      // Wait a bit for the blockchain to update
      setTimeout(() => {
        proposalListRef.current.refreshProposals();
      }, 2000);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🗳️ DAO Voting Platform</h1>
        <p className="network-info">Polygon Mainnet</p>
        <WalletConnect 
          account={account}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
          loading={loading}
        />
      </header>

      {networkError && account && (
        <div className="network-warning">
          <h3>⚠️ Wrong Network</h3>
          <p>Currently connected to: {currentNetwork}</p>
          <p>Please switch to Polygon Mainnet</p>
          <button onClick={switchToPolygonMainnet} className="switch-network-btn">
            Switch to Polygon Mainnet
          </button>
        </div>
      )}

      <main className="App-main">
        {account && !networkError ? (
          <div className="dashboard">
            <div className="dashboard-section">
              <ProposalForm 
                contract={contract}
                account={account}
                onProposalCreated={handleProposalCreated}
              />
            </div>
            
            <div className="dashboard-section">
              <ProposalList 
                ref={proposalListRef}
                contract={contract}
                account={account}
              />
            </div>
          </div>
        ) : !account ? (
          <div className="welcome">
            <h2>Welcome to DAO Voting Platform</h2>
            <p>Connect your wallet to create proposals and vote!</p>
            <div className="features">
              <div className="feature">✅ Create transparent proposals</div>
              <div className="feature">✅ Vote on community decisions</div>
              <div className="feature">✅ All votes stored on Polygon blockchain</div>
              <div className="feature">✅ Low gas fees with Polygon</div>
              <div className="feature">✅ Fully decentralized governance</div>
            </div>
            
            <div className="testnet-info">
              <h3>🚀 Mainnet Deployment</h3>
              <p>This app uses Polygon Mainnet</p>
              <p>Real MATIC tokens required for transactions</p>
              <a href="https://polygonscan.com/" target="_blank" rel="noopener noreferrer">
                View on PolygonScan
              </a>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;