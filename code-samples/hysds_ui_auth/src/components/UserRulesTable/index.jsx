import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ReactTable from "react-table";
import PropTypes from "prop-types";
import {
  ToggleButton,
  EditButton,
  DeleteButton,
} from "../../components/Buttons";

import "./style.css";

const buttonCellStyle = {
  style: {
    paddingTop: 5,
    paddingBottom: 0,
  },
};

const UserRulesTable = (props) => {
  const defaultSorted = [{ id: "modified_time", desc: true }];
  const columns = [
    {
      Header: "ID",
      accessor: "_id",
      show: false,
    },
    {
      Header: "Name",
      accessor: "rule_name",
      filterable: true,
      filterMethod: (filter, row) => {
        if (row.rule_name.toLowerCase().includes(filter.value.toLowerCase()))
          return row;
      },
    },
    {
      Header: "Action",
      accessor: "job_type",
      filterable: true,
      filterMethod: (filter, row) => {
        if (row.job_type.toLowerCase().includes(filter.value.toLowerCase()))
          return row;
      },
    },
    {
      Header: "Job Specification",
      accessor: "job_spec",
      show: false,
    },
    {
      Header: "Queue",
      accessor: "queue",
      filterable: true,
      filterMethod: (filter, row) => {
        if (row.queue.toLowerCase().includes(filter.value.toLowerCase()))
          return row;
      },
    },
    {
      Header: "Priority",
      accessor: "priority",
      width: 65,
      resizable: false,
      filterable: true,
      Filter: ({ filter, onChange }) => (
        <select
          className="user-rules-table-dropdown-filter"
          onChange={(e) => onChange(e.target.value)}
          value={filter ? filter.value : -1}
        >
          <option value={-1}></option>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
          <option value={7}>7</option>
          <option value={8}>8</option>
          <option value={9}>9</option>
        </select>
      ),
      filterMethod: (filter, row) => {
        if (filter.value === -1) return row;
        else if (filter.value === row.priority) return row;
      },
    },
    {
      Header: "User",
      accessor: "username",
      filterable: true,
      filterMethod: (filter, row) => {
        if (row.username.toLowerCase().includes(filter.value.toLowerCase()))
          return row;
      },
      width: 150,
    },
    {
      Header: null,
      accessor: "enabled",
      width: 100,
      resizable: false,
      getProps: () => buttonCellStyle,
      Cell: (state) => (
        <ToggleButton
          loading={state.original.toggleLoading ? 1 : 0}
          enabled={state.row.enabled ? 1 : 0}
          onClick={() => {
            props.toggleUserRule(
              state.row._index,
              state.row._id,
              !state.row.enabled
            );
          }}
        />
      ),
      filterable: true,
      Filter: ({ filter, onChange }) => (
        <select
          className="user-rules-table-dropdown-filter"
          onChange={(e) => onChange(e.target.value)}
          value={filter ? filter.value : ""}
        >
          <option value=""></option>
          <option value={true}>On</option>
          <option value={false}>Off</option>
        </select>
      ),
      filterMethod: (filter, row) => {
        const val = filter.value === "true" ? true : false;
        if (filter.value === "") return row;
        else if (val === row.enabled) return row;
      },
    },
    {
      Header: null,
      width: 100,
      resizable: false,
      sortable: false,
      getProps: () => buttonCellStyle,
      Cell: (state) => (
        <Link to={`${props.link}/${state.row._id}`}>
          <EditButton />
        </Link>
      ),
    },
    {
      Header: null,
      width: 100,
      resizable: false,
      sortable: false,
      getProps: () => buttonCellStyle,
      Cell: (state) => (
        <DeleteButton
          loading={state.original.loading ? 1 : 0}
          onClick={() => {
            var confirmDelete = confirm(`Delete rule? ${state.row.rule_name}`);
            if (confirmDelete)
              props.deleteUserRule(state.row._index, state.row._id);
          }}
        />
      ),
    },
    {
      Header: "Created",
      accessor: "creation_time",
      width: 145,
      resizable: false,
    },
    {
      Header: "Modified",
      accessor: "modified_time",
      width: 145,
      resizable: false,
    },
  ];

  const [expanded, setExpanded] = useState({});

  const handleExpanded = (rows, i) => setExpanded(rows);
  const handlePageChange = () => setExpanded({});
  const handlePageSize = (e) => setExpanded({});
  const handleSortedChange = () => setExpanded({});

  const renderSubComponent = (data) => {
    let queryString = data.original.query_string;
    let kwargs = data.original.kwargs;
    let tags = data.original.tags;

    try {
      const query = JSON.parse(queryString);
      queryString = JSON.stringify(query, null, 2);
    } catch (err) {
      console.error(err);
    }

    try {
      kwargs = JSON.parse(kwargs);
      kwargs = JSON.stringify(kwargs, null, 2);
    } catch (err) {
      console.error(err);
    }

    try {
      tags = JSON.stringify(tags, null, 2);
    } catch (err) {
      console.error(err);
    }

    return (
      <table className="user-rules-table-query-string">
        <tbody>
          <tr>
            <td>
              <pre>query: {queryString}</pre>
            </td>
            {tags ? (
              <td>
                <pre>tags: {tags}</pre>
              </td>
            ) : null}
            <td>
              <pre>kwargs: {kwargs}</pre>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <ReactTable
      data={props.rules}
      columns={columns}
      showPagination={true}
      toggleUserRule={props.toggleUserRule}
      defaultSorted={defaultSorted}
      SubComponent={(row) => renderSubComponent(row)}
      expanded={expanded}
      onExpandedChange={handleExpanded}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSize}
      onSortedChange={handleSortedChange}
      {...props}
    />
  );
};

UserRulesTable.propTypes = {
  link: PropTypes.string.isRequired,
  rules: PropTypes.array.isRequired,
  toggleUserRule: PropTypes.func.isRequired,
  deleteUserRule: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { toggleUserRule, deleteUserRule } = ownProps;
  return {
    toggleUserRule: (index, ruleId, enabled) =>
      dispatch(toggleUserRule(index, ruleId, enabled)),
    deleteUserRule: (index, id) => dispatch(deleteUserRule(index, id)),
  };
};

export default connect(null, mapDispatchToProps)(UserRulesTable);
