import React from 'react';
import DataTable,  { createTheme } from "react-data-table-component";
const DataTableShow = (porps) => {
  createTheme('solarized', {
    background: {
      default: 'transparent',
    },
  }, 'light')
  const tableCustomStyles = {
    headCells: {
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        paddingLeft: '0 8px',
        justifyContent: 'center',
        backgroundColor: '#dddddd'
      },
    },
    cells: {
      style: {
        paddingLeft: '0 8px !important',
        paddingRight: '0 8px !important',
        border: '1px solid 1px solid #80808026',
        justifyContent: 'center',
      },
    },
  }
    return (
        <React.Fragment>
           <DataTable
            title={porps.title}
            customStyles={tableCustomStyles}
            theme="solarized"
            header={porps.header}
            highlightOnHover={porps.highlightOnHover}
            responsive={porps.responsive}
            data={porps.data}
            columns={porps.columns}
            // customStyles={porps.customStyles}
            selectableRow={porps.selectableRow}
            pagination={porps.pagination}
            onSort={porps.onSort}
            progressPending={porps.progressPending}
            sortServer={porps.sortServer}
            paginationServer={porps.paginationServer}
            paginationTotalRows={porps.paginationTotalRows}
            paginationDefaultPage={porps.paginationDefaultPage}
            onChangeRowsPerPage={porps.onChangeRowsPerPage}
            onSelectedRowsChangporps ={porps.onSelectedRowsChangporps}
            onChangePage={porps.onChangePage}
          />
        </React.Fragment>
    );
};

export default DataTableShow;