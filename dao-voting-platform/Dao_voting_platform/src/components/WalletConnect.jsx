import React from 'react';
import { formatAddress } from '../utils/contract';
import './WalletConnect.css';

const WalletConnect = ({ account, onConnect, onDisconnect, loading }) => {
  return (
    <div className="wallet-connect">
      {account ? (
        <div className="wallet-connected">
          <div className="account-info">
            <div className="account-avatar">👤</div>
            <div className="account-details">
              <span className="account-address">{formatAddress(account)}</span>
              <span className="network-badge">Polygon Mainnet</span>
            </div>
          </div>
          <button 
            className="disconnect-btn"
            onClick={onDisconnect}
            title="Disconnect Wallet"
          >
            🔌 Disconnect
          </button>
        </div>
      ) : (
        <button 
          className={`connect-btn ${loading ? 'loading' : ''}`}
          onClick={onConnect}
          disabled={loading}
        >
          {loading ? (
            <span className="loading-spinner">⏳ Connecting...</span>
          ) : (
            <>
              <span className="wallet-icon">🦊</span>
              Connect MetaMask
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default WalletConnect;