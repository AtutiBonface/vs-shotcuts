// context/TenantStatusContext.js
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const TenantStatusContext = createContext();

export const TenantStatusProvider = ({ children }) => {
  const [status, setStatus] = useState('checking'); // 'active', 'suspended', 'checking'

  useEffect(() => {
    const checkTenantStatus = async () => {
      try {
        const res = await axios.get('/api/check-tenant-status'); // Call your Django backend
        if (res.data?.active) {
          setStatus('active');
        } else {
          setStatus('suspended');
        }
      } catch (err) {
        setStatus('suspended');
      }
    };

    checkTenantStatus();
  }, []);

  if (status === 'checking') return <div>Checking access...</div>;

  if (status === 'suspended') {
    return <div style={{ color: 'red' }}>Your account is suspended. Please contact support.</div>;
  }

  return <TenantStatusContext.Provider value={status}>{children}</TenantStatusContext.Provider>;
};
