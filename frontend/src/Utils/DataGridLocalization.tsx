import { GridLocaleText } from "@mui/x-data-grid";

export const GRID_LOCALE_TEXT: GridLocaleText = {
  // Root
  noRowsLabel: "Sin resultados",
  noResultsOverlayLabel: "No se encontraron resultados.",
  errorOverlayDefaultLabel: "Un error ha ocurrido.",

  // Density selector toolbar button text
  toolbarDensity: "Denisdad",
  toolbarDensityLabel: "Denisdad",
  toolbarDensityCompact: "Compacto",
  toolbarDensityStandard: "Estandard",
  toolbarDensityComfortable: "Comfortable",

  // Columns selector toolbar button text
  toolbarColumns: "Columnas",
  toolbarColumnsLabel: "Seleccionar columnas",

  // Filters toolbar button text
  toolbarFilters: "Filtros",
  toolbarFiltersLabel: "Mostrar filtros",
  toolbarFiltersTooltipHide: "Ocultar filtros",
  toolbarFiltersTooltipShow: "Mostrar filtros",
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtros activos` : `${count} filtro activo`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: "Buscar…",
  toolbarQuickFilterLabel: "Buscar",
  toolbarQuickFilterDeleteIconLabel: "Limpiar",

  // Export selector toolbar button text
  toolbarExport: "Exportar",
  toolbarExportLabel: "Exportar",
  toolbarExportCSV: "Descargar CSV",
  toolbarExportPrint: "Imprimir",
  toolbarExportExcel: "Descargar Excel",

  // Columns panel text
  columnsPanelTextFieldLabel: "Buscar columna",
  columnsPanelTextFieldPlaceholder: "Nombre de la columna",
  columnsPanelDragIconLabel: "Reordenar columna",
  columnsPanelShowAllButton: "Mostrart todas",
  columnsPanelHideAllButton: "Ocultar todas",

  // Filter panel text
  filterPanelAddFilter: "Agregar filtro",
  filterPanelDeleteIconLabel: "Borrar",
  filterPanelLinkOperator: "Operador logico",
  filterPanelOperators: "Operador",
  filterPanelOperatorAnd: "y",
  filterPanelOperatorOr: "o",
  filterPanelColumns: "Columnas",
  filterPanelInputLabel: "Valor",
  filterPanelInputPlaceholder: "Valor del filtro",

  // Filter operators text
  filterOperatorContains: "contiene",
  filterOperatorEquals: "es igual a",
  filterOperatorStartsWith: "Empieza con",
  filterOperatorEndsWith: "Termina con",
  filterOperatorIs: "es",
  filterOperatorNot: "no es",
  filterOperatorAfter: "despues de",
  filterOperatorOnOrAfter: "esta en o despues de",
  filterOperatorBefore: "anterior a",
  filterOperatorOnOrBefore: "esta en o antes de",
  filterOperatorIsEmpty: "esta vacia",
  filterOperatorIsNotEmpty: "no esta vacia",
  filterOperatorIsAnyOf: "es uno de",

  // Filter values text
  filterValueAny: "any",
  filterValueTrue: "true",
  filterValueFalse: "false",

  // Column menu text
  columnMenuLabel: "Menu",
  columnMenuShowColumns: "Mostrar columnas",
  columnMenuFilter: "Filtrar",
  columnMenuHideColumn: "Ocultar",
  columnMenuUnsort: "Desordenar",
  columnMenuSortAsc: "Orden ascendente",
  columnMenuSortDesc: "Orden descendiente",

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} filtros activos` : `${count} filtro activo`,
  columnHeaderFiltersLabel: "Mostrar Filtros",
  columnHeaderSortIconLabel: "Ordenar",

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} filas seleccionadas`
      : `${count.toLocaleString()} fila seleccionada`,

  // Total row amount footer text
  footerTotalRows: "Total de filas:",

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: "Casilla de seleccion",
  checkboxSelectionSelectAllRows: "Seleccionar todas las filas",
  checkboxSelectionUnselectAllRows: "Deseleccionar todas las filas",
  checkboxSelectionSelectRow: "Seleccionar fila",
  checkboxSelectionUnselectRow: "Deseleccionar fila",

  // Boolean cell text
  booleanCellTrueLabel: "si",
  booleanCellFalseLabel: "no",

  // Actions cell more text
  actionsCellMore: "mas",

  // Column pinning text
  pinToLeft: "Fijar a la izquierda",
  pinToRight: "Fijar a la derecha",
  unpin: "No fijar",

  // Tree Data
  treeDataGroupingHeaderName: "Grupo",
  treeDataExpand: "Ver hijos",
  treeDataCollapse: "Ocultar hijos",

  // Grouping columns
  groupingColumnHeaderName: "Grupo",
  groupColumn: (name) => `Agrupar por ${name}`,
  unGroupColumn: (name) => `Dejar de agroupar por ${name}`,

  // Master/detail
  detailPanelToggle: "Alternar panel de detalles",
  expandDetailPanel: "Expandir",
  collapseDetailPanel: "Collapsar",

  // Used core components translation keys
  MuiTablePagination: {},

  // Row reordering text
  rowReorderingHeaderName: "Reordenacion de filas",

  // Aggregation
  aggregationMenuItemHeader: "Agregacion",
  aggregationFunctionLabelSum: "suma",
  aggregationFunctionLabelAvg: "promedio",
  aggregationFunctionLabelMin: "minimo",
  aggregationFunctionLabelMax: "maximo",
  aggregationFunctionLabelSize: "tamaño",
};
