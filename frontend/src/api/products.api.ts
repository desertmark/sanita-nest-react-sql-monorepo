import axios, { AxiosInstance } from "axios";

const config = {
  apiUrl: process.env.REACT_APP_API_URL,
};

console.log(`
███████╗ █████╗ ███╗   ██╗██╗████████╗ █████╗ 
██╔════╝██╔══██╗████╗  ██║██║╚══██╔══╝██╔══██╗
███████╗███████║██╔██╗ ██║██║   ██║   ███████║
╚════██║██╔══██║██║╚██╗██║██║   ██║   ██╔══██║
███████║██║  ██║██║ ╚████║██║   ██║   ██║  ██║
╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝  ╚═╝                                              
`);

console.log("Config loaded is", { config });

export interface IListDto<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export class ProductsApi {
  private client: AxiosInstance = axios.create({
    baseURL: `${config.apiUrl}/products`,
  });

  async getProducts(params?: {
    page: number;
    size: number;
    orderBy: string;
    orderDirection: "asc" | "desc";
    filter?: string;
  }): Promise<IListDto<any>> {
    const res = await this.client.get("", { params });
    return res.data;
  }

  async postMdb(files: FileList) {
    const form = new FormData();
    form.append("file", files[0]);
    const res = await this.client.post("/mdb", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }

  async postXls(files: FileList) {
    const form = new FormData();
    form.append("file", files[0]);
    const res = await this.client.post("/xls", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
}
