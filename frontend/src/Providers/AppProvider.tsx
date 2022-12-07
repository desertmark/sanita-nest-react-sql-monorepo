import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { Loader } from "../Utils/Loader";

export interface AppState {
  loader: Loader;
  isSidebarOpen: boolean;
  isHubOpen: boolean;
  isLoading: boolean;
  hubTemplate: JSX.Element;
  openSidebar: () => void;
  closeSidebar: () => void;
  openHub: (template: JSX.Element) => void;
  closeHub: () => void;
}
const AppContext = createContext<AppState>(null as any as AppState);

export const useAppState = () => {
  return useContext(AppContext);
};
export const AppProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  // State
  const [, updateState] = useState<any>();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [loader] = useState<Loader>(new Loader(forceUpdate));

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isHubOpen, setIsHubOpen] = useState<boolean>(false);
  const [hubTemplate, setHubTemplate] = useState<JSX.Element>(<></>);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openHub = (template: JSX.Element) => {
    setHubTemplate(template);
    setIsHubOpen(true);
  };

  const closeHub = () => {
    setIsHubOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        loader,
        isSidebarOpen,
        isHubOpen,
        hubTemplate,
        isLoading: loader.isLoading,
        openSidebar,
        closeSidebar,
        openHub,
        closeHub,
      }}
    >
      <>{children}</>
    </AppContext.Provider>
  );
};
