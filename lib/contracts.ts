// Contract addresses on Arc Testnet
export const CLAIMR_ESCROW_ADDRESS = "0x1a0f14f7485664F10bF32A0C94163Ec50a674900" as const;
export const USDC_ADDRESS = "0x3600000000000000000000000000000000000000" as const;
export const EURC_ADDRESS = "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a" as const;

// USDC ERC-20 ABI (only what we need)
export const USDC_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ type: "bool" }]
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }]
  }
] as const;

// Claimr Escrow ABI
export const CLAIMR_ABI = [
  {
    name: "postJob",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_title", type: "string" },
      { name: "_criteria", type: "string" },
      { name: "_amount", type: "uint256" },
      { name: "_durationDays", type: "uint256" },
      { name: "_isPrivate", type: "bool" },
      { name: "_invitedCreator", type: "address" }
    ],
    outputs: []
  },
  {
    name: "claimJob",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_jobId", type: "uint256" }],
    outputs: []
  },
  {
  name: "rejectWork",
  type: "function",
  stateMutability: "nonpayable",
  inputs: [
    { name: "_jobId", type: "uint256" },
    { name: "_reason", type: "string" }
  ],
  outputs: [],
},
  {
    name: "submitWork",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_jobId", type: "uint256" },
      { name: "_submissionData", type: "string" }
    ],
    outputs: []
  },
  {
    name: "verifyWork",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "_jobId", type: "uint256" }],
    outputs: []
  },
  {
    name: "jobCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }]
  },
  {
    name: "getJob",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_jobId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "project", type: "address" },
          { name: "creator", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "deadline", type: "uint256" },
          { name: "title", type: "string" },
          { name: "criteria", type: "string" },
          { name: "submissionData", type: "string" },
          { name: "status", type: "uint8" },
          { name: "isPrivate", type: "bool" },
          { name: "invitedCreator", type: "address" }
        ]
      }
    ]
  }
] as const;
export const STARLIGHT_POOL_ADDRESS = "0xB70CBc5F65B2CEC9585cF061ac6b5CD9c462CE53" as const;

export const POOL_ABI = [
  {
    name: "swap",
    type: "function",
    inputs: [
      { name: "tokenIn", type: "address" },
      { name: "amountIn", type: "uint256" },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
  },
] as const;