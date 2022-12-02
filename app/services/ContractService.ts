import axios from "axios";
import { BACKEND_API_URL } from "../config";
import { getToken } from "../helpers/auth";
//This class is responsible to communicate with server side API endpoints
export class ContractService {
  public static getContracts(limit=5, skip=0, token=null) {
    const dataURL: string = `${BACKEND_API_URL}/events?skip=${skip}&limit=${limit}`;

    const params = {
      headers: {
        Authorization: `Bearer ${token || getToken()}`
      }
    };

    return axios.get(dataURL, params);
  }

  public static create() {
    const dataURL: string = `${BACKEND_API_URL}/event/create`;

    const params = {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    };

    return axios.post(
      dataURL,
      {
        permium: 100
      },
      params
    );
  }

  public static terminate(contractId: number) {
    const dataURL: string = `${BACKEND_API_URL}/event/terminate`;

    const params = {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    };

    return axios.post(
      dataURL,
      {
        contractId
      },
      params
    );
  }

}
