import React from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";

import { GRQ_DISPLAY_COLUMNS } from "../../config/tosca";

import "react-table/react-table.css";
import "./style.css";

function DataTable(props) {
  const { data } = props;
  return (
    <ReactTable
      manual
      data={data}
      columns={GRQ_DISPLAY_COLUMNS}
      showPagination={false}
      showPageSizeOptions={false}
      pageSize={data.length}
      sortable={false}
      defaultSorted={[
        {
          id: props.sortColumn,
          desc: props.sortOrder === "desc" ? true : false,
        },
      ]}
    />
  );
}

DataTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default DataTable;
