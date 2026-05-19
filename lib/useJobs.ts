"use client";

import { useReadContract, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { CLAIMR_ESCROW_ADDRESS, CLAIMR_ABI } from './contracts';

export interface Job {
  id: number;
  project: string;
  creator: string;
  amount: number;
  deadline: number;
  title: string;
  criteria: string;
  submissionData: string;
  status: number;
  isPrivate: boolean;
  invitedCreator: string;
}

export function useJobs() {
  // Step 1 — Read how many total jobs exist on the contract
  const { data: jobCount, isLoading: countLoading } = useReadContract({
    address: CLAIMR_ESCROW_ADDRESS,
    abi: CLAIMR_ABI,
    functionName: 'jobCount',
  });

  // Step 2 — Build array of contract reads for each job (jobs are 1-indexed)
  const totalJobs = jobCount ? Number(jobCount) : 0;
  const jobIds = Array.from({ length: totalJobs }, (_, i) => BigInt(i + 1));

  const { data: jobsData, isLoading: jobsLoading } = useReadContracts({
    contracts: jobIds.map(id => ({
      address: CLAIMR_ESCROW_ADDRESS,
      abi: CLAIMR_ABI,
      functionName: 'getJob',
      args: [id],
    })),
  });

  // Step 3 — Transform raw blockchain data into clean JS objects
  const jobs: Job[] = jobsData
    ?.filter(r => r.status === 'success' && r.result)
    .map(r => {
      const j = r.result as any;
      return {
        id: Number(j.id),
        project: j.project,
        creator: j.creator,
        amount: Number(formatUnits(j.amount, 6)), // USDC has 6 decimals
        deadline: Number(j.deadline),
        title: j.title,
        criteria: j.criteria,
        submissionData: j.submissionData,
        status: Number(j.status),
        isPrivate: j.isPrivate,
        invitedCreator: j.invitedCreator,
      };
    }) ?? [];

  return { 
    jobs, 
    isLoading: countLoading || jobsLoading, 
    totalJobs 
  };
}