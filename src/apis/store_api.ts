// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export const convertVotingPower = (tokens) => {
  return Math.round(Number(tokens) / 10 ** 6).toLocaleString(undefined);
};

function calculateParticipation(value) {
  const number = value ? Math.round(Number(value) * 100) / 100 : "";
  return number ? `${number.toFixed(2)}%` : "";
}

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}

export async function fetchValidators(
  page: number,
  perPage: number,
  options?: RequestInit
) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_NEXT_PUBLIC_RPC_URL}/validators?page=${page}&per_page=${perPage}`,
      options
    )
    const { result } = await response.json()
    return result
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function fetchLastBlock() {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/block/last`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function fetchValidatorUptime(
  address: string,
  start: number,
  end: number
) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/validator/${address}/uptime?start=${start}&end=${end}`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function fetchValidatorCommitSignatures(address: string) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/validator/${address}/commit_signatures`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function fetchBlocks(
  page: number,
  perPage: number,
  options?: RequestInit
) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/block?page=${page}&size_of_page=${perPage}`,
      options
    )
    const res = await response.json()
    return res
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function fetchBlockDetail(height: number) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/block/height/${height}`
    )
    const res = await response.json()
    return res
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function fetchBlockByHash(hash: string) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/block/hash/${hash}`
    )
    const res = await response.json()
    return res
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function fetchTransactionDetail(hash: string) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/tx/${hash}`
    )
    const res = await response.json()
    return res
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function fetchTransactions(page: number, perPage: number) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_NEXT_PUBLIC_BASE_URL}/tx?page=${page}&size_of_page=${perPage}`
    )
    const res = await response.json()
    return res
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function fetchProposals() {
  try {
    const response = await fetch(
      'https://it.api.namada.red/api/v1/chain/governance/proposals'
    )
    const { proposals } = await response.json()

    return proposals
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function fetchCurrentValidatorsList(options?: RequestInit) {
  try {
    const response = await fetch(
      'https://namada.api.explorers.guru/api/validators',
      options
    )
    const data = await response.json()

    return data.validators.map(validator => ({
      address: validator.hex_address,
      tmAddress: validator?.operator_address,
      votingPower: convertVotingPower(validator.tokens),
      participation: calculateParticipation(validator?.voting_power_percent),
      moniker: validator?.moniker,
    }));
  } catch (error) {
    console.error('Error:', error)
  }
}

export async function fetchLatestBlocks(address: string) {
  try {
    const response = await fetch(
      `https://namada-explorer-api.stakepool.dev.br/node/validators/validator/${address}/latestBlocks`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('An error occurred while fetching the data.', error)
    return null
  }
}

export async function fetchLatestSignatures(address: string) {
  try {
    const response = await fetch(
      `https://namada-explorer-api.stakepool.dev.br/node/validators/validator/${address}/latestSignatures`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('An error occurred while fetching the data.', error)
    return null
  }
}

export async function fetchValidatorsWithDetails(limit = 10, options?: RequestInit) {
  try {
    const response = await fetch(
      'https://namada.api.explorers.guru/api/validators',
      options
    );

    const data = await response.json();

    if (!Array.isArray(data.validators)) {
      throw new Error('Invalid response format');
    }

    // Take only the first "limit" number of validators
    const validatorsToProcess = data.validators.slice(0, limit);

    const validatorsWithDetails = await Promise.all(
      validatorsToProcess.map(async (validator) => {
        const uptime = await fetchValidatorUptime(
          validator.hex_address,
          0, // You might need to adjust the start and end values
          1000 // Just an example for end value, adjust it accordingly
        ).then((data) => (data.uptime * 100).toFixed(2) + '%');

        const commitSignatures = await fetchValidatorCommitSignatures(
          validator.hex_address
        );

        return {
          validator: validator.hex_address,
          tmAddress: validator?.operator_address,
          uptime,
          votingPower: convertVotingPower(validator.tokens),
          participation: validator.voting_power_percent,
          commitSignatures,
          moniker: validator?.moniker,
        };
      })
    );
    return validatorsWithDetails;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function fetchSpecificValidatorsWithDetails(list: any) {
  try {

    // Take only the first "limit" number of validators
    const validatorsToProcess = list.map(item => ({ ...item.model }));

    const validatorsWithDetails = await Promise.all(
      validatorsToProcess.map(async (validator) => {
        const uptime = await fetchValidatorUptime(
          validator.address,
          0, // You might need to adjust the start and end values
          1000 // Just an example for end value, adjust it accordingly
        ).then((data) => (data.uptime * 100).toFixed(2) + '%');

        const commitSignatures = await fetchValidatorCommitSignatures(
          validator.address
        );

        return {
          validator: validator.address,
          tmAddress: validator?.tmAddress,
          uptime,
          votingPower: validator.votingPower,
          participation: validator.participation,
          commitSignatures,
          moniker: validator.moniker,
        };
      })
    );

    return validatorsWithDetails;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}


