import React, { FC, useEffect, useRef, useState } from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRenderCellParams,
  GridCallbackDetails,
  GridToolbar,
} from "@mui/x-data-grid";
import { Screen } from "../Components/Screen";
import { ScreenTitle } from "../Components/ScreenTitle";
import { FileUpload, ShoppingCart } from "@mui/icons-material";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography as Text,
} from "@mui/material";
import { useProductsState } from "../Providers/ProductsProvider";
import { GRID_LOCALE_TEXT } from "../Utils/DataGridLocalization";
import { FileField } from "../Components/FileField";
const commonProps: Partial<GridColDef> = {
  flex: 1,
  sortable: false,
  filterable: false,
};

const moneyRenderer =
  (color = "black") =>
  (params: GridRenderCellParams<any>) =>
    (
      <Text fontSize={14} color={color}>
        $ {params.value}
      </Text>
    );

const columns: GridColDef[] = [
  { ...commonProps, field: "id", headerName: "Id" },
  { ...commonProps, field: "code", headerName: "Codigo" },
  {
    ...commonProps,
    field: "codeString",
    headerName: "Codigo formateado",
  },
  {
    ...commonProps,
    field: "description",
    headerName: "Descripcion",
    flex: 3,
  },
  {
    ...commonProps,
    field: "price",
    headerName: "Precio",
    renderCell: moneyRenderer("green"),
  },
  {
    ...commonProps,
    field: "cardPrice",
    headerName: "Precio Tarjeta",
    renderCell: moneyRenderer("red"),
  },
  {
    ...commonProps,
    field: "dolar",
    headerName: "Precio en U$D",
    renderCell: moneyRenderer(),
  },
  {
    ...commonProps,
    field: "listPrice",
    headerName: "Precio de lista",
    renderCell: moneyRenderer(),
  },
  {
    ...commonProps,
    field: "cost",
    headerName: "Costo",
    renderCell: moneyRenderer(),
  },
  { ...commonProps, field: "card", headerName: "Recargo Tarjeta" },
  { ...commonProps, field: "transport", headerName: "Recargo Transporte" },
  { ...commonProps, field: "utility", headerName: "Utilidad" },
  { ...commonProps, field: "vat", headerName: "I.V.A." },
  { ...commonProps, field: "bonus", headerName: "Bonificacion" },
  { ...commonProps, field: "bonus2", headerName: "Bonificacion 2" },
  { ...commonProps, field: "cashDiscount", headerName: "Caja 1" },
  { ...commonProps, field: "cashDiscount2", headerName: "Caja 2" },
];

export const Products: FC = () => {
  const { products, loadProducts, totalProducts, postMdb, postXls } =
    useProductsState();
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(25);
  const [filter, setFilter] = useState<string>("");
  const [mdbSelected, setMdb] = useState<FileList>();
  const [xlsSelected, setXls] = useState<FileList>();
  const mdbRef = useRef<any>(null);
  const xlsRef = useRef<any>(null);

  useEffect(() => {
    loadProducts!({ page, size, filter });
  }, [page, size, filter]);
  return (
    <Screen style={{ gap: 16 }}>
      <ScreenTitle
        text="Actualizar productos"
        Icon={FileUpload}
        caption="Actualizar productos subiendo un archivo .mdb o excel"
      />
      <Paper
        elevation={0}
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 0,
          padding: 16,
          gap: 16,
        }}
      >
        <Box>
          <Text color="primary">Actualizar base con archivo .mdb</Text>
          <Box display="flex" style={{ gap: 16 }}>
            <FileField
              accept=".mdb"
              onChange={(files) => {
                setMdb(files);
              }}
              ref={mdbRef}
            />
            <Button
              disabled={!xlsSelected}
              variant="outlined"
              onClick={async () => {
                await postMdb!(xlsSelected!);
                setMdb(undefined);
                xlsRef?.current?.reset();
              }}
            >
              Actualizar base
            </Button>
          </Box>
        </Box>
        <Box>
          <Text color="primary">Actualizar base con archivo excel (.xls)</Text>
          <Box display="flex" style={{ gap: 16 }}>
            <FileField
              accept=".xls"
              onChange={(files) => {
                setXls(files);
              }}
              ref={mdbRef}
            />
            <Button
              disabled={!mdbSelected}
              variant="outlined"
              onClick={async () => {
                await postXls!(mdbSelected!);
                setXls(undefined);
                mdbRef?.current?.reset();
              }}
            >
              Actualizar base
            </Button>
          </Box>
        </Box>
      </Paper>
      <ScreenTitle
        text="Productos"
        Icon={ShoppingCart}
        caption="Lista de todos los productos"
      />
      <Paper
        elevation={0}
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <DataGrid
          style={{ padding: 16 }}
          paginationMode="server"
          filterMode="server"
          rowCount={totalProducts}
          page={page}
          pageSize={size}
          onPageChange={(page) => setPage(page)}
          onPageSizeChange={(size) => setSize(size)}
          rows={products || []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          onFilterModelChange={(model) =>
            setFilter(model.quickFilterValues?.join(" ") || "")
          }
          localeText={GRID_LOCALE_TEXT}
        />
      </Paper>
    </Screen>
  );
};
