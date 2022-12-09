import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ProductsApi } from "../api/products.api";
import { Loader } from "../Utils/Loader";
import { useAppState } from "./AppProvider";

export interface ProductsState {
  products: any[];
  totalProducts: number;
  loadProducts?: (params?: any) => Promise<void>;
  postMdb?: (files: FileList) => Promise<void>;
  postXls?: (files: FileList) => Promise<void>;
}
const ProductsContext = createContext<ProductsState>(
  null as any as ProductsState
);

export const useProductsState = () => {
  return useContext(ProductsContext);
};
export const ProductsProvider: FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  // Context
  const { loader } = useAppState();
  // State
  const [productsApi] = useState<ProductsApi>(new ProductsApi());
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  // Methods
  const loadProducts = async (params?: any) => {
    const task = productsApi.getProducts(params);
    loader.waitFor(task);
    const res = await task;
    setProducts(res.items);
    setTotalProducts(res.total);
  };

  const postMdb = async (files: FileList) => {
    const task = productsApi.postMdb(files);
    loader.waitFor(task);
    return task;
  };

  const postXls = async (files: FileList) => {
    const task = productsApi.postXls(files);
    loader.waitFor(task);
    return task;
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        totalProducts,
        loadProducts,
        postMdb,
        postXls,
      }}
    >
      <>{children}</>
    </ProductsContext.Provider>
  );
};
