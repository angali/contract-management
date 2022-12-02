import Layout from "../../components/Layout";
import { withAuthServerSideProps } from "../withAuth";
import Contracts, { IContractProps } from "../../components/Contracts";
import Link from "next/link";
import { NextPage } from "next";
import { ContractService } from "../../services/ContractService";

const AdminPage: NextPage<IContractProps> = ({
  contracts,
  contractsLimit,
  contractSkip,
  totalContracts
}: IContractProps) => {
  return (
    <Layout>
      <div className="container">
        <div className="row ">
          <div className="mx-auto col-lg-10">
            <Contracts
              contracts={contracts}
              contractsLimit={contractsLimit}
              contractSkip={contractSkip}
              totalContracts={totalContracts}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withAuthServerSideProps(
  "admin",
  async (_context: any, _user: any, token: any) => {
    const limit = 5;
    const skip = 0;

    const response = await ContractService.getContracts(limit, skip, token);

    return {
      props: {
        contracts: response.data || [],
        totalContracts: response.data.length || 0,
        contractsLimit: limit,
        contractSkip: skip
      }
    };
  }
);
export default AdminPage;
