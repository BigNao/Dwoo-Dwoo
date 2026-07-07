import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { citizenService } from '../services/citizenService';

export function useCitizenReports() {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = citizenService.getCitizenReports(currentUser.uid, (data) => {
      setReports(data);
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  const stats = citizenService.getReportStatistics(reports);

  return { reports, stats, loading, error };
}
