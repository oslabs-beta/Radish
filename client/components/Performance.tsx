import React, { useEffect, useState, ReactElement, FC } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';

import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
} from '@mui/material';
import { MemoryData, CPUData, BenchmarkData } from '../../types/types';
import { cpuUsage } from 'process';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../Redux/store';

const Performance: FC = (): ReactElement => {
  const navigate = useNavigate();
  const [memoryData, setMemoryData] = useState<MemoryData>({
    usedMemory: 0,
    peakUsedMemory: 0,
  });
  const [CPUData, setCPUData] = useState<CPUData>({ usedCPU: 0 });
  const [BenchmarkData, setBenchmarkData] = useState<BenchmarkData>({
    BenchmarkResult: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userState = useAppSelector((state) => state.user);
  console.log(`userState`, userState);
  useEffect(() => {
    if (!userState.user){
      toast.error('Please login or build a cluster to run performance benchmarking');
      navigate('/login');
    }
  },[]);

  useEffect(() => {
    const fetchMemoryData = async () => {
      try {
        const response = await fetch('/api/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        console.log(`response`, response);
        if (!response.ok) {
          throw new Error(`memory front end error ${response.status}`);
        }
        const data: MemoryData = await response.json();
        setMemoryData(data);
      } catch (err) {
        console.error(`Error fetching memory data:`, err);
      }
    };

    const fetchCPUData = async () => {
      try {
        const response = await fetch('/api/cpu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`cpu front end error ${response.status}`);
        }
        const data: CPUData = await response.json();
        console.log(`data`, data);
        setCPUData(data);
      } catch (err) {
        console.error(`Error fetching cpu data`, err);
      }
    };
    // fetchMemoryData();
    fetchCPUData();
  }, []);

  const runBenchmark = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/benchmark');

      if (!response.ok) {
        throw new Error(`Error running benchmark ${response.status}`);
      }

      const result = await response.json();
      console.log(`result`, result);

      if (result.success) {
        console.log('success');
        const filteredOutput = removeOutputData(result.output);
        setBenchmarkData({ BenchmarkResult: filteredOutput });
        console.log(`BenchmarkData:`, BenchmarkData);
      } else {
        setError(`Benchmark failed: ${result.error}`);
      }
    } catch (err: any) {
      setError(`Error running benchmark: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const removeOutputData = (output: string): string => {
    return output
      .replace(/^SET: rps=.*$/gm, '')
      .replace(/^GET: rps=.*$/gm, '')
      .replace(
        /node \[\d+\] configuration:[\s\S]*?(?=node \[\d+\] configuration|Latency|Summary|$)/g,
        '\n'
      )
      .replace(/multi-thread: yes[\s\S]*?threads: \d+/g, '')
      .replace(
        /Latency by percentile distribution:[\s\S]*?(?=Cumulative|Summary|$)/g,
        '\n'
      )
      .replace(
        /Cumulative distribution of latencies:[\s\S]*?(?=Summary|$)/g,
        '\n'
      )
      .replace(/(====== SET ======|====== GET ======)/g, '\n\n$1')
      .replace(/^GET:/m, '\n\n$&')
      .replace(/\n{3,}/g, '\n')
      .trim();
  };

  console.log('Memory State:', JSON.stringify(memoryData));
  console.log('CPU State:', JSON.stringify(CPUData));
  console.log('Benchmark:', BenchmarkData);

  return (
    <div className="bg-black text-white p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4 section-header">
          Redis Memory and CPU Usage
        </h1>
      </div>
      <div className="content">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-main-hover p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Memory Usage</h2>
            <p>Used Memory: {memoryData.usedMemory}</p>
            <p>Peak Used Memory: {memoryData.peakUsedMemory}</p>
          </div>
          <div className="bg-main-hover p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">CPU Usage</h2>
            <p>Used CPU: {CPUData.usedCPU}</p>
          </div>
        </div>
      </div>
      <button
        onClick={runBenchmark}
        disabled={loading}
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Run Benchmark Test
      </button>
      {BenchmarkData.BenchmarkResult && (
        <div>
          <div style={{ marginBlock: 50 }}>
            Benchmark results for 100 clients and 300 requests:
          </div>
          <div style={{ maxWidth: 500 }}>
            <pre style={{ whiteSpace: 'pre-wrap', width: 700 }}>
              {BenchmarkData.BenchmarkResult}
            </pre>
          </div>
        </div>
      )}
      <div className='flex justify-center items-center mt-20'>
      <ClipLoader 
        color={'red'}
        loading={loading}
        size={150}/>
      </div>
        
      
       
    </div>
    
  );
};

export default Performance;
